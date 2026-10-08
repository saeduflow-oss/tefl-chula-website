/* =========================================================
   admin/js/app.js — จุดเริ่มทำงาน
   โหลดเป็นไฟล์สุดท้าย: ทุกฟังก์ชันที่เรียกถึงต้องถูกประกาศไว้แล้วในไฟล์ก่อนหน้า
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- เริ่มทำงาน ---------- */
async function start(){
  const r = await api('/auth/v1/user');
  if(!r.ok){ clearSession(); return showLogin(); }
  me = await r.json();
  /* ล็อกอินได้ ≠ แก้ได้: RLS ให้สิทธิ์เฉพาะอีเมลในตาราง admins ถ้าไม่อยู่ ทุกตารางจะคืน 0 แถวโดยไม่ error
     หน้าจอจะดูเหมือน "ยังไม่มีการซิงก์ข้อมูล" ทั้งที่จริงคือไม่มีสิทธิ์ — เช็กก่อนแล้วบอกให้ชัด
     (ตาราง admins เองก็อ่านได้เฉพาะผู้ดูแล จึงใช้ "อ่านแล้วได้แถว" เป็นตัวตัดสิน) */
  const a = await api('/rest/v1/admins?select=email&limit=1');
  const isAdmin = a.ok && (await a.json()).length > 0;
  if(!isAdmin){
    clearSession();
    return showLogin('บัญชี ' + me.email + ' ล็อกอินได้ แต่ไม่อยู่ในรายชื่อผู้ดูแล หรือถูกปิดใช้งานอยู่ จึงมองไม่เห็นและแก้ข้อมูลไม่ได้ — ' +
      'ให้ผู้ดูแลที่มีสิทธิ์เพิ่มอีเมลนี้ที่ ตั้งค่า → ผู้ดูแลระบบ หรือรัน SQL: insert into public.admins (email) values (\'' + me.email + '\');');
  }
  await loadMyRole();
  paintMe();
  const ha = await api('/rest/v1/blocks?select=updated_by&limit=1');
  hasAuthor = ha.ok;
  if(authWelcome){ toast(authWelcome); authWelcome = ''; }
  $('#login').style.display = 'none';
  $('#app').style.display = 'block';
  buildMenu();
  /* เปิดตาม hash ใน URL (เช่นลิงก์ที่คัดลอกมา #staff/<id>) ไม่มี = แดชบอร์ด */
  route();
}

/* กลับมาจากลิงก์ "ลืมรหัสผ่าน" ในอีเมล: Supabase ใส่ token ไว้ใน hash (#access_token=…&type=recovery)
   หรือ error ถ้าลิงก์หมดอายุ/ถูกใช้แล้ว — ต้องเช็กก่อน route() ไม่งั้น hash นี้ถูกตีความเป็นชื่อหน้าแล้วเด้งไปแดชบอร์ด
   ลบ token ออกจาก URL ทันที ไม่ให้ค้างในประวัติเบราว์เซอร์หรือติดไปตอนคัดลอกลิงก์ */
let authWelcome = '';   /* ข้อความต้อนรับหลังเข้าด้วยลิงก์จากอีเมล — start() แสดงเมื่อเข้าระบบสำเร็จ */
const authBack = new URLSearchParams(location.hash.slice(1) + '&' + location.search.slice(1));
if(authBack.get('access_token') || authBack.get('error')){
  history.replaceState(null, '', location.href.split(/[?#]/)[0]);
}
if(authBack.get('error')){
  showLogin(/expired|invalid/i.test(authBack.get('error_description') || authBack.get('error_code') || '')
    ? 'ลิงก์ตั้งรหัสผ่านหมดอายุหรือถูกใช้ไปแล้ว — กด "ลืมรหัสผ่าน?" เพื่อขอลิงก์ใหม่'
    : 'ลิงก์ใช้ไม่ได้: ' + (authBack.get('error_description') || authBack.get('error')));
} else if(authBack.get('access_token') && authBack.get('type') === 'recovery'){
  saveSession({ access_token: authBack.get('access_token'), refresh_token: authBack.get('refresh_token') });
  api('/auth/v1/user').then(r => r.ok ? r.json() : {}).then(u => showReset(u.email));
} else if(authBack.get('access_token')){
  /* ลิงก์เข้าสู่ระบบที่ผู้ดูแลส่งให้ตอนเพิ่มคนใหม่ (magiclink / signup) — เข้าได้เลย แล้วแนะนำให้ตั้งรหัสผ่านไว้ใช้ครั้งหน้า */
  saveSession({ access_token: authBack.get('access_token'), refresh_token: authBack.get('refresh_token') });
  authWelcome = 'เข้าสู่ระบบด้วยลิงก์จากอีเมลแล้ว — ตั้งรหัสผ่านไว้ใช้ครั้งหน้าได้ที่ "โปรไฟล์ของฉัน"';
  start();
} else {
  session = loadSession();
  if(session) start(); else showLogin();
}
