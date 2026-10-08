/* =========================================================
   admin/js/views/blockeditor.js — แก้ทั้งหน้าแบบบล็อก (#pages/<ไฟล์>) ตามภาพอ้างอิงที่ผู้ใช้ส่งมา (ต.ค. 2026)

   ข้อมูลยังเป็นแถว blocks เหมือนเดิม (หนึ่งแถว = หนึ่ง <section> เก็บ HTML ทั้งก้อน) — ไม่มีตารางใหม่
   หน้านี้แค่ "ผ่า" HTML ของแต่ละ section ออกเป็นบล็อกย่อยตามลูกชั้นบนสุด แล้วต่อกลับตอนบันทึก:
     หัวข้อ   = div.eyebrow + span.rule + h2 (หรือห่อด้วย .sec-head / .section-head)
     ข้อความ  = p / h3 / h4          รูปภาพ = img หรือ .feature-img/figure ที่มีรูปเดียว
     ปุ่ม     = a.btn-base           HTML พิเศษ = อย่างอื่นทั้งหมด (การ์ด ตาราง แบนเนอร์) แก้แบบเห็นภาพหรือโค้ด
     ล็อก     = มี [data-cms] ข้างใน (cms.js เติมรายการจากเมนูอื่นทับทุกครั้ง) หรือเป็นลายตกแต่ง aria-hidden
   ทุกบล็อกถือ DOM node ตัวจริงไว้ แก้แล้วต่อกลับด้วย outerHTML — class/attribute ที่ไม่รู้จักจึงไม่หาย
   section ที่ไม่ได้แตะจะไม่ถูกเขียนกลับ (เทียบกับผลผ่า-ต่อของต้นฉบับ ไม่ใช่ HTML ดิบ ซึ่งต่างกันแค่ช่องว่าง)

   ห้ามลบ/ย้ายบล็อกล็อกโดยตั้งใจ: กรอบ data-cms คือสัญญากับ cms.js/sync-content.py (CLAUDE.md) ลบแล้วรายการหายเงียบ ๆ
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

let be = null;          /* { page, view, secs:[{ key, label, row, vis, blocks, base }], hist, hi } */
let beSeq = 0;          /* id ของบล็อก (ใช้ผูกปุ่มกับบล็อกหลังวาดใหม่) */
let beTimer = null;     /* หน่วงการจด undo ระหว่างพิมพ์ */

const BE_NAMES = {
  'table-wrap':'ตาราง', 'tile-grid':'การ์ดลิงก์', 'mission-band':'แถบเนื้อหาพิเศษ', 'faq-list':'รายการคำถาม',
  'inner':'แบนเนอร์หัวหน้า', 'cta-inner':'ข้อความและปุ่มแถบชวนสมัคร', 'plan-grid':'การ์ดแผนการเรียน', 'fee-grid':'การ์ดค่าเล่าเรียน',
  'news-carousel':'สไลด์ข่าว', 'news-grid':'ข่าวประกาศ', 'hero-track':'สไลด์ภาพหน้าแรก', 'hero-inner':'ข้อความบนภาพหน้าแรก',
  'contact-split':'ฟอร์มและข้อมูลติดต่อ', 'footer-col':'คอลัมน์ส่วนท้าย', 'program-block':'กล่องแนะนำหลักสูตร',
  'intro-bg':'พื้นหลังส่วนแนะนำ', 'intro-inner':'ข้อความส่วนแนะนำ', 'nc-inner':'ข่าวล่าสุด', 'ov-grid':'การ์ดสรุปรายวิชา',
  'plan-tabs':'แท็บแผนการเรียน', 'pt-panel':'ตารางรายวิชา', 'staff-lead':'การ์ดหัวหน้าสาขา', 'staff-grid':'การ์ดอาจารย์',
  'lecturer-grid':'การ์ดอาจารย์รับเชิญ', 'ev-list':'รายการกิจกรรม', 'footer-brand':'โลโก้ส่วนท้าย', 'f-line':'บรรทัดข้อมูลส่วนท้าย',
  'footer-bottom-inner':'แถบล่างสุด', 'slider-dots':'จุดเลื่อนสไลด์'
};
/* data-cms → เมนูที่ใช้แก้รายการนั้น (staff-lead, news-home, faqs-students … ตัดที่ - ตัวแรก) */
const beCmsMenu = v => ({ staff:'staff', lecturers:'lecturers', courses:'courses', tuition:'tuition', news:'news',
  events:'events', faqs:'faqs', links:'links' })[String(v).split('-')[0]];
const beIsHero = k => /\/page-banner$/.test(k) || k === 'index/home';

/* ---------- คลังบล็อก (เมนู + / และปุ่ม "เพิ่มบล็อก") ----------
   บล็อกพื้นฐานใช้มาร์กอัปเดิมของเว็บ (หัวข้อ eyebrow/rule/h2, p, .note, .btn-base, .feature-img) ผ่าแล้วได้ชนิดเดิม
   บล็อกใหม่มีคลาส .cb + data-cb="<ชนิด>" — หน้าตาอยู่ท้าย site.css (CMS CONTENT BLOCKS) ตัวแก้จำชนิดจาก data-cb
   รูปตั้งต้นใช้รูปที่มีในเว็บอยู่แล้ว ผู้ใช้กด "เปลี่ยนรูป" ทีหลัง */
