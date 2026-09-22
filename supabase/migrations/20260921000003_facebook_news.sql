-- =========================================================
-- เชื่อม Latest News กับโพสต์บนเพจ Facebook
--
-- โพสต์ถูกดึงโดย Edge Function "fb-sync" (supabase/functions/fb-sync) แล้วเขียนลงตาราง news
-- ที่ placement = 'home' เหมือนข่าวที่พิมพ์เอง — cms.js / sync-content.py / การ์ดบนหน้าเว็บ
-- จึงไม่ต้องรู้จัก Facebook เลย
--
-- ทำไมไม่ให้ cms.js เรียก Graph API ตรง ๆ:
--   1. token ของเพจต้องอยู่ในเบราว์เซอร์ = ใครก็เปิดดูได้แล้วเอาไปโพสต์แทนเพจ
--   2. URL รูปที่ Graph API คืนมา (full_picture) หมดอายุในไม่กี่วัน ต้องคัดลอกรูปมาเก็บเอง
-- =========================================================

-- ---------- 1. ผูกแถวข่าวกับโพสต์ต้นทาง ----------
-- unique เพื่อให้ sync ซ้ำกี่รอบก็ไม่ได้ข่าวซ้ำ; แถวที่พิมพ์เองค่าเป็น null
alter table public.news add column fb_post_id text unique;

-- ---------- 2. ค่าตั้งที่ผู้ดูแลแก้ได้ใน /admin → ข้อมูลติดต่อและลิงก์ ----------
-- token ไม่อยู่ในตารางนี้: settings อ่านได้โดยคนทั่วไป (anon) ตาม policy
-- token เก็บเป็น secret ของ Edge Function แทน (supabase secrets set FB_PAGE_TOKEN=...)
insert into public.settings (key, label, hint, value, kind, sort_order) values
  ('facebook.sync_enabled', 'ดึงโพสต์จาก Facebook อัตโนมัติ',
   'เปิดแล้วระบบจะดึงโพสต์ล่าสุดของเพจมาใส่สไลด์ Latest News ทุก 6 ชั่วโมง (กดดึงเองได้ที่หน้าข่าว/กิจกรรม)',
   'true', 'bool', 13),
  ('facebook.sync_count', 'จำนวนโพสต์ Facebook ที่แสดง',
   'ดึงมากี่โพสต์ล่าสุด (1–20) โพสต์ที่เก่ากว่านั้นจะถูกเอาออกจากสไลด์เอง ข่าวที่พิมพ์เองไม่ถูกแตะ',
   '6', 'text', 14)
on conflict (key) do nothing;

-- ---------- 3. ตั้งเวลาให้ดึงเองทุก 6 ชั่วโมง ----------
-- pg_cron เรียก Edge Function ผ่าน pg_net โดยส่งกุญแจ x-sync-key ที่เก็บใน Vault
-- (ค่าเดียวกับ secret FB_SYNC_KEY ของฟังก์ชัน) ถ้ายังไม่ได้ใส่กุญแจ ฟังก์ชันจะตอบ 401
-- และไม่ทำอะไร — ใส่ด้วย: select vault.create_secret('<กุญแจ>', 'fb_sync_key');
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'fb-sync-news',
  '0 */6 * * *',
  $$
  select net.http_post(
    url     := 'https://dpyhvsdtbihssapuwert.supabase.co/functions/v1/fb-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-sync-key', coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'fb_sync_key' limit 1), '')
    ),
    body    := '{}'::jsonb
  );
  $$
);
