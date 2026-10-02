-- =========================================================
-- ปฏิทินกิจกรรมแยกตามผู้จัด (ต.ค. 2569)
--
-- source — ใครเป็นเจ้าของกิจกรรม: หลักสูตร TEFL / คณะครุศาสตร์ / จุฬาฯ
--   ปุ่มกรองบนหน้า Activities → Event Calendar อ่านค่านี้ ค่าที่รับได้ต้องตรงกับ
--   EV_SOURCES ใน cms.js, EV_SOURCES ใน sync-content.py และตัวเลือกใน admin/js/schema.js
--   ค่าเริ่มต้น tefl เพราะกิจกรรมที่มีอยู่ก่อนหน้านี้เป็นของหลักสูตรทั้งหมด
-- image  — ภาพประกอบเล็กด้านขวาของรายการ (เว้นว่างได้)
-- =========================================================

-- if not exists — รันซ้ำได้ไม่ error (ถ้าคอลัมน์มีแล้ว Postgres ข้ามทั้งนิยาม รวม check constraint ด้วย)
alter table public.events
  add column if not exists source text not null default 'tefl'
    constraint events_source_check check (source in ('tefl', 'edu', 'chula')),
  add column if not exists image text;
