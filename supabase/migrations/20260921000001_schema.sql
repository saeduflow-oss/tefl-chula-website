-- =========================================================
-- supabase/schema.sql — โครงสร้างฐานข้อมูล CMS ของเว็บ TEFL Chula
--
-- ใช้เมื่อ: ตั้งโปรเจกต์ Supabase ใหม่ (วางทั้งไฟล์ใน SQL Editor แล้วรัน)
-- รันซ้ำไม่ได้ — ตั้งใจให้ error ถ้าตารางมีอยู่แล้ว กันเผลอทับของจริง
-- ต่อด้วย supabase/migrations/20260921000002_data.sql เพื่อใส่เนื้อหา แล้วดู "ขั้นตอนหลังรัน" ท้ายไฟล์นี้
--
-- ถอดมาจากโปรเจกต์ tefl-chula-website (pxwvughjkuklefkqrrea) วันที่ 21 ก.ย. 2569
-- ให้ตรงกับ DESIGN.md §9 — แก้ที่นี่ต้องแก้เอกสารด้วย
-- =========================================================

-- ---------- 1. trigger ตั้ง updated_at ให้เอง ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin new.updated_at = now(); return new; end
$$;

-- ---------- 2. รายชื่อผู้ดูแล ----------
-- Supabase เปิดให้สมัครสมาชิกเองด้วย publishable key ตามค่าเริ่มต้น
-- policy จึงห้ามเชื่อแค่ role = authenticated ต้องเช็กกับตารางนี้เสมอ
-- ตารางนี้ต้องมาก่อนฟังก์ชัน is_admin เพราะฟังก์ชัน language sql ถูกตรวจตอนสร้าง
-- ถ้าตารางยังไม่มีจะ error "relation does not exist" ทันที (เจอจากการทดสอบ)
create table public.admins (
  email       text primary key,
  note        text,
  created_at  timestamptz not null default now()
);

-- ---------- 3. ฟังก์ชันสิทธิ์ ----------
-- อยู่ใน schema "private" ที่ PostgREST ไม่เปิดเป็น API
-- (ถ้าอยู่ใน public จะถูกเรียกจากภายนอกผ่าน /rest/v1/rpc/ ได้)
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admins enable row level security;
create policy admins_self on public.admins
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- ---------- 4. ตารางเนื้อหา ----------

create table public.staff (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  ext         text,
  photo       text,
  is_lead     boolean not null default false,
  badge       text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index staff_sort_idx on public.staff (sort_order);
alter table public.staff enable row level security;
create policy staff_read_public  on public.staff for select to anon          using (is_visible);
create policy staff_read_admin   on public.staff for select to authenticated using (private.is_admin());
create policy staff_insert_admin on public.staff for insert to authenticated with check (private.is_admin());
create policy staff_update_admin on public.staff for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy staff_delete_admin on public.staff for delete to authenticated using (private.is_admin());
create trigger staff_touch before update on public.staff for each row execute function public.touch_updated_at();

create table public.lecturers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  course      text,
  when_text   text,
  badge       text,
  photo       text,
  url         text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index lecturers_sort_idx on public.lecturers (sort_order);
alter table public.lecturers enable row level security;
create policy lecturers_read_public  on public.lecturers for select to anon          using (is_visible);
create policy lecturers_read_admin   on public.lecturers for select to authenticated using (private.is_admin());
create policy lecturers_insert_admin on public.lecturers for insert to authenticated with check (private.is_admin());
create policy lecturers_update_admin on public.lecturers for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy lecturers_delete_admin on public.lecturers for delete to authenticated using (private.is_admin());
create trigger lecturers_touch before update on public.lecturers for each row execute function public.touch_updated_at();

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('home','applicants','students')),
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index faqs_sort_idx on public.faqs (sort_order);
alter table public.faqs enable row level security;
create policy faqs_read_public  on public.faqs for select to anon          using (is_visible);
create policy faqs_read_admin   on public.faqs for select to authenticated using (private.is_admin());
create policy faqs_insert_admin on public.faqs for insert to authenticated with check (private.is_admin());
create policy faqs_update_admin on public.faqs for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy faqs_delete_admin on public.faqs for delete to authenticated using (private.is_admin());
create trigger faqs_touch before update on public.faqs for each row execute function public.touch_updated_at();

create table public.news (
  id          uuid primary key default gen_random_uuid(),
  placement   text not null check (placement in ('home','activities')),
  title       text not null,
  tag         text,
  image       text,
  url         text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index news_sort_idx on public.news (sort_order);
alter table public.news enable row level security;
create policy news_read_public  on public.news for select to anon          using (is_visible);
create policy news_read_admin   on public.news for select to authenticated using (private.is_admin());
create policy news_insert_admin on public.news for insert to authenticated with check (private.is_admin());
create policy news_update_admin on public.news for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy news_delete_admin on public.news for delete to authenticated using (private.is_admin());
create trigger news_touch before update on public.news for each row execute function public.touch_updated_at();

create table public.links (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('form','useful')),
  label       text,
  title       text not null,
  meta        text,
  url         text not null,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now(),
  icon        text not null default 'link'
);
create index links_sort_idx on public.links (sort_order);
alter table public.links enable row level security;
create policy links_read_public  on public.links for select to anon          using (is_visible);
create policy links_read_admin   on public.links for select to authenticated using (private.is_admin());
create policy links_insert_admin on public.links for insert to authenticated with check (private.is_admin());
create policy links_update_admin on public.links for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy links_delete_admin on public.links for delete to authenticated using (private.is_admin());
create trigger links_touch before update on public.links for each row execute function public.touch_updated_at();

