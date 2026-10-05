-- Contact: ฟอร์มซ้าย + การ์ดข้อมูลติดต่อเข้มขวา + แผนที่ล่าง (ต.ค. 2026)
-- รันใน Supabase → SQL Editor ครั้งเดียว (รันซ้ำได้ ไม่ error ไม่ซ้ำ)
--
-- บล็อกเดิม contact/contact-details มีทั้งการ์ด ฟอร์ม และแผนที่อยู่ในก้อนเดียว — cms.js เขียนทับหลังโหลด
-- ทำให้สคริปต์ฟอร์มใน contact.html ผูกกับฟอร์มเก่าที่ถูกแทนไปแล้ว (กดส่งแล้วไม่ตรวจ/ไม่ส่ง)
-- ตอนนี้ฟอร์มกับแผนที่อยู่ในไฟล์ตรง ๆ เหลือในฐานข้อมูลแค่การ์ดขวา = บล็อกใหม่ contact/contact-card
-- ก่อนรันไฟล์นี้หน้าเว็บก็ใช้ได้อยู่แล้ว (cms.js ไม่เจอ key ใหม่ จะคงของในไฟล์ไว้) — รันเพื่อให้แก้การ์ดได้ใน /admin
begin;

insert into blocks (key, page, label, html, sort_order)
select 'contact/contact-card', 'contact.html', 'การ์ดข้อมูลติดต่อ (ที่อยู่ เบอร์ อีเมล เว็บไซต์ โซเชียล)',
       $tefl$
          <div class="cc-group">
            <h4>Address</h4>
            <p>Faculty of Education, Chulalongkorn University<br>254 Phayathai Road, Wang Mai,<br>Pathum Wan, Bangkok 10330</p>
          </div>
          <div class="cc-group">
            <h4>Contact</h4>
            <p>
              Phone : <a href="tel:+6622182565">(662) 218-2565-97</a> ext. 8143<br>
              Fax : (662) 218-2563<br>
              Email : <a href="mailto:TEFL.Chula@gmail.com" data-setting-href="contact.email" data-setting-prefix="mailto:" data-setting-text="contact.email">TEFL.Chula@gmail.com</a>
            </p>
          </div>
          <div class="cc-group">
            <h4>Website</h4>
            <p><a href="https://www.edu.chula.ac.th/" target="_blank" rel="noopener">edu.chula.ac.th</a></p>
          </div>
          <div class="cc-group">
            <h4>Stay Connected</h4>
              <div class="ci-social">
                <a href="https://www.facebook.com/TEFL.Chula/" class="is-fb" data-setting-href="social.facebook" aria-label="Facebook" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z"/></svg>
                </a>
                <a href="#" class="is-line" data-setting-href="social.line" aria-label="LINE">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2C6.6 3.2 2.2 6.7 2.2 11c0 3.85 3.48 7.08 8.18 7.69.32.07.75.21.86.49.1.25.06.64.03.89l-.14.85c-.04.25-.2.97.85.53s5.65-3.33 7.7-5.7c1.42-1.56 2.1-3.15 2.1-4.75 0-4.3-4.4-7.8-9.78-7.8z"/></svg>
                </a>
                <a href="https://www.instagram.com/p/DbiparfD3FO/?img_index=18" class="is-ig" data-setting-href="social.instagram" aria-label="Instagram" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>
                </a>
              </div>
          </div>
        $tefl$,
       coalesce((select sort_order from blocks where key = 'contact/contact-details'), 2)
on conflict (key) do update set html = excluded.html, updated_at = now();

delete from blocks where key = 'contact/contact-details';

commit;
