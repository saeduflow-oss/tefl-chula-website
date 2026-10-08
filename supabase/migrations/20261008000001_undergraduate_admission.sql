-- =========================================================
-- หน้าย่อย Undergraduate Admission ใต้เมนู Admission (ต.ค. 2026)
-- ทำไม: เตรียมที่ไว้สำหรับข้อมูลรับสมัคร ป.ตรี ในหน้า Admission โดยไม่ต้องเพิ่มเมนูหลัก (แถวเมนูบนเหลือที่ว่างแค่ ~1 รายการ)
-- ยังไม่มีข้อมูลจริง — บล็อกมีแค่หัวข้อ + ข้อความ "announced soon" ให้แก้ต่อที่ /admin → หน้าเว็บ → Admission
-- ต้อง deploy admission.html ที่มี <section id="undergraduate-admission"> ด้วย ไม่งั้นเมนูจะลิงก์ไป id ที่ไม่มีบนหน้า
-- รันซ้ำได้: ทุกคำสั่งเช็กก่อนว่ามีอยู่แล้วหรือยัง
-- =========================================================

-- ---------- 1. บล็อกข้อความ ----------
-- ต่อท้าย Admission Deadline (4) ก่อนแถบ CTA ซึ่งขยับจาก 5 → 6 · html ต้องตรงกับไฟล์ทุกตัวอักษร ไม่งั้น sync-content.py จะเห็นว่าต่าง
update public.blocks set sort_order = 6 where key = 'admission/cta-band' and sort_order = 5;
insert into public.blocks (key, page, label, sort_order, html)
select 'admission/undergraduate-admission', 'admission.html', 'Undergraduate Admission', 5, $ug$<div class="eyebrow">Bachelor&rsquo;s Degree</div>
        <span class="rule"></span>
        <h2>Undergraduate Admission</h2>
        <p>Information on undergraduate admission will be announced soon.</p>$ug$
where not exists (select 1 from public.blocks where key = 'admission/undergraduate-admission');

-- ---------- 2. เมนู ----------
-- รายการย่อยตัวที่ 4 ใต้ Admission (ต่อจาก Admission Deadline = 2) — site.js ใช้รายการนี้แยก section เป็นหน้าย่อยของตัวเอง
insert into public.nav (parent_id, label, href, sort_order)
select id, 'Undergraduate Admission', 'admission.html#undergraduate-admission', 3 from public.nav where parent_id is null and href = 'admission.html'
  and not exists (select 1 from public.nav where href = 'admission.html#undergraduate-admission');
