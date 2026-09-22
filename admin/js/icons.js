/* =========================================================
   admin/js/icons.js — ไอคอน SVG และสีกล่องไอคอนของแต่ละหมวด
   วาดเองในไฟล์ (สไตล์เส้นบาง) ไม่โหลดชุดไอคอนจากภายนอก ให้หน้า admin ไม่พึ่ง CDN
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- ไอคอน ----------
   วาดเป็น SVG ในไฟล์ (สไตล์เส้นบางแบบ Lucide) ไม่โหลดชุดไอคอนจากภายนอก
   ให้หน้า admin ไม่พึ่ง CDN เหมือนส่วนอื่น และสีตามข้อความรอบข้าง (currentColor) */
const I = (d) => '<svg class="i" viewBox="0 0 24 24">' + d + '</svg>';
const ICON = {
  dash:     I('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'),
  blocks:   I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>'),
  nav:      I('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  settings: I('<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>'),
  staff:    I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>'),
  lecturers:I('<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>'),
  news:     I('<path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M19 7v11a2 2 0 0 0 2 2"/><rect x="7" y="8" width="5" height="4" rx=".5"/><path d="M14 9h2M14 12h2M7 15h9"/>'),
  faqs:     I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>'),
  links:    I('<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>'),
  courses:  I('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>'),
  tuition:  I('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>'),
  add:      I('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  edit:     I('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  site:     I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>'),
  warn:     I('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  clock:    I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  facebook: I('<path d="M14 8h2.5V4.5H14a4 4 0 0 0-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1z"/>'),
  events:   I('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h3M13 14h3M8 17h3"/>'),
  refresh:  I('<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>')
};
/* สีกล่องไอคอนของแต่ละหมวด: หมุนเวียน 5 สี ให้แต่ละหมวดจำง่าย */
const TINT = { blocks:'c1', nav:'c2', settings:'c3', staff:'c4', lecturers:'c4', news:'c1', facebook:'c2', events:'c3', faqs:'c2', links:'c3', courses:'c5', tuition:'c5' };
