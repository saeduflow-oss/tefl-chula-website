/* =========================================================
   fb-sync — เชื่อมเพจ Facebook กับข่าวบนเว็บ (ตาราง news, placement = 'home')

   เรียกด้วย POST body { action }:
     "status"  ตรวจว่า token ใช้ได้ไหม → คืนชื่อ/ID เพจ (การ์ด "การเชื่อมต่อ" ในหน้า admin)
     "sync"    ดึงโพสต์ล่าสุดมาใส่ตาราง news (ค่าเริ่มต้นถ้าไม่ระบุ)

   ใครเรียกได้
     • ผู้ดูแลจากหน้า /admin  → Authorization: Bearer <token ของผู้ดูแล>
     • pg_cron ทุก 6 ชั่วโมง → x-sync-key ตรงกับ secret FB_SYNC_KEY
   deploy แบบ verify_jwt = false เพราะ cron ไม่มี JWT จึงต้องตรวจสิทธิ์เองข้างในเสมอ

   token ของเพจอ่านจากตาราง integrations (key = facebook.token) ซึ่งผู้ดูแลแก้ได้จากหน้า admin
   ตารางนั้นไม่มี policy ให้ anon จึงไม่รั่วไปเว็บสาธารณะ; ถ้าว่างจะถอยไปใช้ secret FB_PAGE_TOKEN
   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY มีให้เองในรันไทม์

   กติกาที่จงใจเลือก (ดู DESIGN.md §9.8)
     • รูปถูกคัดลอกไปเก็บที่ media/fb/<post id> เพราะ full_picture ของ Graph API หมดอายุในไม่กี่วัน
     • แถวที่มีอยู่แล้ว (fb_post_id ตรงกัน) ไม่ถูกเขียนทับ — ผู้ดูแลแก้หัวข้อ/ซ่อนได้โดยไม่โดน sync คืนค่า
       ยกเว้นช่อง image ที่ยังว่าง: จะลองหารูปให้ใหม่ทุกรอบ (โพสต์แชร์ที่รูปอยู่ใน attachments ไม่ใช่ full_picture)
     • โพสต์ที่ไม่อยู่ในชุดล่าสุดแล้ว (ถูกลบบนเพจ หรือเก่ากว่า sync_count) ถูกเอาออกพร้อมรูป
       ข่าวที่พิมพ์เอง (fb_post_id ว่าง) ไม่ถูกแตะ
     • sort_order = -(นาทีตั้งแต่ epoch ของเวลาโพสต์) โพสต์ใหม่สุดจึงอยู่หน้าสุดและอยู่ก่อนข่าวที่พิมพ์เอง
       (ซึ่งเริ่มที่ 0) โดยไม่ต้องจัดลำดับใหม่ ปุ่มเลื่อนลำดับใน admin ยังใช้ได้ตามปกติ
   ========================================================= */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY     = Deno.env.get("SUPABASE_ANON_KEY")!;
const ENV_TOKEN    = Deno.env.get("FB_PAGE_TOKEN") ?? "";
const SYNC_KEY     = Deno.env.get("FB_SYNC_KEY") ?? "";
const GRAPH        = "https://graph.facebook.com/v21.0";
const BUCKET_DIR   = "fb";           /* media/fb/<post id>.<ext> */
const TAG          = "Facebook";     /* ป้ายหมวดบนการ์ด */

/* CORS: หน้า admin เรียกข้ามโดเมน เบราว์เซอร์ยิง OPTIONS มาก่อนเสมอ
   คำตอบ 204 ต้องไม่มี body — Response ตัวเดิมยัด "null" เข้าไปแล้วพังเงียบ ๆ เป็น "Load failed" */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

/* ---------- Supabase REST ด้วย service role (ข้าม RLS — ตรวจสิทธิ์ผู้เรียกไปแล้วก่อนถึงตรงนี้) ---------- */
async function rest(path: string, init: RequestInit = {}) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...init,
    headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY,
               "Content-Type": "application/json", Prefer: "return=minimal", ...(init.headers || {}) },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`rest ${path} → ${r.status} ${text}`);
  return text ? JSON.parse(text) : null;   /* POST/DELETE ตอบตัวว่าง (Prefer: return=minimal) */
}

/* ---------- ใครเรียก? ----------
   ผู้ดูแล: ใช้ token ของเขาอ่านตาราง admins — RLS คืนแถวให้เฉพาะคนที่อยู่ในรายชื่อ
   จึงไม่ต้องถอด JWT เอง และใช้กติกาเดียวกับหน้า admin ทุกประการ */
