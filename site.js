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

  /* hash ที่ชี้ element ข้างใน section (เช่น #plan-a) — คืน element นั้น ถ้าชี้ section เองคืน null */
  function innerTarget(sections, id){
    const el = id && document.getElementById(id);
    if(!el || sections.indexOf(el) >= 0) return null;
    return sections.find(function(s){ return s.contains(el); }) ? el : null;
  }

  function filterSections(fromHashChange){
    const content = document.querySelector('.page-wrap .content');
    if(!content) return;
    tagPlanCards();
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
    updateCrumb(group && group.label);

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
     ลิงก์ที่มี data-tab-open (ปุ่ม "See Plan B courses" ใน Study Plan) เปิดแท็บนั้นก่อน
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
