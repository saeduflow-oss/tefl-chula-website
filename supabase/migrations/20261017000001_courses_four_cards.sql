-- การ์ด Courses หน้าแรกเหลือ 4 ใบ: ป.ตรี ป.โท Teaching Practicum Guest Lectures (ต.ค. 2026)
-- รูปใหม่ course-bachelor / course-master / course-supervision (ตัดจาก img/goals) และ course-guest-lecturers
-- (ภาพรวมรูปวิทยากรรับเชิญ 7 คนจาก img/lecturer-*.jpg — สร้างใหม่ถ้าเปลี่ยนรายชื่อวิทยากร)
-- html ต้องตรงกับ index.html (section data-cms-block="index/academics") ไม่งั้น sync-content.py จะเห็นว่าต่าง · รันซ้ำได้
update public.blocks set html = $blk$
      <div class="inner">

        <div class="section-head">
          <div class="eyebrow">Discover Our</div>
          <span class="rule"></span>
          <h2>Courses</h2>
        </div>

        <div class="course-index" id="courses">
          <a class="course-card" href="admission.html#undergraduate-admission">
            <div class="c-photo" style="--img:url('img/course-bachelor.jpg')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Bachelor&rsquo;s Degree</h5>
              <p>Undergraduate study in English language teaching</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="academics.html">
            <div class="c-photo" style="--img:url('img/course-master.jpg')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Master&rsquo;s Degree</h5>
              <p>A two-year TEFL program for pre-service and in-service teachers</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="activities.html#activities-list">
            <div class="c-photo" style="--img:url('img/course-supervision.jpg')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Teaching Practicum</h5>
              <p>Supervised practical teaching experience in real classrooms</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="about.html#guest-lecturers">
            <div class="c-photo" style="--img:url('img/course-guest-lecturers.jpg')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Guest Lectures</h5>
              <p>Talks by visiting scholars and professionals</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
        </div>

        <div class="course-cta">
          <a href="academics.html#curriculum-info" class="btn-base is-outline is-sm">CURRICULUM INFO<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </div>

      </div>
    $blk$
where key = 'index/academics';