async function isAllowed(req: Request): Promise<boolean> {
  const key = req.headers.get("x-sync-key");
  if (key && SYNC_KEY && key === SYNC_KEY) return true;

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  const r = await fetch(SUPABASE_URL + "/rest/v1/admins?select=email&limit=1", {
    headers: { apikey: ANON_KEY, Authorization: auth },
  });
  if (!r.ok) return false;
  const rows = await r.json();
  return Array.isArray(rows) && rows.length > 0;
}

/* ---------- ค่าเชื่อมต่อ ---------- */
type KV = { key: string; value: string };
async function config() {
  const [integ, settings]: [KV[], KV[]] = await Promise.all([
    rest("integrations?select=key,value&key=like.facebook.*"),
    rest("settings?select=key,value&key=like.facebook.*"),
  ]);
  const pick = (rows: KV[], k: string) => (rows.find((r) => r.key === k)?.value ?? "").trim();
  return {
    token:   pick(integ, "facebook.token") || ENV_TOKEN,
    pageId:  pick(integ, "facebook.page_id") || "me",   /* ไม่ระบุ = เพจของ token นั้นเอง */
    enabled: pick(settings, "facebook.sync_enabled") !== "false",
    limit:   Math.min(50, Math.max(1, parseInt(pick(settings, "facebook.sync_count"), 10) || 12)),
  };
}

async function graph(path: string, token: string) {
  const r = await fetch(`${GRAPH}/${path}${path.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(token)}`);
  const d = await r.json();
  if (!r.ok) throw new Error("facebook: " + (d?.error?.message || r.status));
  return d;
}

/* ---------- แปลงโพสต์เป็นหัวข้อการ์ด ----------
   เอาบรรทัดแรกที่มีตัวอักษรจริง ตัดแฮชแท็กท้ายบรรทัด และจำกัดความยาวให้พอกับ 3 บรรทัดของการ์ด */
type FbMedia = { media?: { image?: { src?: string } } };
type FbPost = {
  id: string; message?: string; story?: string; full_picture?: string;
  permalink_url: string; created_time: string;
  attachments?: { data?: (FbMedia & { type?: string; subattachments?: { data?: FbMedia[] } })[] };
};

/* รูปของโพสต์ — ไล่ตามลำดับที่ Graph API ให้มา:
     1. full_picture           โพสต์ที่อัปรูปเองมีเสมอ
     2. attachments[0].media   โพสต์แชร์ / ลิงก์พรีวิว / วิดีโอ (ภาพหน้าปก)
     3. subattachments[0]      โพสต์แชร์อัลบั้ม — รูปอยู่ในรายการย่อย ชั้นบนไม่มี media
   ไม่มีเลย = โพสต์ข้อความล้วน คืน "" ให้การ์ดแสดงแบบไม่มีรูป */
function pictureOf(p: FbPost): string {
  if (p.full_picture) return p.full_picture;
  const a = p.attachments?.data?.[0];
  return a?.media?.image?.src || a?.subattachments?.data?.[0]?.media?.image?.src || "";
}

