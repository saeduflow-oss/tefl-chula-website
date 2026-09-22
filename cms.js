/* =========================================================
   cms.js — ดึงเนื้อหาจาก Supabase มาแทนที่เนื้อหาในหน้าเว็บ

   หลักการ: "เสริม ไม่ใช่แทน" (progressive enhancement)
   HTML ที่เขียนไว้ในไฟล์ยังอยู่ครบและถูกต้องเสมอ — เป็นทั้งเนื้อหาสำรอง
   ตอนฐานข้อมูลล่ม และเป็นเนื้อหาที่ Google เห็น (bot ที่ไม่รันสคริปต์ก็ยังอ่านได้)
   สคริปต์นี้จะเข้าไปสลับเนื้อหาก็ต่อเมื่อโหลดจากฐานข้อมูลสำเร็จเท่านั้น
   ถ้า fetch พัง เน็ตหลุด หรือ RLS ปฏิเสธ → เงียบ ๆ แล้วปล่อยของเดิมไว้

   ผลข้างเคียงที่ต้องรู้: แก้ผ่านหน้า admin แล้ว HTML ในไฟล์จะ "เก่า" กว่าฐานข้อมูล
   คนทั่วไปเห็นของใหม่เสมอ แต่ Google อาจ index ของเก่าจนกว่าจะ sync กลับ
   (ดู DESIGN.md §9 — มีสคริปต์ sync-content.py ไว้เขียนกลับลง HTML)

   จุดเชื่อมคือแอตทริบิวต์ data-cms="..." ในไฟล์ HTML ไม่ใช่ชื่อคลาส
   เพราะชื่อคลาสมีไว้จัดสไตล์ ถ้าใครเปลี่ยนชื่อคลาสวันหลัง CMS ต้องไม่พังตาม
   ========================================================= */
