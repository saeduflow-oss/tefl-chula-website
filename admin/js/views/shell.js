/* =========================================================
   admin/js/views/shell.js — แถบข้าง เมนู และการเปลี่ยนหน้า (go)
   go(v) คือทางเข้าเดียวของทุกหน้า: dash/profile/prefs และหน้าพิเศษที่ SCHEMA ระบุ view เอง ที่เหลือคือหน้ารายการ
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- แถบข้าง ---------- */
function buildMenu(){
  const groups = {};
  Object.keys(SCHEMA).forEach(k => { (groups[SCHEMA[k].menu] = groups[SCHEMA[k].menu] || []).push(k); });
  let h = '<a data-v="dash">' + ICON.dash + 'แดชบอร์ด</a>';
  Object.keys(groups).forEach(function(g){
    h += '<div class="grp">' + esc(g) + '</div>';
    groups[g].forEach(k => {
      h += '<a data-v="' + k + '">' + (ICON[k] || '') + esc(SCHEMA[k].label) +
           '<span class="n" data-n="' + k + '">' + (counts[k] != null ? counts[k] : '') + '</span></a>';
    });
  });
  $('#menu').innerHTML = h;
  $('#menu').querySelectorAll('a').forEach(a =>
    a.addEventListener('click', ()=>{ go(a.dataset.v); $('#side').classList.remove('open'); }));
}
function paintMenu(){
  $('#menu').querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.v === current));
  Object.keys(counts).forEach(k => {
    const n = $('#menu [data-n="' + k + '"]'); if(n) n.textContent = counts[k];
  });
}
$('#sideToggle').addEventListener('click', ()=>$('#side').classList.toggle('open'));
$('#newAny').addEventListener('click', function(){
  /* ปุ่มเพิ่มในแถบข้าง: อยู่หน้ารายการที่เพิ่มได้ก็เพิ่มเลย ไม่งั้นพาไปหน้าข่าวซึ่งเพิ่มบ่อยสุด */
  if(current !== 'dash' && !SCHEMA[current].noAdd) return openEdit(null);
  go('news').then(()=>openEdit(null));
});

/* ---------- เปลี่ยนหน้า ---------- */
function go(v){
  current = v;
  query = '';
  paintMenu();
  if(v === 'dash') return dashboard();
  if(v === 'profile') return profileView();
  if(v === 'prefs') return prefsView();
  if(SCHEMA[v].view) return SCHEMA[v].view();
  return load();
}
