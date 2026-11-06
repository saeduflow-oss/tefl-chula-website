-- =========================================================
-- ส่วนที่เหลือที่ยังแก้ใน /admin ไม่ได้ ย้ายเข้าฐานข้อมูล (พ.ย. 2026)
--   1. การ์ดเลือกระดับปริญญาหน้า Admission → บล็อก admission/degree-paths (คำอธิบายบนการ์ด = คำอธิบายใต้ banner ของระดับนั้น)
--   2. รูปสไลด์หน้าแรก → ย้ายเข้า style="" ของสไลด์ในบล็อก index/home ให้ปุ่ม "รูปพื้นหลัง" ในตัวแก้หน้าเปลี่ยนได้
--      (กฎ .slide-N ใน index.html เหลือเป็นค่าสำรอง)
--   3. banner หน้า Explore → บล็อก explore/page-banner
--   4. ข้อความในฟอร์มติดต่อ (form.*) และชื่อแท็บของทุกหน้า (title.*) → แถวใน settings
-- html ทุกก้อนต้องตรงกับไฟล์ (สร้างจากไฟล์โดยตรง) ไม่งั้น sync-content.py จะเห็นว่าต่าง
-- รันก่อนหรือหลัง push ไฟล์ก็ได้ — แต่ละฝั่งข้ามของที่อีกฝั่งยังไม่มี · รันซ้ำได้
-- =========================================================

-- ---------- 1. การ์ดเลือกระดับปริญญา (ต่อจาก banner = 1 ดันที่เหลือลง 1) ----------
update public.blocks set sort_order = sort_order + 1
where page = 'admission.html' and sort_order >= 1
  and not exists (select 1 from public.blocks where key = 'admission/degree-paths');
insert into public.blocks (key, page, label, sort_order, html)
select 'admission/degree-paths', 'admission.html', 'การ์ดเลือกระดับปริญญา (Bachelor’s / Master’s)', 1, $blk$
        <div class="eyebrow">Choose Your Degree</div>
        <span class="rule"></span>
        <h2>Degree Programs</h2>
        <p>Select a degree level to learn more.</p>
        <div class="dp-grid">
          <a class="ov-tile" href="#undergraduate-admission">
            <span class="dp-text">
              <span class="ov-title">Bachelor&rsquo;s Degree</span>
              <span class="dp-desc">What we study, our activities and our prides</span>
            </span>
            <span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
          </a>
          <a class="ov-tile" href="#admission-procedures">
            <span class="dp-text">
              <span class="ov-title">Master&rsquo;s Degree</span>
              <span class="dp-desc">A two-year TEFL program for pre-service and in-service teachers</span>
            </span>
            <span class="ov-foot"><svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><span class="ov-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
          </a>
        </div>
      $blk$
where not exists (select 1 from public.blocks where key = 'admission/degree-paths');

-- ---------- 2. สไลด์หน้าแรก: รูปอยู่ใน style ของแต่ละสไลด์ ----------
update public.blocks set html = $blk$
      <div class="hero-track" id="heroTrack">
        <div class="hero-slide slide-6" style="background-image:url('img/hero-ceremony.jpg');background-position:center 35%" role="img" aria-label="TEFL students and faculty members at an award ceremony"></div>
        <div class="hero-slide slide-2" style="background-image:url('img/hero-lab.jpg')" role="img" aria-label="TEFL students in the faculty computer lab"></div>
        <div class="hero-slide slide-3" style="background-image:url('img/hero-classroom.jpg')" role="img" aria-label="Students working together in a TEFL class"></div>
        <div class="hero-slide slide-4" style="background-image:url('img/hero-library.jpg')" role="img" aria-label="Group work in the faculty library"></div>
        <div class="hero-slide slide-5" style="background-image:url('img/hero-campus.jpg')" role="img" aria-label="Faculty of Education campus"></div>
      </div>

      <div class="hero-inner">
        <div class="hero-copy" id="heroCopy">
          <h1>Teaching English as a<br>Foreign Language Program</h1>
          <p class="sub">Faculty of Education, Chulalongkorn University</p>
        </div>
      </div>

      <div class="slider-dots" id="sliderDots">
        <button class="active" data-slide="0" aria-label="Slide 1"></button>
        <button data-slide="1" aria-label="Slide 2"></button>
        <button data-slide="2" aria-label="Slide 3"></button>
        <button data-slide="3" aria-label="Slide 4"></button>
        <button data-slide="4" aria-label="Slide 5"></button>
      </div>
    $blk$
