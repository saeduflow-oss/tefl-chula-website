-- คอลัมน์ "ผู้แก้ไข" (updated_by) ของทุกตารางเนื้อหา — แสดงในหน้า /admin (หน้าเว็บ, ตารางรายการ, กล่องเผยแพร่) (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ครั้งเดียว (รันซ้ำได้ ไม่ error)
--
-- ฐานข้อมูลเป็นคนใส่ชื่อเอง ไม่ใช่หน้า admin: trigger อ่านชื่อจาก token ของคนที่บันทึก (ชื่อที่แสดงในโปรไฟล์ ไม่มีก็ใช้อีเมล)
-- หน้า admin จึงปลอมชื่อคนอื่นไม่ได้ และทุกช่องทางที่เขียนข้อมูลได้รับการบันทึกเหมือนกัน
-- ถ้าไม่มีผู้ใช้ (service role เช่น Edge Function fb-sync หรือรันใน SQL Editor) คงชื่อเดิมไว้
-- แถวที่แก้ก่อนรันไฟล์นี้ยังไม่มีชื่อ หน้า admin แสดง "—" จนกว่าจะมีคนแก้แถวนั้นครั้งถัดไป
begin;

create or replace function public.stamp_updated_by()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  who text := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'full_name', ''),
    nullif(auth.jwt() ->> 'email', ''));
begin
  if who is not null then
    new.updated_by := who;
  elsif tg_op = 'UPDATE' then
    new.updated_by := old.updated_by;   -- service role แก้: ไม่ลบชื่อคนแก้ล่าสุดทิ้ง
  end if;
  return new;
end
$$;

do $$
declare t text;
begin
  foreach t in array array['blocks','nav','settings','staff','lecturers','news','events','faqs','links','courses','tuition'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I add column if not exists updated_by text', t);
      execute format('drop trigger if exists %I on public.%I', t || '_author', t);
      execute format('create trigger %I before insert or update on public.%I for each row execute function public.stamp_updated_by()', t || '_author', t);
    end if;
  end loop;
end
$$;

commit;
