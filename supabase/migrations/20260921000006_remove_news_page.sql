-- =========================================================
-- ยุบหน้า News & Events (news.html) — ย้าย Announcements และ Event Calendar ไปไว้ท้ายหน้า Activities
--
-- ทำไม: หน้าน้อยลง คนไม่ต้องไล่หาว่าโพสต์อยู่หน้าไหน (ตัดสินใจ 21 ก.ย. 2569)
-- ตาราง events / integrations / ค่าตั้ง news.home_count ยังอยู่เหมือนเดิม เปลี่ยนแค่ "ที่แสดง"
-- ไฟล์ news.html ถูกลบออกจาก repo และ vercel.json redirect ลิงก์เก่าไป activities.html#announcements
-- =========================================================

-- ---------- 1. เมนู ----------
-- เมนู News ระดับบนออก (รายการย่อยหายตามด้วย on delete cascade) แล้วขยับสามรายการหลังจากนั้นขึ้นมาหนึ่งช่อง
delete from public.nav where parent_id is null and href = 'news.html';
update public.nav set sort_order = sort_order - 1 where parent_id is null and sort_order >= 6;

-- รายการย่อยใต้ Activities: "News & Events" → "Announcements" และเพิ่ม "Event Calendar" ต่อท้าย
update public.nav set label = 'Announcements', href = 'activities.html#announcements'
where parent_id is not null and href = 'news.html';
insert into public.nav (parent_id, label, href, sort_order)
select id, 'Event Calendar', 'activities.html#calendar', 3 from public.nav where parent_id is null and href = 'activities.html'
  and not exists (select 1 from public.nav where href = 'activities.html#calendar');

-- ---------- 2. บล็อกข้อความ ----------
-- สองบล็อกเนื้อหาย้ายไปต่อท้ายหน้า Activities (ก่อนแถบ CTA) แบนเนอร์และ CTA ของหน้า News ทิ้ง
update public.blocks set key = 'activities/announcements', page = 'activities.html', sort_order = 3 where key = 'news/announcements';
update public.blocks set key = 'activities/calendar',      page = 'activities.html', sort_order = 4 where key = 'news/calendar';
update public.blocks set sort_order = 5 where key = 'activities/cta-band';
delete from public.blocks where key in ('news/page-banner', 'news/cta-band');

-- ปุ่ม View All บนสไลด์หน้าแรก และลิงก์ News & Events ใน footer ชี้ไปที่ใหม่
update public.blocks set html = replace(html, 'href="news.html"', 'href="activities.html#announcements"')
where key in ('index/news', 'site/footer-cols') and html like '%href="news.html"%';

-- ---------- 3. คำอธิบายค่าตั้ง ----------
update public.settings set hint = replace(hint, 'ส่วนหน้า News แสดงครบทุกใบ', 'ส่วนหน้า Activities (Announcements) แสดงครบทุกใบ')
where key = 'news.home_count';

