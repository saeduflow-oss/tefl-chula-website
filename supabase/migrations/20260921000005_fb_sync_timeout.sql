-- =========================================================
-- fb-sync-news: ขยาย timeout ของ pg_net จาก 5 วินาที เป็น 2 นาที
--
-- ทำไม: net.http_post ใช้ timeout_milliseconds ค่าเริ่มต้น 5000 แต่ fb-sync ต้องเรียก Graph API
-- แล้วคัดลอกรูปได้ถึง 12–50 รูปเข้า Storage ใช้เวลาเกิน 5 วินาทีเสมอ
-- ผลคือทุกรอบที่ cron เรียก จะถูกตัดสายก่อนฟังก์ชันทำเสร็จ (ดูได้ใน net._http_response:
-- "Timeout of 5000 ms reached", timed_out = true) — การดึงอัตโนมัติจึงไม่เคยสำเร็จเลย
-- ตรวจพบ 21 ก.ย. 2569 ตอนสั่ง sync ด้วยมือผ่านคำสั่งเดียวกับ cron
--
-- cron.schedule ชื่อเดิม = แทนที่งานเดิม (pg_cron ใช้ชื่อเป็นกุญแจ) ไม่ต้อง unschedule ก่อน
-- ส่ง action:"sync" ให้ชัดเจนด้วย (ค่าเริ่มต้นของฟังก์ชันคือ sync อยู่แล้ว แต่ระบุไว้อ่านง่ายกว่า)
-- =========================================================
select cron.schedule(
  'fb-sync-news',
  '0 */6 * * *',
  $$
  select net.http_post(
    url     := 'https://dpyhvsdtbihssapuwert.supabase.co/functions/v1/fb-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-sync-key', coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'fb_sync_key' limit 1), '')
    ),
    body    := '{"action":"sync"}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
