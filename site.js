/* =========================================================
   site.js — สคริปต์ส่วนกลาง (ใช้ร่วมกันทุกหน้า)
   ดูแล: เมนูลิ้นชัก (burger), ช่องค้นหา, ปุ่มกลับขึ้นบน, ปุ่ม Esc
   ========================================================= */
(function(){

  /* ============ HEADER: full menu drawer ============ */
  const mobileToggle = document.getElementById('mobileToggle');
  const navDrawer    = document.getElementById('navDrawer');
  const drawerBody   = document.getElementById('drawerBody');
  const drawerClose  = document.getElementById('drawerClose');

  function setDrawer(open){
    if(!navDrawer) return;
    navDrawer.classList.toggle('open', open);
    if(mobileToggle) mobileToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if(navDrawer && drawerBody){
    /* สร้างลิ้นชักจากเมนูที่อยู่ในหน้า — ต้องสร้างซ้ำได้ ไม่ใช่ครั้งเดียว
       เพราะ cms.js เขียนเมนูใหม่จากฐานข้อมูลหลังหน้าโหลด ถ้าไม่สร้างใหม่
       ลิ้นชักจะยังเป็นเมนูชุดเก่าที่อยู่ในไฟล์ ทั้งที่แถบเมนูบนจอเปลี่ยนไปแล้ว */
    function buildDrawer(){
      drawerBody.innerHTML = '';
      document.querySelectorAll('.main-nav > ul > li').forEach(function(item){
        const top  = item.querySelector(':scope > a');
        const mega = item.querySelector(':scope > .dropdown');
        if(!top) return;
        const group = document.createElement('div');
        group.className = 'drawer-group';

        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = top.getAttribute('href');
        titleLink.textContent = top.textContent.trim();
        title.appendChild(titleLink);
        group.appendChild(title);

        if(mega) group.appendChild(mega.querySelector('.dd-menu').cloneNode(true));
        drawerBody.appendChild(group);
      });
    }
    buildDrawer();
    window.TEFLDrawerRebuild = buildDrawer;   /* cms.js เรียกหลังเขียนเมนูใหม่ */

    if(mobileToggle){
      mobileToggle.addEventListener('click', () => setDrawer(!navDrawer.classList.contains('open')));
    }
    if(drawerClose) drawerClose.addEventListener('click', () => setDrawer(false));
    drawerBody.addEventListener('click', function(event){
      if(event.target.closest('a')) setDrawer(false);
    });
  }

  /* ============ NAV OVERVIEW — หน้ารวม (explore.html) ============
     แบบเว็บกิจการนิสิต sa.edu.chula.ac.th: หัวข้อใหญ่ = เมนูหลักที่มีดรอปดาวน์ + เส้น + ปุ่ม View all
     การ์ด = เมนูย่อยชั้นที่ 2 (ชื่อ + ไอคอน + ลูกศร) ชั้นที่ 3 (Plan A / Plan B) ไม่เอามา
     อ่านจาก .main-nav ทุกครั้ง เหมือนลิ้นชัก — แก้เมนูใน /admin แล้วหน้านี้เปลี่ยนตามเอง
     cms.js เรียกซ้ำหลังเขียนเมนูใหม่ (ไม่งั้นการ์ดยังเป็นเมนูชุดเก่าในไฟล์)
     มาร์กอัปในไฟล์ explore.html สร้างจากฟังก์ชันนี้ — แก้ตรงนี้แล้วต้องคัดลอกผลไปใส่ไฟล์ใหม่ด้วย (สำเนา no-JS) */
  const OV_ICONS = {
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0M12 17v5"/>',
    book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    map:'<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3z"/><path d="M9 3v15M15 6v15"/>',
    star:'<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wallet:'<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><path d="M21 11h-5a2 2 0 0 0 0 4h5z"/>',
    check:'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    steps:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    grad:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>'
  };
  /* เลือกไอคอนจากคำในชื่อเมนู — ลำดับสำคัญ ตัวแรกที่ตรงชนะ
     (Intensive Course ต้องเป็นกิจกรรมก่อนเจอ course, Guidelines for Research Procedures ก่อนเจอ procedure,
      Thesis ... Forms ต้องเป็นฟอร์มก่อนเจอ thesis)
     เมนูใหม่ที่ไม่ตรงคำไหนได้ไอคอนเอกสาร */
  const OV_RULES = [
    [/goal|objective/,'target'], [/staff/,'users'], [/lecturer|speaker/,'mic'],
    [/curriculum/,'book'], [/plan/,'map'], [/intensive|activit/,'star'], [/course/,'list'],
    [/calendar|event/,'calendar'], [/schedule|deadline/,'clock'], [/tuition|fee/,'wallet'],
    [/guideline/,'search'], [/requirement/,'check'], [/procedure|step/,'steps'],
    [/letter/,'mail'], [/link/,'link'], [/announce|news/,'megaphone'], [/graduat/,'grad'],
    [/form/,'file'], [/thesis|research|ojed/,'grad']
  ];
  function ovIcon(label){
    const text = label.toLowerCase();
    const hit = OV_RULES.find(function(r){ return r[0].test(text); });
    return '<svg class="ov-icon" viewBox="0 0 24 24" aria-hidden="true">' + OV_ICONS[hit ? hit[1] : 'file'] + '</svg>';
  }
  function buildNavOverview(){
    const root = document.getElementById('navOverview');
    if(!root) return;
    const escH = function(t){ return t.replace(/[&<>"]/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };
    const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    let html = '';
    document.querySelectorAll('.main-nav > ul > li').forEach(function(item){
      const top = item.querySelector(':scope > a');
      const links = item.querySelectorAll(':scope > .dropdown .dd-menu > ul > li > a');
      if(!top || !links.length) return;
      const title = top.textContent.trim();
      const href = top.getAttribute('href') || '#';
      html += '<section class="ov-group" id="ov-' + escH(href.replace(/\.html.*$/, '')) + '"><div class="ov-inner">' +
        '<div class="ov-head"><h2>' + escH(title) + '</h2><span class="ov-line" aria-hidden="true"></span>' +
        '<a class="ov-all" href="' + escH(href) + '">View all' + ARROW + '<span class="sr-only"> ' + escH(title) + '</span></a></div>' +
        '<div class="ov-grid">' + Array.prototype.map.call(links, function(a){
          const label = a.textContent.trim();
          return '<a class="ov-tile" href="' + escH(a.getAttribute('href') || '#') + '">' +
            '<span class="ov-title">' + escH(label) + '</span>' +
            '<span class="ov-foot">' + ovIcon(label) + '<span class="ov-arrow">' + ARROW + '</span></span></a>';
        }).join('') + '</div></div></section>';
    });
    if(root._html !== html){ root._html = html; root.innerHTML = html; }
  }
  buildNavOverview();
  window.TEFLNavOverview = buildNavOverview;

  /* ============ HEADER: search ============ */
  const searchToggle  = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose   = document.getElementById('searchClose');
  const searchInput   = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchForm    = document.getElementById('searchForm');

  function setSearch(open){
    if(!searchOverlay) return;
    searchOverlay.classList.toggle('open', open);
    if(searchToggle) searchToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if(open){
      if(searchInput) searchInput.focus();
    }else if(searchInput){
      searchInput.value = '';
      if(searchResults) searchResults.innerHTML = '';
    }
  }

  if(searchOverlay && searchInput && searchResults){
    /* index every link inside the menus + every section heading on this page */
    const searchIndex = [];

    /* ต้องสร้างใหม่ได้ ไม่ใช่สร้างครั้งเดียวตอนโหลด
       เพราะ cms.js เปลี่ยนหัวข้อ section และเนื้อ footer หลังหน้าโหลดเสร็จ
       ถ้าไม่สร้างใหม่ ช่องค้นหาจะยังคืนหัวข้อเก่าที่ไม่มีอยู่บนหน้าแล้ว */
    function buildSearchIndex(){
      searchIndex.length = 0;
      document.querySelectorAll('.main-nav .dd-menu a, .footer-col a').forEach(function(link){
        const group = link.closest('.dropdown');
        const col   = link.closest('.footer-col');
        const owner = group ? group.parentElement.querySelector(':scope > a').textContent.trim()
                    : col ? col.querySelector('h4').textContent.trim() : 'Menu';
        const label = link.textContent.trim();
        if(!searchIndex.some(entry => entry.label === label && entry.href === link.href)){
          searchIndex.push({label:label, href:link.getAttribute('href'), group:owner, target:link.target});
        }
      });
      document.querySelectorAll('main section[id] h2, .content section[id] h2').forEach(function(heading){
        searchIndex.push({label:heading.textContent.trim(), href:'#' + heading.closest('section').id, group:'On this page'});
      });
    }
    buildSearchIndex();

    /* cms.js เรียกอันนี้หลังสลับเนื้อหาเสร็จ — เป็นทางเดียวที่ทั้งสองไฟล์คุยกัน */
    window.TEFLSearchReindex = buildSearchIndex;

    function renderResults(query){
      const q = query.trim().toLowerCase();
      searchResults.innerHTML = '';
      if(q.length < 2) return;
      const hits = searchIndex.filter(entry =>
        entry.label.toLowerCase().includes(q) || entry.group.toLowerCase().includes(q)
      ).slice(0, 12);

      if(!hits.length){
        searchResults.innerHTML = '<p class="search-hint">No matches. Try another keyword.</p>';
        return;
      }
      hits.forEach(function(hit){
        const a = document.createElement('a');
        a.href = hit.href;
        if(hit.target) a.target = hit.target;
        a.innerHTML = hit.label + '<span class="grp">' + hit.group + '</span>';
        a.addEventListener('click', () => setSearch(false));
        searchResults.appendChild(a);
      });
    }

    if(searchToggle) searchToggle.addEventListener('click', () => setSearch(true));
    if(searchClose)  searchClose.addEventListener('click', () => setSearch(false));
    searchInput.addEventListener('input', () => renderResults(searchInput.value));
    if(searchForm){
      searchForm.addEventListener('submit', function(event){
        event.preventDefault();
        const first = searchResults.querySelector('a');
        if(first) first.click();
      });
    }
  }

  /* ============ BACK TO TOP ============ */
  (function(){
    const backTop = document.getElementById('backTop');
    if(!backTop) return;
    let ticking = false;
    function sync(){
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){ ticking = false; sync(); });
    });
    backTop.addEventListener('click', function(event){
      event.preventDefault();
      window.scrollTo({top:0, behavior:'smooth'});
    });
    sync();
  })();

  /* ============ SCROLL REVEAL (เนื้อหา Fade in ตอนเลื่อนมาเจอ) ============
     ทำงานอัตโนมัติทุกหน้า ไม่ต้องแก้ HTML: สคริปต์จะไล่หา "ชิ้นเนื้อหา"
     ในแต่ละส่วน แล้วใส่คลาส .reveal ให้ พร้อมหน่วงเวลาไล่ทีละชิ้น
     ========================================================= */
  (function(){
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion || !('IntersectionObserver' in window)) return;

    /* กล่องตั้งต้น — จะไล่ทำอนิเมชันให้ของข้างใน */
    const ROOTS = '.page-banner .inner, .content > section, main > section, .cta-inner, .footer-inner';

    /* กล่องที่ไม่นับเป็นชิ้นเดียว ให้ไล่ลงไปทำที่ลูกข้างในแทน */
    const PASS = '.inner, .intro-inner, .goal-band, .goal-grid, .staff-grid, .lecturer-grid,' +
                 '.mission-cards, .mission-band, .course-index, .intro-stats, .nc-inner, .nc-head,' +
                 '.footer-cols, .footer-mid, .program-block';

    /* ข้ามไปเลย — ฉากหลัง ภาพตกแต่ง และสไลด์ที่มีอนิเมชันของตัวเองอยู่แล้ว */
    const SKIP = '.hero-track, .hero-inner, .slider-dots, .intro-bg, .c-bg, .c-photo, .glow, .w';

    const STAGGER = 70;   /* ms ต่อชิ้น */
    const MAX_DELAY = 420;
    const DURATION = 750; /* ให้ตรงกับ transition ใน site.css */

    /* เก็บ "ชิ้นเนื้อหา" จากลูกของ parent (ลงลึกได้ไม่เกิน 3 ชั้น) */
    function collect(parent, out, depth){
      Array.prototype.forEach.call(parent.children, function(el){
        if(el.matches(SKIP) || el.hidden || el.getAttribute('aria-hidden') === 'true') return;
        if(depth < 3 && el.children.length && el.matches(PASS)){
          collect(el, out, depth + 1);
        }else{
          out.push(el);
        }
      });
    }

    /* บล็อกโปรแกรมสลับซ้าย–ขวา ให้เลื่อนเข้าจากด้านข้างแทน */
    function variantOf(el){
      const block = el.parentElement && el.parentElement.closest('.program-block');
      if(block){
        const flip = block.classList.contains('reverse');
        if(el.classList.contains('program-text')) return flip ? 'from-right' : 'from-left';
        if(el.classList.contains('program-img'))  return flip ? 'from-left'  : 'from-right';
      }
      if(el.classList.contains('eyebrow') || el.classList.contains('rule')) return 'is-soft';
      return '';
    }

    function cleanup(el){
      el.classList.remove('reveal', 'is-in', 'from-left', 'from-right', 'is-soft');
      el.style.removeProperty('--reveal-delay');
      el.style.removeProperty('will-change');
    }

    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
        el.classList.add('is-in');
        window.setTimeout(function(){ cleanup(el); }, delay + DURATION + 120);
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0});

    document.querySelectorAll(ROOTS).forEach(function(root){
      const items = [];
      collect(root, items, 0);
      items.forEach(function(el, index){
        if(el.classList.contains('reveal')) return;
        const variant = variantOf(el);
        el.classList.add('reveal');
        if(variant) el.classList.add(variant);
        el.style.setProperty('--reveal-delay', Math.min(index * STAGGER, MAX_DELAY) + 'ms');
        observer.observe(el);
      });
    });
  })();

  /* ============ CARD CAROUSEL (สไลด์การ์ดแนวนอน) ============
     ทำงานอัตโนมัติกับทุกบล็อก .news-carousel ในหน้า
     โครงสร้างที่ต้องมี: .nc-viewport > .nc-track > .nc-card
                        .nc-dots, .nc-arrows [data-nc="prev"|"next"]
     ========================================================= */
  function initCarousels(){
  document.querySelectorAll('.news-carousel').forEach(function(root){
    const viewport = root.querySelector('.nc-viewport');
    const dotsWrap = root.querySelector('.nc-dots');
    const btnPrev  = root.querySelector('[data-nc="prev"]');
    const btnNext  = root.querySelector('[data-nc="next"]');
    if(!viewport || !dotsWrap || !btnPrev || !btnNext) return;

    /* cms.js เขียนทับ innerHTML ของ section (data-cms-block) แล้วเรียกฟังก์ชันนี้ซ้ำ
       เครื่องหมายกันผูกซ้ำต้องติดที่ .nc-viewport ไม่ใช่ที่ section
       เพราะ section ตัวเดิมอยู่ต่อ (โดนเปลี่ยนแค่ลูกข้างใน) ถ้าติดที่ section ตัวใหม่จะถูกข้ามทั้งบล็อก */
    if(viewport.dataset.ncReady === '1') return;
    viewport.dataset.ncReady = '1';

    /* อ่านการ์ดสดทุกครั้ง ห้ามเก็บ NodeList ไว้ในตัวแปร
       เพราะ cms.js สลับการ์ดทั้งชุดจากฐานข้อมูลหลังหน้าโหลดเสร็จ
       ถ้าจำของเดิมไว้ จะชี้ไปโหนดที่หลุดจาก DOM แล้ว getBoundingClientRect ได้ 0
       ผลคือ step() = 0 แล้วปุ่มลูกศรกดไม่ขยับ */
    function cards(){ return viewport.querySelectorAll('.nc-card'); }
    const label = root.getAttribute('aria-label') || 'Items';
    let pages = 0;

    /* ระยะจากการ์ดใบหนึ่งไปอีกใบ (ความกว้างการ์ด + ช่องไฟ) */
    function step(){
      const list = cards();
      if(list.length > 1){
        return list[1].getBoundingClientRect().left - list[0].getBoundingClientRect().left;
      }
      return viewport.clientWidth;
    }

    function sync(){
      const max   = viewport.scrollWidth - viewport.clientWidth;
      const index = Math.min(pages - 1, Math.round(viewport.scrollLeft / viewport.clientWidth));
      Array.prototype.forEach.call(dotsWrap.children, function(dot, i){
        dot.classList.toggle('active', i === index);
      });
      btnPrev.disabled = viewport.scrollLeft <= 2;
      btnNext.disabled = viewport.scrollLeft >= max - 2;
    }

    function buildDots(){
      /* ชุดเก่าที่ถูก cms.js ถอดออกจากหน้าไปแล้ว ไม่ต้องคำนวณต่อ (listener บน window ยังค้างอยู่) */
      if(!viewport.isConnected) return;
      const count = Math.max(1, Math.ceil(viewport.scrollWidth / viewport.clientWidth));
      if(count !== pages){
        pages = count;
        dotsWrap.innerHTML = '';
        for(let i = 0; i < count; i++){
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', label + ' page ' + (i + 1));
          dot.addEventListener('click', (function(page){
            return function(){
              viewport.scrollTo({ left: page * viewport.clientWidth, behavior:'smooth' });
            };
          })(i));
          dotsWrap.appendChild(dot);
        }
      }
      sync();
    }

    btnPrev.addEventListener('click', function(){
      viewport.scrollBy({ left:-step(), behavior:'smooth' });
    });
    btnNext.addEventListener('click', function(){
      viewport.scrollBy({ left: step(), behavior:'smooth' });
    });

    let ticking = false;
    viewport.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){ ticking = false; sync(); });
    });
    window.addEventListener('resize', buildDots);
    window.addEventListener('load', buildDots);
    buildDots();
  });
  }
  initCarousels();
  /* cms.js เรียกซ้ำหลังเขียนทับ section เพื่อผูกกับมาร์กอัปชุดใหม่ */
  window.TEFLCarouselInit = initCarousels;

  /* ============ PHOTO STRIP — แถบรูปเลื่อนเองสองแถว + ปัด/ลากได้ + กดดูรูปใหญ่ (Goals and Objectives) ============
     รายชื่อรูปเก็บไว้ที่แอตทริบิวต์ data-photo-strip บนตัว <section> (คั่นด้วยจุลภาค)
     เพราะ section ไม่โดนเขียนทับ — cms.js กับ sync-content.py แทนแค่ข้างใน
     มาร์กอัปจึงต้องสร้างจาก JS ที่นี่ ถ้าเขียนลง HTML/บล็อกใน DB จะโดนบล็อกเขียนทับหาย
     รูปใหญ่สำหรับหน้าดูรูปคือชื่อเดียวกันต่อท้าย -lg (img/goals/g01.jpg → img/goals/g01-lg.jpg)

     ครึ่งแรกเป็นแถวบน ครึ่งหลังเป็นแถวล่าง — รูปไม่ซ้ำกันข้ามแถว
     แต่ละแถววางรูปซ้ำสองชุดต่อกันเพื่อให้วนได้ไม่สุด: เลื่อนเลยครึ่งก็ดีดกลับไปจุดเดียวกันของชุดแรก
     (ชุดหนึ่งต้องกว้างกว่าจอ ไม่งั้นจะเห็นรอยดีด — ใช้แถวละ 10+ รูป)

     ใช้ scrollLeft ของแถวจริง ๆ ไม่ใช้ CSS animation เพราะ animation ทำให้นิ้วปัดเองไม่ได้
     ตำแหน่งเก็บเป็นทศนิยมใน pos ของเราเอง — บางเบราว์เซอร์ปัด scrollLeft เป็นจำนวนเต็ม
     ถ้าอ่านกลับมาบวกต่อทีละ 0.5px จะติดอยู่กับที่ */
  function initPhotoStrips(){
    document.querySelectorAll('section[data-photo-strip]').forEach(function(section){
      if(section.querySelector(':scope > .photo-strip')) return;
      const photos = section.getAttribute('data-photo-strip').split(',')
        .map(function(src){ return src.trim(); }).filter(Boolean);
      if(!photos.length) return;
      const half = Math.ceil(photos.length / 2);
      const rows = photos.length > 12 ? [photos.slice(0, half), photos.slice(half)] : [photos];

      const strip = document.createElement('div');
      strip.className = 'photo-strip';
      strip.innerHTML = rows.map(function(row, r){
        function cells(copy){
          return row.map(function(src){
            const index = photos.indexOf(src);
            /* ชุดที่สองมีไว้ให้วนเท่านั้น — ซ่อนจากโปรแกรมอ่านหน้าจอและลำดับ Tab ไม่ให้เจอรูปซ้ำ */
            return '<button type="button" class="ps-card" data-ps-index="' + index + '"' +
              (copy ? ' tabindex="-1" aria-hidden="true"' : ' aria-label="View photo ' + (index + 1) + ' of ' + photos.length + '"') +
              '><img src="' + src + '" alt="" decoding="async" draggable="false"></button>';
          }).join('');
        }
        return '<div class="ps-row' + (r ? ' is-reverse' : '') + '"><div class="ps-track">' + cells(false) + cells(true) + '</div></div>';
      }).join('');
      section.appendChild(strip);

      const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      strip.querySelectorAll('.ps-row').forEach(function(row){ runRow(row, still); });

      strip.addEventListener('click', function(event){
        const card = event.target.closest('.ps-card');
        if(!card || strip.dataset.dragged === '1') return;
        openViewer(photos, +card.dataset.psIndex, card);
      });
    });
  }

  function runRow(row, still){
    const SPEED = row.classList.contains('is-reverse') ? -24 : 28;   /* px ต่อวินาที — ช้าพอให้ดูรูปทัน */
    const strip = row.parentNode;
    let pos = 0, last = 0, holdUntil = 0, hovering = false, drag = null;

    function period(){ return row.scrollWidth / 2; }
    /* ดีดกลับเข้าช่วง [0, ครึ่งแถว) — ภาพที่ตำแหน่ง x กับ x + ครึ่งแถวเป็นรูปเดียวกัน จึงไม่เห็นการกระโดด */
    function wrap(){
      const p = period();
      if(p <= 0) return;
      /* ใช้ modulo ไม่ใช่ลบครั้งเดียว — pos อาจไหลไปไกลหลายรอบ แล้ว scrollLeft ไปค้างท้ายแถวที่ว่างเปล่า */
      pos = ((pos % p) + p) % p;
      row.scrollLeft = pos;
    }
    /* แถวล่างเลื่อนไปทางขวา — เริ่มที่กลางแถวเพื่อให้มีที่ให้ถอยตั้งแต่แรก */
    if(SPEED < 0) pos = -1;   /* wrap() แปลงเป็นท้ายชุดแรกเองเมื่อแถวมีความกว้างจริง (ตอนซ่อนอยู่ยังเป็น 0) */

    function tick(now){
      if(!row.isConnected) return;   /* ชุดเก่าที่ cms.js เขียนทับไปแล้ว ให้หยุดเอง */
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      /* section ถูกตัวกรองซ่อนอยู่ (เปิดเมนูย่อยอื่น) = แถวกว้าง 0 — ห้ามเดิน pos ต่อ
         ไม่งั้นพอกด Goals and Objectives แถวจะโผล่มาที่ตำแหน่งเลยท้ายรูปไปแล้ว เห็นเป็นที่ว่าง */
      if(!still && !hovering && !drag && now > holdUntil && row.clientWidth > 0){
        pos += SPEED * dt;
        wrap();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    /* นิ้วปัด/ล้อเมาส์/แทร็กแพด เลื่อน scrollLeft เอง — ดึงค่ากลับมาเป็น pos แล้วหยุดเลื่อนเองสักพัก */
    row.addEventListener('scroll', function(){
      if(Math.abs(row.scrollLeft - pos) > 1){
        pos = row.scrollLeft;
        holdUntil = performance.now() + 2500;
        wrap();
      }
    }, { passive:true });
    row.addEventListener('touchstart', function(){ holdUntil = performance.now() + 2500; }, { passive:true });

    row.addEventListener('mouseenter', function(){ hovering = true; });
    row.addEventListener('mouseleave', function(){ hovering = false; });

    /* เมาส์ไม่มีการปัดแบบนิ้ว — ทำ "คลิกค้างแล้วลาก" ให้เอง (นิ้วใช้การเลื่อนของเบราว์เซอร์อยู่แล้ว ลื่นกว่า) */
    row.addEventListener('pointerdown', function(event){
      if(event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { x:event.clientX, start:pos, moved:false };
      strip.dataset.dragged = '';
    });
    window.addEventListener('pointermove', function(event){
      if(!drag) return;
      const dx = event.clientX - drag.x;
      /* ขยับเกิน 6px ถือว่าลาก ไม่ใช่คลิก — กันหน้าดูรูปเด้งขึ้นตอนปล่อยเมาส์ */
      if(Math.abs(dx) > 6){ drag.moved = true; row.classList.add('is-dragging'); }
      if(drag.moved){ pos = drag.start - dx; wrap(); }
    });
    window.addEventListener('pointerup', function(){
      if(!drag) return;
      if(drag.moved) strip.dataset.dragged = '1';
      drag = null;
      row.classList.remove('is-dragging');
      holdUntil = performance.now() + 1500;
      /* click ยิงหลัง pointerup — ล้างธงในรอบถัดไปให้คลิกครั้งหน้ากลับมาใช้ได้ */
      setTimeout(function(){ strip.dataset.dragged = ''; }, 0);
    });
  }

  /* ---- หน้าดูรูปใหญ่ (lightbox) — สร้างครั้งเดียวแปะไว้ที่ <body> นอก section จึงไม่โดน cms.js เขียนทับ ---- */
  let viewer = null;
  function openViewer(photos, index, opener){
    if(!viewer){
      viewer = document.createElement('div');
      viewer.className = 'ps-viewer';
      viewer.setAttribute('role', 'dialog');
      viewer.setAttribute('aria-modal', 'true');
      viewer.setAttribute('aria-label', 'Photo viewer');
      viewer.innerHTML =
        '<button type="button" class="psv-close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '<button type="button" class="psv-nav is-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>' +
        '<figure class="psv-stage"><img alt=""><figcaption class="psv-count"></figcaption></figure>' +
        '<button type="button" class="psv-nav is-next" aria-label="Next photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>';
      document.body.appendChild(viewer);

      viewer.addEventListener('click', function(event){
        if(event.target.closest('.psv-close') || event.target === viewer) closeViewer();
        else if(event.target.closest('.is-prev')) step(-1);
        else if(event.target.closest('.is-next')) step(1);
      });
      document.addEventListener('keydown', function(event){
        if(!viewer.classList.contains('is-open')) return;
        if(event.key === 'Escape') closeViewer();
        else if(event.key === 'ArrowLeft') step(-1);
        else if(event.key === 'ArrowRight') step(1);
      });
      /* ปัดซ้าย/ขวาบนรูปใหญ่เพื่อเปลี่ยนรูปบนมือถือ */
      let touchX = null;
      viewer.addEventListener('touchstart', function(event){ touchX = event.touches[0].clientX; }, { passive:true });
      viewer.addEventListener('touchend', function(event){
        if(touchX === null) return;
        const dx = event.changedTouches[0].clientX - touchX;
        touchX = null;
        if(Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      });
    }
    viewer._photos = photos;
    viewer._opener = opener;
    show(index);
    viewer.classList.add('is-open');
    document.documentElement.classList.add('ps-locked');
    viewer.querySelector('.psv-close').focus();
  }
  function show(index){
    const photos = viewer._photos;
    viewer._index = (index + photos.length) % photos.length;
    const img = viewer.querySelector('.psv-stage img');
    img.src = photos[viewer._index].replace(/(\.\w+)$/, '-lg$1');
    viewer.querySelector('.psv-count').textContent = (viewer._index + 1) + ' / ' + photos.length;
  }
  function step(delta){ show(viewer._index + delta); }
  function closeViewer(){
    viewer.classList.remove('is-open');
    document.documentElement.classList.remove('ps-locked');
    /* คืนโฟกัสให้การ์ดที่กดเปิด — คนใช้คีย์บอร์ดไม่หลุดกลับไปต้นหน้า */
    if(viewer._opener && viewer._opener.isConnected) viewer._opener.focus({ preventScroll:true });
  }

  initPhotoStrips();
  /* cms.js เรียกซ้ำหลังเขียนทับ section — แถบรูปโดนลบไปพร้อมกับเนื้อหาเดิม */
  window.TEFLPhotoStripInit = initPhotoStrips;

  /* ============ SECTION FILTER — กดเมนูย่อยแล้วเห็นเฉพาะส่วนนั้น ============
     ลิงก์ #id จากเมนู/ค้นหา จะแสดงแค่กลุ่มของ section นั้น (ดู sectionGroups) ส่วนอื่นถูกซ่อน
     แล้ว breadcrumb บน banner กลายเป็น Home > About > Academic Staff
     ไม่มี hash หรือ hash ไม่ตรงกับ section ไหน = แสดงทั้งหน้าตามเดิม
     ใช้ hidden บนตัว <section> เพราะ cms.js เขียนทับแค่ innerHTML — section เดิมยังอยู่
     ค่า hidden จึงไม่หายหลัง render (อย่าย้ายไปไว้บน element ลูก)
     ส่วน banner ถูก cms.js เขียนทับทั้งก้อน breadcrumb จึงต้องสร้างใหม่ทุกครั้ง (cms.js เรียกซ้ำให้)
     ฟัง hashchange ด้วย เพราะกดเมนูขณะอยู่หน้าเดิมจะไม่โหลดหน้าใหม่
     ทางกลับไปดูทั้งหน้ามีทางเดียวคือชื่อหน้าใน breadcrumb (แผง "Explore more" ถูกเอาออกแล้วตามที่ขอ) */
  const CRUMB_SEP = '<svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
  const pageFile = function(){ return location.pathname.split('/').pop() || 'index.html'; };
  const esc = function(text){ return text.replace(/[&<>"]/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };
  /* อ่านชื่อจาก h2 ทุกครั้ง (ไม่ cache) เพราะ cms.js อาจเปลี่ยนหัวข้อหลังโหลด */
  const sectionTitle = function(s){ const h = s.querySelector('h2'); return (h ? h.textContent : s.id).trim(); };

  function updateCrumb(label){
    const crumb = document.querySelector('.page-banner .breadcrumb');
    if(!crumb) return;
    crumb.querySelectorAll('.crumb-sub').forEach(function(el){ el.remove(); });
    let page = crumb.querySelector('[data-crumb-page]') || crumb.querySelector('.current');
    if(!page) return;
    /* ชื่อหน้า (About) เป็น span ตอนดูทั้งหน้า และเป็นลิงก์กลับทั้งหน้าตอนกรองอยู่ */
    const wantLink = !!label;
    if((page.tagName === 'A') !== wantLink){
      const swap = document.createElement(wantLink ? 'a' : 'span');
      swap.textContent = page.textContent;
      swap.setAttribute('data-crumb-page', '');
      if(wantLink) swap.href = pageFile();
      else { swap.className = 'current'; swap.setAttribute('aria-current', 'page'); }
      page.replaceWith(swap);
      page = swap;
    }
    if(label){
      page.insertAdjacentHTML('afterend',
        CRUMB_SEP.replace('class="sep"', 'class="sep crumb-sub"') +
        '<span class="current crumb-sub" aria-current="page">' + esc(label) + '</span>');
    }
  }

  /* จัด section เป็นกลุ่มตามเมนู: section ที่เมนูลิงก์ถึงเป็นหัวกลุ่ม
     section ที่เมนูไม่ได้ลิงก์ถึง ติดไปกับกลุ่มก่อนหน้า (เช่น Application Steps ไปกับ Admission Procedures)
     ส่วนบทนำต้นหน้าที่ไม่มีในเมนู ติดไปกับกลุ่มแรก
     (Program Overview → Goals and Objectives, Overview → Curriculum Info.)
     อ่านเมนูสดทุกครั้ง เพราะ cms.js สร้างเมนูใหม่จากตาราง nav ได้ */
  function sectionGroups(sections){
    const file = pageFile();
    const menu = {};
    document.querySelectorAll('.main-nav .dd-menu a[href*="#"]').forEach(function(a){
      const parts = (a.getAttribute('href') || '').split('#');
      if((parts[0] || file) === file && parts[1]) menu[parts[1]] = a.textContent.trim();
    });
    const hasMenu = sections.some(function(s){ return s.id in menu; });
    const groups = [];
    let leading = [];
    sections.forEach(function(s){
      /* หน้าที่ไม่มีเมนูย่อย (FAQs) ให้ทุก section เป็นกลุ่มของตัวเอง — ยังลิงก์จากผลค้นหาได้ */
      if(!hasMenu || s.id in menu){
        groups.push({ lead:s, label:menu[s.id] || sectionTitle(s), members:leading.concat(s) });
        leading = [];
      } else if(groups.length){
        groups[groups.length - 1].members.push(s);
      } else {
        leading.push(s);
      }
    });
    groups.hasMenu = hasMenu;
    return groups;
  }

  /* การ์ดแผนการเรียนใน Study Plan (academics.html) ได้ id จากป้ายบนการ์ด: "Plan A" → #plan-a
     เป็นปลายทางของเมนูชั้นที่ 3 (Study Plan → Plan A / Plan B)
     ใส่ด้วยสคริปต์ ไม่ได้เขียนใน HTML เพราะการ์ดมาจากบล็อก academics/study-plan ใน DB
     cms.js เขียนบล็อกทับแล้ว id ที่เขียนไว้ในไฟล์จะหาย — จึงใส่ใหม่ทุกครั้งที่ filterSections ทำงาน
     (cms.js เรียก TEFLSectionFilter หลัง render อยู่แล้ว) */
  function tagPlanCards(){
    document.querySelectorAll('.plan-card').forEach(function(card){
      const label = card.querySelector('.p-label');
      if(!card.id && label) card.id = label.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    });
  }

  /* การ์ด Application Steps (admission.html) — หน้าย่อยเป็นกล่องละขั้นตอน (APPLICATION STEPS ใน site.css)
     ใส่ด้วยสคริปต์ทุกครั้งที่ filterSections ทำงาน เพราะการ์ดมาจากบล็อก admission/application-steps ใน DB
     และ cms.js เขียนทับทั้งก้อน (ของที่ใส่ไว้หาย) — ทำซ้ำได้ ไม่ซ้อนกัน:
     · ช่องว่างหน้า <br> ในชื่อ — ในกล่องซ่อน br ให้ชื่ออยู่บรรทัดเดียว ไม่มีช่องว่างคำจะติดกัน ("OnlineTwice")
     · role/tabindex — การ์ดย่อตอนเปิดทั้งหน้าเป็น <div> ที่กดแล้วพาไปหน้าย่อย ต้องกดด้วยคีย์บอร์ดได้
       (หน้าย่อยการ์ดเป็นกล่องข้อความเฉย ๆ จึงถอดออก) */
  function tagStepCards(){
    document.querySelectorAll('#application-steps .tile-card').forEach(function(card){
      card.querySelectorAll('.t-name br').forEach(function(br){
        const prev = br.previousSibling;
        if(!(prev && prev.nodeType === 3 && /\s$/.test(prev.nodeValue))) br.before(' ');
      });
      if(document.body.classList.contains('is-section-view')){
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
      } else {
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
      }
    });
  }

  /* hash ที่ชี้ element ข้างใน section (เช่น #plan-a) — คืน element นั้น ถ้าชี้ section เองคืน null */
  function innerTarget(sections, id){
    const el = id && document.getElementById(id);
    if(!el || sections.indexOf(el) >= 0) return null;
    return sections.find(function(s){ return s.contains(el); }) ? el : null;
  }

  /* Read More — ส่วนที่มีแต่ย่อหน้า (research.html Overview / OJED) ตอนเปิดทั้งหน้า CSS ตัดเหลือ 2 บรรทัด (READ MORE ใน site.css)
     ปุ่มเป็นลิงก์ #id ของ section → ตัวกรอง section เปิดหน้าย่อยที่เห็นข้อความเต็ม (เจ้าของเว็บขอ ต.ค. 2026)
     หน้าตา/ขนาดเดียวกับปุ่ม Read More หน้า Home (.btn-base.is-outline + ลูกศร) — แก้ที่ index.html แล้วแก้ตรงนี้ด้วย
     ใส่ด้วยสคริปต์เพราะ section มาจากบล็อก DB ที่ cms.js เขียนทับ จึงเรียกจาก filterSections (cms.js เรียกซ้ำหลัง render)
     และตรวจหาปุ่มในลูกทุกครั้ง ไม่ติด marker ที่ section */
  /* activities.html — การ์ดกิจกรรม / ประกาศ / ปฏิทิน ตอนเปิดทั้งหน้าเหลือ 4 รายการ ปุ่มพาไปหน้าย่อยที่เห็นครบ (ACTIVITIES ใน site.css) */
  /* forms-and-links.html — แบบเดียวกัน: ส่วนที่มีแต่ย่อหน้าตัด 2 บรรทัด, ส่วนที่มีการ์ดเหลือ 4 ใบ (FORMS & LINKS ใน site.css) */
  const READ_MORE = '#research-overview, #tefl-research-ojed, #recent-activities, #announcements, #calendar, ' +
    '#request-forms, #thesis-forms, #research-collaboration-letters, #graduation-request, #useful-links, ' +
    '#faqs-applicants, #faqs-students';   /* faqs.html — 4 คำถามแรก (FAQS ใน site.css) */
  function addReadMore(){
    document.querySelectorAll(READ_MORE).forEach(function(section){
      if(section.querySelector(':scope > .read-more-wrap')) return;
      section.insertAdjacentHTML('beforeend',
        '<div class="read-more-wrap"><a href="#' + section.id + '" class="btn-base is-outline read-more">Read More' +
        '<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a></div>');
    });
  }

  function filterSections(fromHashChange){
    const content = document.querySelector('.page-wrap .content');
    if(!content) return;
    tagPlanCards();
    addReadMore();
    const sections = Array.from(content.querySelectorAll(':scope > section[id]'));
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch(e){}
    const inner = innerTarget(sections, id);
    /* ชี้ element ข้างใน = แสดงกลุ่มของ section ที่ครอบมันอยู่ */
    if(inner) id = sections.find(function(s){ return s.contains(inner); }).id;
    const groups = sectionGroups(sections);
    const group = id && groups.find(function(g){
      return g.members.some(function(s){ return s.id === id; });
    });
    sections.forEach(function(s){ s.hidden = !!group && group.members.indexOf(s) < 0; });
    document.body.classList.toggle('is-section-view', !!group);
    /* เปิดทั้งหน้า — CSS ใช้ย่อบางส่วนให้สั้น (เช่นการ์ด Study Plan เหลือแค่ป้ายกับชื่อแผน)
       เป็นคลาสแยก ไม่ใช้ :not(.is-section-view) เพราะไม่มี JS ต้องเห็นเนื้อหาเต็ม (การ์ดย่อแล้วกดเปิดแผ่นไม่ได้) */
    document.body.classList.toggle('is-page-view', !group);
    /* หลังใส่คลาสมุมมอง — tagStepCards ดูว่าเป็นหน้าย่อยหรือไม่ */
    tagStepCards();
    updateCrumb(group && group.label);
    renderSectionTabs(content, groups, group);

    if(!group) return;

    if(fromHashChange === true){
      group.members.forEach(function(s){
        s.classList.remove('sm-enter');
        void s.offsetWidth;
        s.classList.add('sm-enter');
      });
      if(!inner) toTop();
    }
    window.dispatchEvent(new Event('resize'));
    /* เมนูชั้นที่ 3 — เลื่อนไปที่การ์ดนั้นแล้วกระพริบกรอบให้รู้ว่าเลือกอันไหน
       เรียกตอน cms.js render ใหม่ด้วย เพราะเนื้อหาเปลี่ยนแล้วตำแหน่งการ์ดอาจขยับ */
    if(inner){
      inner.scrollIntoView({ block:'center', behavior:'instant' });
      if(fromHashChange === true || !inner.dataset.flashed){
        inner.dataset.flashed = '1';
        inner.classList.remove('is-target');
        void inner.offsetWidth;
        inner.classList.add('is-target');
      }
    }
  }
  /* แถบหัวข้อใต้ banner — ลิงก์ตัวหนังสือไปแต่ละกลุ่ม ตัวที่เลือกอยู่มีขีดส้มใต้ชื่อ
     ไม่มี hash = ไม่มีแถบ และเนื้อหาทั้งหน้ายังแสดงตามเดิม
     ใส่เป็นพี่น้องของ .page-wrap ไม่ใช่ใน banner — banner ถูก cms.js เขียนทับทั้งก้อน แถบจะหายไปด้วย
     แสดงเฉพาะหน้าที่มีเมนูย่อยและมีมากกว่าหนึ่งกลุ่ม; ปิดได้ด้วย .content[data-section-tabs="off"] (about.html)
     สร้างใหม่ทุกครั้งเพราะชื่อเมนูเปลี่ยนได้หลัง cms.js โหลด */
  function renderSectionTabs(content, groups, current){
    const wrap = content.closest('.page-wrap');
    let bar = document.querySelector('.section-tabs');
    /* เปิดทั้งหน้า (ไม่ได้เลือกหัวข้อ) ไม่ต้องมีแถบ — เจ้าของเว็บขอ ต.ค. 2026 ให้โผล่เฉพาะตอนเลือกหัวข้อแล้ว */
    if(!wrap || !current || !groups.hasMenu || groups.length < 2 || content.dataset.sectionTabs === 'off'){
      if(bar) bar.remove();
      return;
    }
    if(!bar){
      bar = document.createElement('nav');
      bar.className = 'section-tabs';
      bar.setAttribute('aria-label', 'On this page');
      wrap.before(bar);
    }
    const html = '<div class="st-inner">' + groups.map(function(g){
      const on = g === current;
      return '<a href="#' + esc(g.lead.id) + '"' + (on ? ' class="is-active" aria-current="true"' : '') + '>' + esc(g.label) + '</a>';
    }).join('') + '</div>';
    if(bar._html === html) return;
    bar._html = html;
    bar.innerHTML = html;
    /* มือถือแถบเลื่อนแนวนอน — เลื่อนให้เห็นตัวที่เลือก */
    const active = bar.querySelector('.is-active');
    if(active) bar.firstChild.scrollLeft = active.offsetLeft - 16;
  }
  /* hash ปัจจุบันชี้ element ข้างใน section ไหม — ใช้ข้ามการเลื่อนขึ้นบนสุดตอนโหลดหน้า */
  function hashIsInner(){
    const content = document.querySelector('.page-wrap .content');
    if(!content) return false;
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch(e){}
    return !!innerTarget(Array.from(content.querySelectorAll(':scope > section[id]')), id);
  }
  /* ส่วนที่เลือกอยู่ใต้ banner พอดีแล้ว จึงเลื่อนขึ้นบนสุดให้เห็น breadcrumb ด้วย
     แทนที่จะปล่อยให้เบราว์เซอร์เลื่อนไปที่ anchor (ซึ่งจะบัง banner ไว้)
     'instant' ข้าม scroll-behavior:smooth ของ html — ไม่งั้นจะเห็นหน้าไหลขึ้นทุกครั้งที่เปิด */
  function toTop(){ window.scrollTo({ top:0, left:0, behavior:'instant' }); }
  filterSections();
  if(document.body.classList.contains('is-section-view') && !hashIsInner()){
    toTop();
    /* เบราว์เซอร์เลื่อนไป anchor อีกรอบตอนโหลดเสร็จ ต้องดึงกลับขึ้นมา */
    window.addEventListener('load', function(){
      if(document.body.classList.contains('is-section-view') && !hashIsInner()) toTop();
    });
  }
  window.addEventListener('hashchange', function(){ filterSections(true); });
  /* "ดูทั้งหน้า" (ชื่อหน้าใน breadcrumb) — ลบ hash โดยไม่โหลดหน้าใหม่
     แล้วค้างตำแหน่งไว้ที่ส่วนที่อ่านอยู่ */
  document.addEventListener('click', function(event){
    const link = event.target.closest('.breadcrumb a[data-crumb-page]');
    if(!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const current = document.getElementById(location.hash.slice(1));
    history.pushState(null, '', location.pathname + location.search);
    filterSections();
    if(current) current.scrollIntoView({ block:'start' });
  });
  window.addEventListener('popstate', function(){ filterSections(true); });
  /* cms.js เรียกซ้ำหลัง render เพื่อสร้าง breadcrumb ใหม่ */
  window.TEFLSectionFilter = filterSections;

  /* ============ PLAN TABS — สลับตารางรายวิชา Plan A / Plan B (academics.html) ============
     ผูก event ไว้ที่ document แล้วหาแท็บสด ๆ ทุกครั้ง ไม่เก็บ element ไว้
     เพราะ cms.js เขียนทับ innerHTML ของ section ทั้งก้อน ถ้าผูกกับปุ่มตรง ๆ แท็บจะกดไม่ติดหลัง render
     (กับดักเดียวกับ hero/carousel ใน CLAUDE.md) — แบบนี้จึงไม่ต้องมี rebind hook ใน cms.js
     ลิงก์ที่มี data-tab-open (การ์ดย่อของ List of Courses) เปิดแท็บนั้นก่อน
     แล้วปล่อยให้ hash พาไปที่ #list-of-courses ตามปกติ */
  function selectTab(tab, focus){
    const list = tab.closest('[role="tablist"]');
    if(!list) return;
    list.querySelectorAll('[role="tab"]').forEach(function(t){
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if(panel) panel.hidden = !on;
    });
    if(focus) tab.focus();
  }
  document.addEventListener('click', function(event){
    const tab = event.target.closest('.plan-tabs [role="tab"]');
    if(tab){ selectTab(tab); return; }
    const opener = event.target.closest('[data-tab-open]');
    if(opener){
      const target = document.querySelector('[role="tab"][aria-controls="' + opener.getAttribute('data-tab-open') + '"]');
      if(target) selectTab(target);
    }
  });
  /* การ์ดค่าเล่าเรียนตอนเปิดทั้งหน้า (ย่อเหลือชื่อ + ลูกศร) — กดแล้วไปดูยอดเต็มที่ #tuition-and-fees
     การ์ดเป็น <article> จากบล็อก DB ไม่ใช่ลิงก์ จึงต้องพาไปด้วยสคริปต์; ผูกที่ document เพราะ cms.js เขียนการ์ดใหม่ */
  document.addEventListener('click', function(event){
    if(!document.body.classList.contains('is-page-view')) return;
    if(event.target.closest('#tuition-and-fees .fee-card')) location.hash = 'tuition-and-fees';
    /* admission.html — แถวตารางที่ CSS ย่อเป็นการ์ด (ADMISSION REQUIREMENTS / DEADLINE ใน site.css)
       และการ์ด Application Steps ที่ CSS ย่อแบบเดียวกัน (APPLICATION STEPS ใน site.css) */
    const row = event.target.closest('#admission-requirements tbody tr, #admission-deadline tbody tr, #application-steps .tile-card');
    if(row) location.hash = row.closest('section').id;
    /* research.html — การ์ดย่อ (RESEARCH ใน site.css): แถวตาราง Thesis และการ์ด Guidelines
       การ์ด Guidelines เป็นลิงก์ไปหน้า Forms & Links — เปิดทั้งหน้ากดแล้วไปหน้าย่อยก่อน (เหมือนการ์ดย่ออื่น) ลิงก์ใช้ได้ในหน้าย่อย */
    const card = event.target.closest('#tefl-research-thesis tbody tr, #research-guidelines .tile-card');
    if(card && !event.metaKey && !event.ctrlKey && !event.shiftKey){
      event.preventDefault();
      location.hash = card.closest('section').id;
    }
  });
  /* ลูกศรซ้าย/ขวา Home/End ย้ายระหว่างแท็บ ตามแบบแผน ARIA tabs (Tab ปกติข้ามไปที่ตารางเลย) */
  document.addEventListener('keydown', function(event){
    const tab = event.target.closest && event.target.closest('.plan-tabs [role="tab"]');
    if(!tab) return;
    const tabs = Array.from(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
    const i = tabs.indexOf(tab);
    const next = { ArrowRight:i + 1, ArrowLeft:i - 1, Home:0, End:tabs.length - 1 }[event.key];
    if(next === undefined) return;
    event.preventDefault();
    selectTab(tabs[(next + tabs.length) % tabs.length], true);
  });

  /* ============ STUDY PLAN — กดการ์ดย่อแล้วไปหน้าย่อยของแผนนั้น (academics.html) ============
     เปิดทั้งหน้า การ์ด Plan A / Plan B ถูกย่อ (ดู STUDY PLAN ใน site.css) — กดทั้งใบ = ไป #plan-a / #plan-b
     ตัวกรอง section แสดงกลุ่ม Study Plan เลื่อนไปที่การ์ดแล้วกระพริบกรอบ และการ์ดในหน้าย่อยแสดงรายละเอียดเต็ม
     หน้าย่อย (is-section-view) การ์ดไม่ใช่ลิงก์ — กดแล้วไม่ทำอะไร เลือกข้อความได้ตามปกติ
     ผูกที่ document เพราะ cms.js เขียนทับ section ทั้งก้อน (ดู CLAUDE.md) · id มาจาก tagPlanCards */
  document.addEventListener('click', function(event){
    if(!document.body.classList.contains('is-page-view')) return;
    const card = event.target.closest('#study-plan .plan-card');
    if(!card || !card.id || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    location.hash = card.id;
  });

  /* ============ APPLICATION STEPS — Enter/Space บนการ์ดย่อ = ไปหน้าย่อย (admission.html) ============
     การ์ดเป็น <div role="button"> (tagStepCards) — คลิกจัดการในตัวจัดการค่าเล่าเรียน/แถวตารางด้านบน
     ผูกที่ document เพราะ cms.js เขียนทับ section ทั้งก้อน (ดู CLAUDE.md) */
  document.addEventListener('keydown', function(event){
    if(event.key !== 'Enter' && event.key !== ' ') return;
    if(!document.body.classList.contains('is-page-view')) return;
    const card = event.target.closest && event.target.closest('#application-steps .tile-card');
    if(!card) return;
    event.preventDefault();
    location.hash = 'application-steps';
  });

  /* ============ EVENT CALENDAR — ปฏิทินกิจกรรมแบบกดได้ (activities.html#calendar) ============
     ข้อมูลมาจากรายการ .ev-item ใน .ev-list[data-cms="events"] (cms.js / sync-content.py เขียนไว้)
     ไม่ได้ fetch เอง — รายการนั้นคือฉบับไม่มี JS อยู่แล้ว ใช้เป็นแหล่งข้อมูลเดียวกันจึงไม่มีทางไม่ตรงกัน
     สร้าง .evc ไว้หน้ารายการแล้วซ่อนรายการเดิม (.is-enhanced) การ์ดในปฏิทินคือ "โคลน" ของการ์ดเดิม
     หน้าตาการ์ดจึงมีที่เดียวคือ site.css

     มุมมอง "รายการ" — แถบวัน 14 วัน แสดงกิจกรรมตั้งแต่วันที่เลือกถึงท้ายแถบ จัดกลุ่มตามวัน
       กิจกรรมหลายวันแสดงครั้งเดียว ใต้วันแรกที่อยู่ในช่วง ไม่ซ้ำทุกวัน (ค่ายสองสัปดาห์จะท่วมรายการ)
     มุมมอง "เดือน" — ตาราง 7 คอลัมน์ กดวันไหนก็สลับไปมุมมองรายการที่วันนั้น
     ปุ่มกรองผู้จัด (TEFL / EDU / CHULA) และช่องค้นหาใช้กับทั้งสองมุมมอง

     cms.js เขียนการ์ดใหม่หลังโหลด → เรียก TEFLEventCalInit อีกรอบ ซึ่งลบ .evc เก่าแล้วสร้างใหม่ทั้งก้อน
     (บล็อก activities/calendar เขียนทับ section ก็ลบ .evc ไปด้วย ไม่มี listener ค้าง เพราะผูกไว้ที่ .evc เอง) */
  const EVC_SRC = [['all', 'All', 'All organisers'], ['tefl', 'TEFL', 'TEFL Program'],
                   ['edu', 'EDU', 'Faculty of Education'], ['chula', 'CHULA', 'Chulalongkorn University']];
  const EVC_MONTHS = ['January','February','March','April','May','June','July',
                      'August','September','October','November','December'];
  const EVC_DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const EVC_DOW_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const EVC_STRIP = 14;
  const EVC_ICON = {
    list:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',
    month:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7.5 13h2M11 13h2M14.5 13h2M7.5 17h2M11 17h2"/></svg>',
    search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>',
    next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
  };

  /* วันที่เก็บเป็นสตริง yyyy-mm-dd ตลอด เทียบกันด้วย < > ได้ตรง ๆ และไม่โดนเขตเวลาเลื่อนวัน */
  function evcIso(d){
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function evcDate(iso){ const p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function evcAdd(iso, n){ const d = evcDate(iso); d.setDate(d.getDate() + n); return evcIso(d); }
  function evcLabel(iso){ const d = evcDate(iso); return d.getDate() + ' ' + EVC_MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); }
  function evcEsc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* เปิดทั้งหน้า (activities.html) ปฏิทินเหลือแค่ 4 กิจกรรมที่กำลังจะมาถึง (เจ้าของเว็บขอ ต.ค. 2026)
     ติด .is-upcoming ให้การ์ดในรายการเดิม (ฉบับไม่มี JS) แล้ว CSS แสดงรายการนั้นแทนปฏิทินแบบกดได้เฉพาะตอน is-page-view
     "กำลังจะมาถึง" = วันจบ ≥ วันนี้ จึงรวมกิจกรรมที่กำลังจัดอยู่ด้วย · รายการเรียงตามวันเริ่มอยู่แล้ว (cms.js / sync) เอา 4 ใบแรกได้เลย
     ไม่มีกิจกรรมข้างหน้า → ใส่ข้อความแจ้ง (รายการถูกเขียนใหม่ทุกครั้งที่ cms.js render ข้อความเก่าจึงหายไปเอง) */
  const EV_UPCOMING = 4;
  function tagUpcomingEvents(list){
    const today = evcIso(new Date());
    let left = EV_UPCOMING;
    list.querySelectorAll('.ev-item[data-start]').forEach(function(node){
      const on = left > 0 && (node.dataset.end || node.dataset.start) >= today;
      node.classList.toggle('is-upcoming', on);
      if(on) left--;
    });
    const none = list.querySelector('.ev-none');
    if(left === EV_UPCOMING && !none) list.insertAdjacentHTML('beforeend', '<p class="ev-none">No upcoming events at the moment.</p>');
    if(left < EV_UPCOMING && none) none.remove();
  }

  function initEventCal(){
    const list = document.querySelector('.ev-list[data-cms="events"]');
    if(!list) return;
    tagUpcomingEvents(list);
    const old = list.parentNode.querySelector('.evc');
    if(old) old.remove();
    const events = Array.prototype.map.call(list.querySelectorAll('.ev-item[data-start]'), function(node){
      return { node:node, start:node.dataset.start, end:node.dataset.end || node.dataset.start,
               src:node.dataset.src || 'tefl', text:node.textContent.toLowerCase() };
    });
    /* รายการเก่าที่ยังไม่มี data-start (ไฟล์ที่ sync ก่อนมีฟีเจอร์นี้) — ปล่อยฉบับไม่มี JS ไว้ตามเดิม */
    if(!events.length){ list.classList.remove('is-enhanced'); return; }

    const today = evcIso(new Date());
    const st = { view:'list', src:'all', q:'', sel:today, from:today };

    const root = document.createElement('div');
    root.className = 'evc';
    root.innerHTML =
      '<div class="evc-top">' +
        '<div class="evc-chips" role="group" aria-label="Filter by organiser">' +
          EVC_SRC.map(function(s){
            return '<button type="button" class="evc-chip is-' + s[0] + '" data-src="' + s[0] + '" title="' + s[2] + '">' +
              '<span class="evc-dot" aria-hidden="true"></span>' + s[1] + '</button>';
          }).join('') +
        '</div>' +
        '<div class="evc-tools">' +
          '<label class="evc-search"><span class="sr-only">Search events</span>' + EVC_ICON.search +
            '<input type="search" placeholder="Search events" autocomplete="off"></label>' +
          '<div class="evc-views" role="group" aria-label="View">' +
            '<button type="button" data-view="list">' + EVC_ICON.list + '<span>List</span></button>' +
            '<button type="button" data-view="month">' + EVC_ICON.month + '<span>Month</span></button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="evc-panel">' +
        '<div class="evc-bar">' +
          '<label class="evc-month"><span class="sr-only">Month</span><select></select></label>' +
          '<div class="evc-nav">' +
            '<button type="button" class="evc-btn" data-step="-1" aria-label="Previous month">' + EVC_ICON.prev + '</button>' +
            '<button type="button" class="evc-btn evc-today" data-today>Today</button>' +
            '<button type="button" class="evc-btn" data-step="1" aria-label="Next month">' + EVC_ICON.next + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="evc-strip">' +
          '<button type="button" class="evc-shift" data-shift="-7" aria-label="Previous week">' + EVC_ICON.prev + '</button>' +
          '<div class="evc-days"></div>' +
          '<button type="button" class="evc-shift" data-shift="7" aria-label="Next week">' + EVC_ICON.next + '</button>' +
        '</div>' +
        '<p class="evc-status sr-only" aria-live="polite"></p>' +
        '<div class="evc-body"></div>' +
      '</div>';

    const sel = root.querySelector('select');
    const days = root.querySelector('.evc-days');
    const body = root.querySelector('.evc-body');
    const status = root.querySelector('.evc-status');

    /* ตัวเลือกเดือน: ครอบทุกเดือนที่มีกิจกรรม และอย่างน้อย 6 เดือนก่อน–12 เดือนหลังวันนี้ */
    const firstIso = events.reduce(function(a, e){ return e.start < a ? e.start : a; }, evcAdd(today, -183));
    const lastIso = events.reduce(function(a, e){ return e.end > a ? e.end : a; }, evcAdd(today, 365));
    function monthKey(iso){ return iso.slice(0, 7); }
    function fillMonths(){
      let opts = '', d = evcDate(firstIso.slice(0, 8) + '01');
      const stop = monthKey(lastIso);
      while(monthKey(evcIso(d)) <= stop){
        opts += '<option value="' + monthKey(evcIso(d)) + '">' + EVC_MONTHS[d.getMonth()] + ' ' + d.getFullYear() + '</option>';
        d.setMonth(d.getMonth() + 1);
      }
      sel.innerHTML = opts;
    }
    fillMonths();

    function visible(){
      return events.filter(function(e){
        return (st.src === 'all' || e.src === st.src) && (!st.q || e.text.indexOf(st.q) !== -1);
      });
    }
    function on(e, iso){ return e.start <= iso && e.end >= iso; }

    /* ไปที่เดือน: ถ้าเป็นเดือนนี้ให้เลือกวันนี้ ไม่งั้นวันที่ 1 */
    function goMonth(key){
      const iso = key === monthKey(today) ? today : key + '-01';
      st.sel = st.from = iso;
      render();
    }

    function card(e){
      const c = e.node.cloneNode(true);
      c.removeAttribute('id');
      return c.outerHTML;
    }
    function dayGroup(iso, cards){
      return '<div class="evc-day' + (iso === today ? ' is-today' : '') + '">' +
        '<p class="evc-day-h"><time datetime="' + iso + '">' + evcLabel(iso) + '</time>' +
        '<span>' + (iso === today ? 'Today' : EVC_DOW_LONG[evcDate(iso).getDay()]) + '</span></p>' +
        cards + '</div>';
    }

    function renderStrip(vis){
      let out = '';
      for(let i = 0; i < EVC_STRIP; i++){
        const iso = evcAdd(st.from, i);
        const d = evcDate(iso);
        const has = vis.some(function(e){ return on(e, iso); });
        out += '<button type="button" class="evc-dayb' + (has ? ' has-ev' : '') + (iso === today ? ' is-today' : '') +
          (iso === st.sel ? ' is-sel' : '') + '" data-day="' + iso + '" aria-pressed="' + (iso === st.sel) + '"' +
          ' aria-label="' + EVC_DOW_LONG[d.getDay()] + ' ' + evcLabel(iso) + (has ? ', has events' : '') + '">' +
          '<span class="evc-dow">' + EVC_DOW[d.getDay()] + '</span><span class="evc-num">' + d.getDate() + '</span></button>';
      }
      days.innerHTML = out;
    }

    function renderList(vis){
      /* ค้นหาอยู่ = ไม่สนแถบวัน แสดงทุกผลลัพธ์ตามวันเริ่ม */
      if(st.q){
        if(!vis.length) return empty('No events match “' + st.q + '”.', null);
        let out = '', cur = '', buf = '';
        vis.forEach(function(e){
          if(e.start !== cur){ if(buf) out += dayGroup(cur, buf); cur = e.start; buf = ''; }
          buf += card(e);
        });
        status.textContent = vis.length + (vis.length === 1 ? ' event found' : ' events found');
        return out + dayGroup(cur, buf);
      }
      const stop = evcAdd(st.from, EVC_STRIP - 1);
      const shown = new Set();
      let out = '', count = 0;
      for(let iso = st.sel; iso <= stop; iso = evcAdd(iso, 1)){
        const todays = vis.filter(function(e){ return !shown.has(e) && on(e, iso); });
        if(!todays.length) continue;
        todays.forEach(function(e){ shown.add(e); });
        count += todays.length;
        out += dayGroup(iso, todays.map(card).join(''));
      }
      if(count){
        status.textContent = count + (count === 1 ? ' event' : ' events') + ' from ' + evcLabel(st.sel) + ' to ' + evcLabel(stop);
        return out;
      }
      /* ช่วงนี้ว่าง — ชี้ไปกิจกรรมถัดไป หรือถ้าไม่มีแล้ว ชี้ไปกิจกรรมล่าสุดที่ผ่านมา */
      const next = vis.filter(function(e){ return e.start > stop; })[0];
      const prev = vis.filter(function(e){ return e.end < st.sel; }).pop();
      const jump = next ? ['Next event: ' + evcLabel(next.start), next.start]
                 : prev ? ['Latest event: ' + evcLabel(prev.start), prev.start] : null;
      return empty('No events between ' + evcLabel(st.sel) + ' and ' + evcLabel(stop) + '.', jump);
    }
    function empty(msg, jump){
      status.textContent = msg;
      return '<div class="evc-empty"><p>' + evcEsc(msg) + '</p>' +
        (jump ? '<button type="button" class="btn-base is-outline" data-jump="' + jump[1] + '">' + jump[0] + '</button>' : '') +
        '</div>';
    }

    function renderMonth(vis){
      const key = monthKey(st.sel);
      const first = evcDate(key + '-01');
      const start = evcAdd(key + '-01', -first.getDay());
      const name = sel.options[sel.selectedIndex].text;
      let out = '<div class="evc-grid"><div class="evc-row evc-head" aria-hidden="true">' +
        EVC_DOW.map(function(d){ return '<span>' + d + '</span>'; }).join('') + '</div>';
      for(let w = 0; w < 6; w++){
        const weekStart = evcAdd(start, w * 7);
        if(w > 3 && monthKey(weekStart) !== key) break;   /* ไม่ต้องมีแถวสุดท้ายที่เป็นเดือนหน้าทั้งแถว */
        out += '<div class="evc-row">';
        for(let i = 0; i < 7; i++){
          const iso = evcAdd(weekStart, i);
          const todays = vis.filter(function(e){ return on(e, iso); });
          out += '<button type="button" class="evc-cell' + (monthKey(iso) !== key ? ' is-out' : '') +
            (iso === today ? ' is-today' : '') + (todays.length ? ' has-ev' : '') + '" data-pick="' + iso + '"' +
            ' aria-label="' + evcLabel(iso) + (todays.length ? ', ' + todays.length + (todays.length === 1 ? ' event' : ' events') : '') + '">' +
            '<span class="evc-num">' + evcDate(iso).getDate() + '</span>' +
            todays.slice(0, 2).map(function(e){
              return '<span class="evc-pill is-' + e.src + '">' + evcEsc(e.node.querySelector('h3').textContent) + '</span>';
            }).join('') +
            (todays.length > 2 ? '<span class="evc-more">+' + (todays.length - 2) + ' more</span>' : '') +
            '</button>';
        }
        out += '</div>';
      }
      const monthEnd = evcAdd(monthKey(evcAdd(key + '-28', 7)) + '-01', -1);
      const total = vis.filter(function(e){ return e.start <= monthEnd && e.end >= key + '-01'; }).length;
      status.textContent = total + (total === 1 ? ' event' : ' events') + ' in ' + name;
      return out + '</div>';
    }

    function render(){
      const vis = visible();
      sel.value = monthKey(st.sel);
      root.classList.toggle('is-month', st.view === 'month');
      root.classList.toggle('is-searching', !!st.q);
      root.querySelectorAll('[data-view]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.view === st.view); });
      root.querySelectorAll('[data-src]').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.src === st.src); });
      if(st.view === 'list') renderStrip(vis);
      body.innerHTML = st.view === 'month' ? renderMonth(vis) : renderList(vis);
    }

    root.addEventListener('click', function(event){
      const b = event.target.closest('button');
      if(!b || !root.contains(b)) return;
      if(b.dataset.src){ st.src = b.dataset.src; }
      else if(b.dataset.view){ st.view = b.dataset.view; }
      else if(b.dataset.step){
        const d = evcDate(monthKey(st.sel) + '-01');
        d.setMonth(d.getMonth() + +b.dataset.step);
        return goMonth(monthKey(evcIso(d)));
      }
      else if(b.hasAttribute('data-today')){ st.sel = st.from = today; }
      else if(b.dataset.shift){
        st.from = evcAdd(st.from, +b.dataset.shift);
        if(st.sel < st.from || st.sel > evcAdd(st.from, EVC_STRIP - 1)) st.sel = st.from;
      }
      else if(b.dataset.day){ st.sel = b.dataset.day; }
      else if(b.dataset.pick){ st.view = 'list'; st.sel = st.from = b.dataset.pick; }
      else if(b.dataset.jump){ st.q = ''; root.querySelector('input').value = ''; st.sel = st.from = b.dataset.jump; }
      else return;
      render();
    });
    sel.addEventListener('change', function(){ goMonth(sel.value); });
    root.querySelector('input').addEventListener('input', function(event){
      st.q = event.target.value.trim().toLowerCase();
      render();
    });

    list.parentNode.insertBefore(root, list);
    list.classList.add('is-enhanced');
    render();
  }
  initEventCal();
  window.TEFLEventCalInit = initEventCal;   /* cms.js เรียกหลังเขียนการ์ดกิจกรรมใหม่ */

  /* ============ KEYBOARD: Esc ปิดเมนู/ค้นหา ============ */
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){ setSearch(false); setDrawer(false); }
  });

  /* ============ SITE SOUND — เสียงประกอบต่อเนื่องทุกหน้า ============
     มาร์กอัปสร้างจากที่นี่ ไม่ได้เขียนใน HTML เพราะไม่งั้นต้องก็อปลงทั้ง 9 ไฟล์

     ทำไมใช้ <video> ไม่ใช่ <audio> — ทดสอบกับ Chrome จริงแล้ว:
       <audio>            เล่นเองไม่ได้เลย แม้ตั้ง muted (NotAllowedError)
       <video muted>      เล่นเองได้ และเวลาเดินจริง
     กฎ "ปิดเสียงแล้วเล่นอัตโนมัติได้" ของเบราว์เซอร์ใช้กับ <video> เท่านั้น
     เราเลยใช้ <video> ที่ซ่อนไว้เป็นเครื่องเล่นเสียง — ได้ประโยชน์สองอย่าง:
       1. เพลงเดินอยู่เงียบ ๆ ตั้งแต่เปิดหน้า ตำแหน่งจึงถูกบันทึกไว้ให้หน้าถัดไปต่อได้จริง
          (ของเดิมใช้ <audio> พอโดนบล็อก timeupdate ไม่ยิงเลย ตำแหน่งเป็น 0 ตลอด = ทุกหน้าเริ่มใหม่)
       2. พอผู้ใช้แตะหน้าเว็บครั้งแรก แค่ปลดปิดเสียงก็ได้ยินทันทีจากจุดที่เพลงเดินมาถึง

     สิ่งที่ยังทำไม่ได้และไม่มีทางทำได้: ให้ "มีเสียง" ตั้งแต่วินาทีแรกโดยผู้ใช้ยังไม่แตะอะไรเลย
     เบราว์เซอร์ทุกตัวห้ามไว้ และการปลดปิดเสียงเองโดยไม่มี gesture จะโดนสั่งหยุดทันที ============ */
  (function(){
    const SRC       = 'img/song.m4a';
    const KEY_STATE = 'tefl-sound';       /* เปิด/ปิด — จำข้ามการเข้าเว็บ (localStorage) */
    const KEY_TIME  = 'tefl-sound-time';  /* วินาทีที่ค้างไว้ — ต่อเนื่องเฉพาะแท็บนี้ (sessionStorage) */
    /* เฉพาะ event ที่นับเป็น user activation จริง — scroll ไม่นับ ใส่ไปก็ปลดล็อกเสียงไม่ได้ */
    const GESTURES  = ['pointerdown','keydown','touchend','click'];

    if(!document.body) return;

    /* โหมดส่วนตัวของบางเบราว์เซอร์อ่าน/เขียน storage ไม่ได้และจะโยน exception
       ห้ามให้ทั้งบล็อกพังเพราะเรื่องนี้ — ถือว่า "ยังไม่เคยปิด" แล้วเล่นต่อไปตามปกติ */
    function wantsSound(){
      try{ return localStorage.getItem(KEY_STATE) !== 'off'; }catch(e){ return true; }
    }
    function rememberState(value){
      try{ localStorage.setItem(KEY_STATE, value); }catch(e){}
    }
    function readTime(){
      try{ return parseFloat(sessionStorage.getItem(KEY_TIME)) || 0; }catch(e){ return 0; }
    }
    function writeTime(value){
      try{ sessionStorage.setItem(KEY_TIME, value); }catch(e){}
    }

    /* ---- เครื่องเล่น: <video> ที่ซ่อนไว้ ----
       ใช้วางนอกจอแทน display:none เพราะบางเบราว์เซอร์หยุดเล่นวิดีโอที่ถูกซ่อนสนิทเพื่อประหยัดแบต */
    const player = document.createElement('video');
    player.src      = SRC;
    player.loop     = true;
    player.muted    = true;      /* ต้องเริ่มแบบปิดเสียง ไม่งั้นเบราว์เซอร์ไม่ยอมให้เล่นเอง */
    player.volume   = 0.35;      /* เป็นเสียงประกอบ ไม่ใช่ตัวเอก ดังกว่านี้จะกวนคนอ่าน */
    player.preload  = 'auto';    /* ต้องมี metadata ก่อนถึงจะ seek ไปต่อจุดเดิมได้ */
    player.setAttribute('playsinline','');   /* กัน iOS เปิดเป็นเครื่องเล่นเต็มจอ */
    player.setAttribute('aria-hidden','true');
    player.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(player);

    /* ค่าจากหน้า admin มาถึงทีหลัง (cms.js ยิง event นี้เมื่อโหลด settings เสร็จ)
       เพลงเริ่มเล่นด้วยไฟล์ในเครื่องไปก่อน แล้วค่อยสลับถ้าผู้ดูแลตั้งไว้ต่างจากนี้
       ตอนนั้นยังปิดเสียงอยู่แน่ ๆ (ยังไม่มี gesture) จึงสลับได้โดยผู้ชมไม่รู้สึก */
    document.addEventListener('tefl:settings', function(ev){
      const st = ev.detail || {};
      if(st['music.enabled'] === 'false'){
        player.pause(); player.remove();
        const b = document.getElementById('soundToggle'); if(b) b.remove();
        return;
      }
      const src = st['music.src'];
      if(src && src !== SRC && !player.src.endsWith(src)){
        const at = player.currentTime;
        player.src = src;
        player.addEventListener('loadedmetadata', function once(){
          player.removeEventListener('loadedmetadata', once);
          try{ player.currentTime = at; }catch(e){}
          player.play().catch(function(){});
        });
      }
    });

    /* ---- ปุ่มเปิด/ปิด ---- */
    const button = document.createElement('button');
    button.type      = 'button';
    button.id        = 'soundToggle';
    button.className = 'sound-toggle';
    button.innerHTML =
      '<svg class="ic-off" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/>' +
        '<path d="M16.5 9.8l4.5 4.4M21 9.8l-4.5 4.4"/>' +
      '</svg>' +
      '<svg class="ic-on" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/>' +
        '<path class="wave" d="M15.6 9.2a4 4 0 0 1 0 5.6"/>' +
        '<path class="wave" d="M18.4 6.6a8 8 0 0 1 0 10.8"/>' +
      '</svg>';
    document.body.appendChild(button);

    /* "เปิด" = ได้ยินจริง ไม่ใช่แค่กำลังเดินอยู่เงียบ ๆ */
    function audible(){ return !player.paused && !player.muted; }
    function paint(){
      const on = audible();
      button.classList.toggle('is-on', on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.setAttribute('aria-label', on ? 'Turn background music off' : 'Turn background music on');
    }
    paint();
    /* volumechange ยิงตอน muted เปลี่ยนด้วย จึงครอบคลุมทั้งสามทาง */
    ['play','pause','volumechange'].forEach(function(type){ player.addEventListener(type, paint); });

    /* ---- ต่อจากจุดเดิมของหน้าที่แล้ว ---- */
    function seekTo(seconds){
      /* กันกรณีไฟล์ถูกเปลี่ยนให้สั้นลง แล้ววินาทีที่จำไว้เกินความยาวจริง */
      try{
        if(isFinite(player.duration) && seconds > 0 && seconds < player.duration - 0.3){
          player.currentTime = seconds;
        }
      }catch(e){}
    }
    const resumeAt = readTime();

    /* ---- เก็บตำแหน่งไว้ให้หน้าถัดไป ---- */
    let lastSave = 0;
    player.addEventListener('timeupdate', function(){
      const now = Date.now();
      if(now - lastSave < 1000) return;   /* timeupdate ยิงถี่มาก เขียน storage วินาทีละครั้งพอ */
      lastSave = now;
      writeTime(player.currentTime);
    });
    /* pagehide เชื่อถือได้กว่า beforeunload บนมือถือ (Safari ไม่ยิง beforeunload ตอนสลับแอป) */
    window.addEventListener('pagehide', function(){ writeTime(player.currentTime); });

    /* ---- เล่นเงียบ / เปิดเสียง ---- */
    function runSilently(){
      player.muted = true;
      const attempt = player.play();
      if(attempt && attempt.catch) attempt.catch(function(){ armGestures(); });
    }
    function goAudible(){
      player.muted = false;
      const attempt = player.play();
      if(attempt && attempt.catch){
        attempt.then(disarmGestures).catch(function(){
          /* ยังไม่ได้รับอนุญาตให้มีเสียง — กลับไปเดินเงียบ ๆ ไว้ก่อน แล้วรอจังหวะผู้ใช้ */
          runSilently();
          armGestures();
        });
      }
    }
    /* ---- กู้สถานะเมื่อเบราว์เซอร์สั่งหยุดเอง ----
       ตอนถูกปฏิเสธไม่ให้เล่นมีเสียง เบราว์เซอร์จะสั่ง pause ทิ้งไว้ ถ้าปล่อยไว้นาฬิกาจะหยุด
       ตำแหน่งไม่ถูกบันทึก แล้วหน้าถัดไปจะเริ่มเพลงใหม่ = ความต่อเนื่องพัง
       จึงดักไว้: ถ้าไม่ใช่ผู้ใช้เป็นคนสั่งปิด ให้กลับไปเดินเงียบ ๆ ต่อ */
    let userPaused = false;
    let lastRecover = 0;
    player.addEventListener('pause', function(){
      if(userPaused || !wantsSound()) return;
      const now = Date.now();
      if(now - lastRecover < 1000) return;   /* กันวนรัวถ้าเล่นไม่ได้จริง ๆ */
      lastRecover = now;
      runSilently();
    });

    function onGesture(event){
      /* ถ้าจังหวะแรกคือการกดปุ่มเสียงเอง ให้ handler ของปุ่มตัดสินใจ ไม่งั้นจะเปิดเสียงก่อน
         แล้วโดน click สั่งปิดทันที กลายเป็นกดแล้วไม่มีเสียง */
      if(event && event.target && event.target.closest && event.target.closest('#soundToggle')) return;
      disarmGestures();
      if(wantsSound()) goAudible();
    }
    function armGestures(){
      GESTURES.forEach(function(type){ window.addEventListener(type, onGesture, {passive:true}); });
    }
    function disarmGestures(){
      GESTURES.forEach(function(type){ window.removeEventListener(type, onGesture); });
    }

    button.addEventListener('click', function(){
      if(audible()){
        userPaused = true;            /* ผู้ใช้สั่งเอง — ตัวกู้สถานะข้างบนต้องไม่ไปเปิดซ้ำ */
        rememberState('off');
        player.pause();
        writeTime(player.currentTime);
      }else{
        userPaused = false;
        rememberState('on');
        goAudible();       /* คลิกปุ่มคือ gesture อยู่แล้ว เปิดเสียงได้แน่นอน */
      }
    });

    /* ---- ลำดับการเริ่ม ----
       seek ให้เสร็จก่อนค่อยเล่น ไม่งั้นผู้ใช้จะได้ยินท่อนต้นแวบหนึ่งแล้วกระโดด ฟังเหมือนเสียงสะดุด */
    function start(){
      if(!wantsSound()){ paint(); return; }   /* ผู้ใช้กดปิดไว้ ก็ไม่ต้องเดินให้เปลืองแบต */
      /* ลองแบบมีเสียงก่อนเสมอ — ถ้าผู้ใช้เคยฟังเว็บนี้มาพอ เบราว์เซอร์จะอนุญาตเองตั้งแต่วินาทีแรก
         ถ้ายังไม่อนุญาต จะถอยไปเดินเงียบ ๆ (เวลายังเดิน ตำแหน่งยังถูกบันทึก) แล้วเปิดเสียงให้เอง
         ทันทีที่ผู้ใช้แตะอะไรก็ได้ครั้งแรก โดยไม่ต้องให้เขากดปุ่มอะไรทั้งสิ้น */
      goAudible();
    }
    if(resumeAt > 0 && player.readyState < 1){
      player.addEventListener('loadedmetadata', function(){ seekTo(resumeAt); start(); }, {once:true});
      /* กันเหนียว: เน็ตช้าจน metadata ไม่มาสักที ให้เริ่มเล่นไปก่อน เดี๋ยว seek ตามทีหลังเอง */
      setTimeout(function(){ if(player.paused) start(); }, 1500);
    }else{
      if(resumeAt > 0) seekTo(resumeAt);
      start();
    }
  })();

  /* เผยฟังก์ชันให้สคริปต์เฉพาะหน้าเรียกใช้ได้ (เช่น ตรวจว่าเมนูเปิดอยู่ไหม) */
  window.siteHeader = {
    setDrawer: setDrawer,
    setSearch: setSearch,
    isOverlayOpen: function(){
      return !!((searchOverlay && searchOverlay.classList.contains('open')) ||
                (navDrawer && navDrawer.classList.contains('open')));
    }
  };

})();
