-- เพิ่มรูปพิธีมอบรางวัล (slide-6, img/hero-ceremony.jpg) เป็นสไลด์ใบแรกของหน้าแรก กลับเป็น 5 รูป 5 จุด (ต.ค. 2026)
update blocks set html = $hero$<div class="hero-track" id="heroTrack">
        <div class="hero-slide slide-6" role="img" aria-label="TEFL students and faculty members at an award ceremony"></div>
        <div class="hero-slide slide-2" role="img" aria-label="TEFL students in the faculty computer lab"></div>
        <div class="hero-slide slide-3" role="img" aria-label="Students working together in a TEFL class"></div>
        <div class="hero-slide slide-4" role="img" aria-label="Group work in the faculty library"></div>
        <div class="hero-slide slide-5" role="img" aria-label="Faculty of Education campus"></div>
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
      </div>$hero$
where key = 'index/home';