const BE_ARROW = '<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg>';
const beCard = (img, t) => '<article class="cb-card"><img src="' + img + '" alt="" loading="lazy" decoding="async"><div class="cb-card-body"><h3>' + t + '</h3><p>คำอธิบายสั้น ๆ</p><a href="#" class="cb-card-btn">อ่านต่อ</a></div></article>';
const beFig = (img, t) => '<figure><img src="' + img + '" alt="" loading="lazy" decoding="async"><figcaption>' + t + '</figcaption></figure>';
const BE_LIB = [
  { k:'heading', cat:'พื้นฐาน', name:'หัวข้อ (H2)', icon:ICON.heading },
  { k:'h3', cat:'พื้นฐาน', name:'หัวข้อย่อย (H3)', icon:ICON.heading, html:'<h3>หัวข้อย่อย</h3>' },
  { k:'text', cat:'พื้นฐาน', name:'ข้อความ', icon:ICON.text, html:'<p></p>' },
  { k:'note', cat:'พื้นฐาน', name:'หมายเหตุ (แถบส้มซ้าย)', icon:ICON.text, html:'<p class="note">หมายเหตุ</p>' },
  { k:'list', cat:'พื้นฐาน', name:'รายการแบบจุด', icon:ICON.ul, html:'<ul class="cb cb-list" data-cb="list"><li>รายการที่ 1</li><li>รายการที่ 2</li></ul>' },
  { k:'olist', cat:'พื้นฐาน', name:'รายการแบบตัวเลข', icon:ICON.ol, html:'<ol class="cb cb-list" data-cb="olist"><li>ขั้นตอนที่ 1</li><li>ขั้นตอนที่ 2</li></ol>' },
  { k:'quote', cat:'พื้นฐาน', name:'คำพูด / ข้อความยกมา', icon:I('<path d="M7 7h4v4H8a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5V8a1 1 0 0 1 1-1zM15 7h4v4h-3a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5V8a1 1 0 0 1 1-1z"/>'),
    html:'<blockquote class="cb cb-quote" data-cb="quote"><p>“ข้อความที่ยกมา”</p><cite>— ชื่อผู้พูด</cite></blockquote>' },
  { k:'button', cat:'พื้นฐาน', name:'ปุ่มลิงก์', icon:ICON.link, html:'<a href="#" class="btn-base is-outline">Read More' + BE_ARROW + '</a>' },
  { k:'image', cat:'พื้นฐาน', name:'รูปภาพ', icon:ICON.media },
  { k:'divider', cat:'พื้นฐาน', name:'เส้นคั่น', icon:I('<path d="M4 12h16"/>'), html:'<hr class="cb cb-divider" data-cb="divider">' },
  { k:'spacer', cat:'พื้นฐาน', name:'ระยะห่าง', icon:I('<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>'), html:'<div class="cb cb-spacer cb-sp-m" data-cb="spacer"></div>' },
  { k:'callout', cat:'บล็อกจัดหน้า', name:'กล่องเน้นข้อความ', icon:I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    html:'<div class="cb cb-callout is-info" data-cb="callout"><p><strong>สำคัญ:</strong> พิมพ์ข้อความที่ต้องการเน้นที่นี่</p></div>' },
  { k:'columns', cat:'บล็อกจัดหน้า', name:'ข้อความ 2 คอลัมน์', icon:I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>'),
    html:'<div class="cb cb-cols cols-2" data-cb="columns"><div class="cb-col"><h3>หัวข้อ</h3><p>ข้อความ</p></div><div class="cb-col"><h3>หัวข้อ</h3><p>ข้อความ</p></div></div>' },
  { k:'cards', cat:'บล็อกจัดหน้า', name:'การ์ดรูป + ปุ่ม', icon:I('<rect x="3" y="5" width="8" height="14" rx="2"/><rect x="13" y="5" width="8" height="14" rx="2"/>'),
    html:'<div class="cb cb-cards cols-2" data-cb="cards">' + beCard('img/hero-cohort.jpg', 'ชื่อการ์ด') + beCard('img/hero-campus.jpg', 'ชื่อการ์ด') + '</div>' },
  { k:'gallery', cat:'บล็อกจัดหน้า', name:'แกลเลอรีรูป', icon:I('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    html:'<div class="cb cb-gallery" data-cb="gallery">' + beFig('img/activity-foundations.jpg', 'รูป 1') + beFig('img/activity-public-talk.jpg', 'รูป 2') +
      beFig('img/activity-young-learners.jpg', 'รูป 3') + beFig('img/activity-expedition.jpg', 'รูป 4') + '</div>' },
  { k:'video', cat:'บล็อกจัดหน้า', name:'วิดีโอ YouTube', icon:I('<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>') },
  { k:'table', cat:'บล็อกจัดหน้า', name:'ตาราง', icon:I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M10 4v16"/>'),
    html:'<div class="cb table-wrap" data-cb="table"><table class="data-table"><thead><tr><th>หัวข้อ 1</th><th>หัวข้อ 2</th></tr></thead>' +
      '<tbody><tr><td>ข้อมูล</td><td>ข้อมูล</td></tr><tr><td>ข้อมูล</td><td>ข้อมูล</td></tr></tbody></table></div>' },
  { k:'html', cat:'บล็อกจัดหน้า', name:'HTML เอง', icon:I('<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>'), html:'<div><p>HTML</p></div>' }
];
/* ส่วนที่พิมพ์แก้ได้ในบล็อก .cb แต่ละชนิด (':scope' = ทั้งก้อน) — ไม่มีในรายการ = แก้ข้อความตรง ๆ ไม่ได้ (เส้นคั่น ระยะห่าง วิดีโอ) */
const BE_CB_EDIT = { list:':scope', olist:':scope', quote:':scope', callout:':scope', columns:'.cb-col',
  cards:'.cb-card-body h3, .cb-card-body p, .cb-card-btn', gallery:'figcaption', table:'th, td' };
function beYouTube(u){
  const m = String(u || '').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? 'https://www.youtube.com/embed/' + m[1] : '';
}
/* สร้างบล็อกใหม่จากคลัง — คืนเป็น array (ว่าง = ยกเลิก เช่นไม่ได้ใส่ลิงก์วิดีโอ) */
function beCreate(k, s){
  if(k === 'heading' || k === 'image') return [beNew(k, s)];
  if(k === 'video'){
    const u = beYouTube(prompt('วางลิงก์ YouTube เช่น https://www.youtube.com/watch?v=…'));
    if(!u){ toast('ไม่ได้เพิ่มวิดีโอ — ลิงก์ YouTube ไม่ถูกต้อง'); return []; }
    return beParse('<div class="cb cb-video" data-cb="video"><iframe src="' + esc(u) + '" title="วิดีโอ" loading="lazy" ' +
      'allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>');
  }
  const L = BE_LIB.find(x => x.k === k);
  return L && L.html ? beParse(L.html) : [];
}
/* เลือกรูปจากเครื่อง → อัปโหลด → ส่ง URL ให้ fn (ใช้ร่วมทุกที่ที่เปลี่ยน/เพิ่มรูปในตัวแก้หน้า) */
let beFilePending = null;
function bePickImage(fn){ beFilePending = fn; $('#beFile').click(); }

/* ---------- ผ่า HTML ของ section เป็นบล็อก ---------- */
function beParse(html){
  const t = document.createElement('template');
  t.innerHTML = html;
  const kids = [...t.content.childNodes];
  /* มีข้อความเปล่า ๆ ชั้นบนสุด (เช่นเครดิตรูป: ข้อความปนลิงก์) — ผ่าไม่ได้โดยไม่ทำให้ช่องว่างเพี้ยน จึงเป็นบล็อกเดียว */
  if(kids.some(n => n.nodeType === 3 && n.textContent.trim())) return [beMake('html', { els: kids, inline: true })];
  const out = [];
  let pre = [];
  const els = kids.filter(n => n.nodeType === 1 || n.nodeType === 8);
  for(let i = 0; i < els.length; i++){
    const el = els[i];
    if(el.nodeType === 8){ pre.push(el); continue; }   /* คอมเมนต์ติดไปกับบล็อกถัดไป */
    const is = (n, sel) => n && n.nodeType === 1 && n.matches(sel);
    let b;
    /* หัวข้อแบบไม่ห่อ: [eyebrow] [rule] h2 — eyebrow/rule ไม่บังคับ (หัวข้อใหม่ที่ไม่ใส่หัวข้อเล็กจะเหลือ rule + h2)
       ต้องจับเป็นก้อนเดียว ไม่งั้นบันทึกแล้วเปิดใหม่ rule หลุดเป็นบล็อก HTML แยก */
    if(is(el, 'div.eyebrow') || is(el, 'span.rule')){
      let j = i;
      const eb = is(els[j], 'div.eyebrow') ? els[j++] : null;
      const rule = is(els[j], 'span.rule') ? els[j++] : null;
      if(is(els[j], 'h2')){ b = beMake('heading', { eb, rule, h: els[j] }); i = j; }
    }
    if(b){ /* จับเป็นหัวข้อแล้ว */ }
    else if(is(el, '.sec-head, .section-head') && el.querySelector(':scope > h2') && !el.querySelector('[data-cms]')){
      b = beMake('heading', { wrap: el, eb: el.querySelector(':scope > .eyebrow'), rule: el.querySelector(':scope > .rule'), h: el.querySelector(':scope > h2') });
    } else if(is(el, 'h2')){
      b = beMake('heading', { h: el });
    } else if(el.matches('[data-cb]') && !el.querySelector('[data-cms]')){
      b = beMake('cb', { els: [el], kind: el.getAttribute('data-cb') });
    } else if(el.querySelector('[data-cms]') || el.matches('[data-cms]')){
      b = beMake('locked', { els: [el], cms: (el.matches('[data-cms]') ? el : el.querySelector('[data-cms]')).getAttribute('data-cms') });
    } else if(el.getAttribute('aria-hidden') === 'true'){
      b = beMake('locked', { els: [el], deco: true });
    } else if(is(el, 'p, h3, h4')){
      b = beMake('text', { els: [el] });
    } else if(is(el, 'img')){
      b = beMake('image', { img: el });
    } else if(is(el, '.feature-img, figure') && el.querySelectorAll('img').length === 1 && !el.textContent.trim()){
      b = beMake('image', { wrap: el, img: el.querySelector('img') });
    } else if(is(el, 'a.btn-base')){
      b = beMake('button', { els: [el] });
    } else {
      b = beMake('html', { els: [el] });
    }
    b.pre = pre; pre = [];
    out.push(b);
  }
  if(pre.length) out.push(Object.assign(beMake('html', { els: pre }), { pre: [] }));
  return out;
}
function beMake(type, o){ return Object.assign({ id: ++beSeq, type, pre: [] }, o); }

/* ---------- ต่อกลับเป็น HTML ---------- */
function beMain(b){
  if(b.type === 'heading') return b.wrap ? [b.wrap] : [b.eb, b.rule, b.h].filter(Boolean);
  if(b.type === 'image') return [b.wrap || b.img];
  return b.els;
}
function beOut(n){
  if(n.nodeType === 8) return '<!--' + n.data + '-->';
  if(n.nodeType === 3) return n.textContent;
  const c = n.cloneNode(true);
  /* ตัวแก้ใส่ contenteditable ไว้ที่กรอบนอกเท่านั้น แต่กันพลาด: ห้ามหลุดไปหน้าเว็บจริง */
  [c, ...c.querySelectorAll('[contenteditable],[spellcheck],[data-be]')].forEach(x => { x.removeAttribute('contenteditable'); x.removeAttribute('spellcheck'); x.removeAttribute('data-be'); });
  return c.outerHTML;
}
function beSerialize(blocks){
  return blocks.map(b => b.inline ? b.els.map(beOut).join('')
    : b.pre.concat(beMain(b)).map(beOut).join('\n')).join('\n');
}

/* ---------- โหลดหน้า ---------- */
/* keep=true (หลังบันทึก): โหลดข้อมูลใหม่โดยไม่ล้างจอ — กรอบหน้าเว็บไม่ต้องโหลดใหม่
   arg = ไฟล์ (ทั้งหน้า) หรือ ไฟล์#id (หน้าย่อย) — หน้าย่อยโหลดเฉพาะ section ในกลุ่มของมัน (pageSubs ใน pages.js)
   be.secs มีแค่ section ที่แก้ได้ ส่วนอื่นของหน้าไม่ถูกแตะเลย (ทั้งตอนวาด บันทึก และ Preview) */
async function pageEditor(arg, keep){
  const [page, anchor] = String(arg).split('#');
  const p0 = pageOf(page);
  pgOpen = arg;
  setTitle(p0.title);
  if(!keep){ beCanvasStop(); $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>'; }
  const cols = 'key,page,label,html,is_visible,updated_at,sort_order' + (hasAuthor ? ',updated_by' : '');
  const [r, rn] = await Promise.all([
    api('/rest/v1/blocks?select=' + cols + '&page=eq.' + encodeURIComponent(page) + '&order=sort_order.asc'),
    anchor ? api('/rest/v1/nav?select=label,href,parent_id,sort_order&order=sort_order.asc') : null]);
  if(current !== 'pages' || pgOpen !== arg) return;
  if(!r.ok){ $('#view').innerHTML = '<div class="empty">โหลดไม่สำเร็จ (' + r.status + ')</div>'; return; }
  let rows = await r.json();
  if(!rows.length){ toast('ไม่พบหน้านี้'); return go('pages'); }
  let title = p0.title;
  if(anchor){
    const g = pageSubs(page, rows, rn && rn.ok ? await rn.json() : []).find(x => x.id === anchor);
    if(!g){ toast('ไม่พบหน้าย่อยนี้ในเมนู — เปิดทั้งหน้าแทน'); return go('pages/' + encodeURIComponent(page)); }
    const keys = new Set(g.members.map(b => b.key));
    rows = rows.filter(row => keys.has(row.key));
    title = g.label;
    setTitle(title + ' ‹ ' + p0.title);
  }
  const secs = rows.map(row => {
    const blocks = beParse(row.html);
    return { key: row.key, label: row.label, row, vis: row.is_visible !== false, blocks, base: beSerialize(blocks) };
  });
  const view = be && be.id === arg ? be.view : beDefaultView();
  be = { id: arg, page, anchor: anchor || '', title, view, secs, hist: [], hi: 0 };
  be.hist.push(beSnap());
  beRender();
}

const beSnap = () => JSON.stringify(be.secs.map(s => [s.key, s.vis, beSerialize(s.blocks)]));
function beRestore(snap){
  JSON.parse(snap).forEach(([key, vis, html]) => {
    const s = be.secs.find(x => x.key === key);
    if(s){ s.vis = vis; s.blocks = beParse(html); }
  });
  beRender();
}
const beChanged = s => s.vis !== (s.row.is_visible !== false) || beSerialize(s.blocks) !== s.base;

/* จดประวัติ undo + อัปเดตสถานะ "ยังไม่บันทึก" — now=true ใช้กับการเพิ่ม/ย้าย/ลบบล็อก (จดทันที) */
function beTouch(now){
  clearTimeout(beTimer);
  const commit = () => {
    const s = beSnap();
    if(s !== be.hist[be.hi]){ be.hist = be.hist.slice(0, be.hi + 1); be.hist.push(s); be.hi++; }
    bePaintState();
  };
  if(now) commit(); else { beTimer = setTimeout(commit, 450); bePaintState(); }
}
function bePaintState(){
  if(!be || !$('#beSave')) return;
  const n = be.secs.filter(beChanged).length;
  dirty = n > 0;
  $('#beSave').disabled = !n;
  $('#beState').textContent = n ? 'ยังไม่บันทึก ' + n + ' ส่วน' : 'บันทึกครบแล้ว';
  $('#beState').classList.toggle('on', !!n);
  $('#beUndo').disabled = be.hi === 0;
  $('#beRedo').disabled = be.hi >= be.hist.length - 1;
}

/* ---------- วาด ----------
   มี 2 มุมมองของข้อมูลชุดเดียวกัน (be.secs):
     canvas = เปิดหน้าเว็บจริงในกรอบ (iframe) แล้วแก้บนหน้านั้นเลย — หน้าตาตรงกับเว็บทุกอย่างเพราะใช้ CSS ของเว็บเอง
     form   = รายการบล็อกแบบฟอร์ม (มุมมองเดิม) — ใช้บนจอเล็ก หรือเวลาต้องการแก้แม่น ๆ
   แถบบนวาดครั้งเดียวต่อการเปิดหน้า/สลับมุมมอง (beShell) ส่วนเนื้อหาวาดซ้ำได้ (beRender) — กรอบ iframe จึงไม่โหลดใหม่ทุกครั้งที่แก้ */
const BE_TYPE = {
  heading: [ICON.heading, 'หัวข้อ (H2)'], text: [ICON.text, 'ข้อความ'], image: [ICON.media, 'รูปภาพ'],
  button: [ICON.link, 'ปุ่มลิงก์'], html: [ICON.pages, 'ส่วนจัดรูปแบบพิเศษ'], locked: [ICON.settings, 'ข้อมูลอัตโนมัติ'],
  cb: [ICON.pages, 'บล็อก']
};
function beLabel(b){
  if(b.type === 'cb'){ const L = BE_LIB.find(x => x.k === b.kind); return L ? L.name : 'บล็อก ' + b.kind; }
  if(b.type === 'text'){ const el = b.els.find(n => n.nodeType === 1); if(!el) return 'ข้อความ'; return el.tagName === 'P' ? (el.classList.contains('note') ? 'หมายเหตุ' : el.classList.contains('subtitle') ? 'คำโปรย' : 'ข้อความ') : 'หัวข้อย่อย (' + el.tagName + ')'; }
  if(b.type === 'html'){ const el = b.els.find(n => n.nodeType === 1); const c = el && [...el.classList].find(x => BE_NAMES[x]); return c ? BE_NAMES[c] : BE_TYPE.html[1]; }
  if(b.type === 'locked') return b.deco ? 'ลายตกแต่ง' : 'รายการจากเมนู ' + (SCHEMA[beCmsMenu(b.cms)] ? SCHEMA[beCmsMenu(b.cms)].label : b.cms);
  return BE_TYPE[b.type][1];
}
const beSnip = b => beMain(b).map(n => n.textContent || '').join(' ').replace(/\s+/g, ' ').trim().slice(0, 48);
const BE_VIEW = 'tefl-cms-be-view';
function beDefaultView(){
  let v = null; try{ v = localStorage.getItem(BE_VIEW); }catch(e){}
  return v === 'form' || v === 'canvas' ? v : (window.innerWidth > 900 ? 'canvas' : 'form');
}

function beRender(){
  const root = $('#beRoot');
  if(!root || root.dataset.view !== be.view || root.dataset.page !== be.id) return beShell();
  if(be.view === 'canvas') beCanvasApply(); else beFormRender();
  bePaintState();
}

function beShell(){
  const p = pageOf(be.page);
  const related = Object.keys(SCHEMA).filter(k => k !== 'blocks' && k !== 'nav' && SCHEMA[k].link && SCHEMA[k].link.split('#')[0] === be.page);
  beCanvasStop();
  $('#view').innerHTML = '<div class="be" id="beRoot" data-view="' + be.view + '" data-page="' + esc(be.id) + '">' +
    '<div class="be-top">' +
      '<a class="be-back" href="' + H('pages') + '" title="กลับไปหน้าเว็บทั้งหมด">' + ICON.undo + '</a>' +
      '<h1>' + esc(be.title) + '</h1>' + pgBadge(be.anchor ? 'sub' : p.type) +
      (be.anchor ? '<a class="be-parent" href="' + pgHref(be.page) + '" title="แก้ทั้งหน้า">ใน ' + esc(p.title) + '</a>' : '') +
      '<span class="be-state" id="beState"></span>' +
      '<span class="be-sp"></span>' +
      '<button class="be-ic" id="beUndo" title="ย้อนกลับ">' + ICON.undo + '</button>' +
      '<button class="be-ic" id="beRedo" title="ทำซ้ำ">' + ICON.redo + '</button>' +
      (be.view === 'canvas' ? '<button class="be-ic" id="beOutline" title="แสดงกรอบของทุกบล็อก" aria-pressed="false">' + ICON.dash + '</button>' : '') +
      '<button class="btn" id="bePrev">' + ICON.eye + 'Preview</button>' +
      '<button class="btn primary" id="beSave">บันทึก</button>' +
    '</div>' +
    '<div class="be-tabs">' +
      '<button data-view="canvas" aria-selected="' + (be.view === 'canvas') + '">แก้บนหน้าเว็บ</button>' +
      '<button data-view="form" aria-selected="' + (be.view === 'form') + '">รายการบล็อก</button>' +
      (related.length ? '<span class="be-rel">ข้อมูลอื่นในหน้านี้: ' + related.map(k => '<a href="' + H(k) + '">' + esc(SCHEMA[k].label) + '</a>').join('') + '</span>' : '') +
    '</div>' +
    '<div class="msg err" id="editMsg"></div>' +
    '<input type="file" accept="image/*" id="beFile" hidden>' +
    '<div id="beBody"></div>' +
  '</div>';
  $('#beUndo').addEventListener('click', ()=>{ beTouch(true); if(be.hi > 0){ be.hi--; beRestore(be.hist[be.hi]); } });
  $('#beRedo').addEventListener('click', ()=>{ if(be.hi < be.hist.length - 1){ be.hi++; beRestore(be.hist[be.hi]); } });
  $('#beSave').addEventListener('click', beSave);
  $('#bePrev').addEventListener('click', bePreview);
  $('#beRoot').querySelectorAll('[data-view]').forEach(t => t.addEventListener('click', ()=>{
    if(t.dataset.view === be.view) return;
    beTouch(true);
    be.view = t.dataset.view;
    try{ localStorage.setItem(BE_VIEW, be.view); }catch(e){}
    beShell();
  }));
  const ol = $('#beOutline');
  if(ol) ol.addEventListener('click', ()=>{
    if(!bf) return;
    const on = !bf.d.body.classList.contains('be-outlines');
    bf.d.body.classList.toggle('be-outlines', on); ol.setAttribute('aria-pressed', on);
  });
  if(be.view === 'canvas') beCanvasMount(); else beFormRender();
  bePaintState();
}

/* ---------- มุมมองรายการบล็อก (form) ---------- */
function beFormRender(){
  /* แทนกล่องเนื้อหาทั้งกล่อง (ไม่ใช่แค่ innerHTML) ให้ listener ของรอบก่อนหายไปกับกล่องเก่า ไม่ซ้อนกัน */
  be.secs.forEach(s => s.blocks.forEach(b => beEditable(b, false)));
  const old = $('#beBody'), body = document.createElement('div');
  body.id = 'beBody';
  body.innerHTML = be.secs.map(beSecHtml).join('');
  old.replaceWith(body);
  beFormWire(body);
}

function beSecHtml(s){
  let head = null;
  return '<section class="be-sec' + (s.vis ? '' : ' off') + '" data-key="' + esc(s.key) + '">' +
    '<header class="be-sec-h"><div><b>' + esc(s.label) + '</b>' + (s.vis ? '' : '<span class="pg-st warn">ซ่อนอยู่</span>') + '</div>' +
      /* ไม่มีปุ่มซ่อน section โดยตั้งใจ: cms.js ดึงเฉพาะแถวที่ is_visible = true แถวที่ซ่อนจึงไม่ถูกเขียนทับ
         หน้าเว็บกลับไปโชว์สำเนาในไฟล์ HTML แทน — ซ่อนจริงไม่ได้ ใส่ปุ่มไว้จะหลอกผู้ใช้ */
      '<div class="be-sec-a">' +
      '<a href="' + editHref('blocks', s.row) + '" title="แก้ HTML ทั้งส่วนในตัวแก้แบบเดิม">แก้ทั้งส่วน (HTML)</a></div></header>' +
    '<div class="be-list">' + s.blocks.map((b, i) => {
      if(b.type === 'heading') head = b;
      const under = b.type !== 'heading' && head;
      return beBlockHtml(s, b, i, under ? head.h.textContent.replace(/\s+/g, ' ').trim().slice(0, 48) : '');
    }).join('') + '</div>' +
    '<div class="be-add">' + beAddMenu(-1) + '</div>' +
  '</section>';
}
function beAddMenu(after){
  let cat = '';
  return '<div class="be-addwrap"><button type="button" class="be-addbtn" data-add="' + after + '">' +
    (after < 0 ? '<span>+</span> เพิ่มบล็อก' : '+') + '</button>' +
    '<div class="be-addmenu">' + BE_LIB.map(x => (x.cat !== cat ? '<div class="be-mcat">' + esc(cat = x.cat) + '</div>' : '') +
      '<a data-new="' + x.k + '">' + x.icon + esc(x.name) + '</a>').join('') + '</div></div>';
}

function beBlockHtml(s, b, i, under){
  const icon = b.type === 'cb' ? ((BE_LIB.find(x => x.k === b.kind) || {}).icon || ICON.pages) : BE_TYPE[b.type][0];
  const locked = b.type === 'locked';
  const bar = '<div class="be-bar"><span class="be-type">' + icon + esc(beLabel(b)) + '</span>' +
    (under ? '<span class="be-under">↳ ' + esc(under) + '</span>' : (b.type !== 'heading' ? '<span class="be-under">' + esc(beSnip(b)) + '</span>' : '')) +
    '<span class="be-acts">' + (locked ? '<span class="be-lock" title="ห้ามลบหรือย้าย: cms.js เติมรายการลงในกรอบนี้">ล็อก</span>' :
      beAddMenu(i) +
      '<button type="button" data-mv="-1" title="เลื่อนขึ้น"' + (i === 0 ? ' disabled' : '') + '>' + ICON.sortUp + '</button>' +
      '<button type="button" data-mv="1" title="เลื่อนลง"' + (i === s.blocks.length - 1 ? ' disabled' : '') + '>' + ICON.sortDown + '</button>' +
      '<button type="button" data-del class="del" title="ลบบล็อก">' + ICON.trash + '</button>') +
    '</span></div>';
  let body = '';
  if(b.type === 'heading'){
    body = '<input class="be-eb" placeholder="หัวข้อเล็กด้านบน (ไม่ใส่ก็ได้)" value="' + esc(b.eb ? b.eb.textContent.trim() : '') + '">' +
      '<div class="be-h2" contenteditable="true" spellcheck="false"></div>';
  } else if(b.type === 'text' || b.type === 'html' || b.type === 'cb'){
    body = beTools(b.type !== 'text') + '<div class="be-ce ' + (b.type === 'text' ? 'be-p' : 'be-html') + '" contenteditable="true"></div>' +
      '<textarea class="be-code" hidden spellcheck="false"></textarea>';
  } else if(b.type === 'image'){
    body = '<div class="be-imgrow"><button type="button" class="be-img" data-pick title="เปลี่ยนรูป"><img alt=""></button>' +
      '<div class="be-imgf"><button type="button" class="btn" data-pick>' + ICON.media + 'อัปโหลดรูปใหม่</button>' +
      '<label>คำอธิบายรูป (alt)<input data-alt></label><label>ลิงก์/พาธของรูป<input data-src></label>' +
      '<input type="file" accept="image/*" data-file hidden></div></div>';
  } else if(b.type === 'button'){
    body = '<div class="be-btnrow"><label>ข้อความบนปุ่ม<input data-btxt></label><label>ลิงก์<input data-bhref></label></div>';
  } else {
    const m = beCmsMenu(b.cms);
    body = b.deco ? '<p class="be-lockmsg">ลายตกแต่งพื้นหลัง — ไม่มีข้อความให้แก้</p>'
      : '<p class="be-lockmsg">รายการในกรอบนี้ดึงจากเมนู <b>' + esc(SCHEMA[m] ? SCHEMA[m].label : b.cms) + '</b> อัตโนมัติ' +
        (SCHEMA[m] ? ' — <a href="' + H(m) + '">ไปแก้ที่เมนูนั้น ↗</a>' : '') + '</p>';
  }
  return '<div class="be-blk t-' + b.type + (under ? ' under' : '') + '" data-id="' + b.id + '">' + bar + '<div class="be-body">' + body + '</div></div>';
}
function beTools(code){
  const c = (cmd, t, ic) => '<button type="button" data-cmd="' + cmd + '" title="' + t + '">' + ic + '</button>';
  return '<div class="be-tools">' + c('bold','ตัวหนา',ICON.bold) + c('italic','ตัวเอียง',ICON.italic) +
    (code ? c('insertUnorderedList','รายการแบบจุด',ICON.ul) : '') +
    '<button type="button" data-link title="แทรกลิงก์">' + ICON.link + '</button>' + c('unlink','เอาลิงก์ออก',ICON.unlink) +
    c('removeFormat','ล้างรูปแบบ',ICON.clean) + '<span class="sep"></span>' +
    '<button type="button" data-code title="แก้เป็นโค้ด HTML">&lt;/&gt;</button></div>';
}

const beFind = id => { for(const s of be.secs){ const i = s.blocks.findIndex(b => b.id === id); if(i >= 0) return [s, i, s.blocks[i]]; } return []; };

function beFormWire(root){
  /* ใส่ node ตัวจริงเข้าไปในตัวแก้ — แก้แล้ว node เปลี่ยนตาม ไม่ต้องคัดลอกกลับ */
  root.querySelectorAll('.be-blk').forEach(el => {
    const [, , b] = beFind(+el.dataset.id);
    if(!b) return;
    if(b.type === 'heading'){ el.querySelector('.be-h2').innerHTML = b.h.innerHTML; }
    if(b.type === 'text' || b.type === 'html' || b.type === 'cb'){ const ce = el.querySelector('.be-ce'); b.els.forEach(n => ce.appendChild(n)); }
    if(b.type === 'image'){
      el.querySelector('.be-img img').src = b.img.getAttribute('src') || '';
      el.querySelector('[data-alt]').value = b.img.getAttribute('alt') || '';
      el.querySelector('[data-src]').value = b.img.getAttribute('src') || '';
    }
    if(b.type === 'button'){
      const a = b.els[0];
      el.querySelector('[data-btxt]').value = [...a.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      el.querySelector('[data-bhref]').value = a.getAttribute('href') || '';
    }
  });

  /* ปุ่มในแถบเครื่องมือไม่แย่งโฟกัส ข้อความที่เลือกไว้จึงยังอยู่ตอนกดตัวหนา/ลิงก์ */
  root.addEventListener('mousedown', e => { if(e.target.closest('.be-tools button')) e.preventDefault(); });

  root.addEventListener('click', e => {
    const blkEl = e.target.closest('.be-blk'), secEl = e.target.closest('.be-sec');
    const s = secEl && be.secs.find(x => x.key === secEl.dataset.key);
    const [, i, b] = blkEl ? beFind(+blkEl.dataset.id) : [];
    const t = e.target.closest('button, a');
    if(!t) return;
    if(t.matches('.be-addbtn')){
      e.stopPropagation();
      const w = t.parentNode, open = !w.classList.contains('open');
      root.querySelectorAll('.be-addwrap.open').forEach(x => x.classList.remove('open'));
      w.classList.toggle('open', open);
      return;
    }
    if(t.matches('[data-new]')){
      const at = +t.closest('.be-addwrap').querySelector('.be-addbtn').dataset.add;
      const nbs = beCreate(t.dataset.new, s);
      if(!nbs.length) return;
      const nb = nbs[0];
      s.blocks.splice(at < 0 ? s.blocks.length : at + 1, 0, ...nbs);
      beTouch(true); beRender();
      const ne = $('#beRoot [data-id="' + nb.id + '"]');
      if(ne){ ne.scrollIntoView({ block:'center' }); const f = ne.querySelector('input, [contenteditable]'); if(f) f.focus(); }
      return;
    }
    if(t.matches('[data-mv]')){
      const j = i + +t.dataset.mv;
      if(j < 0 || j >= s.blocks.length) return;
      [s.blocks[i], s.blocks[j]] = [s.blocks[j], s.blocks[i]];
      beTouch(true); beRender(); return;
    }
    if(t.matches('[data-del]')){ s.blocks.splice(i, 1); beTouch(true); beRender(); toast('ลบบล็อกแล้ว — กดย้อนกลับได้ถ้าลบผิด'); return; }
    if(t.matches('[data-cmd]')){ document.execCommand(t.dataset.cmd); beTouch(); return; }
    if(t.matches('[data-link]')){
      const url = prompt('ใส่ลิงก์ เช่น admission.html หรือ https://www.chula.ac.th/');
      if(url && url.trim()){ document.execCommand('createLink', false, url.trim()); beTouch(); }
      return;
    }
    if(t.matches('[data-code]')) return beToggleCode(blkEl, b, t);
    if(t.matches('[data-pick]')) return blkEl.querySelector('[data-file]').click();
  });
  document.addEventListener('click', beCloseMenus);

  root.addEventListener('input', e => {
    const blkEl = e.target.closest('.be-blk');
    if(!blkEl) return;
    const [, , b] = beFind(+blkEl.dataset.id);
    if(!b) return;
    if(e.target.matches('.be-eb')) beSetEyebrow(b, e.target.value.trim());
    else if(e.target.matches('.be-h2')) b.h.innerHTML = e.target.innerHTML.replace(/<div>|<\/div>/g, '');
    else if(e.target.matches('.be-ce')) b.els = [...e.target.childNodes];
    else if(e.target.matches('.be-code')){ /* แก้ตอนสลับกลับ */ }
    else if(e.target.matches('[data-alt]')) b.img.setAttribute('alt', e.target.value);
    else if(e.target.matches('[data-src]')){ beSetSrc(b, e.target.value.trim()); blkEl.querySelector('.be-img img').src = e.target.value.trim(); }
    else if(e.target.matches('[data-btxt]')) beSetBtnText(b, e.target.value);
    else if(e.target.matches('[data-bhref]')) b.els[0].setAttribute('href', e.target.value.trim());
    beTouch();
  });
  root.addEventListener('change', async e => {
    if(e.target.matches('[data-file]')){
      const blkEl = e.target.closest('.be-blk'), [, , b] = beFind(+blkEl.dataset.id);
      const url = await uploadFile(e.target.files[0]); e.target.value = '';
      if(!url) return;
      beSetSrc(b, url);
      blkEl.querySelector('.be-img img').src = url; blkEl.querySelector('[data-src]').value = url;
      beTouch(true);
    }
  });
  /* วางข้อความจากที่อื่นให้ตัดรูปแบบทิ้ง ไม่งั้นสีและฟอนต์จาก Word ติดเข้าหน้าเว็บ */
  root.addEventListener('paste', e => {
    if(!e.target.closest('.be-ce, .be-h2')) return;
    e.preventDefault();
    document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text'));
  });
  /* Enter ในข้อความ = ตัดเป็นบล็อกข้อความใหม่ (Shift+Enter = ขึ้นบรรทัดในบล็อกเดิม) · หัวข้อ H2 ห้ามขึ้นบรรทัด */
  root.addEventListener('keydown', e => {
    if(e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    if(e.target.matches('.be-h2')){ e.preventDefault(); return; }
    if(!e.target.matches('.be-p')) return;
    const blkEl = e.target.closest('.be-blk'), [s, i, b] = beFind(+blkEl.dataset.id);
    const np = beSplit(window, b, e);
    if(!np) return;
    const nb = beMake('text', { els: [np] });
    s.blocks.splice(i + 1, 0, nb);
    beTouch(true); beRender();
    const ce = $('#beRoot [data-id="' + nb.id + '"] .be-ce');
    if(ce){ ce.focus(); beCaret(window, np); }
  });
}
function beCloseMenus(e){
  if(!$('#beRoot')) return document.removeEventListener('click', beCloseMenus);
  if(!e.target.closest('.be-addwrap')) document.querySelectorAll('.be-addwrap.open').forEach(x => x.classList.remove('open'));
}

/* ตัดย่อหน้าตรงเคอร์เซอร์ คืน <p> ใหม่ที่ถือส่วนท้าย (ใช้ทั้งสองมุมมอง — w = หน้าต่างที่ข้อความอยู่) */
function beSplit(w, b, e){
  const p = b.els.find(n => n.nodeType === 1);
  const sel = w.getSelection();
  if(!p || !sel.rangeCount || !p.contains(sel.anchorNode)) return null;
  e.preventDefault();
  const r = sel.getRangeAt(0); r.deleteContents();
  const tail = p.ownerDocument.createRange(); tail.setStart(r.endContainer, r.endOffset); tail.setEnd(p, p.childNodes.length);
  const np = p.ownerDocument.createElement('p'); np.appendChild(tail.extractContents());
  return np;
}
function beCaret(w, el, atEnd){
  const r = el.ownerDocument.createRange();
  r.selectNodeContents(el); r.collapse(!atEnd);
  const sel = w.getSelection(); sel.removeAllRanges(); sel.addRange(r);
}
function beSetBtnText(b, text){
  const a = b.els[0];
  const tn = [...a.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()) || a.insertBefore(a.ownerDocument.createTextNode(''), a.firstChild);
  tn.textContent = text;
}

/* ส่วนที่แก้ข้อความตรง ๆ ได้ในหน้า: หัวข้อเล็ก+H2 / ย่อหน้า / ส่วนพิเศษทั้งก้อน / ข้อความบนปุ่ม
   on=false ถอดออกก่อนสลับไปมุมมองรายการ (beOut ก็ถอดตอนบันทึกอยู่แล้ว กันพลาดสองชั้น) */
function beEditable(b, on){
  let hosts = [];
  if(b.type === 'cb'){
    const root = b.els.find(n => n.nodeType === 1), sel = BE_CB_EDIT[b.kind];
    if(root){
      if(on && sel) hosts = sel === ':scope' ? [root] : [...root.querySelectorAll(sel)];
      if(!on) hosts = [root, ...root.querySelectorAll('[contenteditable]')];
    }
  }
  if(b.type === 'heading') hosts = [b.eb, b.h];
  else if(b.type === 'text' || b.type === 'button' || (b.type === 'html' && !b.inline)) hosts = b.els;
  hosts.filter(n => n && n.nodeType === 1).forEach(n => {
    if(on){ n.setAttribute('contenteditable', 'true'); n.setAttribute('spellcheck', 'false'); }
    else { n.removeAttribute('contenteditable'); n.removeAttribute('spellcheck'); }
  });
  if(!on) beMain(b).concat(b.pre).forEach(n => { if(n && n.nodeType === 1) n.removeAttribute('data-be'); });
}

/* ---------- มุมมองแก้บนหน้าเว็บ (canvas) ----------
   โหลดหน้าจริงใน iframe (?cms-edit = site.js ไม่เปิดเพลง) รอ cms.js เติมเนื้อหาจนเสร็จ (TEFLCmsReady)
   แล้วแทนลูกของแต่ละ section ด้วย node ของบล็อก — node ชุดเดียวกับที่บันทึก แก้ในหน้า = แก้ข้อมูลเลย
   บล็อกล็อกที่มีรายการจากเมนูอื่น แสดงสำเนาของที่ cms.js เติมไว้ (ของจริงล่าสุด) แต่ตอนบันทึกใช้ node เดิมจากฐานข้อมูล
   ปุ่ม/กรอบควบคุมวาดเป็นชั้นลอย #be-ov ใน iframe — ไม่แทรกอะไรเข้าไปใน section จึงไม่ทำ layout ของเว็บเพี้ยน */
let bf = null;   /* { fr, w, d, live, sel, hov, menu, timer, hovTimer } */

function beCanvasStop(){ if(bf){ clearInterval(bf.timer); bf = null; } }

function beCanvasMount(){
  const body = $('#beBody');
  body.innerHTML = '<div class="be-canvas"><iframe id="beFrame" title="หน้าเว็บสำหรับแก้ไข"></iframe>' +
    '<div class="be-load" id="beLoad">กำลังเปิดหน้าเว็บ…</div></div>';
  const fr = $('#beFrame');
  fr.addEventListener('load', async ()=>{
    /* รอ cms.js เติมเนื้อหาให้เสร็จก่อน ไม่งั้นมันเขียนทับสิ่งที่วางไว้ (ไม่เกิน 10 วินาที — Supabase ล่มก็ยังแก้ได้) */
    for(let n = 0; n < 100 && fr.isConnected && !(fr.contentWindow && fr.contentWindow.TEFLCmsReady); n++){
      await new Promise(r => setTimeout(r, 100));
    }
    if(fr.isConnected) beCanvasInit(fr);
  }, { once:true });
  /* หน้าย่อย: เปิดที่ #id ให้ site.js กรองเหลือกลุ่มนั้นเหมือนผู้ชมเห็นจริง */
  fr.src = pgLive(be.page) + '?cms-edit=1' + (be.anchor ? '#' + be.anchor : '');
}

function beCanvasInit(fr){
  const w = fr.contentWindow, d = fr.contentDocument;
  bf = { fr, w, d, live: {}, sel: null, hov: null, menu: null, timer: 0, hovTimer: 0 };
  const st = d.createElement('style'); st.textContent = BE_FRAME_CSS; d.head.appendChild(st);
  /* มุมมองย่อของ site.js (ตัด 2 บรรทัด + ปุ่ม Read More, กรองเฉพาะกลุ่ม) ต้องปิด — ต้องเห็นเนื้อหาเต็มเพื่อแก้ */
  /* ทั้งหน้า: ปิดมุมมองย่อ/กรองของ site.js ให้เห็นทุก section · หน้าย่อย: คงการกรองไว้ (= สิ่งที่ผู้ชมเห็นในหน้าย่อยนั้น) */
  if(!be.anchor){
    d.body.classList.remove('is-page-view', 'is-section-view');
    d.querySelectorAll('section[hidden]').forEach(x => { x.hidden = false; });
  }
  d.querySelectorAll('.read-more-wrap, .section-tabs').forEach(x => x.remove());
  const keys = new Set(be.secs.map(s => s.key));
  d.querySelectorAll('[data-cms-block]').forEach(sec => { if(!keys.has(sec.getAttribute('data-cms-block'))) sec.classList.add('be-inert'); });
  d.querySelectorAll('.site-header, body > header').forEach(x => x.classList.add('be-inert', 'be-static'));
  /* เก็บสำเนาของรายการที่ cms.js เติมไว้ (ตามค่า data-cms) ไว้โชว์ในบล็อกล็อก */
  be.secs.forEach(s => {
    const sec = d.querySelector('[data-cms-block="' + CSS.escape(s.key) + '"]');
    if(!sec) return;
    [...sec.children].forEach(ch => {
      const c = ch.matches('[data-cms]') ? ch : ch.querySelector('[data-cms]');
      if(c) bf.live[c.getAttribute('data-cms')] = ch.cloneNode(true);
    });
  });
  const ov = d.createElement('div');
  ov.id = 'be-ov';
  ov.innerHTML = '<div class="be-box hov"></div><div class="be-box sel"></div>' +
    '<div class="be-gut"><button data-g="add" title="เพิ่มบล็อกต่อจากนี้">' + ICON.add + '</button>' +
      '<button data-g="up" title="เลื่อนขึ้น">' + ICON.sortUp + '</button><button data-g="down" title="เลื่อนลง">' + ICON.sortDown + '</button></div>' +
    '<div class="be-chip"></div>' +
    '<div class="be-menu">' + beMenuHtml() + '</div>' +
    '<div class="be-locks"></div>';
  d.body.appendChild(ov);
  beFrameWire();
  bf.timer = setInterval(()=>{ if(!fr.isConnected) return beCanvasStop(); bePlace(); }, 600);
  const ld = $('#beLoad'); if(ld) ld.hidden = true;
  beCanvasApply();
  /* หน้าย่อยเปิดที่ #id: site.js เลื่อนไปหา section ด้วย scrollIntoView ซึ่งเลื่อน "หน้า admin" ที่ครอบกรอบไว้ด้วย
     (แถบบนเลื่อนหายไปครึ่งหนึ่ง) — ดึงหน้า admin กลับขึ้นบนสุด ส่วนในกรอบเลื่อนไปที่ section ของหน้าย่อยเอง */
  const top0 = () => { window.scrollTo(0, 0); const v = $('#view'); if(v) v.scrollTop = 0; };
  top0(); setTimeout(top0, 300); setTimeout(top0, 1200);
  if(be.anchor){ const first = be.secs[0] && d.querySelector('[data-cms-block="' + CSS.escape(be.secs[0].key) + '"]'); if(first) w.scrollTo(0, Math.max(0, first.getBoundingClientRect().top + w.scrollY - 24)); }
  const miss = be.secs.filter(s => !d.querySelector('[data-cms-block="' + CSS.escape(s.key) + '"]'));
  if(miss.length) msg($('#editMsg'), 'มี ' + miss.length + ' ส่วนที่ไม่อยู่ในไฟล์หน้านี้ (' + miss.map(s => s.label).join(', ') + ') — แก้ได้ในแท็บ "รายการบล็อก"', 'err');
}

function beCanvasApply(){
  if(!bf) return;
  const d = bf.d;
  be.secs.forEach(s => {
    const sec = d.querySelector('[data-cms-block="' + CSS.escape(s.key) + '"]');
    if(!sec) return;
    const nodes = [];
    s.blocks.forEach(b => {
      let disp;
      if(b.type === 'locked' && !b.deco && bf.live[b.cms]){
        if(!b.disp){
          b.disp = bf.live[b.cms].cloneNode(true);
          /* ปฏิทินกิจกรรมซ่อนรายการเดิมไว้ (.is-enhanced) แล้ววาดปฏิทินแยก — ในตัวแก้ไม่มีปฏิทิน จึงให้รายการโผล่ */
          [b.disp, ...b.disp.querySelectorAll('[hidden], .is-enhanced')].forEach(x => { x.hidden = false; x.classList.remove('is-enhanced'); });
        }
        disp = [b.disp];
      } else disp = b.pre.concat(beMain(b));
      disp.forEach(n => { if(n.nodeType === 1) n.setAttribute('data-be', b.id); nodes.push(n); });
      beEditable(b, true);
    });
    if(!s.blocks.length){
      const ph = d.createElement('button'); ph.className = 'be-empty'; ph.dataset.beEmpty = s.key;
      ph.textContent = '+ เพิ่มบล็อกในส่วน "' + s.label + '"';
      nodes.push(ph);
    }
    sec.replaceChildren(...nodes);
  });
  if(bf.sel && !beFind(bf.sel)[2]) bf.sel = null;
  bePaint();
}

/* กรอบรวมของทุก node ในบล็อก (หัวข้อแบบไม่ห่อมี 3 node) เป็นพิกัดของเอกสาร */
function beRect(id){
  let r = null;
  bf.d.querySelectorAll('[data-be="' + id + '"]').forEach(el => {
    const q = el.getBoundingClientRect();
    if(!q.width && !q.height) return;
    r = r ? { l: Math.min(r.l, q.left), t: Math.min(r.t, q.top), r: Math.max(r.r, q.right), b: Math.max(r.b, q.bottom) }
          : { l: q.left, t: q.top, r: q.right, b: q.bottom };
  });
  if(!r) return null;
  return { x: r.l + bf.w.scrollX, y: r.t + bf.w.scrollY, w: r.r - r.l, h: r.b - r.t };
}
const beOv = sel => bf.d.querySelector('#be-ov ' + sel);
function bePut(el, r, pad){
  if(!r){ el.style.display = 'none'; return; }
  pad = pad || 0;
  Object.assign(el.style, { display:'block', left:(r.x - pad) + 'px', top:(r.y - pad) + 'px', width:(r.w + pad * 2) + 'px', height:(r.h + pad * 2) + 'px' });
}

/* วาดแถบควบคุมใหม่ทั้งหมด (เรียกเมื่อเลือก/ชี้บล็อกใหม่) แล้วจัดตำแหน่ง */
function bePaint(){
  if(!bf) return;
  const chip = beOv('.be-chip');
  const [, , b] = bf.sel ? beFind(bf.sel) : [];
  chip.innerHTML = b ? beChipHtml(b) : '';
  /* ป้าย "สำเร็จรูป" บนบล็อกล็อกทุกตัว (ตามภาพอ้างอิง: READY-MADE · CANNOT EDIT TEXT) */
  beOv('.be-locks').innerHTML = be.secs.flatMap(s => s.blocks.filter(x => x.type === 'locked' && !x.deco))
    .map(x => '<div class="be-lockl" data-for="' + x.id + '">สำเร็จรูป · ' + esc(beLabel(x)) + '</div>').join('');
  bePlace();
}
function bePlace(){
  if(!bf || !bf.d.body) return;
  const sr = bf.sel && beRect(bf.sel), hr = bf.hov && bf.hov !== bf.sel && beRect(bf.hov);
  bePut(beOv('.be-box.sel'), sr, 6);
  bePut(beOv('.be-box.hov'), hr, 6);
  const gid = bf.hov || bf.sel, gr = gid && beRect(gid), gut = beOv('.be-gut');
  if(gr){
    const [s, i, b] = beFind(gid);
    gut.style.display = 'flex';
    gut.style.left = Math.max(4, gr.x - 96) + 'px'; gut.style.top = gr.y + 'px';
    gut.dataset.for = gid;
    gut.querySelector('[data-g="up"]').disabled = !b || b.type === 'locked' || i === 0;
    gut.querySelector('[data-g="down"]').disabled = !b || b.type === 'locked' || i === s.blocks.length - 1;
  } else gut.style.display = 'none';
  const chip = beOv('.be-chip');
  if(sr && chip.innerHTML){
    chip.style.display = 'flex';
    chip.style.left = Math.max(4, sr.x - 6) + 'px';
    chip.style.top = Math.max(bf.w.scrollY + 4, sr.y - 44) + 'px';
  } else chip.style.display = 'none';
  bf.d.querySelectorAll('#be-ov .be-lockl').forEach(l => {
    const r = beRect(+l.dataset.for);
    if(!r){ l.style.display = 'none'; return; }
    Object.assign(l.style, { display:'block', left:(r.x + r.w / 2) + 'px', top:(r.y + 2) + 'px' });
  });
}

function beChipHtml(b){
  const btn = (c, title, inner, cls) => '<button data-c="' + c + '" title="' + title + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</button>';
  const sep = '<span class="sep"></span>';
  const fmt = btn('bold','ตัวหนา',ICON.bold) + btn('italic','ตัวเอียง',ICON.italic) + btn('link','แทรกลิงก์',ICON.link) +
    btn('unlink','เอาลิงก์ออก',ICON.unlink) + btn('removeFormat','ล้างรูปแบบ',ICON.clean);
  let h = '<span class="lbl">' + BE_TYPE[b.type][0] + esc(beLabel(b)) + '</span>';
  if(b.type === 'heading') h += fmt + sep + (b.eb ? '<button class="txt" data-c="ebOff">เอาหัวข้อเล็กออก</button>' : '<button class="txt" data-c="ebOn">+ หัวข้อเล็ก</button>');
  else if(b.type === 'text' || (b.type === 'html' && !b.inline)) h += fmt;
  else if(b.type === 'button') h += '<button class="txt" data-c="href">แก้ลิงก์ปุ่ม</button>';
  else if(b.type === 'cb') h += beCbChip(b, fmt, sep);
  else if(b.type === 'image') h += '<button class="txt" data-c="img">เปลี่ยนรูป</button><button class="txt" data-c="alt">คำอธิบายรูป</button><button class="txt" data-c="src">ลิงก์รูป</button>';
  else if(b.type === 'locked'){
    const m = beCmsMenu(b.cms);
    h += ICON.settings.replace('class="i"', 'class="i lock"') + (SCHEMA[m] ? '<button class="txt" data-c="menu" data-m="' + m + '">แก้ที่เมนู ' + esc(SCHEMA[m].label) + ' ↗</button>' : '');
  }
  if(b.type !== 'locked') h += sep + btn('code','แก้เป็นโค้ด HTML','&lt;/&gt;') + btn('del','ลบบล็อก',ICON.trash,'del');
  return h;
}

function beSelect(id, keepSub){
  if(!bf) return;
  if(!keepSub) bf.sub = null;
  if(bf.sel !== id){ bf.sel = id; beCloseMenu(); }
  bePaint();
}
/* เมนูเลือกบล็อก (แบบภาพอ้างอิง: แบ่งหมวด + ช่องพิมพ์กรองท้ายเมนู) — เปิดจากปุ่ม + ซ้ายบล็อก, ปุ่มในส่วนว่าง, หรือพิมพ์ / ในย่อหน้าว่าง */
function beMenuHtml(){
  let cat = '';
  return '<div class="be-mlist">' + BE_LIB.map(x => (x.cat !== cat ? '<div class="be-mcat">' + esc(cat = x.cat) + '</div>' : '') +
    '<a data-new="' + x.k + '" data-q="' + esc((x.name + ' ' + x.k).toLowerCase()) + '"><span class="be-mic">' + x.icon + '</span>' + esc(x.name) + '</a>').join('') +
    '</div><input class="be-mq" placeholder="พิมพ์เพื่อค้นหาบล็อก…" aria-label="ค้นหาบล็อก">';
}
/* replace=true: แทนที่บล็อกที่ at (ย่อหน้าว่างที่พิมพ์ / ) แทนการแทรกต่อ */
function beOpenMenu(s, at, r, replace){
  const m = beOv('.be-menu');
  bf.menu = { s, at, replace: !!replace };
  m.style.display = 'flex';
  const q = m.querySelector('.be-mq'); q.value = ''; beFilterMenu('');
  const h = m.offsetHeight, below = r.y + r.h + 6;
  const roomBelow = bf.w.scrollY + bf.w.innerHeight - below;
  Object.assign(m.style, { left: Math.max(4, r.x) + 'px', top: (roomBelow < h && r.y - bf.w.scrollY > h ? r.y - h - 6 : below) + 'px' });
  q.focus({ preventScroll: true });
}
function beCloseMenu(){ if(!bf) return; bf.menu = null; const m = beOv('.be-menu'); if(m) m.style.display = 'none'; }
function beFilterMenu(q){
  const m = beOv('.be-menu');
  m.querySelectorAll('[data-new]').forEach(a => { a.hidden = !!q && !a.dataset.q.includes(q.toLowerCase()); });
  m.querySelectorAll('.be-mcat').forEach(c => {
    let n = c.nextElementSibling, any = false;
    while(n && !n.matches('.be-mcat')){ if(!n.hidden) any = true; n = n.nextElementSibling; }
    c.hidden = !any;
  });
}
function beInsert(s, at, k, replace){
  const nbs = beCreate(k, s);
  if(!nbs.length) return;
  s.blocks.splice(at, replace ? 1 : 0, ...nbs);
  beTouch(true); beCanvasApply();
  const nb = nbs[0];
  bf.sel = nb.id; bf.sub = null; bePaint();
  const r = beRect(nb.id);
  if(r) bf.w.scrollTo({ top: Math.max(0, r.y - bf.w.innerHeight / 3), behavior:'smooth' });
  const host = beMain(nb).filter(n => n && n.nodeType === 1)
    .map(n => n.isContentEditable ? n : n.querySelector('[contenteditable]')).find(Boolean);
  if(host){ host.focus(); beCaret(bf.w, host, true); }
  if(k === 'image') bePickImage(url => { beSetSrc(nb, url); beTouch(true); bePlace(); });
}

function beFrameWire(){
  const d = bf.d, w = bf.w;
  /* ห้ามลิงก์/ฟอร์มในหน้าพาออกไปที่อื่น และห้ามสคริปต์ของหน้า (สไลด์ ปุ่มเมนู) ได้รับคลิกระหว่างแก้ */
  d.addEventListener('submit', e => e.preventDefault(), true);
  d.addEventListener('mousedown', e => { if(e.target.closest('#be-ov button, #be-ov a')) e.preventDefault(); }, true);
  d.addEventListener('click', e => {
    const ovb = e.target.closest('#be-ov button, #be-ov a, .be-empty');
    if(e.target.closest('a') || ovb){ e.preventDefault(); }
    if(ovb){ e.stopPropagation(); return beOvClick(ovb); }
    if(e.target.closest('#be-ov')) return;
    e.stopPropagation();
    if(bf.menu) beCloseMenu();
    const el = e.target.closest('[data-be]');
    /* ชิ้นย่อยที่คลิกในบล็อก .cb (รูปในการ์ด/แกลเลอรี ลิงก์ปุ่ม แถวตาราง) — ชิปเปลี่ยนปุ่มตามชิ้นนั้น */
    const b = el && beFind(+el.dataset.be)[2];
    bf.sub = b && b.type === 'cb' ? e.target.closest('img, a, figure, .cb-card, .cb-col, td, th') : null;
    beSelect(el ? +el.dataset.be : null, true);
  }, true);
  d.addEventListener('mouseover', e => {
    if(e.target.closest('#be-ov')){ clearTimeout(bf.hovTimer); return; }
    const el = e.target.closest('[data-be]');
    clearTimeout(bf.hovTimer);
    if(el){ if(bf.hov !== +el.dataset.be){ bf.hov = +el.dataset.be; bePlace(); } }
    /* ออกจากบล็อกแล้วรอแป๊บก่อนซ่อนปุ่มซ้าย — ระหว่างเลื่อนเมาส์ไปหาปุ่มจะได้ไม่หายต่อหน้า */
    else bf.hovTimer = setTimeout(()=>{ if(bf){ bf.hov = null; bePlace(); } }, 500);
  });
  d.addEventListener('focusin', e => { const el = e.target.closest('[data-be]'); if(el && bf.sel !== +el.dataset.be) beSelect(+el.dataset.be); });
  d.addEventListener('input', e => {
    if(e.target.matches && e.target.matches('.be-mq')) return beFilterMenu(e.target.value.trim());
    if(e.target.closest('[data-be]')){ beTouch(); bePlace(); }
  });
  d.addEventListener('load', bePlace, true);   /* รูปโหลดเสร็จ = ขนาดบล็อกเปลี่ยน */
  w.addEventListener('resize', bePlace);
  d.addEventListener('paste', e => {
    if(!e.target.closest || !e.target.closest('[contenteditable]')) return;
    e.preventDefault();
    d.execCommand('insertText', false, (e.clipboardData || w.clipboardData).getData('text'));
  });
  d.addEventListener('keydown', e => {
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's'){ e.preventDefault(); return beSave(); }
    /* ช่องค้นหาในเมนูบล็อก: Enter = เลือกตัวแรกที่เหลือ · Esc = ปิด */
    if(e.target.matches && e.target.matches('.be-mq')){
      if(e.key === 'Enter'){ e.preventDefault(); const a = beOv('.be-menu [data-new]:not([hidden])'); if(a) beOvClick(a); }
      if(e.key === 'Escape'){ e.preventDefault(); beCloseMenu(); }
      return;
    }
    if(e.key === 'Escape'){ if(bf.menu) beCloseMenu(); else beSelect(null); return; }
    /* พิมพ์ / ในย่อหน้าว่าง = เปิดเมนูเลือกบล็อกมาแทนย่อหน้านั้น (แบบ Notion / ภาพอ้างอิง) */
    if(e.key === '/' && !e.ctrlKey && !e.metaKey){
      const el = e.target.closest && e.target.closest('[data-be]'), [s, i, b] = el ? beFind(+el.dataset.be) : [];
      if(b && b.type === 'text' && !b.els.some(n => (n.textContent || '').trim())){ e.preventDefault(); return beOpenMenu(s, i, beRect(b.id), true); }
    }
    if(e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    const el = e.target.closest && e.target.closest('[data-be]');
    if(!el) return;
    const [s, i, b] = beFind(+el.dataset.be);
    if(!b) return;
    if(b.type === 'heading' || b.type === 'button'){ e.preventDefault(); return; }
    if(b.type !== 'text') return;
    const np = beSplit(w, b, e);
    if(!np) return;
    const nb = beMake('text', { els: [np] });
    s.blocks.splice(i + 1, 0, nb);
    beTouch(true); beCanvasApply();
    bf.sel = nb.id; bePaint();
    np.focus(); beCaret(w, np);
  });
}

async function beOvClick(t){
  const d = bf.d;
  if(t.matches('.be-empty')){
    const s = be.secs.find(x => x.key === t.dataset.beEmpty), q = t.getBoundingClientRect();
    return beOpenMenu(s, 0, { x: q.left + bf.w.scrollX, y: q.top + bf.w.scrollY, w: q.width, h: q.height });
  }
  if(t.dataset.g){
    const id = +beOv('.be-gut').dataset.for, [s, i, b] = beFind(id);
    if(!b) return;
    if(t.dataset.g === 'add'){
      if(bf.menu && bf.menu.s === s && bf.menu.at === i + 1 && !bf.menu.replace) return beCloseMenu();
      const q = t.getBoundingClientRect();
      return beOpenMenu(s, i + 1, { x: q.left + bf.w.scrollX, y: q.top + bf.w.scrollY, w: q.width, h: q.height });
    }
    const j = i + (t.dataset.g === 'up' ? -1 : 1);
    if(j < 0 || j >= s.blocks.length || b.type === 'locked') return;
    [s.blocks[i], s.blocks[j]] = [s.blocks[j], s.blocks[i]];
    bf.sel = id; beTouch(true); beCanvasApply();
    return;
  }
  if(t.dataset.new){
    if(!bf.menu) return;
    const { s, at, replace } = bf.menu;
    beCloseMenu();
    return beInsert(s, at, t.dataset.new, replace);
  }
  const c = t.dataset.c;
  const [s, i, b] = bf.sel ? beFind(bf.sel) : [];
  if(!b) return;
  if(['bold','italic','unlink','removeFormat'].includes(c)){ d.execCommand(c); beTouch(); return; }
  if(c === 'link'){
    const url = prompt('ใส่ลิงก์ เช่น admission.html หรือ https://www.chula.ac.th/');
    if(url && url.trim()){ d.execCommand('createLink', false, url.trim()); beTouch(); }
    return;
  }
  if(c === 'ebOn'){ beSetEyebrow(b, 'หัวข้อเล็ก'); beTouch(true); beCanvasApply(); if(b.eb){ b.eb.focus(); beCaret(bf.w, b.eb, true); } return; }
  if(c === 'ebOff'){ beSetEyebrow(b, ''); beTouch(true); beCanvasApply(); return; }
  if(c === 'href'){
    const a = b.els[0], url = prompt('ลิงก์ของปุ่ม เช่น admission.html', a.getAttribute('href') || '');
    if(url != null){ a.setAttribute('href', url.trim()); beTouch(true); }
    return;
  }
  if(c === 'img') return bePickImage(url => { beSetSrc(b, url); beTouch(true); bePlace(); });
  if(b.type === 'cb' && beCbAction(b, c)){ beTouch(true); beCanvasApply(); return; }
  if(c === 'alt'){
    const v = prompt('คำอธิบายรูป (alt) สำหรับผู้ใช้โปรแกรมอ่านหน้าจอ', b.img.getAttribute('alt') || '');
    if(v != null){ b.img.setAttribute('alt', v); beTouch(true); }
    return;
  }
  if(c === 'src'){
    const v = prompt('ลิงก์หรือพาธของรูป เช่น img/about-program.jpg', b.img.getAttribute('src') || '');
    if(v != null && v.trim()){ beSetSrc(b, v.trim()); beTouch(true); bePlace(); }
    return;
  }
  if(c === 'menu') return go(t.dataset.m);
  if(c === 'del'){ s.blocks.splice(i, 1); bf.sel = null; beTouch(true); beCanvasApply(); toast('ลบบล็อกแล้ว — กดย้อนกลับได้ถ้าลบผิด'); return; }
  if(c === 'code') return beCodeDialog(s, i, b);
}

/* แก้โค้ด HTML ของบล็อกเดียว (กล่องลอยในหน้า admin) — โค้ดใหม่ผ่าเป็นบล็อกได้หลายบล็อก แทนที่บล็อกเดิม */
function beCodeDialog(s, i, b){
  const box = document.createElement('div');
  box.className = 'be-modal';
  box.innerHTML = '<div class="be-modal-box"><h3>แก้โค้ด HTML — ' + esc(beLabel(b)) + '</h3>' +
    '<textarea spellcheck="false"></textarea>' +
    '<div class="be-modal-foot"><button class="btn" data-x>ยกเลิก</button><button class="btn primary" data-ok>ใช้โค้ดนี้</button></div></div>';
  box.querySelector('textarea').value = b.pre.concat(beMain(b)).map(beOut).join('\n');
  document.body.appendChild(box);
  box.querySelector('textarea').focus();
  const close = () => box.remove();
  box.addEventListener('click', e => { if(e.target === box || e.target.matches('[data-x]')) close(); });
  box.querySelector('[data-ok]').addEventListener('click', ()=>{
    const nb = beParse(box.querySelector('textarea').value);
    s.blocks.splice(i, 1, ...nb);
    close();
    beTouch(true); beRender();
    if(bf){ bf.sel = nb.length ? nb[0].id : null; bePaint(); }
  });
}

/* ไฟล์รูปที่เลือกจากปุ่ม "เปลี่ยนรูป" / เพิ่มบล็อกรูป */
document.addEventListener('change', async e => {
  if(e.target.id !== 'beFile') return;
  const f = e.target.files[0], fn = beFilePending;
  e.target.value = ''; beFilePending = null;
  if(!f || !fn) return;
  const url = await uploadFile(f);
  if(url) fn(url);
});

/* ---------- ปุ่มเฉพาะชนิดของบล็อก .cb ---------- */
function beCbChip(b, fmt, sep){
  const root = b.els.find(n => n.nodeType === 1);
  if(!root) return '';
  const k = b.kind, sub = bf.sub;
  const t = (c, label, on) => '<button class="txt' + (on ? ' on' : '') + '" data-c="' + c + '">' + label + '</button>';
  let h = BE_CB_EDIT[k] ? fmt + sep : '';
  if(k === 'spacer') h += [['s','เล็ก'],['m','กลาง'],['l','ใหญ่']].map(([z, l]) => t('sp:' + z, l, root.classList.contains('cb-sp-' + z))).join('');
  if(k === 'callout') h += [['info','สีส้ม'],['warn','สีเหลือง'],['ok','สีเขียว']].map(([z, l]) => t('tone:' + z, l, root.classList.contains('is-' + z))).join('');
  if(k === 'columns' || k === 'cards') h += t('cols:2', '2 ต่อแถว', root.classList.contains('cols-2')) + t('cols:3', '3 ต่อแถว', root.classList.contains('cols-3'));
  if(k === 'cards') h += sep + t('cardAdd', '+ การ์ด') + t('cardDel', sub && sub.closest('.cb-card') ? '− การ์ดนี้' : '− การ์ดสุดท้าย') +
    (sub && sub.closest('.cb-card') ? t('subImg', 'เปลี่ยนรูปการ์ด') : '') + (sub && sub.closest('a') ? t('subHref', 'แก้ลิงก์ปุ่ม') : '');
  if(k === 'gallery') h += t('galAdd', '+ รูป') + (sub && sub.closest('figure') ? t('subImg', 'เปลี่ยนรูปนี้') + t('galDel', '− รูปนี้') : '');
  if(k === 'video') h += t('video', 'เปลี่ยนวิดีโอ');
  if(k === 'table') h += t('rowAdd', '+ แถว') + t('rowDel', '− แถว') + t('colAdd', '+ คอลัมน์') + t('colDel', '− คอลัมน์');
  if((k === 'cards' || k === 'gallery') && !sub) h += '<span class="hint">คลิกที่รูปหรือปุ่มเพื่อแก้ชิ้นนั้น</span>';
  return h;
}
/* คืน true = เปลี่ยนโครงสร้างแล้ว (ผู้เรียกจด undo + วาดใหม่) · การเปลี่ยนรูปทำทีหลังตอนอัปโหลดเสร็จจึงจด undo เอง */
function beCbAction(b, c){
  const root = b.els.find(n => n.nodeType === 1), doc = root.ownerDocument, sub = bf.sub;
  const swap = (pre, v, all) => { all.forEach(x => root.classList.remove(pre + x)); root.classList.add(pre + v); };
  const keepOne = (list, el) => { if(list.length > 1){ (el || list[list.length - 1]).remove(); return true; } toast('ต้องเหลืออย่างน้อย 1 ชิ้น'); return false; };
  if(c.startsWith('sp:')){ swap('cb-sp-', c.slice(3), ['s','m','l']); return true; }
  if(c.startsWith('tone:')){ swap('is-', c.slice(5), ['info','warn','ok']); return true; }
  if(c.startsWith('cols:')){
    const n = +c.slice(5); swap('cols-', n, [2, 3]);
    if(b.kind === 'columns'){
      let cols = root.querySelectorAll(':scope > .cb-col');
      while(cols.length < n){ const x = cols[cols.length - 1].cloneNode(true); root.appendChild(x); cols = root.querySelectorAll(':scope > .cb-col'); }
      while(cols.length > n){ cols[cols.length - 1].remove(); cols = root.querySelectorAll(':scope > .cb-col'); }
    }
    return true;
  }
  if(c === 'cardAdd'){ const cards = root.querySelectorAll('.cb-card'); root.appendChild(cards[cards.length - 1].cloneNode(true)); return true; }
  if(c === 'cardDel'){ bf.sub = null; return keepOne(root.querySelectorAll('.cb-card'), sub && sub.closest('.cb-card')); }
  if(c === 'galAdd'){
    bePickImage(url => {
      const f = doc.createElement('figure');
      f.innerHTML = '<img src="' + esc(url) + '" alt="" loading="lazy" decoding="async"><figcaption></figcaption>';
      root.appendChild(f); beTouch(true); beCanvasApply();
    });
    return false;
  }
  if(c === 'galDel'){ bf.sub = null; return keepOne(root.querySelectorAll('figure'), sub && sub.closest('figure')); }
  if(c === 'subImg'){
    const holder = sub && sub.closest('figure, .cb-card'), img = holder && holder.querySelector('img');
    if(img) bePickImage(url => { ['srcset','sizes','width','height'].forEach(a => img.removeAttribute(a)); img.setAttribute('src', url); beTouch(true); bePlace(); });
    return false;
  }
  if(c === 'subHref'){
    const a = sub && sub.closest('a'), url = a && prompt('ลิงก์ของปุ่ม เช่น admission.html', a.getAttribute('href') || '');
    if(a && url != null){ a.setAttribute('href', url.trim()); return true; }
    return false;
  }
  if(c === 'video'){
    const ifr = root.querySelector('iframe'), u = beYouTube(prompt('วางลิงก์ YouTube ใหม่', ''));
    if(ifr && u){ ifr.setAttribute('src', u); return true; }
    if(ifr) toast('ลิงก์ YouTube ไม่ถูกต้อง');
    return false;
  }
  if(c === 'rowAdd'){
    const rows = root.querySelectorAll('tbody tr'), last = rows[rows.length - 1], x = last.cloneNode(true);
    x.querySelectorAll('td, th').forEach(td => { td.textContent = '…'; });
    (sub && sub.closest('tbody tr') || last).after(x); return true;
  }
  if(c === 'rowDel') return keepOne(root.querySelectorAll('tbody tr'), sub && sub.closest('tbody tr'));
  if(c === 'colAdd' || c === 'colDel'){
    const cell = sub && sub.closest('td, th');
    const idx = cell ? [...cell.parentNode.children].indexOf(cell) : -1;
    const trs = root.querySelectorAll('tr');
    if(c === 'colDel' && trs[0].children.length < 2){ toast('ต้องเหลืออย่างน้อย 1 คอลัมน์'); return false; }
    trs.forEach(tr => {
      const ref = tr.children[idx >= 0 ? idx : tr.children.length - 1];
      if(c === 'colDel') ref.remove();
      else { const n = doc.createElement(ref.tagName); n.textContent = ref.tagName === 'TH' ? 'หัวข้อ' : '…'; ref.after(n); }
    });
    return true;
  }
  return false;
}

/* CSS ที่ฉีดเข้า iframe — แยกจาก admin.css เพราะอยู่ในเอกสารของหน้าเว็บ (ใช้ตัวแปรของ admin ไม่ได้)
   สีน้ำเงินของกรอบ/ปุ่มควบคุมจงใจให้ต่างจากส้มของเว็บ จะได้ไม่ปนกับเนื้อหาจริง */
const BE_FRAME_CSS = `
.reveal{opacity:1!important;transform:none!important;transition:none!important}
.be-static{position:relative!important;top:auto!important}
.be-inert{opacity:.38;pointer-events:none;filter:grayscale(.4)}
[data-be][contenteditable],[data-be] [contenteditable]{cursor:text}
[contenteditable]:focus{outline:none}
body.be-outlines [data-be]{outline:1px dashed rgba(37,99,235,.5);outline-offset:4px}
.be-empty{all:unset;display:block;margin:16px auto;padding:12px 18px;border:1.5px dashed #9ca3af;border-radius:8px;color:#4b5563;cursor:pointer;text-align:center;font:14px system-ui,sans-serif}
.be-empty:hover{border-color:#2563eb;color:#1d4ed8}
#be-ov{position:absolute;left:0;top:0;width:0;height:0;z-index:2147483000;font:13px/1.4 'IBM Plex Sans Thai',system-ui,-apple-system,sans-serif;color:#1f2937}
#be-ov *{box-sizing:border-box}
#be-ov svg.i{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
#be-ov .be-box{position:absolute;pointer-events:none;border-radius:6px;display:none}
#be-ov .be-box.hov{border:1px dashed rgba(37,99,235,.55)}
#be-ov .be-box.sel{border:2px solid #2563eb}
#be-ov .be-gut{position:absolute;display:none;gap:1px;align-items:center;background:#fff;border:1px solid #e5e7eb;border-radius:7px;padding:1px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
#be-ov button{all:unset;box-sizing:border-box;cursor:pointer}
#be-ov .be-gut button,#be-ov .be-chip button:not(.txt){width:28px;height:28px;display:inline-grid;place-items:center;border-radius:5px;color:#4b5563}
#be-ov .be-gut button:hover:not(:disabled),#be-ov .be-chip button:hover{background:#eef2ff;color:#1d4ed8}
#be-ov .be-gut button:disabled{opacity:.3;cursor:default}
#be-ov .be-chip{position:absolute;display:none;align-items:center;gap:1px;background:#fff;border:1px solid #d9dde3;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.14);padding:3px 4px;white-space:nowrap}
#be-ov .be-chip .lbl{display:inline-flex;align-items:center;gap:6px;padding:0 10px 0 6px;font-weight:600;border-right:1px solid #e5e7eb;margin-right:3px;height:26px}
#be-ov .be-chip .sep{width:1px;height:18px;background:#e5e7eb;margin:0 4px}
#be-ov .be-chip button.del{color:#dc2626}
#be-ov .be-chip button.del:hover{background:#fef2f2;color:#dc2626}
#be-ov .be-chip button.txt{padding:0 9px;height:28px;display:inline-flex;align-items:center;border-radius:5px;font-weight:500}
#be-ov .be-chip button.txt:hover{background:#eef2ff;color:#1d4ed8}
#be-ov .be-chip svg.lock{color:#6b7280;margin:0 4px}
#be-ov .be-menu{position:absolute;display:none;flex-direction:column;width:290px;background:#fff;border:1px solid #d9dde3;border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,.18);overflow:hidden}
#be-ov .be-mlist{max-height:330px;overflow:auto;padding:6px}
#be-ov .be-mcat{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:#9ca3af;font-weight:600;padding:10px 10px 4px}
#be-ov .be-mcat[hidden],#be-ov .be-menu a[hidden]{display:none}
#be-ov .be-menu a{display:flex;align-items:center;gap:12px;padding:7px 10px;border-radius:7px;color:#1f2937;cursor:pointer;text-decoration:none;font-size:14.5px}
#be-ov .be-menu a:hover{background:#f3f4f6}
#be-ov .be-mic{width:30px;height:30px;border-radius:7px;background:#f3f4f6;display:grid;place-items:center;color:#374151;flex-shrink:0}
#be-ov .be-mq{all:unset;box-sizing:border-box;border-top:1px solid #e5e7eb;padding:11px 14px;font-size:14px;color:#1f2937}
#be-ov .be-mq::placeholder{color:#9ca3af}
#be-ov .be-chip button.txt.on{background:#eef2ff;color:#1d4ed8}
#be-ov .be-chip .hint{color:#9ca3af;font-size:12px;padding:0 6px}
[data-cb="video"] iframe{pointer-events:none}
.cb-spacer[data-be]{background:repeating-linear-gradient(45deg,rgba(37,99,235,.06) 0 8px,transparent 8px 16px);border-radius:6px}
p[contenteditable]:empty::before,p[contenteditable]:has(> br:only-child)::before{content:"พิมพ์ข้อความ หรือกด / เพื่อเลือกบล็อก";color:#9ca3af;pointer-events:none}
p[contenteditable]:has(> br:only-child)::before{position:absolute}
#be-ov .be-lockl{position:absolute;pointer-events:none;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;background:rgba(255,255,255,.94);border:1px solid #e5e7eb;padding:2px 10px;border-radius:999px;transform:translate(-50%,-50%);white-space:nowrap}
`;

/* หัวข้อเล็ก (eyebrow): ว่าง = เอาออก · ใส่ในหัวข้อที่ไม่เคยมี = สร้าง div.eyebrow + span.rule แบบเดียวกับหน้าอื่น */
function beSetEyebrow(b, text){
  if(!text){
    if(b.eb){ b.eb.remove(); b.eb = null; }
    return;
  }
  if(!b.eb){
    b.eb = document.createElement('div'); b.eb.className = 'eyebrow';
    if(!b.rule){ b.rule = document.createElement('span'); b.rule.className = 'rule'; }
    if(b.wrap){ b.wrap.insertBefore(b.eb, b.wrap.firstChild); if(!b.rule.parentNode) b.wrap.insertBefore(b.rule, b.h); }
  }
  b.eb.textContent = text;
}
/* เปลี่ยนรูป: ลบ width/height/srcset ของรูปเดิมทิ้ง ไม่งั้นรูปใหม่ถูกบังคับสัดส่วนของรูปเก่า */
function beSetSrc(b, url){
  ['width','height','srcset','sizes'].forEach(a => b.img.removeAttribute(a));
  b.img.setAttribute('src', url);
}
function beNew(type, s){
  const make = h => { const t = document.createElement('template'); t.innerHTML = h; return t.content.firstElementChild; };
  /* หัวข้อใหม่ใช้รูปแบบเดียวกับหัวข้อแรกของ section นั้น (ห่อ .sec-head หรือไม่ห่อ) ให้หน้าตาเข้าชุด */
  if(type === 'heading'){
    const first = s.blocks.find(b => b.type === 'heading');
    const h = make('<h2>หัวข้อใหม่</h2>');
    if(first && first.wrap){
      const w = make('<div class="' + first.wrap.className + '"><span class="rule"></span></div>'); w.appendChild(h);
      return beMake('heading', { wrap: w, rule: w.querySelector('.rule'), h });
    }
    return beMake('heading', { h, rule: first && first.rule ? make('<span class="rule"></span>') : null });
  }
  if(type === 'text') return beMake('text', { els: [make('<p>พิมพ์ข้อความที่นี่</p>')] });
  if(type === 'note') return beMake('text', { els: [make('<p class="note">หมายเหตุ</p>')] });
  if(type === 'image'){ const w = make('<div class="feature-img"><img src="" alt="" loading="lazy" decoding="async"></div>'); return beMake('image', { wrap: w, img: w.querySelector('img') }); }
  if(type === 'button') return beMake('button', { els: [make('<a href="#" class="btn-base is-outline">Read More</a>')] });
  return beMake('html', { els: [make('<div><p>HTML</p></div>')] });
}
function beToggleCode(blkEl, b, btn){
  const ce = blkEl.querySelector('.be-ce'), code = blkEl.querySelector('.be-code');
  const toCode = code.hidden;
  if(toCode){
    code.value = b.els.map(beOut).join('\n');
  } else {
    const t = document.createElement('template'); t.innerHTML = code.value;
    b.els = [...t.content.childNodes];
    ce.innerHTML = ''; b.els.forEach(n => ce.appendChild(n));
    beTouch(true);
  }
  code.hidden = !toCode; ce.hidden = toCode; btn.classList.toggle('on', toCode);
  blkEl.querySelectorAll('.be-tools button:not([data-code])').forEach(x => { x.disabled = toCode; });
}

/* ---------- บันทึก / Preview ---------- */
async function beSave(){
  beTouch(true);
  const list = be.secs.filter(beChanged);
  if(!list.length) return;
  const btn = $('#beSave'); btn.disabled = true; btn.textContent = 'กำลังบันทึก…';
  const res = await Promise.all(list.map(s => api('/rest/v1/blocks?key=eq.' + encodeURIComponent(s.key), {
    method:'PATCH', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ html: beSerialize(s.blocks), is_visible: s.vis }) }).then(r => r.ok)));
  btn.textContent = 'บันทึก';
  if(!res.every(Boolean)){ bePaintState(); return msg($('#editMsg'), 'บันทึกไม่สำเร็จบางส่วน — ลองกดบันทึกอีกครั้ง'); }
  dirty = false;
  toast('บันทึกแล้ว ' + list.length + ' ส่วน ✓ รีเฟรชหน้าเว็บจะเห็นผลทันที');
  pageEditor(be.id, true);
}
/* เปิดหน้าเว็บจริงพร้อมเนื้อหาที่ยังไม่บันทึก: ฝากไว้ใน localStorage แล้ว cms.js (เห็น ?cms-preview) ใช้แทนของในฐานข้อมูล
   เห็นแค่ในเบราว์เซอร์นี้ ผู้ชมคนอื่นไม่เห็น · ส่วนที่ตั้งเป็นซ่อนยังแสดงใน Preview (cms.js ไม่มีแนวคิดซ่อน section) */
function bePreview(){
  beTouch(true);
  const map = {}; be.secs.forEach(s => { map[s.key] = beSerialize(s.blocks); });
  try{ localStorage.setItem('tefl-cms-preview', JSON.stringify(map)); }catch(e){ return toast('เปิด Preview ไม่ได้ (เบราว์เซอร์ไม่ให้เก็บข้อมูลชั่วคราว)'); }
  window.open(pgLive(be.page) + '?cms-preview=1' + (be.anchor ? '#' + be.anchor : ''), '_blank', 'noopener');
}
