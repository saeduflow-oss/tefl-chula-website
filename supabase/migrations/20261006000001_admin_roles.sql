-- หน้า "ผู้ดูแลระบบ" ใน /admin: ชื่อ · บทบาท · เปิด/ปิดใช้งาน (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ครั้งเดียว (รันซ้ำได้ ไม่ error)
--
-- บทบาท 2 แบบ:
--   admin  = ผู้ดูแลระบบ — แก้เนื้อหาได้ + จัดการรายชื่อผู้ดูแล (เพิ่ม ลบ เปลี่ยนบทบาท ปิดใช้งาน)
--   editor = ผู้แก้ไขเนื้อหา — แก้เนื้อหาได้อย่างเดียว เห็นรายชื่อแต่แก้ไม่ได้
-- ปิดใช้งาน (is_active = false) = เข้าระบบได้แต่แก้/อ่านข้อมูลหลังบ้านไม่ได้เลย เพราะ private.is_admin() ตอบ false
-- สิทธิ์ทั้งหมดบังคับที่ฐานข้อมูล ไม่ใช่ที่หน้า admin — แก้ JavaScript ในเบราว์เซอร์ก็ข้ามไม่ได้
-- แถวเดิมทุกแถวกลายเป็น admin + active (คนที่ใช้อยู่ตอนนี้จึงไม่เสียสิทธิ์)
begin;

alter table public.admins add column if not exists full_name  text;
alter table public.admins add column if not exists role       text        not null default 'admin';
alter table public.admins add column if not exists is_active  boolean     not null default true;
alter table public.admins add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'admins_role_check') then
    alter table public.admins add constraint admins_role_check check (role in ('admin', 'editor'));
  end if;
end
$$;

drop trigger if exists admins_touch on public.admins;
create trigger admins_touch before update on public.admins
  for each row execute function public.touch_updated_at();

-- ทุก policy ของตารางเนื้อหาเรียกฟังก์ชันนี้ — เพิ่มเงื่อนไข is_active จึงปิดสิทธิ์คนที่ถูกปิดใช้งานได้ทั้งระบบในจุดเดียว
create or replace function private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and a.is_active
  );
$$;

-- จัดการรายชื่อผู้ดูแลได้เฉพาะบทบาท admin ที่ยังใช้งานอยู่
create or replace function private.is_owner()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and a.is_active and a.role = 'admin'
  );
$$;

drop policy if exists admins_self   on public.admins;
drop policy if exists admins_read   on public.admins;
drop policy if exists admins_insert on public.admins;
drop policy if exists admins_update on public.admins;
drop policy if exists admins_delete on public.admins;
create policy admins_read   on public.admins for select to authenticated using (private.is_admin());
create policy admins_insert on public.admins for insert to authenticated with check (private.is_owner());
create policy admins_update on public.admins for update to authenticated using (private.is_owner()) with check (private.is_owner());
create policy admins_delete on public.admins for delete to authenticated using (private.is_owner());

-- กันล็อกตัวเองออกทั้งระบบ: หลังแก้/ลบทุกครั้งต้องเหลือ admin ที่ใช้งานอยู่อย่างน้อย 1 คน ไม่งั้นยกเลิกทั้งคำสั่ง
create or replace function private.keep_one_admin()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.admins where role = 'admin' and is_active) then
    raise exception 'ต้องเหลือผู้ดูแลระบบ (admin) ที่ใช้งานอยู่อย่างน้อย 1 คน';
  end if;
  return null;
end
$$;
drop trigger if exists admins_keep_one on public.admins;
create trigger admins_keep_one after update or delete on public.admins
  for each statement execute function private.keep_one_admin();

commit;