create table public.courses (
  id          uuid primary key default gen_random_uuid(),
  group_name  text not null,
  code        text,
  title       text not null,
  credits     text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index courses_sort_idx on public.courses (sort_order);
alter table public.courses enable row level security;
create policy courses_read_public  on public.courses for select to anon          using (is_visible);
create policy courses_read_admin   on public.courses for select to authenticated using (private.is_admin());
create policy courses_insert_admin on public.courses for insert to authenticated with check (private.is_admin());
create policy courses_update_admin on public.courses for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy courses_delete_admin on public.courses for delete to authenticated using (private.is_admin());
create trigger courses_touch before update on public.courses for each row execute function public.touch_updated_at();

create table public.tuition (
  id                  uuid primary key default gen_random_uuid(),
  group_name          text not null,
  student_group       text not null,
  part_university     text,
  part_faculty        text,
  total_per_semester  text,
  sort_order          integer not null default 0,
  is_visible          boolean not null default true,
  updated_at          timestamptz not null default now()
);
create index tuition_sort_idx on public.tuition (sort_order);
alter table public.tuition enable row level security;
create policy tuition_read_public  on public.tuition for select to anon          using (is_visible);
create policy tuition_read_admin   on public.tuition for select to authenticated using (private.is_admin());
create policy tuition_insert_admin on public.tuition for insert to authenticated with check (private.is_admin());
create policy tuition_update_admin on public.tuition for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy tuition_delete_admin on public.tuition for delete to authenticated using (private.is_admin());
create trigger tuition_touch before update on public.tuition for each row execute function public.touch_updated_at();

create table public.blocks (
  key         text primary key,
  page        text not null,
  label       text not null,
  html        text not null,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index blocks_page_idx on public.blocks (page, sort_order);
alter table public.blocks enable row level security;
create policy blocks_read_public  on public.blocks for select to anon          using (is_visible);
create policy blocks_read_admin   on public.blocks for select to authenticated using (private.is_admin());
create policy blocks_insert_admin on public.blocks for insert to authenticated with check (private.is_admin());
create policy blocks_update_admin on public.blocks for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy blocks_delete_admin on public.blocks for delete to authenticated using (private.is_admin());
create trigger blocks_touch before update on public.blocks for each row execute function public.touch_updated_at();

create table public.nav (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.nav(id) on delete cascade,
  label       text not null,
  href        text not null,
  dd_title    text,
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
create index nav_parent_idx on public.nav (parent_id, sort_order);
alter table public.nav enable row level security;
create policy nav_read_public  on public.nav for select to anon          using (is_visible);
create policy nav_read_admin   on public.nav for select to authenticated using (private.is_admin());
create policy nav_insert_admin on public.nav for insert to authenticated with check (private.is_admin());
create policy nav_update_admin on public.nav for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy nav_delete_admin on public.nav for delete to authenticated using (private.is_admin());
create trigger nav_touch before update on public.nav for each row execute function public.touch_updated_at();

create table public.settings (
  key         text primary key,
  label       text not null,
  hint        text,
  value       text not null default '',
  kind        text not null default 'text' check (kind in ('text','url','email','bool')),
  sort_order  integer not null default 0,
  is_visible  boolean not null default true,
  updated_at  timestamptz not null default now()
);
alter table public.settings enable row level security;
create policy settings_read_public  on public.settings for select to anon          using (is_visible);
create policy settings_read_admin   on public.settings for select to authenticated using (private.is_admin());
create policy settings_insert_admin on public.settings for insert to authenticated with check (private.is_admin());
create policy settings_update_admin on public.settings for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy settings_delete_admin on public.settings for delete to authenticated using (private.is_admin());
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- ---------- 5. ที่เก็บรูปที่อัปโหลดผ่าน /admin ----------
-- สาธารณะ อ่านได้ทุกคน · จำกัด 5 MB · รับเฉพาะไฟล์ภาพ · เขียนได้เฉพาะผู้ดูแล
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']);

create policy media_read_public  on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy media_insert_admin on storage.objects for insert to authenticated with check (bucket_id = 'media' and private.is_admin());
create policy media_update_admin on storage.objects for update to authenticated using (bucket_id = 'media' and private.is_admin()) with check (bucket_id = 'media' and private.is_admin());
create policy media_delete_admin on storage.objects for delete to authenticated using (bucket_id = 'media' and private.is_admin());

-- =========================================================
-- ขั้นตอนหลังรัน (ทำใน Supabase Dashboard ของโปรเจกต์ใหม่)
--   1. รัน 20260921000002_data.sql ต่อ (supabase db push ทำให้เองอยู่แล้ว) เพื่อใส่เนื้อหาและรายชื่อผู้ดูแล
--   2. Authentication → Users → Add user: สร้าง user ด้วยอีเมลเดียวกับที่อยู่ในตาราง admins
--      (auth.users ย้ายผ่าน SQL ไม่ได้ ต้องสร้างใหม่ที่นี่)
--   3. Project Settings → API: คัดลอก Project URL กับ publishable key
--      ไปแทนที่ใน cms.js, admin/index.html, sync-content.py
--   4. รัน python3 sync-content.py --check ต้องได้ "ตรงกับฐานข้อมูลอยู่แล้ว"
-- =========================================================
