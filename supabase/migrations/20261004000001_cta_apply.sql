-- แถบ CTA ท้ายหน้าทั้ง 8 หน้า: ข้อความชวนสมัคร + ปุ่ม Apply + พื้นคลื่นเคลื่อนไหว (ต.ค. 2026)
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Shape the Future of English Teaching</h3>
      <p>Join Chulalongkorn University&rsquo;s Master&rsquo;s in TEFL and grow into the confident, research-informed teacher your students deserve.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="academics.html" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'about/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Ready to Take the Next Step?</h3>
      <p>A research-driven curriculum, real classroom practice and close mentoring from TEFL specialists &mdash; all at Thailand&rsquo;s first university. Secure your place in the next intake.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="faqs.html#faqs-applicants" class="btn-base is-outline">READ THE FAQS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'academics/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Learn Beyond the Classroom</h3>
      <p>Conferences, workshops and teaching projects with a community of passionate educators &mdash; your TEFL journey is more than lectures. Come be part of it.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="academics.html" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'activities/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Your TEFL Journey Starts Here</h3>
      <p>Apply online for the next intake and join a network of English teachers shaping classrooms across Thailand and beyond.</p>
      <div class="cta-actions">
        <a href="https://www.grad.chula.ac.th/" class="btn-base cta-apply" target="_blank" rel="noopener">APPLY ONLINE<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="faqs.html#faqs-applicants" class="btn-base is-outline">READ THE FAQS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'admission/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Got Your Answers? Take the Next Step</h3>
      <p>Join the Master&rsquo;s in TEFL at Chulalongkorn University &mdash; and if anything is still unclear, our office is happy to help.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="contact.html" class="btn-base is-outline">CONTACT US<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'faqs/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Grow Your Teaching Career With Us</h3>
      <p>Not a TEFL student yet? Study with experienced lecturers and researchers and earn a master&rsquo;s degree from Thailand&rsquo;s leading university.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="contact.html" class="btn-base is-outline">CONTACT US<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'forms-and-links/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Start Your Master&rsquo;s in TEFL</h3>
      <p>Bring your passion for English teaching to Chulalongkorn University and learn alongside dedicated teachers, lecturers and researchers.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="academics.html" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'contact/cta-band';
update blocks set html = $cta$<div class="cta-bg" aria-hidden="true">
      <div class="cw cw-1">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffe6d8"/>
              <stop offset="55%" stop-color="#ffc3a5"/>
              <stop offset="100%" stop-color="#ff9d6e"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveA)"
            d="M-200,140 C 120,44 320,192 640,140 C 960,88 1140,14 1640,72 L1640,-120 L-200,-120 Z"/>
        </svg>
      </div>

      <div class="cw cw-2">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffd7c2" stop-opacity="0"/>
              <stop offset="42%" stop-color="#ffb489" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f4915c" stop-opacity=".5"/>
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#ctaWaveB)" stroke-width="80" stroke-linecap="round"
            d="M-220,198 C 180,122 340,252 700,202 C 1020,158 1240,88 1660,132"/>
        </svg>
      </div>

      <div class="cw cw-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ctaWaveC" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#fff0e6"/>
              <stop offset="100%" stop-color="#ffcdb0" stop-opacity=".6"/>
            </linearGradient>
          </defs>
          <path fill="url(#ctaWaveC)"
            d="M-200,300 C 220,240 400,332 780,278 C 1090,236 1300,302 1640,266 L1640,470 L-200,470 Z"/>
        </svg>
      </div>

      <span class="cglow cglow-1"></span>
      <span class="cglow cglow-2"></span>
    </div>
    <div class="cta-inner">
      <span class="cta-kicker"><span class="dot" aria-hidden="true"></span>Master of Education in TEFL</span>
      <h3>Turn Classroom Questions Into Research</h3>
      <p>Work with experienced supervisors on a thesis or master project that changes how English is taught &mdash; it starts with your application.</p>
      <div class="cta-actions">
        <a href="admission.html" class="btn-base cta-apply">APPLY NOW<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        <a href="about.html#academic-staff" class="btn-base is-outline">MEET OUR STAFF<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>
    </div>$cta$, updated_at = now() where key = 'research/cta-band';
