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
