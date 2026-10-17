-- =========================================================
-- เมนู Admission แยกเป็น ป.ตรี / ป.โท (ต.ค. 2026)
-- ทำไม: หน้า Admission แบ่งตามระดับปริญญาแล้ว (การ์ด .degree-paths + data-track ใน admission.html) — เมนูต้องแบ่งแบบเดียวกัน
--   Admission
--   ├─ Bachelor’s Degree        → #undergraduate-admission   (เดิมชื่อ Undergraduate Admission)
--   └─ Master’s Degree          → #admission-procedures      (ใหม่)
--        ├─ Admission Procedures  → #admission-procedures
--        ├─ Admission Requirements → #admission-requirements
--        └─ Admission Deadline    → #admission-deadline
-- ชื่อระดับใช้ ’ (U+2019) ให้ตรงกับ data-track ใน admission.html — site.js เทียบสองค่านี้เพื่อไม่ให้ breadcrumb ซ้ำชื่อ
-- ลำดับหัวข้อย่อย ป.โท ตามลำดับบนหน้า (Procedures ก่อน) ให้ตรงกับแถบหัวข้อใต้ banner
-- รันซ้ำได้
-- =========================================================

-- ---------- 1. ป.ตรี — เปลี่ยนชื่อรายการเดิม ขึ้นเป็นตัวแรก ----------
update public.nav set label = 'Bachelor’s Degree', sort_order = 0
where href = 'admission.html#undergraduate-admission'
  and parent_id = (select id from public.nav where parent_id is null and href = 'admission.html');

-- ---------- 2. ป.โท — รายการใหม่ชั้นที่ 2 ----------
insert into public.nav (parent_id, label, href, sort_order)
select id, 'Master’s Degree', 'admission.html#admission-procedures', 1
from public.nav where parent_id is null and href = 'admission.html'
  and not exists (select 1 from public.nav where label = 'Master’s Degree');

-- ---------- 3. หัวข้อเดิมสามรายการย้ายไปเป็นชั้นที่ 3 ใต้ ป.โท ----------
update public.nav n set parent_id = m.id,
  sort_order = case n.href
    when 'admission.html#admission-procedures'   then 0
    when 'admission.html#admission-requirements' then 1
    when 'admission.html#admission-deadline'     then 2 end
from public.nav m
where m.label = 'Master’s Degree'
  and n.id <> m.id
  and n.href in ('admission.html#admission-procedures',
                 'admission.html#admission-requirements',
                 'admission.html#admission-deadline');
