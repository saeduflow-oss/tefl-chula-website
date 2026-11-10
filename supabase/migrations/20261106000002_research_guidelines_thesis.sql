-- Guidelines for Research Procedures → Guidelines for Thesis Procedures (พ.ย. 2026)
-- เอาการ์ด 4 ขั้น (Proposal Defense / Collaboration Letters / Thesis Defense / Publication) ออก ใส่รูปผัง img/thesis-procedures.jpg แทน
-- ต้องตรงกับ research.html (section data-cms-block="research/research-guidelines") ไม่งั้น cms.js จะเอาการ์ดเดิมกลับมาทับ · รันซ้ำได้
update public.blocks
   set label = 'Guidelines for Thesis Procedures',
       html = $html$<div class="sec-head">
  <div class="eyebrow">Step by Step</div>
  <span class="rule"></span>
  <h2>Guidelines for Thesis Procedures</h2>
</div>
<figure class="thesis-flow">
  <img src="img/thesis-procedures.jpg" width="1200" height="1607" loading="lazy" alt="Working on Master Project: From Start to Finish. Prepare the research proposal with your thesis advisor and submit it to the TEFL Board Committee (first Wednesday of the month); if it does not pass, revise it with your advisor and resubmit. Once it passes, carry out the research process: developing the instrument, collecting data, analyzing data, and writing a report in journal format. Then defend your work before the committee; if you do not pass, retake the course; if you pass, you graduate.">
</figure>

<p class="note">
  Each guide is available as a downloadable PDF from the
  <a href="forms-and-links.html">Forms &amp; Links</a> page.
</p>$html$, updated_at = now()
 where key = 'research/research-guidelines';

update public.nav
   set label = 'Guidelines for Thesis Procedures', updated_at = now()
 where href = 'research.html#research-guidelines';
