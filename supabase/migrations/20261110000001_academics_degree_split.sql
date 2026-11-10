-- =========================================================
-- Academics แยกเป็น ป.ตรี / ป.โท แบบเดียวกับหน้า Admission (พ.ย. 2026)
-- ทำไม: เจ้าของเว็บขอให้ Academics แบ่ง Bachelor’s Degree กับ Master’s Degree
--   Academics
--   ├─ Bachelor’s Degree   → #bachelor-program   (ใหม่ — ยังเป็นข้อความ "announced soon" แก้ต่อที่ /admin)
--   └─ Master’s Degree     → #curriculum-info    (ใหม่)
--        └─ Curriculum Info. / List of Courses / Study Plan / Class Schedule / Tentative Schedule / Tuition and Fees (ย้ายลงเป็นชั้นที่ 3)
-- ชื่อระดับใช้ ’ (U+2019) ให้ตรงกับ data-track ใน academics.html — site.js เทียบสองค่านี้
-- html ต้องตรงกับไฟล์ (สร้างจากไฟล์โดยตรง) ไม่งั้น sync-content.py จะเห็นว่าต่าง
-- ควร push ไฟล์ก่อนแล้วค่อยรัน: ถ้ารันก่อน เมนูจาก DB จะชี้ #bachelor-program ที่หน้าเก่ายังไม่มี · รันซ้ำได้
-- =========================================================

-- ---------- 1. บล็อกการ์ดเลือกระดับ (ต่อจาก banner = 1) + section ป.ตรี (ก่อนแถบ CTA) ----------
update public.blocks set sort_order = sort_order + 1
where page = 'academics.html' and sort_order >= 1
  and not exists (select 1 from public.blocks where key = 'academics/degree-paths');
insert into public.blocks (key, page, label, sort_order, html)
select 'academics/degree-paths', 'academics.html', 'การ์ดเลือกระดับปริญญา (Bachelor’s / Master’s)', 1, $blk$
        <div class="eyebrow">Choose Your Degree</div>
        <span class="rule"></span>
        <h2>Degree Programs</h2>
        <p>Select a degree level to see its curriculum.</p>
        <div class="dp-grid">
          <a class="ov-tile" href="#bachelor-program">
            <span class="dp-text">
              <span class="ov-title">Bachelor&rsquo;s Degree</span>
              <span class="dp-desc">Curriculum and courses of the undergraduate program</span>
            </span>
            <span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
          </a>
          <a class="ov-tile" href="#curriculum-info">
            <span class="dp-text">
              <span class="ov-title">Master&rsquo;s Degree</span>
              <span class="dp-desc">A two-year TEFL program for pre-service and in-service teachers</span>
            </span>
            <span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
          </a>
        </div>
      $blk$
where not exists (select 1 from public.blocks where key = 'academics/degree-paths');

update public.blocks set sort_order = sort_order + 1
where key = 'academics/cta-band'
  and not exists (select 1 from public.blocks where key = 'academics/bachelor-program');
insert into public.blocks (key, page, label, sort_order, html)
select 'academics/bachelor-program', 'academics.html', 'Undergraduate Program (Bachelor’s)',
       (select sort_order - 1 from public.blocks where key = 'academics/cta-band'), $blk$
        <div class="eyebrow">Bachelor&rsquo;s Degree</div>
        <span class="rule"></span>
        <h2>Undergraduate Program</h2>
        <p>Information will be announced soon.</p>
      $blk$
where not exists (select 1 from public.blocks where key = 'academics/bachelor-program');

-- ---------- 2. การ์ด Master’s Degree หน้าแรก → เข้าหน้าย่อย ป.โท ตรง ๆ (ไม่ต้องผ่านการ์ดเลือกระดับซ้ำ) ----------
update public.blocks
   set html = replace(html, '<a class="course-card" href="academics.html">', '<a class="course-card" href="academics.html#curriculum-info">')
 where key = 'index/academics';

-- ---------- 3. เมนู ----------
insert into public.nav (parent_id, label, href, sort_order)
select id, 'Bachelor’s Degree', 'academics.html#bachelor-program', 0
from public.nav where parent_id is null and href = 'academics.html'
  and not exists (select 1 from public.nav where href = 'academics.html#bachelor-program');

insert into public.nav (parent_id, label, href, sort_order)
select id, 'Master’s Degree', 'academics.html#curriculum-info', 1
from public.nav where parent_id is null and href = 'academics.html'
  and not exists (select 1 from public.nav n join public.nav p on n.parent_id = p.id
                  where n.label = 'Master’s Degree' and p.href = 'academics.html');

-- หกรายการเดิมย้ายลงใต้ Master’s Degree (ลำดับเดิม 0–5 คงไว้)
update public.nav n set parent_id = m.id
from public.nav m join public.nav top on m.parent_id = top.id
where top.parent_id is null and top.href = 'academics.html'
  and m.label = 'Master’s Degree'
  and n.parent_id = top.id
  and n.href in ('academics.html#curriculum-info', 'academics.html#list-of-courses', 'academics.html#study-plan',
                 'academics.html#class-schedule', 'academics.html#tentative-schedule', 'academics.html#tuition-and-fees');