where key = 'index/home';

-- ---------- 3. banner หน้า Explore ----------
insert into public.blocks (key, page, label, sort_order, html)
select 'explore/page-banner', 'explore.html', 'แบนเนอร์หัวหน้า — Explore', 0, $blk$
    <div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Explore</span>
      </nav>
      <h1>Explore TEFL</h1>
      <p class="subtitle">Everything about the TEFL Program at a glance &mdash; pick a topic to read more.</p>
    </div>
  $blk$
where not exists (select 1 from public.blocks where key = 'explore/page-banner');

-- ---------- 4. ข้อความฟอร์มติดต่อ + ชื่อแท็บ (มีแถวอยู่แล้ว = ไม่ทับค่าที่ผู้ดูแลแก้ไว้) ----------
insert into public.settings (key, label, hint, value, kind, sort_order) values
  ('form.heading', 'หัวข้อฟอร์ม', null, 'Send Us a Message', 'text', 50),
  ('form.lead', 'คำอธิบายใต้หัวข้อฟอร์ม', null, 'Fill out the form and we will get back to you as soon as possible.', 'text', 51),
  ('form.label_first', 'ป้ายช่อง: ชื่อ', null, 'First Name', 'text', 52),
  ('form.label_last', 'ป้ายช่อง: นามสกุล', null, 'Last Name', 'text', 53),
  ('form.label_email', 'ป้ายช่อง: อีเมล', null, 'Email', 'text', 54),
  ('form.label_phone', 'ป้ายช่อง: เบอร์โทร', null, 'Phone', 'text', 55),
  ('form.label_subject', 'ป้ายช่อง: หัวข้อ', null, 'Subject', 'text', 56),
  ('form.subjects', 'ตัวเลือกหัวข้อ', 'คั่นแต่ละตัวเลือกด้วยจุลภาค (,) — ตัวเลือก "Please select" ด้านบนสุดมีให้อัตโนมัติ', 'Admissions, Program and Curriculum, Student Services, Thesis and Research, Other', 'text', 57),
  ('form.label_message', 'ป้ายช่อง: ข้อความ', null, 'Message', 'text', 58),
  ('form.button', 'ข้อความบนปุ่มส่ง', null, 'Send Message', 'text', 59),
  ('form.hint', 'ข้อความใต้ปุ่มส่ง', 'ต่อจากประโยค "Fields marked * are required." ซึ่งคงไว้เสมอ', 'Your message goes to TEFL.Chula@gmail.com.', 'text', 60),
  ('title.index', 'ชื่อแท็บ: หน้าแรก', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', '(TEFL) Teaching English as a Foreign Language', 'text', 70),
  ('title.about', 'ชื่อแท็บ: About', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'About | (TEFL) Teaching English as a Foreign Language', 'text', 71),
  ('title.academics', 'ชื่อแท็บ: Academics', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Academics | TEFL Program', 'text', 72),
  ('title.admission', 'ชื่อแท็บ: Admission', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Admission | TEFL Program', 'text', 73),
  ('title.research', 'ชื่อแท็บ: Research', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Research | TEFL Program', 'text', 74),
  ('title.activities', 'ชื่อแท็บ: Activities', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Activities | TEFL Program', 'text', 75),
  ('title.faqs', 'ชื่อแท็บ: FAQs', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'FAQs | TEFL Program', 'text', 76),
  ('title.forms-and-links', 'ชื่อแท็บ: Forms and Links', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Forms and Links | TEFL Program', 'text', 77),
  ('title.contact', 'ชื่อแท็บ: Contact', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Contact | TEFL Program', 'text', 78),
  ('title.explore', 'ชื่อแท็บ: Explore', 'ข้อความบนแท็บเบราว์เซอร์และในผลค้นหา Google', 'Explore | TEFL Program', 'text', 79)
on conflict (key) do nothing;
