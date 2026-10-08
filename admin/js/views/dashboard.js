/* =========================================================
   admin/js/views/dashboard.js — แดชบอร์ดแบบ WordPress
   แผงต้อนรับ (Welcome panel) + วิดเจ็ต: ข้อมูลโดยรวม · วิธีใช้ · แก้ไขล่าสุด · ยังไม่ได้ใส่
   ดึงทุกตารางพร้อมกันเอาแค่คอลัมน์ที่ต้องใช้ ข้ามชุดข้อมูลที่เป็นหน้าพิเศษ (มี view)
   ใช้ postbox() จาก editor.js ซึ่งโหลดทีหลัง — เรียกตอนวาดหน้าเท่านั้น ไม่ใช่ตอนประกาศ จึงไม่เป็น undefined
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

async function dashboard(){
  setTitle('แดชบอร์ด');
  const view = $('#view');
  view.innerHTML = '<div class="empty">กำลังโหลด…</div>';

  /* ดึงทุกตารางพร้อมกัน เอาแค่คอลัมน์ที่ต้องใช้ (ไม่เอา html ของบล็อกที่ใหญ่มาก) */
  const keys = Object.keys(SCHEMA).filter(k => !SCHEMA[k].view);
  const results = await Promise.all(keys.map(k => {
    const def = SCHEMA[k], pk = def.pk || 'id';
    const cols = [pk, 'is_visible', 'updated_at'].concat(hasAuthor ? ['updated_by'] : [], k === 'news' ? ['fb_post_id'] : [],
      k === 'blocks' ? ['label','page'] : k === 'settings' ? ['label','value'] :
      k === 'staff' || k === 'lecturers' ? ['name'] : k === 'news' ? ['title'] :
      k === 'faqs' ? ['question'] : k === 'links' ? ['title'] : k === 'courses' ? ['title'] : k === 'events' ? ['title'] :
      k === 'nav' ? ['label'] : ['student_group']);
    return api('/rest/v1/' + k + '?select=' + cols.join(',') + '&order=updated_at.desc')
      .then(r => r.ok ? r.json() : []).catch(()=>[]);
  }));
  if(current !== 'dash') return;   /* ผู้ใช้กดไปหน้าอื่นระหว่างรอ */
  const all = {};
  keys.forEach((k, i) => { all[k] = results[i]; counts[k] = results[i].length; });

  /* แก้ไขล่าสุด: รวมทุกตารางแล้วเรียงตามเวลา กดแล้วเข้าหน้าแก้ไขของแถวนั้นตรง ๆ */
  const recent = keys.flatMap(k => all[k].map(r => ({
    k, r, t: r.updated_at, name: SCHEMA[k].listT(Object.assign({ html:'', answer:'' }, r))
  }))).sort((a,b) => (b.t||'').localeCompare(a.t||'')).slice(0, 8);

  /* ค่าเชื่อมต่อที่ยังว่าง: บอกไว้ตรงนี้ดีกว่าให้ไปเจอเองตอนฟอร์มไม่ส่ง — และขึ้นวงส้มที่เมนูด้วย */
  const unset = (all.settings || []).filter(s => !(s.value || '').trim());
  badges.settings = unset.length;
  paintMenu();
  const hidden = keys.reduce((n, k) => n + all[k].filter(r => r.is_visible === false).length, 0);

  const glance = '<ul class="glance">' + keys.map(k => {
    const off = all[k].filter(r => r.is_visible === false).length;
    return '<li><a href="' + H(k === 'blocks' ? 'pages' : k) + '">' + (ICON[k] || '') + '<span><b>' + all[k].length + '</b> ' + esc(SCHEMA[k].label) +
      (off ? ' <small>(ซ่อน ' + off + ')</small>' : '') + '</span></a></li>';
  }).join('') + '</ul>' +
  '<p class="glance-foot">' + (hidden ? 'มีรายการที่ซ่อนจากเว็บอยู่ ' + hidden + ' รายการ · ' : '') +
    (unset.length ? 'ข้อมูลติดต่อยังไม่ได้ใส่ ' + unset.length + ' รายการ' : 'ข้อมูลติดต่อครบทุกรายการ') + '</p>';

  const how = '<ol class="how">' +
    '<li><b>เลือกหมวดจากเมนูซ้าย</b> เช่น อาจารย์ ข่าว หรือข้อความในหน้า — ทุกหน้าบอกว่าข้อมูลไปโผล่ตรงไหนบนเว็บ</li>' +
    '<li><b>คลิกชื่อรายการ</b> หรือ "เพิ่มใหม่" จะเปิดหน้าแก้ไขเต็มจอ พิมพ์แก้ได้เหมือนเขียนบทความใน WordPress</li>' +
    '<li><b>กด "อัปเดต" ในกล่องเผยแพร่</b> (หรือ Ctrl+S) แล้วรีเฟรชหน้าเว็บ เห็นผลทันที — อยากเอาออกชั่วคราวให้ตั้งสถานะเป็น "ซ่อน" ไม่ต้องลบ</li>' +
  '</ol>';

  const activity = recent.length ? '<ul class="activity">' + recent.map(x =>
    '<li><span class="when">' + when(x.t) + '</span><a href="' + editHref(x.k, x.r) + '">' + esc(x.name) + '</a>' +
    /* บล็อกหลายหน้าชื่อซ้ำกัน (เช่น แถบชวนสมัครท้ายหน้า มีทุกหน้า) ต้องบอกว่าเป็นของหน้าไหน */
    '<span class="in">ใน ' + esc(SCHEMA[x.k].label) + (x.k === 'blocks' ? ' · ' + esc(SCHEMA.blocks.groupBy(x.r)) : '') +
      (x.r.updated_by ? ' · โดย ' + esc(x.r.updated_by) : '') + '</span></li>').join('') + '</ul>'
    : '<div class="empty">ยังไม่มีการแก้ไข</div>';

  const todo = unset.length ? '<ul class="activity">' + unset.map(s =>
    '<li><span class="tag off">ยังว่าง</span><a href="' + editHref('settings', s) + '">' + esc(s.label) + '</a></li>').join('') + '</ul>'
    : '<div class="empty">ข้อมูลติดต่อครบแล้ว ✓</div>';

  const who = (me && me.user_metadata && me.user_metadata.full_name) || '';
  view.innerHTML = '<div class="wrap">' + heading('แดชบอร์ด') +
    '<div class="welcome">' +
      '<div class="welcome-head">' +
        '<p class="eyebrow">TEFL Chula · Faculty of Education, Chulalongkorn University</p>' +
        '<h2>ยินดีต้อนรับ' + (who ? ' ' + esc(who) : '') + ' สู่ระบบจัดการเนื้อหา TEFL</h2>' +
        '<p>แก้ข้อความ ข่าว อาจารย์ และปฏิทินกิจกรรมของเว็บไซต์หลักสูตรได้จากที่นี่ ไม่ต้องแตะโค้ด</p>' +
      '</div>' +
      '<div class="welcome-cols">' +
        '<div><h3>เริ่มต้นใช้งาน</h3><a class="btn primary hero" href="' + H('news/new') + '">' + ICON.news + 'เขียนข่าว/กิจกรรมใหม่</a>' +
          '<p>หรือ <a href="' + H('pages') + '">แก้ข้อความในหน้าเว็บ</a></p></div>' +
        '<div><h3>ขั้นตอนถัดไป</h3><ul>' +
          '<li><a href="' + H('staff/new') + '">' + ICON.staff + 'เพิ่มอาจารย์</a></li>' +
          '<li><a href="' + H('events/new') + '">' + ICON.events + 'เพิ่มกิจกรรมในปฏิทิน</a></li>' +
          '<li><a href="' + H('faqs/new') + '">' + ICON.faqs + 'เพิ่มคำถามที่พบบ่อย</a></li></ul></div>' +
        '<div><h3>การจัดการอื่น ๆ</h3><ul>' +
          '<li><a href="' + H('nav') + '">' + ICON.nav + 'แก้เมนูด้านบน</a></li>' +
          '<li><a href="' + H('facebook') + '">' + ICON.facebook + 'เชื่อมต่อ Facebook</a></li>' +
          '<li><a href="' + H('settings') + '">' + ICON.settings + 'ข้อมูลติดต่อและลิงก์</a></li></ul></div>' +
      '</div>' +
    '</div>' +
    '<div class="dash-cols">' +
      '<div>' + postbox('ข้อมูลโดยรวม', glance) + postbox('วิธีใช้', how) + '</div>' +
      '<div>' + postbox('แก้ไขล่าสุด', activity) + postbox('ยังไม่ได้ใส่', todo) + '</div>' +
    '</div></div>';
}
