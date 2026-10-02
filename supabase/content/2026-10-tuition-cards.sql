-- Tuition and Fees: เปลี่ยนจากตารางเป็นการ์ด (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ครั้งเดียว — แก้แค่บล็อก academics/tuition-and-fees ข้อมูลในตาราง tuition ไม่เปลี่ยน
begin;

update blocks set html = $tefl$<div class="sec-head">
          <div class="eyebrow">Costs</div>
          <span class="rule"></span>
          <h2>Tuition and Fees</h2>
        </div>
        <p>Charged per semester, in two parts.</p>
        <div class="fee-grid" data-cms="tuition"></div>
        <p class="note">
          Each total is Part 1 (University) plus Part 2 (Faculty).
          The application fee and comprehensive exam fee are charged separately.
        </p>
      $tefl$, updated_at = now()
where key = 'academics/tuition-and-fees';

commit;
