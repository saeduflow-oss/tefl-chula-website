/* =========================================================
   admin/js/core.js — สถานะร่วม, การเรียก API, ล็อกอิน/ออก, ธีม, helper
   session/current/rows/editing/query/counts เป็นสถานะที่ทุกหน้าใช้ร่วมกัน
   api() ต่ออายุ token ให้เองเมื่อหมดอายุ (access_token อายุ 1 ชม.)
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- session ---------- */
let session = null, current = 'dash', rows = [], editing = null, query = '';
const counts = {};   /* จำนวนแถวต่อชุดข้อมูล ใช้ในแถบข้างและแดชบอร์ด */
/* ตารางส่วนใหญ่ใช้ id (uuid) แต่ blocks/settings ใช้ key เป็น primary key */
const pkOf = () => SCHEMA[current].pk || 'id';
const pkUrl = row => '?' + pkOf() + '=eq.' + encodeURIComponent(row[pkOf()]);

function saveSession(s){ session = s; try{ localStorage.setItem(STORE, JSON.stringify(s)); }catch(e){} }
function loadSession(){ try{ return JSON.parse(localStorage.getItem(STORE) || 'null'); }catch(e){ return null; } }
function clearSession(){ session = null; try{ localStorage.removeItem(STORE); }catch(e){} }

/* เรียก API พร้อมต่ออายุ token อัตโนมัติเมื่อหมดอายุ
   access_token ของ Supabase อายุ 1 ชม. คนแก้เนื้อหานาน ๆ จะโดนเด้งถ้าไม่ refresh */
async function api(path, opts, retry){
  opts = opts || {};
  const h = Object.assign({ apikey: KEY }, opts.headers || {});
  if(session) h.Authorization = 'Bearer ' + session.access_token;
  const r = await fetch(URL_ + path, Object.assign({}, opts, { headers: h }));
  if(r.status === 401 && session && session.refresh_token && !retry){
    const ok = await refresh();
    if(ok) return api(path, opts, true);
  }
  return r;
}
async function refresh(){
  const r = await fetch(URL_ + '/auth/v1/token?grant_type=refresh_token', {
    method:'POST', headers:{ apikey: KEY, 'Content-Type':'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token })
  });
  if(!r.ok){ clearSession(); showLogin('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'); return false; }
  saveSession(await r.json());
  return true;
}

/* ---------- helper ---------- */
const $ = s => document.querySelector(s);
function esc(v){
  return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function msg(el, text, kind){
  el.textContent = text || '';
  el.className = el.className.replace(/\b(err|ok|show)\b/g,'').trim() + ' ' + (kind || 'err') + (text ? ' show' : '');
}
function toast(text){
  const t = $('#toast');
  msg(t, text, 'ok');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(()=>msg(t, ''), 2600);
}
/* วันที่ของกิจกรรม (คอลัมน์ date เป็น YYYY-MM-DD ไม่มีเวลา) แสดงเป็น 12 ก.ย. 2569 */
const TH_M = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
function dmy(iso){ if(!iso) return ''; const d = iso.split('-'); return (+d[2]) + ' ' + TH_M[+d[1] - 1] + ' ' + (+d[0] + 543); }
function today(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
/* วันที่แบบสั้น ๆ พอบอกได้ว่าแก้เมื่อไหร่ ไม่ต้องละเอียดถึงวินาที */
function when(iso){
  if(!iso) return '';
  const d = new Date(iso), diff = (Date.now() - d) / 1000;
  if(diff < 3600) return Math.max(1, Math.round(diff/60)) + ' นาทีที่แล้ว';
  if(diff < 86400) return Math.round(diff/3600) + ' ชม. ที่แล้ว';
  if(diff < 86400*7) return Math.round(diff/86400) + ' วันที่แล้ว';
  return d.toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'2-digit' });
}
function showLogin(err){
  $('#app').style.display = 'none';
  $('#login').style.display = 'grid';
  if(err) msg($('#loginMsg'), err);
}

/* ---------- ธีม ----------
   จำค่าที่ผู้ใช้เลือกไว้ ไม่มีค่าเลือกก็ตามระบบ */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem(THEME, t); }catch(e){}
}
(function(){
  let t = null; try{ t = localStorage.getItem(THEME); }catch(e){}
  if(!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
$('#theme').addEventListener('click', ()=>applyTheme(
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ---------- ล็อกอิน / ออก ---------- */
$('#loginForm').addEventListener('submit', async function(e){
  e.preventDefault();
  msg($('#loginMsg'), '');
  $('#loginBtn').disabled = true;
  const r = await fetch(URL_ + '/auth/v1/token?grant_type=password', {
    method:'POST', headers:{ apikey: KEY, 'Content-Type':'application/json' },
    body: JSON.stringify({ email: $('#email').value, password: $('#password').value })
  });
  $('#loginBtn').disabled = false;
  if(!r.ok){
    const e2 = await r.json().catch(()=>({}));
    return msg($('#loginMsg'), e2.error_description || e2.msg || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }
  saveSession(await r.json());
  start();
});
$('#logout').addEventListener('click', function(){ clearSession(); location.reload(); });

/* เมนูผู้ใช้: กดที่ชื่อเปิด กดข้างนอกหรือ Esc ปิด */
let me = null;   /* ข้อมูลผู้ใช้ที่ล็อกอิน (จาก /auth/v1/user) */
$('#ustrip').addEventListener('click', function(e){
  e.stopPropagation();
  const open = !$('#umenu').classList.contains('show');
  $('#umenu').classList.toggle('show', open);
  this.setAttribute('aria-expanded', open);
});
document.addEventListener('click', ()=>{ $('#umenu').classList.remove('show'); $('#ustrip').setAttribute('aria-expanded', false); });
$('#umenu').querySelectorAll('[data-v]').forEach(a => a.addEventListener('click', ()=>{ go(a.dataset.v); $('#side').classList.remove('open'); }));

function paintMe(){
  const name = (me && me.user_metadata && me.user_metadata.full_name) || '';
  $('#who').textContent = name || (me ? me.email : '');
  $('#whoSub').textContent = name ? me.email : 'ผู้ดูแลระบบ';
  $('#avatar').textContent = ((name || (me && me.email) || 'A')[0]).toUpperCase();
}
