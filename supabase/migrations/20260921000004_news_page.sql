-- =========================================================
-- หน้า News & Events (news.html) + ปฏิทินกิจกรรม + ให้ผู้ดูแลแก้ token ของเพจได้เอง
--
-- 1. integrations — ค่าลับที่ผู้ดูแลแก้ได้จาก /admin (token ของเพจ, Page ID)
--    แยกจาก settings เพราะ settings เปิดให้คนทั่วไปอ่านได้ตาม policy
--    ตารางนี้ "ไม่มี" policy ให้ anon เลย: อ่าน/เขียนได้เฉพาะผู้ดูแล ส่วน Edge Function
--    อ่านด้วย service role (ข้าม RLS) — token จึงไม่มีทางไปโผล่ในเว็บสาธารณะ
-- 2. events — ปฏิทินกิจกรรม (หน้า News → Event Calendar)
-- 3. ค่าตั้งใหม่ news.home_count และปรับ facebook.sync_count ให้ดึงได้ถึง 50
-- 4. เมนู News (ระดับบน + 2 รายการย่อย) และบล็อกข้อความของหน้า news.html
-- =========================================================

-- ---------- 1. integrations ----------
create table public.integrations (
  key         text primary key,
  label       text not null,
  hint        text,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);
alter table public.integrations enable row level security;
create policy integrations_admin on public.integrations
  for all to authenticated using (private.is_admin()) with check (private.is_admin());
create trigger integrations_touch before update on public.integrations for each row execute function public.touch_updated_at();

insert into public.integrations (key, label, hint, value) values
  ('facebook.token', 'Page Access Token', 'token ของเพจจาก Meta for Developers (ต้องมีสิทธิ์ pages_read_engagement + pages_read_user_content) — ว่างไว้ = ใช้ค่าจาก secret FB_PAGE_TOKEN ของฟังก์ชัน', ''),
  ('facebook.page_id', 'Page ID', 'เว้นว่างได้ ระบบจะใช้เพจของ token นั้นเอง ใส่เมื่อ token เป็นของผู้ใช้ที่ดูแลหลายเพจ', '')
on conflict (key) do nothing;

-- ---------- 2. events ----------
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  starts_on   date not null,
  ends_on     date,
  time_text   text,
  location    text,
  description text,
  url         text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index events_start_idx on public.events (starts_on);
alter table public.events enable row level security;
create policy events_read_public  on public.events for select to anon          using (is_visible);
create policy events_read_admin   on public.events for select to authenticated using (private.is_admin());
create policy events_insert_admin on public.events for insert to authenticated with check (private.is_admin());
create policy events_update_admin on public.events for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy events_delete_admin on public.events for delete to authenticated using (private.is_admin());
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();

-- ตัวอย่างสองรายการจากโพสต์จริงของเพจ ให้หน้าไม่ว่างตอนเปิดครั้งแรก — แก้/ลบได้ใน /admin
insert into public.events (title, starts_on, ends_on, time_text, location, description, url, sort_order) values
  ('TEFL Graduation Party', '2026-09-12', null, null, 'Faculty of Education',
   'Celebrating our master''s and undergraduate graduates with lecturers, friends and family.', null, 0),
  ('TEFL Study Base', '2026-09-23', null, 'Every Wednesday & Friday, 9:00 AM – 6:00 PM', 'TEFL Study Base',
   'A quiet space for focused study and group work. Drop in any open day.', null, 1);

-- ---------- 3. ค่าตั้ง ----------
insert into public.settings (key, label, hint, value, kind, sort_order) values
  ('news.home_count', 'จำนวนข่าวบนสไลด์หน้าแรก',
   'หน้าแรกโชว์ข่าวกี่ใบแรก (ทั้งจาก Facebook และที่พิมพ์เอง) ส่วนหน้า News แสดงครบทุกใบ', '6', 'text', 15)
