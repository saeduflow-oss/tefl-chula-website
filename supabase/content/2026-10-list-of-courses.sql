-- List of Courses ตามหลักสูตร B.E. 2568 (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ทั้งไฟล์ครั้งเดียว (อยู่ใน transaction — พังกลางทางจะไม่มีอะไรเปลี่ยน)
-- 1) แทนรายวิชาทุกกลุ่มของ Plan A / Plan B ด้วยชุดใหม่  2) เปลี่ยนบล็อก academics/list-of-courses เป็นโครงใหม่ (แท็บ + วิชาเลือก + การ์ดหน้ารวม)
begin;

delete from courses where group_name like 'Plan A —%' or group_name like 'Plan B —%';
insert into courses (group_name, code, title, credits, sort_order, is_visible) values
  ('Plan A — Academic Track — 12 credits', '2725634', 'Principles of English Language Teaching', '3(3-0-9)', 0, true),
  ('Plan A — Academic Track — 12 credits', '2725637', 'English Language Assessment and Evaluation', '3(3-0-9)', 1, true),
  ('Plan A — Academic Track — 12 credits', '2725708', 'English Language Curriculum Development', '3(3-0-9)', 2, true),
  ('Plan A — Academic Track — 12 credits', '2725739', 'Research Design in English Language Teaching', '3(3-0-9)', 3, true),
  ('Plan A — Electives — Group 1', '2725622*', 'Teaching English Listening and Oral Communication', '1(1-0-3)', 0, true),
  ('Plan A — Electives — Group 1', '2725623*', 'Teaching English Reading', '1(1-0-3)', 1, true),
  ('Plan A — Electives — Group 1', '2725624*', 'Teaching English Writing', '1(1-0-3)', 2, true),
  ('Plan A — Electives — Group 1', '2725625*', 'Morphology and Syntax in English Language Teaching', '1(1-0-3)', 3, true),
  ('Plan A — Electives — Group 1', '2725626*', 'Semantics in English Language Teaching', '1(1-0-3)', 4, true),
  ('Plan A — Electives — Group 1', '2725627*', 'Pragmatics in English Language Teaching', '1(1-0-3)', 5, true),
  ('Plan A — Electives — Group 1', '2725704', 'Supervision of English Language Teaching', '3(3-0-9)', 6, true),
  ('Plan A — Electives — Group 1', '2725705', 'Selected Topics in English Language Teaching', '3(3-0-9)', 7, true),
  ('Plan A — Electives — Group 1', '2725706', 'Teaching English for Workplaces', '3(3-0-9)', 8, true),
  ('Plan A — Electives — Group 1', '2725712', 'Second Language Acquisition', '3(3-0-9)', 9, true),
  ('Plan A — Electives — Group 1', '2725716', 'Sociolinguistics for English Language Teaching', '3(3-0-9)', 10, true),
  ('Plan A — Electives — Group 1', '2725717', 'Selected Topics in Language and Linguistics', '3(3-0-9)', 11, true),
  ('Plan A — Electives — Group 1', '2725733', 'Teaching English for Young Learners', '3(3-0-9)', 12, true),
  ('Plan A — Electives — Group 1', '2725734', 'Teaching English for Adolescent Learners', '3(3-0-9)', 13, true),
  ('Plan A — Electives — Group 1', '2725838', 'Multilingual and Multicultural Education', '3(3-0-9)', 14, true),
  ('Plan A — Electives — Group 1', '2725741', 'Teaching English Literacy', '3(3-0-9)', 15, true),
  ('Plan A — Electives — Group 1', '2725744*', 'Teaching English for Intercultural Communication', '3(3-0-9)', 16, true),
  ('Plan A — Electives — Group 1', '2725746*', 'Teaching English for Adult Learners and Lifelong Learning', '3(3-0-9)', 17, true),
  ('Plan A — Electives — Group 2', '2725702', 'English Language Teaching Materials and Media', '3(3-0-9)', 0, true),
  ('Plan A — Electives — Group 2', '2725710', 'Reading and Writing for English Language Teachers', '3(3-0-9)', 1, true),
  ('Plan A — Electives — Group 2', '2725711', 'Professional Oral Communication Skills', '3(3-0-9)', 2, true),
  ('Plan A — Electives — Group 2', '2725723', 'English Language Teaching Innovations', '3(3-0-9)', 3, true),
  ('Plan A — Electives — Group 2', '2725724', 'Individual Study', '3(3-0-9)', 4, true),
  ('Plan A — Electives — Group 2', '2725743*', 'Selected Topics in English Language Education Research and Innovation', '3(3-0-9)', 5, true),
  ('Plan A — Electives — Group 2', '2725745*', 'Multimedia and Digital Technology for ELT', '3(3-0-9)', 6, true),
  ('Plan B — Professional Track — 12 credits', '2725622*', 'Teaching English Listening and Oral Communication', '1(1-0-3)', 0, true),
  ('Plan B — Professional Track — 12 credits', '2725623*', 'Teaching English Reading', '1(1-0-3)', 1, true),
  ('Plan B — Professional Track — 12 credits', '2725624*', 'Teaching English Writing', '1(1-0-3)', 2, true),
  ('Plan B — Professional Track — 12 credits', '2725634', 'Principles of English Language Teaching', '3(3-0-9)', 3, true),
  ('Plan B — Professional Track — 12 credits', '2725637', 'English Language Assessment and Evaluation', '3(3-0-9)', 4, true),
  ('Plan B — Professional Track — 12 credits', '2725708', 'English Language Curriculum Development', '3(3-0-9)', 5, true),
  ('Plan B — Electives — Group 1', '2725625*', 'Morphology and Syntax in English Language Teaching', '1(1-0-3)', 0, true),
  ('Plan B — Electives — Group 1', '2725626*', 'Semantics in English Language Teaching', '1(1-0-3)', 1, true),
  ('Plan B — Electives — Group 1', '2725627*', 'Pragmatics in English Language Teaching', '1(1-0-3)', 2, true),
  ('Plan B — Electives — Group 1', '2725704', 'Supervision of English Language Teaching', '3(3-0-9)', 3, true),
  ('Plan B — Electives — Group 1', '2725705', 'Selected Topics in English Language Teaching', '3(3-0-9)', 4, true),
  ('Plan B — Electives — Group 1', '2725706', 'Teaching English for Workplaces', '3(3-0-9)', 5, true),
  ('Plan B — Electives — Group 1', '2725712', 'Second Language Acquisition', '3(3-0-9)', 6, true),
  ('Plan B — Electives — Group 1', '2725716', 'Sociolinguistics for English Language Teaching', '3(3-0-9)', 7, true),
  ('Plan B — Electives — Group 1', '2725717', 'Selected Topics in Language and Linguistics', '3(3-0-9)', 8, true),
  ('Plan B — Electives — Group 1', '2725733', 'Teaching English for Young Learners', '3(3-0-9)', 9, true),
  ('Plan B — Electives — Group 1', '2725734', 'Teaching English for Adolescent Learners', '3(3-0-9)', 10, true),
  ('Plan B — Electives — Group 1', '2725838', 'Multilingual and Multicultural Education', '3(3-0-9)', 11, true),
  ('Plan B — Electives — Group 1', '2725741', 'Teaching English Literacy', '3(3-0-9)', 12, true),
  ('Plan B — Electives — Group 1', '2725744*', 'Teaching English for Intercultural Communication', '3(3-0-9)', 13, true),
  ('Plan B — Electives — Group 1', '2725746*', 'Teaching English for Adult Learners and Lifelong Learning', '3(3-0-9)', 14, true),
  ('Plan B — Electives — Group 2', '2725702', 'English Language Teaching Materials and Media', '3(3-0-9)', 0, true),
  ('Plan B — Electives — Group 2', '2725710', 'Reading and Writing for English Language Teachers', '3(3-0-9)', 1, true),
  ('Plan B — Electives — Group 2', '2725711', 'Professional Oral Communication Skills', '3(3-0-9)', 2, true),
  ('Plan B — Electives — Group 2', '2725723', 'English Language Teaching Innovations', '3(3-0-9)', 3, true),
  ('Plan B — Electives — Group 2', '2725724', 'Individual Study', '3(3-0-9)', 4, true),
  ('Plan B — Electives — Group 2', '2725739', 'Research Design in English Language Education', '3(3-0-9)', 5, true),
  ('Plan B — Electives — Group 2', '2725743*', 'Selected Topics in English Language Education Research and Innovation', '3(3-0-9)', 6, true),
  ('Plan B — Electives — Group 2', '2725745*', 'Multimedia and Digital Technology for ELT', '3(3-0-9)', 7, true);

