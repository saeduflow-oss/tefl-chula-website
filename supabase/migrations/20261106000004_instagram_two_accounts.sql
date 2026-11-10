-- =========================================================
-- Instagram แยกเป็น 2 บัญชี: ป.ตรี กับ ป.โท (พ.ย. 2026)
-- ทำไม: หลักสูตรมี IG สองบัญชี ช่องเดิม social.instagram ชี้ไปโพสต์เดียว ไม่ใช่บัญชี
--   social.instagram           → บัญชี ป.โท  https://www.instagram.com/tefl.chulalongkorn_university/
--   social.instagram_bachelor  → บัญชี ป.ตรี (ยังไม่มีลิงก์ — เว้นว่าง = ไอคอนถูกซ่อน ใส่ได้ที่ /admin → ข้อมูลติดต่อและลิงก์)
-- ไอคอนสองอันหน้าตาเหมือนกัน จึงมีป้าย B.Ed. / M.Ed. ใต้ไอคอน (data-badge) — สไตล์อยู่ใน site.css
-- html ต้องตรงกับ footer ในไฟล์ทั้ง 10 หน้า ไม่งั้น cms.js จะเอาของเดิมกลับมาทับ
-- การ์ดหน้า Contact (contact/contact-card) แก้ใน supabase/content/2026-10-contact-card.sql แล้ว
-- รันซ้ำได้: replace ไม่เจอข้อความเดิมก็ไม่ทำอะไร · insert เช็กก่อน
-- =========================================================

-- ---------- 1. ค่าตั้ง ----------
update public.settings
   set label = 'Instagram (ป.โท)',
       hint = 'URL เต็มของบัญชี IG ปริญญาโท — เว้นว่างแล้วไอคอนจะถูกซ่อน',
       value = 'https://www.instagram.com/tefl.chulalongkorn_university/'
 where key = 'social.instagram';

insert into public.settings (key, label, hint, value, kind, sort_order)
select 'social.instagram_bachelor', 'Instagram (ป.ตรี)',
       'URL เต็มของบัญชี IG ปริญญาตรี — เว้นว่างแล้วไอคอนจะถูกซ่อน', '', 'url', 13
where not exists (select 1 from public.settings where key = 'social.instagram_bachelor');

-- ---------- 2. ไอคอนใน footer ทุกหน้า ----------
update public.blocks
   set html = replace(html, $b$          <a href="https://www.instagram.com/p/DbiparfD3FO/?img_index=18" class="is-ig" data-setting-href="social.instagram" aria-label="Instagram" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>
          </a>$b$, $b$          <a href="#" class="is-ig" data-setting-href="social.instagram_bachelor" data-badge="B.Ed." aria-label="Instagram — Bachelor&rsquo;s Degree" title="Bachelor&rsquo;s Degree" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>
          </a>
          <a href="https://www.instagram.com/tefl.chulalongkorn_university/" class="is-ig" data-setting-href="social.instagram" data-badge="M.Ed." aria-label="Instagram — Master&rsquo;s Degree" title="Master&rsquo;s Degree" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>
          </a>$b$),
       updated_at = now()
 where key = 'site/footer-bottom';