on conflict (key) do nothing;
update public.settings set
  hint = 'ดึงมากี่โพสต์ล่าสุด (1–50) โพสต์ที่เก่ากว่านั้นจะถูกเอาออกจากเว็บเอง ข่าวที่พิมพ์เองไม่ถูกแตะ',
  value = case when value = '6' then '12' else value end
where key = 'facebook.sync_count';

-- ---------- 4. เมนูและบล็อกของหน้า News ----------
-- เมนู News อยู่ต่อจาก Activities: ขยับสามรายการหลังจากนั้นลงหนึ่งช่องก่อน
update public.nav set sort_order = sort_order + 1 where parent_id is null and sort_order >= 5;
with top as (
  insert into public.nav (parent_id, label, href, dd_title, sort_order) values (null, 'News', 'news.html', 'News & Events', 5)
  returning id
)
insert into public.nav (parent_id, label, href, sort_order)
select id, 'Announcements', 'news.html#announcements', 0 from top
union all
select id, 'Event Calendar', 'news.html#calendar', 1 from top;
-- รายการย่อย "News & Events" ใต้ Activities เคยชี้ไปสไลด์หน้าแรก ให้ชี้หน้าใหม่แทน
update public.nav set href = 'news.html' where href = 'index.html#news';

-- ปุ่ม View All บนสไลด์หน้าแรกเคยเป็น # ให้ไปหน้า News · footer เพิ่มลิงก์ News & Events เหนือ FAQs
update public.blocks set html = replace(html, '<a href="#" class="btn-base is-outline is-sm">View All', '<a href="news.html" class="btn-base is-outline is-sm">View All')
where key = 'index/news';
update public.blocks set html = replace(html, '<li><a href="faqs.html">FAQs</a></li>', '<li><a href="news.html">News &amp; Events</a></li>
            <li><a href="faqs.html">FAQs</a></li>')
where key = 'site/footer-cols' and html not like '%href="news.html"%';

insert into public.blocks (key, page, label, html, sort_order, is_visible, updated_at) values
  ('news/page-banner', 'news.html', 'แบนเนอร์หัวหน้า — News & Events', $b$<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">News &amp; Events</span>
      </nav>
      <h1>News &amp; Events</h1>
      <p class="subtitle">Announcements from the program and a calendar of upcoming activities, talks and important dates.</p>
    </div>$b$, 0, true, now()),
  ('news/announcements', 'news.html', 'Announcements (หัวข้อ + คำอธิบาย)', $b$<div class="eyebrow">Stay Updated</div>
        <span class="rule"></span>
        <h2>Announcements</h2>
        <p>
          The latest news from the TEFL Program &mdash; updated from our Facebook page.
          Follow the page for photos and full stories.
        </p>
        <div class="news-grid" data-cms="news-all"></div>
        <p class="news-more">
          <a href="https://www.facebook.com/TEFL.Chula/" class="btn-base is-outline" data-setting-href="social.facebook" target="_blank" rel="noopener">FOLLOW US ON FACEBOOK<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </p>$b$, 1, true, now()),
  ('news/calendar', 'news.html', 'Event Calendar (หัวข้อ + คำอธิบาย)', $b$<div class="eyebrow">Mark Your Calendar</div>
        <span class="rule"></span>
        <h2>Event Calendar</h2>
        <p>
          Upcoming activities, talks and key dates for students and applicants.
          Dates may change &mdash; check back or follow our page for updates.
        </p>
        <div class="ev-list" data-cms="events"></div>$b$, 2, true, now()),
  ('news/cta-band', 'news.html', 'แถบชวนสมัครท้ายหน้า', $b$<div class="cta-bg" aria-hidden="true">
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
      <h3>Want to Join Us?</h3>
      <p>Explore the curriculum and admissions information for the next intake.</p>
      <a href="academics.html" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>$b$, 3, true, now())
on conflict (key) do nothing;
