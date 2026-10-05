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
/* rowsKey = rows ตอนนี้เป็นของชุดข้อมูลไหน — เปิดลิงก์หน้าแก้ไขตรง ๆ (#staff/<id>) ต้องรู้ว่าต้องโหลดใหม่ไหม
   filter = แท็บ ทั้งหมด/แสดงบนเว็บ/ซ่อนอยู่ เหนือตาราง
   dirty = หน้าแก้ไขมีของที่ยังไม่บันทึก ใช้เตือนก่อนออกจากหน้า (แบบ WordPress) */
let rowsKey = null, filter = 'all', dirty = false;
const counts = {};   /* จำนวนแถวต่อชุดข้อมูล ใช้ในแดชบอร์ด */
const badges = {};   /* ตัวเลขวงกลมส้มข้างเมนู (เช่น ข้อมูลติดต่อที่ยังว่าง) แบบ bubble แจ้งเตือนของ WordPress */
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
/* ชื่อแท็บเบราว์เซอร์แบบ WordPress: "หน้า ‹ เว็บ — ระบบ" — เปิดหลายแท็บแล้วแยกออกว่าแท็บไหนแก้อะไร */
function setTitle(t){ document.title = t + ' ‹ TEFL Chula — ระบบจัดการเนื้อหา'; }
/* หัวหน้าทุกหน้า: ชื่อหน้า + ปุ่มข้างชื่อ (เช่น "เพิ่มใหม่") แบบ .wp-heading-inline + .page-title-action */
function heading(text, actions){
  return '<div class="wrap-head"><h1>' + esc(text) + '</h1>' + (actions || '') + '</div>';
}
/* ลิงก์ภายในหน้า admin ต้องเป็น URL เต็มของหน้านี้เอง ห้ามเขียนแค่ "#staff":
   index.html มี <base href="../"> ลิงก์ "#staff" จึงถูกตีความเป็น /#staff = หน้าแรกของเว็บสาธารณะ
   (history.replaceState ก็เช่นกัน) — ใช้ H('staff') ทุกครั้ง ลิงก์ปกติยังแค่เปลี่ยน hash ไม่โหลดหน้าใหม่ และเปิดแท็บใหม่ได้ถูกที่ */
const SELF = location.href.split('#')[0];
const H = h => SELF + '#' + h;
/* hash ของหน้าแก้ไขของแถว: key ของ blocks มี / อยู่ (เช่น site/footer-...) จึงต้อง encode */
function editHash(k, row){ return k + '/' + encodeURIComponent(row[SCHEMA[k].pk || 'id']); }
function editHref(k, row){ return H(editHash(k, row)); }
function showLogin(err){
  $('#app').style.display = 'none';
  $('#login').style.display = 'grid';
  if(err) msg($('#loginMsg'), err);
}

/* ---------- ธีม ----------
   ค่าเริ่มต้นคือสว่าง (พื้นขาว) เสมอ ไม่ตามโหมดมืดของเครื่อง — ผู้ใช้ขอพื้นขาว และเครื่องที่ตั้งโหมดมืดไว้
   เปิดมาแล้วเจอหน้าดำทั้งจอ ดูเหมือนแก้แล้วไม่ได้ผล · มืดเฉพาะเมื่อกดสลับเอง หรือเลือก "ตามเครื่อง" ในหน้าตั้งค่า */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem(THEME, t); }catch(e){}
}
(function(){
  let t = null; try{ t = localStorage.getItem(THEME); }catch(e){}
  if(t === 'system') t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if(t !== 'dark') t = 'light';
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
$('#umenu').querySelectorAll('[data-v]').forEach(a => a.addEventListener('click', ()=>go(a.dataset.v)));

function paintMe(){
  const name = (me && me.user_metadata && me.user_metadata.full_name) || '';
  const email = me ? me.email : '';
  $('#who').textContent = name || email.split('@')[0];
  $('#whoName').textContent = name || email;
  $('#whoSub').textContent = name ? email : 'ผู้ดูแลระบบ';
  $('#avatar').textContent = $('#avatarBig').textContent = ((name || email || 'A')[0]).toUpperCase();
}
