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
    return showLogin('บัญชี ' + me.email + ' ล็อกอินได้ แต่ยังไม่อยู่ในรายชื่อผู้ดูแล จึงมองไม่เห็นและแก้ข้อมูลไม่ได้ — ' +
      'ให้ผู้ดูแลที่มีสิทธิ์เพิ่มอีเมลนี้ที่ ตั้งค่า → ผู้ดูแลระบบ หรือรัน SQL: insert into public.admins (email) values (\'' + me.email + '\');');
  }
  paintMe();
  $('#login').style.display = 'none';
  $('#app').style.display = 'block';
  buildMenu();
  go('dash');
}

session = loadSession();
if(session) start(); else showLogin();