update blocks set html = $tefl$<div class="sec-head">
          <div class="eyebrow">What You Study</div>
          <span class="rule"></span>
          <h2>List of Courses</h2>
        </div>
        <p>The new curriculum B.E. 2568 will apply to students admitted from the academic year 2025 onwards.</p>

        <!-- เปิดทั้งหน้า (body.is-page-view) เห็นแค่การ์ดสองใบนี้ เปิดผ่าน #list-of-courses เห็นตารางเต็ม -->
        <div class="ov-grid course-tiles">
          <a class="ov-tile" href="#list-of-courses" data-tab-open="courses-plan-a"><span class="ov-title">Academic Track (Coursework and Thesis)</span><span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>
          <a class="ov-tile" href="#list-of-courses" data-tab-open="courses-plan-b"><span class="ov-title">Professional Track (Coursework and Comprehensive Exam)</span><span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></a>
        </div>

        <div class="plan-tabs" role="tablist" aria-label="Courses by plan">
          <button type="button" class="pt-tab" role="tab" id="tab-courses-plan-a" aria-controls="courses-plan-a" aria-selected="true"><span class="t-tag">Plan A</span>Academic Track <span class="pt-cr">Coursework and Thesis</span></button>
          <button type="button" class="pt-tab" role="tab" id="tab-courses-plan-b" aria-controls="courses-plan-b" aria-selected="false" tabindex="-1"><span class="t-tag">Plan B</span>Professional Track <span class="pt-cr">Coursework and Comprehensive Exam</span></button>
        </div>
        <div class="pt-panel" role="tabpanel" id="courses-plan-a" aria-labelledby="tab-courses-plan-a">
          <h3 class="course-head">Required Courses for Academic Track (Coursework and Thesis)</h3>
          <div class="table-label">
            <span class="t-tag">Required</span>
            <span class="t-title">Required courses for TEFL students for Academic Track (12 Credits)</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan A — Academic Track — 12 credits"></tbody>
            </table>
          </div>
          <h3 class="course-head">Elective Courses for Academic Track (Coursework and Thesis)</h3>
          <div class="table-label">
            <span class="t-tag">Group 1</span>
            <span class="t-title">English Language, Learning, and Teaching</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan A — Electives — Group 1"></tbody>
            </table>
          </div>
          <div class="table-label">
            <span class="t-tag">Group 2</span>
            <span class="t-title">Innovations and Professional Development</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan A — Electives — Group 2"></tbody>
            </table>
          </div>
        </div>

        <div class="pt-panel" role="tabpanel" id="courses-plan-b" aria-labelledby="tab-courses-plan-b" hidden>
          <h3 class="course-head">Required Courses for Professional Track (Coursework and Comprehensive Exam)</h3>
          <div class="table-label">
            <span class="t-tag">Required</span>
            <span class="t-title">Required courses for TEFL students for Professional Track (12 Credits)</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan B — Professional Track — 12 credits"></tbody>
            </table>
          </div>
          <h3 class="course-head">Elective Courses for Professional Track (Coursework and Comprehensive Exam)</h3>
          <div class="table-label">
            <span class="t-tag">Group 1</span>
            <span class="t-title">English Language, Learning, and Teaching</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan B — Electives — Group 1"></tbody>
            </table>
          </div>
          <div class="table-label">
            <span class="t-tag">Group 2</span>
            <span class="t-title">Innovations and Professional Development</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Course Title</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody data-cms="courses" data-group="Plan B — Electives — Group 2"></tbody>
            </table>
          </div>
        </div>
      $tefl$, updated_at = now()
where key = 'academics/list-of-courses';

commit;
