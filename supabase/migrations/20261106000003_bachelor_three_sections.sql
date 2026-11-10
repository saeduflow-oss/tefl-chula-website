-- =========================================================
-- ป.ตรี แยกเป็น 3 หัวข้อ (พ.ย. 2026)
-- ทำไม: เจ้าของเว็บขอให้เมนู Bachelor’s Degree มีหัวข้อย่อยแบบเดียวกับ Master’s Degree
--   Admission
--   ├─ Bachelor’s Degree        → #undergraduate-admission
--   │    ├─ What Do We Study      → #undergraduate-admission   (บล็อกเดิม เปลี่ยนหัวข้อ — id เดิมเพราะการ์ดหน้าแรกชี้อยู่)
--   │    ├─ Our Activities        → #bachelor-activities       (ใหม่)
--   │    └─ Our Prides            → #bachelor-prides           (ใหม่)
--   └─ Master’s Degree          (เดิม)
-- ยังไม่มีข้อมูลจริง — แต่ละบล็อกมีแค่หัวข้อ + "announced soon" ให้แก้ต่อที่ /admin → หน้าเว็บ → Admission
-- html ต้องตรงกับ admission.html ไม่งั้น cms.js จะเอาของเดิมกลับมาทับ · ต้อง deploy admission.html ที่มี section ใหม่ด้วย
-- รันซ้ำได้: ทุกคำสั่งเช็กก่อนว่ามีอยู่แล้วหรือยัง
-- =========================================================

-- ---------- 1. บล็อก ----------
update public.blocks
   set label = 'What Do We Study (Bachelor’s)',
       html = $b$<div class="eyebrow">Bachelor&rsquo;s Degree</div>
        <span class="rule"></span>
        <h2>What Do We Study</h2>
        <p>Information will be announced soon.</p>$b$,
       updated_at = now()
 where key = 'admission/undergraduate-admission';

-- ต่อท้าย What Do We Study (5) ก่อนแถบ CTA ซึ่งขยับจาก 6 → 8
update public.blocks set sort_order = 8 where key = 'admission/cta-band' and sort_order = 6;
insert into public.blocks (key, page, label, sort_order, html)
select 'admission/bachelor-activities', 'admission.html', 'Our Activities (Bachelor’s)', 6, $b$<div class="eyebrow">Bachelor&rsquo;s Degree</div>
        <span class="rule"></span>
        <h2>Our Activities</h2>
        <p>Information will be announced soon.</p>$b$
where not exists (select 1 from public.blocks where key = 'admission/bachelor-activities');
insert into public.blocks (key, page, label, sort_order, html)
select 'admission/bachelor-prides', 'admission.html', 'Our Prides (Bachelor’s)', 7, $b$<div class="eyebrow">Bachelor&rsquo;s Degree</div>
        <span class="rule"></span>
        <h2>Our Prides</h2>
        <p>Information will be announced soon.</p>$b$
where not exists (select 1 from public.blocks where key = 'admission/bachelor-prides');

-- ---------- 2. เมนูชั้นที่ 3 ใต้ Bachelor’s Degree ----------
insert into public.nav (parent_id, label, href, sort_order)
select b.id, v.label, v.href, v.sort_order
from public.nav b
cross join (values ('What Do We Study', 'admission.html#undergraduate-admission', 0),
                   ('Our Activities',   'admission.html#bachelor-activities',     1),
                   ('Our Prides',       'admission.html#bachelor-prides',         2)) v(label, href, sort_order)
where b.label = 'Bachelor’s Degree'
  and b.parent_id = (select id from public.nav where parent_id is null and href = 'admission.html')
  and not exists (select 1 from public.nav c where c.parent_id = b.id and c.href = v.href);