function titleOf(p: { message?: string; story?: string }): string {
  const src = (p.message || p.story || "").replace(/\r/g, "");
  const line = src.split("\n").map((s) => s.trim()).find((s) => /[\p{L}\p{N}]/u.test(s)) || "";
  const clean = line.replace(/(\s*#[\p{L}\p{N}_]+)+\s*$/u, "").trim();
  if (!clean) return "New post from TEFL Chula on Facebook";
  return clean.length > 120 ? clean.slice(0, 117).trimEnd() + "…" : clean;
}

/* ---------- คัดลอกรูปเข้า Storage ----------
   คืน URL สาธารณะ หรือ "" ถ้าโพสต์ไม่มีรูป/โหลดไม่ได้ (การ์ดยังแสดงได้ แค่ไม่มีรูป) */
async function storeImage(postId: string, src?: string): Promise<string> {
  if (!src) return "";
  const img = await fetch(src);
  if (!img.ok) return "";
  const type = img.headers.get("content-type") || "image/jpeg";
  const ext  = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
  const name = `${BUCKET_DIR}/${postId}.${ext}`;
  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/media/${name}`, {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY,
               "Content-Type": type, "x-upsert": "true" },
    body: await img.arrayBuffer(),
  });
  if (!up.ok) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/media/${name}`;
}

async function removeImages(urls: string[]) {
  const prefixes = urls.map((u) => u.split("/storage/v1/object/public/media/")[1]).filter(Boolean);
  if (!prefixes.length) return;
  await fetch(`${SUPABASE_URL}/storage/v1/object/media`, {
    method: "DELETE",
    headers: { apikey: SERVICE_KEY, Authorization: "Bearer " + SERVICE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes }),
  });
}

/* ---------- action: status ---------- */
async function status(cfg: Awaited<ReturnType<typeof config>>) {
  if (!cfg.token) return { connected: false, reason: "no-token" };
  try {
    const page = await graph(`${cfg.pageId}?fields=id,name`, cfg.token);
    const synced: { fb_post_id: string; updated_at: string }[] =
      await rest("news?select=fb_post_id,updated_at&fb_post_id=not.is.null&order=updated_at.desc&limit=1");
    return { connected: true, page: { id: page.id, name: page.name },
             token_tail: cfg.token.slice(-4), synced_at: synced[0]?.updated_at ?? null,
             enabled: cfg.enabled, limit: cfg.limit };
  } catch (e) {
    return { connected: false, reason: String((e as Error).message || e) };
  }
}

/* ---------- action: sync ---------- */
async function sync(cfg: Awaited<ReturnType<typeof config>>) {
  if (!cfg.token) throw new Error("ยังไม่ได้ใส่ token ของเพจ");
  if (!cfg.enabled) return { skipped: "disabled" };

  /* ขอ attachments มาด้วย — โพสต์ที่ "แชร์" โพสต์/อัลบั้ม/ลิงก์ของคนอื่น Graph API มักไม่ให้ full_picture
     รูปจะอยู่ใน attachments.media หรือ subattachments (อัลบั้ม) แทน ถ้าขอแค่ full_picture การ์ดจะไม่มีรูป */
  const FIELDS = "id,message,story,full_picture,permalink_url,created_time," +
    "attachments{media,type,subattachments{media}}";
  const feed = await graph(`${cfg.pageId}/posts?fields=${FIELDS}&limit=${cfg.limit}`, cfg.token);
  const posts: FbPost[] = feed.data || [];

  const existing: { id: string; fb_post_id: string; image: string | null }[] =
    await rest("news?select=id,fb_post_id,image&fb_post_id=not.is.null");
  const have = new Set(existing.map((r) => r.fb_post_id));
  const keep = new Set(posts.map((p) => p.id));

  /* เพิ่มเฉพาะที่ยังไม่มี */
  const fresh = [];
  for (const p of posts) {
    if (have.has(p.id)) continue;
    fresh.push({
      placement: "home",
      title: titleOf(p),
      tag: TAG,
      image: await storeImage(p.id, pictureOf(p)),
      url: p.permalink_url,
      fb_post_id: p.id,
      sort_order: -Math.floor(Date.parse(p.created_time) / 60000),
      is_visible: true,
    });
  }
  if (fresh.length) await rest("news", { method: "POST", body: JSON.stringify(fresh) });

  /* เติมรูปย้อนหลังให้แถวที่เคยดึงมาแล้วแต่ไม่มีรูป (เช่น โพสต์แชร์ก่อนที่จะรู้จัก attachments)
     แตะเฉพาะช่อง image และเฉพาะแถวที่ image ว่าง — หัวข้อ/การซ่อนที่ผู้ดูแลแก้ไว้ไม่โดน */
  let refilled = 0;
  /* โพสต์ที่ยังหารูปไม่ได้ พร้อมเหตุผลสั้น ๆ — ส่งกลับไปให้หน้า admin/คนดีบักเห็น
     ว่าเป็นเพราะ Graph API ไม่ให้รูปมาเลย (no-source) หรือให้ URL มาแต่โหลดไม่ได้ (fetch-<status>) */
  const unresolved: { id: string; type: string; reason: string }[] = [];
  for (const r of existing) {
    if (r.image) continue;
    const p = posts.find((x) => x.id === r.fb_post_id);
    if (!p) continue;
    const src = pictureOf(p);
    const image = await storeImage(p.id, src);
    if (!image) {
      let reason = "no-source";
      if (src) { try { reason = "fetch-" + (await fetch(src, { method: "HEAD" })).status; } catch { reason = "fetch-error"; } }
      unresolved.push({ id: p.id, type: p.attachments?.data?.[0]?.type || "-", reason });
      continue;
    }
    await rest(`news?id=eq.${r.id}`, { method: "PATCH", body: JSON.stringify({ image }) });
    refilled++;
  }

  /* เอาออกเฉพาะแถวที่มาจาก Facebook และไม่อยู่ในชุดล่าสุดแล้ว */
  const stale = existing.filter((r) => !keep.has(r.fb_post_id));
  if (stale.length) {
    await rest("news?id=in.(" + stale.map((r) => r.id).join(",") + ")", { method: "DELETE" });
    await removeImages(stale.map((r) => r.image || ""));
  }
  return { added: fresh.length, removed: stale.length, refilled, unresolved, total: posts.length };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!(await isAllowed(req))) return json({ error: "unauthorized" }, 401);

  try {
    const body = await req.json().catch(() => ({}));
    const cfg = await config();
    return json(body.action === "status" ? await status(cfg) : await sync(cfg));
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
