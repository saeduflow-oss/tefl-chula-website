/* =========================================================
   admin/js/views/shell.js — เมนูซ้าย แถบบน (ปุ่ม "เพิ่มใหม่") และการเปลี่ยนหน้า
   ทุกหน้ามี URL เป็น hash: #dash · #staff (รายการ) · #staff/new · #staff/<รหัส> (หน้าแก้ไข)
   route() คือทางเข้าเดียวของทุกหน้า go(v) แค่เปลี่ยน hash แล้วให้ route ทำงาน
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- เมนูซ้าย ----------
   ตามภาพอ้างอิงที่ผู้ใช้ส่งมา: หัวกลุ่มตัวเล็ก (ชื่อกลุ่มจาก SCHEMA.menu) + รายการบรรทัดเดียว + กลุ่ม "ตั้งค่า" ท้ายสุด
   .sub ยังสร้างไว้ — ใช้เป็นป้ายชื่อลอยตอนย่อเมนูเหลือแต่ไอคอน (CSS ซ่อนลิงก์ข้างในไว้) */
function buildMenu(){
  const groups = {};
  Object.keys(SCHEMA).forEach(k => { (groups[SCHEMA[k].menu] = groups[SCHEMA[k].menu] || []).push(k); });
  const item = (k, icon, label, subs) =>
    '<div class="mi" data-k="' + k + '"><a class="top" href="' + H(k) + '">' + icon + '<span class="lb">' + esc(label) + '</span>' +
    '<span class="bub" data-b="' + k + '"></span></a>' +
    '<div class="sub"><span class="sub-h">' + esc(label) + '</span>' + (subs || '') + '</div></div>';
  let h = item('dash', ICON.dash, 'แดชบอร์ด', '');
  Object.keys(groups).forEach(function(g){
    h += '<div class="grp">' + esc(g) + '</div>';
    groups[g].forEach(k => {
      const def = SCHEMA[k];
      /* blocks ไม่มีเมนูเอง — ตำแหน่งเดียวกันในเมนูเป็น "หน้าเว็บ" (#pages) ที่รวมบล็อกตามหน้าไว้ */
      if(def.hideMenu){ if(k === 'blocks') h += item('pages', ICON.pages, 'หน้าเว็บ', ''); return; }
      const subs = def.view ? '' :
        '<a href="' + H(k) + '" data-s="list">' + (def.noAdd ? 'แก้ไขทั้งหมด' : 'ทั้งหมด') + '</a>' +
        (def.noAdd ? '' : '<a href="' + H(k + '/new') + '" data-s="new">เพิ่มใหม่</a>');
      h += item(k, ICON[k] || '', def.label, subs);
    });
  });
  h += '<div class="grp">ตั้งค่า</div>' + item('users', ICON.shield, 'ผู้ดูแลระบบ', '<span></span>') +
    item('prefs', ICON.gear, 'หน้าตา', '<span></span>') +
    item('profile', ICON.user, 'โปรไฟล์ของฉัน', '<span></span>');
  $('#menu').innerHTML = h;

  /* ปุ่ม "+ เพิ่มใหม่" ในแถบบน: รายการชุดข้อมูลที่เพิ่มได้ (ตรงกับเมนู + New ของ WordPress) */
  $('#newMenu').innerHTML = Object.keys(SCHEMA).filter(k => !SCHEMA[k].noAdd)
    .map(k => '<a href="' + H(k + '/new') + '">' + esc(SCHEMA[k].label) + '</a>').join('');
}
/* sub = 'list' | 'new' | 'edit' — ใช้ไฮไลต์เมนูย่อย (หน้าแก้ไขไฮไลต์ "ทั้งหมด" แบบ WordPress) */
function paintMenu(sub){
  $('#menu').querySelectorAll('.mi').forEach(mi => {
    /* แก้ข้อความในหน้า (#blocks/<key>) นับเป็นส่วนหนึ่งของเมนู "หน้าเว็บ" */
    const on = mi.dataset.k === current || (mi.dataset.k === 'pages' && current === 'blocks');
    mi.classList.toggle('on', on);
    mi.querySelectorAll('.sub a').forEach(a =>
      a.classList.toggle('on', on && a.dataset.s === (sub === 'new' ? 'new' : 'list')));
  });
  Object.keys(SCHEMA).forEach(k => {
    const b = $('#menu [data-b="' + k + '"]'); if(b) b.textContent = badges[k] || '';
  });
}

