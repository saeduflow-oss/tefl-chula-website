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
    /* build the drawer once, from the mega panels already in the markup */
    document.querySelectorAll('.main-nav > ul > li').forEach(function(item){
      const top  = item.querySelector(':scope > a');
      const mega = item.querySelector(':scope > .dropdown');
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
  document.querySelectorAll('.news-carousel').forEach(function(root){
    const viewport = root.querySelector('.nc-viewport');
    const dotsWrap = root.querySelector('.nc-dots');
    const btnPrev  = root.querySelector('[data-nc="prev"]');
    const btnNext  = root.querySelector('[data-nc="next"]');
    if(!viewport || !dotsWrap || !btnPrev || !btnNext) return;

    const cards = viewport.querySelectorAll('.nc-card');
    const label = root.getAttribute('aria-label') || 'Items';
    let pages = 0;

    /* ระยะจากการ์ดใบหนึ่งไปอีกใบ (ความกว้างการ์ด + ช่องไฟ) */
    function step(){
      if(cards.length > 1){
        return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
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

  /* ============ KEYBOARD: Esc ปิดเมนู/ค้นหา ============ */
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){ setSearch(false); setDrawer(false); }
  });

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
