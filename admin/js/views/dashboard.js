/* =========================================================
   admin/js/views/dashboard.js — แดชบอร์ด
   ดึงทุกตารางพร้อมกันเอาแค่คอลัมน์ที่ต้องใช้ ข้ามชุดข้อมูลที่เป็นหน้าพิเศษ (มี view)
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- แดชบอร์ด ---------- */
async function dashboard(){
  $('#title').textContent = 'แดชบอร์ด';
  const view = $('#view');
  view.innerHTML = '<div class="empty">กำลังโหลด…</div>';

  /* ดึงทุกตารางพร้อมกัน เอาแค่คอลัมน์ที่ต้องใช้ (ไม่เอา html ของบล็อกที่ใหญ่มาก) */
  const keys = Object.keys(SCHEMA).filter(k => !SCHEMA[k].view);
  const results = await Promise.all(keys.map(k => {
    const def = SCHEMA[k], pk = def.pk || 'id';
    const cols = [pk, 'is_visible', 'updated_at'].concat(
      k === 'blocks' ? ['label','page'] : k === 'settings' ? ['label','value'] :
      k === 'staff' || k === 'lecturers' ? ['name'] : k === 'news' ? ['title'] :
      k === 'faqs' ? ['question'] : k === 'links' ? ['title'] : k === 'courses' ? ['title'] : k === 'events' ? ['title'] :
      k === 'nav' ? ['label'] : ['student_group']);
    return api('/rest/v1/' + k + '?select=' + cols.join(',') + '&order=updated_at.desc')
      .then(r => r.ok ? r.json() : []).catch(()=>[]);
  }));
  const all = {};
  keys.forEach((k, i) => { all[k] = results[i]; counts[k] = results[i].length; });
  paintMenu();

  /* แก้ไขล่าสุด: รวมทุกตารางแล้วเรียงตามเวลา */
  const recent = keys.flatMap(k => all[k].map(r => ({
    k, r, t: r.updated_at, name: SCHEMA[k].listT(Object.assign({ html:'', answer:'' }, r))
  }))).sort((a,b) => (b.t||'').localeCompare(a.t||'')).slice(0, 8);

  /* ค่าเชื่อมต่อที่ยังว่าง: บอกไว้ตรงนี้ดีกว่าให้ไปเจอเองตอนฟอร์มไม่ส่ง */
  const unset = (all.settings || []).filter(s => !(s.value || '').trim());
  const hidden = keys.reduce((n, k) => n + all[k].filter(r => r.is_visible === false).length, 0);

  const strip = keys.map(k => {
    const off = all[k].filter(r => r.is_visible === false).length;
    return '<a data-v="' + k + '"><span class="ico ' + (TINT[k] || 'c1') + '">' + (ICON[k] || '') + '</span><div>' +
      '<div class="v">' + all[k].length + '</div>' +
      '<div class="k">' + esc(SCHEMA[k].label) + '</div>' +
      (off ? '<div class="h">ซ่อนอยู่ ' + off + '</div>' : '') + '</div></a>';
  }).join('');

  view.innerHTML =
    '<div class="lead"><h2>ภาพรวมเว็บไซต์</h2><p>' +
      (hidden ? 'มีรายการที่ซ่อนจากเว็บอยู่ ' + hidden + ' รายการ · ' : '') +
      (unset.length ? 'ข้อมูลติดต่อยังไม่ได้ใส่ ' + unset.length + ' รายการ' : 'ข้อมูลติดต่อครบทุกรายการ') +
    '</p></div>' +
    '<div class="sec">วิธีใช้</div>' +
    '<div class="steps">' +
      '<div><span class="n">1</span><b>' + ICON.dash + ' เลือกหมวดจากเมนูซ้าย</b><p>เช่น อาจารย์ ข่าว หรือข้อความในหน้า ทุกหน้ามีบอกว่าข้อมูลไปโผล่ตรงไหนบนเว็บ</p></div>' +
      '<div><span class="n">2</span><b>' + ICON.edit + ' กด "แก้ไข" หรือ "+ เพิ่ม"</b><p>แผงจะเลื่อนมาทางขวา พิมพ์แก้ได้เลย ไม่ต้องรู้เรื่องโค้ด</p></div>' +
      '<div><span class="n">3</span><b>' + ICON.site + ' กด "บันทึก" แล้วรีเฟรชหน้าเว็บ</b><p>เห็นผลทันที ถ้าอยากเอาออกชั่วคราวใช้ "ซ่อนจากเว็บ" ไม่ต้องลบ</p></div>' +
    '</div>' +
    '<div class="sec">ทำบ่อย</div>' +
    '<div class="quick">' +
      '<button class="btn" data-q="news">' + ICON.news + 'เพิ่มข่าว/กิจกรรม</button>' +
      '<button class="btn" data-q="staff">' + ICON.staff + 'เพิ่มอาจารย์</button>' +
      '<button class="btn" data-q="events">' + ICON.events + 'เพิ่มกิจกรรมในปฏิทิน</button>' +
      '<button class="btn" data-go="facebook">' + ICON.facebook + 'เชื่อมต่อ Facebook</button>' +
      '<button class="btn" data-go="nav">' + ICON.nav + 'แก้เมนู</button>' +
      '<button class="btn" data-go="settings">' + ICON.settings + 'ข้อมูลติดต่อและลิงก์</button>' +
    '</div>' +
    '<div class="sec">เนื้อหาทั้งหมด</div>' +
    '<div class="strip">' + strip + '</div>' +
    '<div class="two" style="margin-top:26px">' +
      '<div><div class="sec" style="margin-top:0">แก้ไขล่าสุด</div><div class="list">' +
        (recent.length ? recent.map(x =>
          '<div class="it" data-v="' + x.k + '" style="cursor:pointer">' +
          '<span class="ico ' + (TINT[x.k] || 'c1') + '">' + (ICON[x.k] || '') + '</span><div style="min-width:0">' +
          '<div class="t">' + esc(x.name) + '</div><div class="s">' + esc(SCHEMA[x.k].label) + '</div></div>' +
          '<span class="r">' + when(x.t) + '</span></div>').join('')
        : '<div class="empty">ยังไม่มีการแก้ไข</div>') +
      '</div></div>' +
      '<div><div class="sec" style="margin-top:0">ยังไม่ได้ใส่</div><div class="list">' +
        (unset.length ? unset.map(s =>
          '<div class="it warn" data-v="settings" style="cursor:pointer">' +
          '<span class="ico c5">' + ICON.warn + '</span><div style="min-width:0">' +
          '<div class="t">' + esc(s.label) + '</div><div class="s">กดเพื่อไปใส่</div></div>' +
          '<span class="tag off">ยังว่าง</span></div>').join('')
        : '<div class="empty">ข้อมูลติดต่อครบแล้ว</div>') +
      '</div></div>' +
    '</div>';

  view.querySelectorAll('[data-v]').forEach(el => el.addEventListener('click', ()=>go(el.dataset.v)));
  view.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', ()=>go(el.dataset.go)));
  view.querySelectorAll('[data-q]').forEach(el => el.addEventListener('click', ()=>go(el.dataset.q).then(()=>openEdit(null))));
}
