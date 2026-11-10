-- การ์ดใบที่ 3 ของ Courses หน้าแรก: เปลี่ยนชื่อจาก Teaching Practicum เป็น Our Activities (พ.ย. 2026)
-- ต้องตรงกับ index.html (section data-cms-block="index/academics") ไม่งั้น cms.js จะเอาชื่อเดิมกลับมาทับ · รันซ้ำได้
update public.blocks
   set html = replace(html, '<h5>Teaching Practicum</h5>', '<h5>Our Activities</h5>')
 where key = 'index/academics';
