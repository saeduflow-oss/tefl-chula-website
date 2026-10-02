-- Event Calendar: เพิ่มวันพระราชทานปริญญาบัตร 30 ก.ย. – 2 ต.ค. 2026 (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ครั้งเดียว — หรือเพิ่มเองใน /admin → กิจกรรม ก็ได้ผลเท่ากัน
-- source = 'chula' เพราะผู้จัดคือมหาวิทยาลัย (ต้องตรงกับ check constraint ของ events.source)
-- กันรันซ้ำ: ไม่เพิ่มถ้ามีแถวชื่อเดียวกันวันเริ่มเดียวกันอยู่แล้ว
begin;

insert into events (title, starts_on, ends_on, location, description, source, sort_order, is_visible)
select 'Graduation Ceremony', '2026-09-30', '2026-10-02', 'Chulalongkorn University',
       'Chulalongkorn University''s commencement, conferring degrees on this year''s graduates.',
       'chula', 2, true
where not exists (
  select 1 from events where title = 'Graduation Ceremony' and starts_on = '2026-09-30'
);

commit;