(function(){
  'use strict';

  const SUPABASE_URL = 'https://dpyhvsdtbihssapuwert.supabase.co';
  /* publishable key เปิดเผยได้ตามการออกแบบ — เป็นกุญแจฝั่งเบราว์เซอร์
     สิทธิ์จริงคุมด้วย RLS: anon อ่านได้อย่างเดียว เขียนต้องล็อกอิน */
  const SUPABASE_KEY = 'sb_publishable_f5Y0D69E80W_f7B5E5cgtQ_NV-H2kyN';

  /* ---------- helper ---------- */

  /* ข้อความจากฐานข้อมูลต้อง escape ก่อนยัดลง innerHTML เสมอ
     ยกเว้นช่อง answer ของ FAQ ที่ตั้งใจให้เป็น HTML (มีลิงก์ข้างใน) */
  function esc(v){
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* รูปที่อัปโหลดผ่าน admin เก็บเป็น URL เต็มของ Supabase Storage
     ส่วนรูปเดิมเก็บเป็นพาธสัมพัทธ์ เช่น img/staff-thana.jpg — ใช้ได้ทั้งคู่ */
  function img(src){ return esc(src || ''); }

  function get(table){
    return fetch(SUPABASE_URL + '/rest/v1/' + table +
                 '?select=*&is_visible=eq.true&order=sort_order.asc', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
    }).then(function(r){
      if(!r.ok) throw new Error(table + ' ' + r.status);
      return r.json();
    });
  }

  /* หา container ตาม data-cms แล้วสลับเนื้อหาข้างในทั้งก้อน
     ถ้าไม่มี container ในหน้านี้ หรือรายการว่าง → ไม่แตะอะไรเลย */
  function fill(hook, rows, render){
    const box = document.querySelector('[data-cms="' + hook + '"]');
    if(!box || !rows || !rows.length) return false;
    box.innerHTML = rows.map(render).join('');
    return true;
  }

  const ARROW = '<span class="l-arrow" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>';
  const TILE_ARROW = '<span class="t-arrow" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>';
  const DL_ARROW = '<span class="t-arrow" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4"/><path d="M5 19.2h14"/></svg></span>';

  /* ไอคอนการ์ดเก็บในฐานข้อมูลเป็น "ชื่อชุด" ไม่ใช่ SVG เต็ม
     เพื่อไม่ให้ผู้ดูแลต้องแปะโค้ด SVG เอง และกัน XSS จากช่องกรอก */
  const ICONS = {
    'pdf': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11z"/><path d="M21 4v7h7"/><path d="M13 19h10M13 24h7"/></svg>',
    'university': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 4 4 11h28z"/><path d="M8 11v14M14 11v14M22 11v14M28 11v14"/><path d="M4 25h28"/><path d="M2 31h32"/></svg>',
    'faculty': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30V9l12-5 12 5v21"/><path d="M6 30h24"/><path d="M14 30v-8h8v8"/><path d="M13 14h10M13 18h10"/></svg>',
    'library': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h10a3 3 0 0 1 3 3v19a3 3 0 0 0-3-3H5z"/><path d="M31 7H21a3 3 0 0 0-3 3v19a3 3 0 0 1 3-3h10z"/></svg>',
    'registrar': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h20a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M13 12h10M13 18h10M13 24h6"/></svg>',
    'graduate-school': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 3 13l15 7 15-7z"/><path d="M9 16v8c0 2 4 4 9 4s9-2 9-4v-8"/></svg>',
    'link': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="14"/><path d="M4 18h28"/><path d="M18 4c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14z"/></svg>'
  };
  function icon(name){ return ICONS[name] || ICONS.link; }

  /* ---------- ตัวเรนเดอร์: มาร์กอัปต้องตรงกับที่เขียนไว้ใน HTML เป๊ะ ๆ
                 ไม่งั้น CSS ที่ผูกกับคลาสเดิมจะไม่จับ ---------- */

  function staffCard(s){
    return '<div class="staff-card"><div class="staff-photo">' +
      '<img src="' + img(s.photo) + '" alt="' + esc(s.name) + '" loading="lazy" decoding="async">' +
      '<div class="s-body">' +
        '<div class="s-name">' + esc(s.name) + '</div>' +
        '<div class="s-role">' + esc(s.role) + '</div>' +
        (s.ext ? '<div class="s-ext">' + esc(s.ext) + '</div>' : '') +
      '</div></div></div>';
  }

  function staffLead(s){
    return '<div class="staff-photo">' +
        '<img src="' + img(s.photo) + '" alt="' + esc(s.name) + '" loading="lazy" decoding="async">' +
        (s.badge ? '<span class="badge">' + esc(s.badge) + '</span>' : '') +
      '</div>' +
      '<div class="lead-info">' +
        '<div class="li-role">' + esc(s.role) + '</div>' +
        '<h3 class="li-name">' + esc(s.name) + '</h3>' +
        '<span class="li-rule"></span>' +
      '</div>';
  }

  function lecturerCard(l){
    return '<a class="lecturer-card" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
      '<img class="l-photo" src="' + img(l.photo) + '" alt="' + esc(l.name) + '" loading="lazy" decoding="async">' +
      (l.badge ? '<span class="badge">' + esc(l.badge) + '</span>' : '') +
      '<div class="l-body">' +
        '<div class="l-name">' + esc(l.name) + '</div>' +
        '<p class="l-meta">' + esc(l.course) +
          (l.when_text ? '<span class="when">' + esc(l.when_text) + '</span>' : '') +
        '</p>' +
      '</div>' + ARROW + '</a>';
  }

  /* answer จงใจไม่ escape — เนื้อหาเดิมมี <a> และ <strong> อยู่ข้างใน
     ความเสี่ยงยอมรับได้เพราะเขียนได้เฉพาะผู้ดูแลที่ล็อกอินแล้วเท่านั้น */
  function faqItem(f){
    return '<details class="faq-item">' +
      '<summary>' + esc(f.question) + '</summary>' +
      '<div class="answer">' + (f.answer || '') + '</div></details>';
  }

  function newsCard(n){
    return '<article class="nc-card"><a href="' + esc(n.url || '#') + '">' +
      '<div class="nc-thumb"><img src="' + img(n.image) + '" alt=""></div>' +
      '<div class="nc-body"><h3>' + esc(n.title) + '</h3>' +
      (n.tag ? '<span class="nc-tag">' + esc(n.tag) + '</span>' : '') +
      '</div></a></article>';
  }

  /* ---------- ปฏิทินกิจกรรม (activities.html#calendar) ----------
     คืนทั้งก้อน ไม่ใช่ทีละแถว เพราะต้องแทรกหัวเดือนเมื่อเดือนเปลี่ยน
     เรียงตามวันเริ่มเสมอ (ไม่ใช่ sort_order) — ปฏิทินที่ไม่เรียงตามวันคืออ่านไม่รู้เรื่อง
     กิจกรรมที่จบไปแล้วยังแสดงแต่ใส่ .is-past ให้จาง ไม่ซ่อน */
  const MONTHS = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];
  function evDate(iso){ const d = iso.split('-'); return { y: +d[0], m: +d[1] - 1, d: +d[2] }; }
  function renderEvents(rows){
    const today = new Date().toISOString().slice(0, 10);
    const list = rows.slice().sort(function(a, b){ return a.starts_on < b.starts_on ? -1 : a.starts_on > b.starts_on ? 1 : 0; });
    let out = '', month = '';
    list.forEach(function(e){
      const s = evDate(e.starts_on);
      const key = MONTHS[s.m] + ' ' + s.y;
      if(key !== month){ out += '<div class="ev-month">' + key + '</div>'; month = key; }
      const meta = [];
      if(e.ends_on && e.ends_on !== e.starts_on){
        const t = evDate(e.ends_on);
        meta.push(MONTHS[s.m].slice(0, 3) + ' ' + s.d + ' – ' + MONTHS[t.m].slice(0, 3) + ' ' + t.d);
      }
      if(e.time_text) meta.push(esc(e.time_text));
      if(e.location) meta.push(esc(e.location));
      const past = (e.ends_on || e.starts_on) < today ? ' is-past' : '';
      const title = e.url ? '<a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.title) + '</a>' : esc(e.title);
      out += '<article class="ev-item' + past + '">' +
        '<div class="ev-date"><span class="ev-d">' + s.d + '</span><span class="ev-m">' + MONTHS[s.m].slice(0, 3) + '</span></div>' +
        '<div class="ev-body"><h3>' + title + '</h3>' +
        (meta.length ? '<p class="ev-meta">' + meta.join(' · ') + '</p>' : '') +
        (e.description ? '<p class="ev-desc">' + esc(e.description) + '</p>' : '') +
        '</div></article>';
    });
    return out;
  }

  function formCard(l){
    return '<article class="tile-card dl-card">' +
      (l.label ? '<span class="t-label">' + esc(l.label) + '</span>' : '') +
      '<div class="t-name">' + esc(l.title) + '</div>' +
      (l.meta ? '<p class="t-meta">' + esc(l.meta) + '</p>' : '') +
      '<div class="t-foot"><span class="t-ic">' + icon(l.icon) + '</span>' + DL_ARROW + '</div>' +
      '<a class="dl-stretch" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
        '<span class="sr-only">Download ' + esc(l.title) + '</span></a></article>';
  }

  function usefulCard(l){
    return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener" class="tile-card">' +
      (l.label ? '<span class="t-label">' + esc(l.label) + '</span>' : '') +
      '<div class="t-name">' + esc(l.title) + '</div>' +
      (l.meta ? '<p class="t-meta">' + esc(l.meta) + '</p>' : '') +
      '<div class="t-foot"><span class="t-ic">' + icon(l.icon) + '</span>' + TILE_ARROW + '</div></a>';
  }

  function courseRow(c){
    return '<tr><td class="code">' + esc(c.code) + '</td><td>' + esc(c.title) +
           '</td><td class="credits">' + esc(c.credits) + '</td></tr>';
  }

  function tuitionRow(t){
    return '<tr><td>' + esc(t.student_group) + '</td>' +
      '<td class="num-cell">' + esc(t.part_university) + '</td>' +
      '<td class="num-cell">' + esc(t.part_faculty) + '</td>' +
      '<td class="total">' + esc(t.total_per_semester) + '</td></tr>';
  }

  /* ---------- เมนูหลัก ----------
     มาร์กอัปต้องตรงกับที่เขียนไว้ในไฟล์เป๊ะ ๆ เพราะ CSS ดรอปดาวน์และ site.js
     (ลิ้นชักมือถือ + ดัชนีค้นหา) อ่านโครง .main-nav > ul > li > a + .dropdown > .dd-menu */
  const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>';
  function slug(v){ return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function currentPage(){ return location.pathname.split('/').pop() || 'index.html'; }

  function renderNav(rows){
    const ul = document.querySelector('.main-nav ul[data-cms="nav"]');
    if(!ul || !rows || !rows.length) return;
    const here = currentPage();
    ul.innerHTML = rows.filter(function(r){ return !r.parent_id; }).map(function(t){
      const kids = rows.filter(function(r){ return r.parent_id === t.id; });
      const id = 'dd-' + slug(t.label);
      /* class="active" ขีดเส้นใต้เมนูของหน้าปัจจุบัน — ในไฟล์ใส่ไว้ต่างกันแต่ละหน้า
         ที่นี่คำนวณจากชื่อไฟล์แทน จึงใช้เมนูชุดเดียวกับทุกหน้าได้ */
      const active = t.href.split('#')[0] === here ? ' class="active"' : '';
      let h = '<li><a href="' + esc(t.href) + '"' + active +
              (kids.length ? ' data-dropdown="' + id + '"' : '') + '>' + esc(t.label) +
              (kids.length ? CHEV : '') + '</a>';
      if(kids.length){
        h += '<div class="dropdown" id="' + id + '"><div class="dd-menu">' +
             (t.dd_title ? '<a class="dd-title" href="' + esc(t.href) + '">' + esc(t.dd_title) + '</a>' : '') +
             '<ul>' + kids.map(function(k){
               return '<li><a href="' + esc(k.href) + '">' + esc(k.label) + '</a></li>';
             }).join('') + '</ul></div></div>';
      }
      return h + '</li>';
    }).join('');
    /* site.js โคลนเมนูไปทำลิ้นชักมือถือตอนโหลด ต้องบอกให้โคลนใหม่ */
    if(typeof window.TEFLDrawerRebuild === 'function') window.TEFLDrawerRebuild();
  }

  /* ---------- ค่าการเชื่อมต่อ (settings) ----------
     ใส่ค่าลงองค์ประกอบที่มาร์ก data-setting-* ไว้ ไม่ใช่ค้นหาด้วยชื่อคลาส
     data-setting-href   = ใส่ค่าลง href (ต่อ prefix ให้ถ้ามี เช่น tel: / mailto:)
     data-setting-text   = ใส่ค่าเป็นข้อความ
     data-setting-map    = สร้าง URL แผนที่ Google จากชื่อสถานที่
     ค่าว่างของ href = ซ่อนองค์ประกอบนั้น (เช่น LINE ที่ยังไม่มีลิงก์ ไม่ควรโชว์ไอคอนที่กดแล้วไปไหนไม่ได้) */
  function applySettings(rows){
    const st = {};
    rows.forEach(function(r){ st[r.key] = r.value == null ? '' : String(r.value); });
    window.TEFLSettings = st;   /* สคริปต์ในหน้า (เช่น ฟอร์มติดต่อ) อ่านจากตรงนี้ */

    document.querySelectorAll('[data-setting-href]').forEach(function(el){
      const k = el.getAttribute('data-setting-href');
      if(!(k in st)) return;
      const v = st[k].trim();
      if(!v){ el.style.display = 'none'; return; }
      el.style.display = '';
      el.setAttribute('href', (el.getAttribute('data-setting-prefix') || '') + v);
    });
    document.querySelectorAll('[data-setting-text]').forEach(function(el){
      const k = el.getAttribute('data-setting-text');
      if(k in st && st[k].trim()) el.textContent = st[k];
    });
    const place = (st['map.place'] || '').trim();
    if(place){
      const q = encodeURIComponent(place);
      document.querySelectorAll('[data-setting-map="embed"]').forEach(function(el){
        const src = 'https://www.google.com/maps?q=' + q + '&hl=en&z=17&output=embed';
        if(el.getAttribute('src') !== src) el.setAttribute('src', src);   /* ตั้งซ้ำค่าเดิม = แผนที่กะพริบโหลดใหม่ */
      });
      document.querySelectorAll('[data-setting-map="directions"]').forEach(function(el){
        el.setAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=' + q);
      });
    }
    /* site.js (เพลง) รอ event นี้อยู่ */
    document.dispatchEvent(new CustomEvent('tefl:settings', { detail: st }));
  }

  /* ---------- ประกอบร่าง ---------- */

  /* ---------- ข้อความบรรยาย (blocks) ----------
     ต้องวางก่อนคอลเลกชันเสมอ เพราะการเขียนทับ innerHTML ของ section
     จะสร้างกรอบ data-cms ขึ้นใหม่แบบว่างเปล่า ถ้าคอลเลกชันเติมไปก่อนจะโดนลบทิ้ง */
  function renderBlocks(){
    const nodes = document.querySelectorAll('[data-cms-block]');
    if(!nodes.length) return Promise.resolve();
    return get('blocks').then(function(rows){
      const map = {};
      rows.forEach(function(r){ map[r.key] = r.html; });
      nodes.forEach(function(n){
        const html = map[n.getAttribute('data-cms-block')];
        if(html != null) n.innerHTML = html;
      });
    });
  }

  /* โหลดเฉพาะตารางที่หน้านี้ใช้จริง — ไม่ต้องยิงครบ 8 ตารางทุกหน้า */
  function need(hook){ return !!document.querySelector('[data-cms^="' + hook + '"]'); }

  function renderCollections(){
  const jobs = [];

  if(need('staff')){
    jobs.push(get('staff').then(function(rows){
      const lead = rows.filter(function(r){ return r.is_lead; });
      const rest = rows.filter(function(r){ return !r.is_lead; });
      const box = document.querySelector('[data-cms="staff-lead"]');
      if(box && lead.length) box.innerHTML = staffLead(lead[0]);
      fill('staff-grid', rest, staffCard);
    }));
  }

  if(need('lecturers')){
    jobs.push(get('lecturers').then(function(rows){
      fill('lecturers', rows, lecturerCard);
    }));
  }

  if(need('faqs')){
    jobs.push(get('faqs').then(function(rows){
      ['home', 'applicants', 'students'].forEach(function(cat){
        fill('faqs-' + cat, rows.filter(function(r){ return r.category === cat; }), faqItem);
      });
    }));
  }

  if(need('news')){
    jobs.push(get('news').then(function(rows){
      const home = rows.filter(function(r){ return r.placement === 'home'; });
      /* หน้าแรกโชว์แค่ N ใบแรก (ค่า news.home_count) ที่เหลือดูได้ที่หน้า Activities ส่วน Announcements ซึ่งโชว์ครบ
         settings โหลดขนานกับบล็อกไว้แล้ว ถึงตรงนี้จึงมีค่าให้ใช้ */
      const st = window.TEFLSettings || {};
      const n = parseInt(st['news.home_count'], 10) || 6;
      fill('news-home', home.slice(0, n), newsCard);
      fill('news-all', home, newsCard);
      fill('news-activities', rows.filter(function(r){ return r.placement === 'activities'; }), newsCard);
    }));
  }

  if(need('events')){
    jobs.push(get('events').then(function(rows){
      const box = document.querySelector('[data-cms="events"]');
      if(box && rows.length) box.innerHTML = renderEvents(rows);
    }));
  }

  if(need('links')){
    jobs.push(get('links').then(function(rows){
      fill('links-form', rows.filter(function(r){ return r.kind === 'form'; }), formCard);
      fill('links-useful', rows.filter(function(r){ return r.kind === 'useful'; }), usefulCard);
    }));
  }

  if(need('courses')){
    jobs.push(get('courses').then(function(rows){
      /* ตารางรายวิชามีหลายกลุ่ม (Plan A / Plan B) แต่ละ tbody บอกกลุ่มของตัวเองไว้ */
      document.querySelectorAll('[data-cms="courses"]').forEach(function(body){
        const group = body.getAttribute('data-group');
        const list = rows.filter(function(r){ return r.group_name === group; });
        if(list.length) body.innerHTML = list.map(courseRow).join('');
      });
    }));
  }

  if(need('tuition')){
    jobs.push(get('tuition').then(function(rows){
      fill('tuition', rows, tuitionRow);
    }));
  }

    return Promise.allSettled(jobs);
  }

  /* บล็อกก่อน แล้วค่อยคอลเลกชัน — ลำดับนี้ห้ามสลับ (ดูเหตุผลที่ renderBlocks)
     ถ้าโหลดบล็อกไม่สำเร็จก็ยังเดินต่อไปโหลดคอลเลกชัน เพราะ HTML เดิมในไฟล์ยังใช้ได้ */
  /* เมนูกับ settings โหลดขนานกับบล็อกได้ แต่ต้อง "ใส่" หลังบล็อก:
     footer เป็นบล็อก ถ้าใส่ค่าโซเชียลก่อนแล้วบล็อกมาเขียนทับ ค่าก็หายไปด้วย */
  const quiet = function(tag){ return function(e){ console.warn('[cms] ' + tag + ' โหลดไม่สำเร็จ:', e); return null; }; };
  let navRows = null, settingRows = null;

  Promise.all([
    renderBlocks().catch(function(e){ console.warn('[cms] โหลดข้อความไม่สำเร็จ ใช้ของในไฟล์แทน:', e); }),
    get('nav').then(function(r){ navRows = r; }).catch(quiet('เมนู')),
    get('settings').then(function(r){
      settingRows = r;
      /* ประกาศค่าไว้ก่อนให้คอลเลกชันใช้ (เช่น news.home_count) ส่วนการ "ใส่ลง DOM" ยังรอหลังบล็อกเหมือนเดิม */
      const st = {}; r.forEach(function(x){ st[x.key] = x.value == null ? '' : String(x.value); });
      window.TEFLSettings = st;
    }).catch(quiet('settings'))
  ])
    .then(function(){
      if(navRows) renderNav(navRows);
      /* section.hero ถูกเขียนทับทั้งก้อน สคริปต์สไลด์ในหน้าแรกจึงถือ element ชุดเก่าที่หลุดจากหน้าไปแล้ว
         ต้องบอกให้ผูกกับชุดใหม่ ไม่งั้นสไลด์ค้างใบแรกแบบไม่มี error ให้เห็น
         (บล็อกอื่นที่มีสคริปต์ผูกอยู่ก็ต้องมี hook แบบนี้เหมือนกัน) */
      if(typeof window.TEFLHeroRebind === 'function') window.TEFLHeroRebind();
      /* section.news-carousel ก็โดนเขียนทับเหมือนกัน ปุ่มลูกศร/จุดไข่ปลาจึงต้องผูกใหม่
         (initCarousels มีเครื่องหมายกันผูกซ้ำอยู่แล้ว เรียกซ้ำได้ปลอดภัย) */
      if(typeof window.TEFLCarouselInit === 'function') window.TEFLCarouselInit();
    })
    .then(renderCollections)
    .then(function(results){
      /* การ์ดสไลด์ถูกสร้างใหม่หมด — ต้องบอก site.js ให้คำนวณจุดไข่ปลาและปุ่มลูกศรใหม่
         site.js ผูก buildDots ไว้กับ resize อยู่แล้ว ยิง event นี้จึงพอ ไม่ต้อง init ซ้ำ
         (ถ้า init ซ้ำจะได้ listener ซ้อนกันทุกครั้งที่โหลด) */
      if(need('news')) window.dispatchEvent(new Event('resize'));

      /* ใส่ค่าการเชื่อมต่อหลังสุด เพราะเป้าหมายบางตัวเพิ่งถูกสร้างโดยบล็อก (footer) */
      if(settingRows) applySettings(settingRows);

      /* หัวข้อ section ลิงก์ในเมนู และ footer เปลี่ยนไปแล้ว ดัชนีค้นหาที่ site.js
         สร้างไว้ตอนโหลดจึงเป็นของเก่า ต้องสั่งสร้างใหม่ */
      if(typeof window.TEFLSearchReindex === 'function') window.TEFLSearchReindex();

      (results || []).forEach(function(r){
        if(r.status === 'rejected'){
          /* ล้มก็แค่ปล่อยเนื้อหาเดิมในไฟล์ไว้ ไม่ต้องรบกวนผู้ชม */
          console.warn('[cms] โหลดไม่สำเร็จ ใช้เนื้อหาสำรองในไฟล์แทน:', r.reason);
        }
      });
    });
})();