/* ลิ้นชักมือถือ + ย่อเมนู (จำค่าไว้) */
function closeSide(){ $('#side').classList.remove('open'); $('#scrim').classList.remove('show'); }
$('#sideToggle').addEventListener('click', ()=>{
  const open = !$('#side').classList.contains('open');
  $('#side').classList.toggle('open', open); $('#scrim').classList.toggle('show', open);
});
$('#scrim').addEventListener('click', closeSide);
$('#menu').addEventListener('click', e => { if(e.target.closest('a')) closeSide(); });
const FOLD = 'tefl-cms-folded';
function applyFold(on){
  $('#shell').classList.toggle('folded', on);
  $('#collapse').querySelector('span').textContent = on ? 'ขยายเมนู' : 'ย่อเมนู';
}
try{ applyFold(localStorage.getItem(FOLD) === '1'); }catch(e){}
$('#collapse').addEventListener('click', ()=>{
  const on = !$('#shell').classList.contains('folded');
  applyFold(on); try{ localStorage.setItem(FOLD, on ? '1' : '0'); }catch(e){}
});

/* ปุ่ม "+ เพิ่มใหม่": กดเฉย ๆ = เพิ่มในหน้าที่อยู่ (ถ้าเพิ่มได้) ไม่งั้นข่าวซึ่งเพิ่มบ่อยสุด · ชี้ค้าง = เลือกชุดข้อมูล */
$('#newAny').addEventListener('click', function(){
  const k = SCHEMA[current] && !SCHEMA[current].noAdd ? current : 'news';
  go(k + '/new');
});

/* ---------- เปลี่ยนหน้า ---------- */
function go(h){
  if(location.hash.slice(1) === h) return route();
  location.hash = h;   /* hashchange → route() */
  return Promise.resolve();
}

let lastHash = null;
async function route(){
  const h = location.hash.slice(1) || 'dash';
  /* ออกจากหน้าแก้ไขที่ยังไม่บันทึก: ถามก่อน ถ้าไม่ออกให้คืน hash เดิมแบบไม่ยิง hashchange ซ้ำ */
  if(dirty && h !== lastHash){
    if(!confirm('มีการแก้ไขที่ยังไม่ได้บันทึก ถ้าออกจากหน้านี้จะหายไป\n\nออกจากหน้านี้เลยไหม?')){
      history.replaceState(null, '', H(lastHash));
      return;
    }
  }
  dirty = false; lastHash = h;
  const cut = h.indexOf('/');
  let v = cut < 0 ? h : h.slice(0, cut);
  const sub = cut < 0 ? '' : decodeURIComponent(h.slice(cut + 1));
  if(!['dash','profile','prefs','pages','users'].includes(v) && !SCHEMA[v]) v = 'dash';
  /* กลับมาหน้ารายการเดิมจากหน้าแก้ไข: คงคำค้นและแท็บกรองไว้ เปลี่ยนชุดข้อมูลเมื่อไหร่ค่อยล้าง */
  if(v !== current){ query = ''; filter = 'all'; }
  current = v;
  closeSide();
  window.scrollTo(0, 0);
  paintMenu(sub ? (sub === 'new' ? 'new' : 'edit') : 'list');

  if(v === 'dash') return dashboard();
  if(v === 'profile') return profileView();
  if(v === 'prefs') return prefsView();
  if(v === 'users') return usersView();
  if(v === 'pages') return sub ? pageEditor(sub) : pagesView();
  if(SCHEMA[v].view) return SCHEMA[v].view();
  if(!sub) return load();

  /* หน้าแก้ไข/เพิ่มใหม่ต้องมี rows ของชุดนี้ (หาแถว + คำนวณลำดับของรายการใหม่ + ตัวเลือกแม่ของเมนู) */
  $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>';
  if(rowsKey !== v && !(await fetchRows(v))) return;
  if(current !== v) return;   /* ผู้ใช้กดไปหน้าอื่นระหว่างรอโหลด */
  if(sub === 'new') return SCHEMA[v].noAdd ? go(v) : openEdit(null);
  const pk = SCHEMA[v].pk || 'id';
  const row = rows.find(r => String(r[pk]) === sub);
  if(!row){ toast('ไม่พบรายการนี้ อาจถูกลบไปแล้ว'); return go(v); }
  openEdit(row);
}
window.addEventListener('hashchange', route);
/* ปิดแท็บ/รีเฟรชระหว่างแก้: เบราว์เซอร์ถามให้เอง (ข้อความกำหนดเองไม่ได้แล้ว) */
window.addEventListener('beforeunload', e => { if(dirty){ e.preventDefault(); e.returnValue = ''; } });
