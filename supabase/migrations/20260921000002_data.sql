-- =========================================================
-- supabase/data.sql — เนื้อหาทั้งหมดของ CMS ณ วันที่ export
-- รันหลัง schema.sql · ใช้ on conflict do nothing จึงรันซ้ำได้โดยไม่ทับของที่แก้ไปแล้ว
-- คง id/updated_at เดิมไว้ เพื่อให้ sync-content.py และลิงก์ในเว็บยังตรงกัน
-- =========================================================

-- ผู้ดูแลคนแรก — ต้องสร้าง user อีเมลนี้ใน Authentication → Users ด้วย ไม่งั้นล็อกอิน /admin ไม่ได้
insert into public.admins (email, note) values ('kittiyakuldee.315@gmail.com', 'เจ้าของเว็บ — ผู้ดูแลคนแรก') on conflict do nothing;

-- staff: 7 แถว
insert into public.staff (id, name, role, ext, photo, is_lead, badge, sort_order, is_visible, updated_at) values
  ('1a6cc228-06b0-482d-bf0b-caa1a47b0a8c', 'Ruedeerath Chusanachoti, Ph.D.', 'Assistant Professor', null, 'img/staff-ruedeerath.jpg', true, 'Program Chair', 0, true, '2026-09-08T14:52:13.092941+00:00'),
  ('07239186-2053-4a4e-ae6f-6f596109a10e', 'Nattida Pattaraworathum, Ph.D.', 'Program Secretary', 'Ext. 8044', 'img/staff-nattida.jpg', false, null, 1, true, '2026-09-08T14:37:57.694143+00:00'),
  ('65978b80-83d3-4bdd-b311-60a5916cce26', 'Assoc. Prof. Pornpimol Sukavatee, Ph.D.', 'Instructor', 'Ext. 8046', 'img/staff-pornpimol.jpg', false, null, 2, true, '2026-09-08T14:37:57.694143+00:00'),
  ('9ec5a00c-5bda-485f-aef9-b9e6640fec4d', 'Asst. Prof. Apasara Chinwonno, Ph.D.', 'Instructor', 'Ext. 8038', 'img/staff-apasara.jpg', false, null, 3, true, '2026-09-08T14:37:57.694143+00:00'),
  ('67c87b23-d712-461a-adc5-1521ce15d0d6', 'Asst. Prof. Jutarat Vibulphol, Ph.D.', 'Instructor', 'Ext. 8045', 'img/staff-jutarat.jpg', false, null, 4, true, '2026-09-08T14:37:57.694143+00:00'),
  ('1d606754-957a-416a-b8af-773914935908', 'Asst. Prof. Maneerat Ekkayokkaya, Ph.D.', 'Instructor', 'Ext. 8032', 'img/staff-maneerat.jpeg', false, null, 5, true, '2026-09-08T14:51:25.013124+00:00'),
  ('3e52cfc9-0400-4732-99fd-8b44cb85a550', 'Thana Kruawong, Ph.D.', 'Instructor', null, 'img/staff-thana.jpg', false, null, 6, true, '2026-09-08T14:37:57.694143+00:00')
on conflict do nothing;

-- lecturers: 7 แถว
insert into public.lecturers (id, name, course, when_text, badge, photo, url, sort_order, is_visible, updated_at) values
  ('310d398b-df23-4e67-9044-3e999bfef885', 'Prof. Lin, Angel Mei Yi', '2725717 Selected Topic in Language and Linguistics', 'Jul 17–26, 2026', 'Most Recent', 'img/lecturer-lin.jpg', 'https://repository.eduhk.hk/en/persons/mei-yi-angel-lin/', 0, true, '2026-09-08T14:37:57.694143+00:00'),
  ('b2c59a50-d458-4e9f-9eb8-8af2d6efbf32', 'Prof. Dr. Tatiana Sildus', '2725733 Teaching English for Young Learners', 'Oct–Nov 2025', null, 'img/lecturer-sildus.jpg', 'https://www.pittstate.edu/education/teaching-and-leadership/faculty-and-staff/tatiana-sildus.html', 1, true, '2026-09-08T14:37:57.694143+00:00'),
  ('c3958220-ccf8-45b4-aea5-985dc83d8399', 'Prof. Dr. Willy Ardian Renandya', '2725705 Selected Topics in ELT', 'May–Jun 2025', null, 'img/lecturer-renandya.jpg', 'https://willyrenandya.com/', 2, true, '2026-09-08T14:37:57.694143+00:00'),
  ('bae5ea41-37af-4255-baf1-04274c82cc89', 'Prof. Dr. Will Baker', '2725705 Selected Topics in ELT', 'May 24–Jun 2, 2024', null, 'img/lecturer-baker.jpg', 'https://www.southampton.ac.uk/people/5x5kr5/doctor-will-baker', 3, true, '2026-09-08T14:37:57.694143+00:00'),
  ('f44c7168-cd11-4723-a637-b4306c3018db', 'Prof. Dr. Paul Kei Matsuda', '2725705 Selected Topics in ELT', 'Dec 8–17, 2023', null, 'img/lecturer-matsuda.jpg', 'https://search.asu.edu/profile/1097693', 4, true, '2026-09-08T14:37:57.694143+00:00'),
  ('3cdea4c3-249b-428d-9527-74e66db59669', 'Prof. Dr. Jim McKinley', '2725717 Selected Topics in Language and Linguistics', 'Feb 17–27, 2023', null, 'img/lecturer-mckinley.jpg', 'https://www.jimmckinley.me/', 5, true, '2026-09-08T14:37:57.694143+00:00'),
  ('ea21f66b-d6f8-42e4-98d7-8028300178d7', 'Prof. Dr. Heath Rose', '2725705 Selected Topics in ELT', 'Dec 4–15, 2019', null, 'img/lecturer-rose.jpg', 'https://www.education.ox.ac.uk/person/heath-rose/', 6, true, '2026-09-08T14:37:57.694143+00:00')
on conflict do nothing;

-- faqs: 21 แถว
insert into public.faqs (id, category, question, answer, sort_order, is_visible, updated_at) values
  ('8f1e936a-7752-428f-a0d1-b89895c131f1', 'applicants', 'How do I apply?', 'Complete the online program application and the Graduate School application; see <a href="admission.html#admission-procedures">Admission Procedures</a> for the full process.', 5, true, '2026-09-08T14:37:57.694143+00:00'),
  ('30059905-ca92-4066-bafd-14869d450b81', 'applicants', 'When are the deadlines?', 'Generally two rounds a year &mdash; roughly Feb&ndash;Mar and September; exact dates are on the <a href="admission.html#admission-deadline">Admission Deadline</a> page.', 6, true, '2026-09-08T14:37:57.694143+00:00'),
  ('52f71b98-58e3-4b0d-b9eb-310297e861e3', 'applicants', 'What documents are needed?', 'Transcripts, English test results, a statement of purpose, two recommendation letters, and other required documents.', 7, true, '2026-09-08T14:37:57.694143+00:00'),
  ('36b6ccd2-3f34-41fc-af34-b336b3ea975d', 'applicants', 'Which English tests are accepted?', 'CU-TEP / TOEFL iBT / TOEFL ITP-PBT / IELTS, per the minimum scores listed.', 8, true, '2026-09-08T14:37:57.694143+00:00'),
  ('cd83159a-eb91-4509-8c15-51fad3b7bb0d', 'applicants', 'Can I submit my English score later?', 'No &mdash; a valid score (issued within 2 years) must be submitted with the application.', 9, true, '2026-09-08T14:37:57.694143+00:00'),
  ('2cda2122-39e8-4e43-8c43-fa3097a827bc', 'applicants', 'What’s the minimum GPA?', '2.75 on a 4.00 scale at the bachelor&rsquo;s level.', 10, true, '2026-09-08T14:37:57.694143+00:00'),
  ('e2718514-b874-48d0-b94b-5ccb5988e884', 'applicants', 'What’s the application fee?', '34 USD or 1,000 THB, non-refundable.', 11, true, '2026-09-08T14:37:57.694143+00:00'),
  ('4ec63859-15af-4e97-b341-683ef63ef54e', 'applicants', 'What study plans exist?', 'An Academic Track (thesis) and a Professional Track (master project plus comprehensive exam).', 12, true, '2026-09-08T14:37:57.694143+00:00'),
  ('8d04463b-ef68-4365-897e-bcfa5bc880bb', 'applicants', 'What are the estimated costs?', 'Around 65,500 THB/semester for Thai students and 105,200 THB/semester for non-Thai students, plus the application fee and comprehensive exam fee.', 13, true, '2026-09-08T14:37:57.694143+00:00'),
  ('74e11e24-b61a-441f-bde5-744f5da05ae8', 'applicants', 'Is financial aid available for international students?', 'Yes &mdash; see Chulalongkorn University&rsquo;s central scholarship pages for details.', 14, true, '2026-09-08T14:37:57.694143+00:00'),
  ('f0f3fd19-10ce-4948-85f0-6700cdfca4a4', 'home', 'What is the TEFL Program?', 'TEFL stands for Teaching English as a Foreign Language. The program focuses on English language education, teaching methodology and professional development for future English teachers.', 0, true, '2026-09-08T14:37:57.694143+00:00'),
  ('985a386a-dad6-4dc8-b8c3-1a5fe417ce4e', 'home', 'Who should enroll in the TEFL Program?', 'The program is ideal for students who are passionate about English language education and aim to become professional English teachers in Thai and international contexts.', 1, true, '2026-09-08T14:37:57.694143+00:00'),
  ('24b6c0f8-1374-4ab8-96be-45470391633f', 'home', 'What can students learn from the program?', 'Students develop English language proficiency, pedagogical knowledge, research skills and practical experience in language teaching.', 2, true, '2026-09-08T14:37:57.694143+00:00'),
  ('fef402db-120a-470d-87c6-a84df24bdf95', 'home', 'Are there activities outside the classroom?', 'Yes. Students can participate in academic activities, workshops, educational projects and professional learning experiences.', 3, true, '2026-09-08T14:37:57.694143+00:00'),
  ('1388a7f3-6c6e-43b1-9be9-f872580470fe', 'home', 'How can I contact the TEFL Program?', 'Please use the contact information provided in the footer of this website, or reach us by email at tefl@chula.ac.th.', 4, true, '2026-09-08T14:37:57.694143+00:00'),
  ('281d41e5-3fa8-4271-bad6-b8e5db2672f8', 'students', 'How do I register for courses?', 'Register via <a href="https://www.reg.chula.ac.th/" target="_blank" rel="noopener">reg.chula.ac.th</a> using your student ID.', 15, true, '2026-09-08T14:37:57.694143+00:00'),
  ('8e1fe662-40ae-47ed-86d2-406ec0bcdf9f', 'students', 'Where can I find each semester’s schedule?', 'Each semester&rsquo;s schedule is posted on the program&rsquo;s <a href="academics.html#tentative-schedule">Tentative Schedule</a> page.', 16, true, '2026-09-08T14:37:57.694143+00:00'),
  ('fed8f8a2-e82e-452a-8f5e-7e6def8f1ef0', 'students', 'Can I add or drop a course after registering?', 'Yes. Courses can be added or dropped during the <strong>Add/Drop period</strong> set by the academic calendar.', 17, true, '2026-09-08T14:37:57.694143+00:00'),
  ('fdb98da9-e71c-4374-a849-f2f5c9aa29f1', 'students', 'What if a course is already full?', 'Contact the program office or the instructor about waitlisting.', 18, true, '2026-09-08T14:37:57.694143+00:00'),
  ('19487f1c-b108-418b-bcd9-23d3172ba871', 'students', 'Can I still register after the deadline?', 'Late registration is possible during the late period, subject to a penalty fee.', 19, true, '2026-09-08T14:37:57.694143+00:00'),
  ('4a7cce75-e4d4-4e99-bd81-26ce1b15fb94', 'students', 'How do I withdraw from a course?', 'Course withdrawal follows the official procedure and deadlines in the registration manual.', 20, true, '2026-09-08T14:37:57.694143+00:00')
on conflict do nothing;

-- news: 12 แถว
insert into public.news (id, placement, title, tag, image, url, sort_order, is_visible, updated_at) values
  ('17be0db2-6cd1-492b-affb-dd95fc19ae64', 'activities', 'Young Learners Course', 'Other Activities · October 2025', 'img/activity-young-learners.jpg', '#', 6, true, '2026-09-10T07:32:41.530518+00:00'),
  ('a960cbb7-4529-40da-8b17-d22e2d0985de', 'activities', 'A Public Talk: Issues & Trends in Global Englishes and Intercultural Communication', 'TEFL Roundtable · May 2024', 'img/activity-public-talk.jpg', '#', 7, true, '2026-09-10T07:32:41.530518+00:00'),
  ('ae602a01-b2e4-4207-b129-17c61578d9d2', 'activities', 'Intensive Course', 'Intensive Course · May 2024', 'img/activity-intensive-2024.jpg', '#intensive-course', 8, true, '2026-09-10T07:32:41.530518+00:00'),
  ('105ec3d7-9414-4aab-ad6c-0a63d49d0119', 'activities', 'Intensive Course', 'Intensive Course · December 2023', 'img/activity-intensive-2023.jpg', '#intensive-course', 9, true, '2026-09-10T07:32:41.530518+00:00'),
  ('68d00ff6-9fa8-45f0-8a4d-b67158b622f6', 'activities', 'Foundations of English Language Study Course', 'Other Activities · 2023', 'img/activity-foundations.jpg', '#', 10, true, '2026-09-10T07:32:41.530518+00:00'),
  ('01b5f75f-4a3a-4759-97d0-d3fb4e4132ce', 'activities', 'TEFL Academic Expedition: field visits and school-based learning', 'TEFL Academic Expedition', 'img/activity-expedition.jpg', '#', 11, true, '2026-09-10T07:32:41.530518+00:00'),
  ('6303eb8c-41f2-4b98-aa72-2c6a835d66a7', 'home', 'TEFL Program welcomes the incoming cohort of graduate students', 'News & Announcements', 'img/news-cohort.jpg', '#', 0, true, '2026-09-10T07:32:41.530518+00:00'),
  ('be3f721b-d75a-4432-986e-f9a455209c97', 'home', 'Workshop on classroom research methods for English language teachers', 'Academic Activities', 'img/news-workshop.jpg', '#', 1, true, '2026-09-10T07:32:41.530518+00:00'),
  ('73de93c7-5a05-44f3-9727-8488b4a4dc55', 'home', 'Student teaching practicum: reflections from the field', 'Student Activities', 'img/news-practicum.jpg', '#', 2, true, '2026-09-10T07:32:41.530518+00:00'),
  ('c2a904f0-aebf-424f-a1a6-40fcaf27428b', 'home', 'Guest lecture series on technology-enhanced language learning', 'Academic Activities', 'img/news-guest.jpg', '#', 3, true, '2026-09-10T07:32:41.530518+00:00'),
  ('84ebaf7a-bfa9-4980-b57e-bfeddafb664d', 'home', 'Faculty and students present at the international TEFL conference', 'Research', 'img/news-conference.jpg', '#', 4, true, '2026-09-10T07:32:41.530518+00:00'),
  ('d6ab3f1f-b0f3-4115-ad75-7ccfd428854c', 'home', 'Admission open for the next academic year — information session announced', 'News & Announcements', 'img/news-admission.jpg', '#', 5, true, '2026-09-10T07:32:41.530518+00:00')
on conflict do nothing;

-- links: 16 แถว
insert into public.links (id, kind, label, title, meta, url, sort_order, is_visible, updated_at, icon) values
  ('5d920aaf-7ec9-4777-b3b0-12a44a00cc5f', 'form', 'Form 01', 'Thesis Plan Report Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Thesis%20Plan%20Report.pdf', 0, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('477c62bd-5fea-45e2-8be9-5c8738807ae2', 'form', 'Form 02', 'Thesis Work-in-progress Report Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Thesis%20Work-in-progress%20Report.pdf', 1, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('5fb56866-c348-4fc0-b8bf-2c2881c4a45e', 'form', 'Form 03', 'Thesis Proposal Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Research%20Proposal%20form.pdf', 2, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('32dfe607-34b2-4005-b7b1-ee332cc85ee1', 'form', 'Form 04', 'AI Declaration Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Files/AI%20Declaration%20Form.pdf', 3, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('8d87d09c-37fb-4454-9e17-1f079e0c9355', 'form', 'Form 05', 'Thesis Proposal Evaluation (Program Committee)', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Files/Proposal%20Evaluation_TEFL%20Committee%202026.pdf', 4, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('9a420336-d0a5-4df0-bf01-99f863c21593', 'form', 'Form 06', 'Thesis Proposal Evaluation', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Forms_2022/5.%20Thesis%20Proposal%20Evaluation%20Form%202021.pdf', 5, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('992bdbe1-b85e-4eda-8cec-d99ea2e38d5e', 'form', 'Form 07', 'Thesis Defense Evaluation', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Forms_2022/6.%20Thesis%20Defense%20Evaluation%20Form%202021.pdf', 6, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('918d23f1-6011-4d1f-b682-f141b81a3525', 'form', 'Form 08', 'Master Project Proposal Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Master%20Project%20Proposal%20Form%202026.pdf', 7, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('dda1e95c-2859-4f94-9a3e-e9514702fb86', 'form', 'Form 09', 'Master Project Proposal Evaluation Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Master%20Project%20Proposal%20Evaluation%20Form.pdf', 8, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('602f37f9-0927-4254-8e41-c34b4e4951f6', 'form', 'Form 10', 'Master Project Defense Evaluation Form', 'PDF file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Forms_2022/9.%20Master%20Project%20Defense%20Evaluation%20Form%202021.pdf', 9, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('b4ff458b-21b7-4bbf-8748-c020b2b76e27', 'form', 'Form 11', 'Request for Inviting Thesis Examination Committee', 'PDF or Word file', 'https://portal.edu.chula.ac.th/pub/tefl/images/Downloads/Forms_2022/Updated_Forms_31_03_22/Request%20for%20Inviting%20Thesis%20Examination%20Committee%2061.pdf', 10, true, '2026-09-08T14:39:26.616417+00:00', 'pdf'),
  ('78afd2b3-d99e-4139-b39b-1cb3720883da', 'useful', 'University', 'Chulalongkorn University', 'chula.ac.th', 'https://www.chula.ac.th/', 11, true, '2026-09-08T14:39:26.616417+00:00', 'university'),
  ('97020075-1661-4394-8297-f26d784cc518', 'useful', 'Faculty', 'Faculty of Education', 'edu.chula.ac.th', 'https://www.edu.chula.ac.th/', 12, true, '2026-09-08T14:39:26.616417+00:00', 'faculty'),
  ('364cd559-fe92-4e50-a917-41b863e48108', 'useful', 'Library', 'Chulalongkorn University Library', 'car.chula.ac.th', 'https://www.car.chula.ac.th/', 13, true, '2026-09-08T14:39:26.616417+00:00', 'library'),
  ('a0ff7f23-bc66-4930-ae62-3bf3426886ef', 'useful', 'Registrar', 'Office of the Registrar', 'reg.chula.ac.th', 'https://www.reg.chula.ac.th/', 14, true, '2026-09-08T14:39:26.616417+00:00', 'registrar'),
  ('8853d935-21e0-455f-bbc1-4fb7e4697515', 'useful', 'Graduate School', 'Graduate School, Chulalongkorn University', 'grad.chula.ac.th', 'https://www.grad.chula.ac.th/', 15, true, '2026-09-08T14:39:26.616417+00:00', 'graduate-school')
on conflict do nothing;

-- courses: 10 แถว
insert into public.courses (id, group_name, code, title, credits, sort_order, is_visible, updated_at) values
  ('9afda239-1783-4ec0-9ebb-45ea403d7776', 'Plan A — Academic Track — 12 credits', '2725634', 'Principles of English Language Teaching', '3(3-0-9)', 0, true, '2026-09-08T14:37:57.694143+00:00'),
  ('8da06094-35f9-47ff-b26f-6314de34ddb1', 'Plan A — Academic Track — 12 credits', '2725637', 'English Language Assessment and Evaluation', '3(3-0-9)', 1, true, '2026-09-08T14:37:57.694143+00:00'),
  ('8f295771-1a80-49ee-a4f6-94cfac9ea211', 'Plan A — Academic Track — 12 credits', '2725708', 'English Language Curriculum Development', '3(3-0-9)', 2, true, '2026-09-08T14:37:57.694143+00:00'),
  ('bd5848b2-e497-4408-9144-8a596fb08b72', 'Plan A — Academic Track — 12 credits', '2725739', 'Research Design in English Language Teaching', '3(3-0-9)', 3, true, '2026-09-08T14:37:57.694143+00:00'),
  ('6aa2c549-9453-4962-bdff-ad6d40d36c46', 'Plan B — Professional Track — 12 credits', '2725622*', 'Teaching English Listening and Oral Communication', '1(1-0-3)', 4, true, '2026-09-08T14:37:57.694143+00:00'),
  ('2652b0b9-bd1c-4618-a905-6a32ba814c0c', 'Plan B — Professional Track — 12 credits', '2725623*', 'Teaching English Reading', '1(1-0-3)', 5, true, '2026-09-08T14:37:57.694143+00:00'),
  ('98912e7b-0be3-4156-9d0b-0be881067723', 'Plan B — Professional Track — 12 credits', '2725624*', 'Teaching English Writing', '1(1-0-3)', 6, true, '2026-09-08T14:37:57.694143+00:00'),
  ('08338583-cc26-4baf-b8db-b6e2a03ae16c', 'Plan B — Professional Track — 12 credits', '2725634', 'Principles of English Language Teaching', '3(3-0-9)', 7, true, '2026-09-08T14:37:57.694143+00:00'),
  ('f9396ea6-07af-4ca8-b194-86307e1d2aec', 'Plan B — Professional Track — 12 credits', '2725637', 'English Language Assessment and Evaluation', '3(3-0-9)', 8, true, '2026-09-08T14:37:57.694143+00:00'),
  ('b396c365-22d7-4629-a687-3b24bc5acaec', 'Plan B — Professional Track — 12 credits', '2725708', 'English Language Curriculum Development', '3(3-0-9)', 9, true, '2026-09-08T14:37:57.694143+00:00')
on conflict do nothing;

-- tuition: 4 แถว
insert into public.tuition (id, group_name, student_group, part_university, part_faculty, total_per_semester, sort_order, is_visible, updated_at) values
  ('c7d252c8-f8b9-46b0-af57-76b251c3f0e8', 'Tuition & Fees', 'Thai students (AY2020 onward)', '24,500 THB', '41,000 THB', '65,500 THB', 0, true, '2026-09-08T14:37:57.694143+00:00'),
  ('65f69d78-4e53-4b45-b3d9-a085cff787ab', 'Tuition & Fees', 'Non-Thai students (AY2020 onward)', '24,500 THB', '80,700 THB', '105,200 THB', 1, true, '2026-09-08T14:37:57.694143+00:00'),
  ('4a580f8d-a58e-4e35-a1cd-2b6860016662', 'Tuition & Fees', 'Thai students (before AY2019)', '23,000 THB', '41,000 THB', '64,000 THB', 2, true, '2026-09-08T14:37:57.694143+00:00'),
  ('f93cc899-d370-47a9-a601-52642445212b', 'Tuition & Fees', 'Non-Thai students (before AY2019)', '23,000 THB', '77,000 THB', '100,000 THB', 3, true, '2026-09-08T14:37:57.694143+00:00')
on conflict do nothing;

-- blocks: 58 แถว
insert into public.blocks (key, page, label, html, sort_order, is_visible, updated_at) values
  ('site/footer-cols', '(ทุกหน้า)', 'เมนูลิงก์ใน footer', '<div class="footer-col">
          <h4>About</h4>
          <ul>
            <li><a href="about.html">About the Program</a></li>
            <li><a href="about.html#goals">Goals and Objectives</a></li>
            <li><a href="about.html#academic-staff">Academic Staff</a></li>
            <li><a href="about.html#guest-lecturers">Guest Lecturers</a></li>
            <li><a href="faqs.html">FAQs</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="forms-and-links.html#request-forms">Request Forms</a></li>
            <li><a href="forms-and-links.html#thesis-forms">Thesis &amp; Master Project Forms</a></li>
            <li><a href="forms-and-links.html#graduation-request">Graduation Request</a></li>
            <li><a href="forms-and-links.html#research-collaboration-letters">Research Collaboration Letters</a></li>
            <li><a href="forms-and-links.html#useful-links">Useful Links</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Academics</h4>
          <ul>
            <li><a href="academics.html#curriculum-info">Curriculum Info</a></li>
            <li><a href="academics.html#list-of-courses">List of Courses</a></li>
            <li><a href="academics.html#study-plan">Study Plan</a></li>
            <li><a href="academics.html#class-schedule">Class Schedule</a></li>
            <li><a href="academics.html#tuition-and-fees">Tuition and Fees</a></li>
            <li><a href="admission.html">Admission</a></li>
          </ul>
        </div>

        <div class="footer-col is-split">
          <h4>Related Links</h4>
          <ul>
            <li><a href="https://www.edu.chula.ac.th/" target="_blank" rel="noopener">Faculty of Education</a></li>
            <li><a href="https://www.chula.ac.th/" target="_blank" rel="noopener">Chulalongkorn University</a></li>
            <li><a href="https://www.reg.chula.ac.th/" target="_blank" rel="noopener">Reg Chula</a></li>
            <li><a href="https://mooc.chula.ac.th/" target="_blank" rel="noopener">CHULA MOOC</a></li>
            <li><a href="https://www.car.chula.ac.th/" target="_blank" rel="noopener">CU Library</a></li>
            <li><a href="https://www.grad.chula.ac.th/" target="_blank" rel="noopener">Graduate School</a></li>
          </ul>
        </div>', 90, true, '2026-09-08T15:23:57.632871+00:00'),
  ('site/footer-mid', '(ทุกหน้า)', 'ที่อยู่และช่องทางติดต่อ', '<div class="footer-brand">
          <img src="img/logo.png" alt="TEFL Chula, Faculty of Education, Chulalongkorn University">
        </div>

        <div class="f-line">
          Address: Faculty of Education, Chulalongkorn University<br>
          254 Phayathai Road, Wang Mai, Pathum Wan, Bangkok 10330
        </div>

        <div class="f-line">
          Tel: <a href="tel:+6622182565" data-setting-href="contact.phone_href" data-setting-prefix="tel:" data-setting-text="contact.phone">0&ndash;2218&ndash;2565</a><br>
          Email: <a href="mailto:tefl@chula.ac.th">tefl@chula.ac.th</a>
        </div>', 91, true, '2026-09-21T00:20:02.448345+00:00'),
  ('site/footer-bottom', '(ทุกหน้า)', 'โซเชียลและลิขสิทธิ์', '<div class="footer-bottom-inner">

        <div class="footer-social">
          <a href="https://www.facebook.com/TEFL.Chula/" class="is-fb" data-setting-href="social.facebook" aria-label="Facebook" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z"/></svg>
          </a>
          <a href="#" class="is-line" data-setting-href="social.line" aria-label="LINE">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2C6.6 3.2 2.2 6.7 2.2 11c0 3.85 3.48 7.08 8.18 7.69.32.07.75.21.86.49.1.25.06.64.03.89l-.14.85c-.04.25-.2.97.85.53s5.65-3.33 7.7-5.7c1.42-1.56 2.1-3.15 2.1-4.75 0-4.3-4.4-7.8-9.78-7.8z"/></svg>
          </a>
          <a href="https://www.instagram.com/p/DbiparfD3FO/?img_index=18" class="is-ig" data-setting-href="social.instagram" aria-label="Instagram" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0z"/></svg>
          </a>
        </div>

        <div class="copyright">Copyright &copy; 2026 TEFL Program, Faculty of Education, Chulalongkorn University</div>

      </div>', 92, true, '2026-09-21T00:20:02.564236+00:00'),
  ('site/photo-credits', '(ทุกหน้า)', 'เครดิตภาพ (CC — ห้ามลบ)', 'Photo credits (Wikimedia Commons):
      <a href="https://commons.wikimedia.org/wiki/File:Faculty_of_Arts_Library,_Chulalongkorn_University.jpg" target="_blank" rel="noopener">Faculty of Arts Library</a> &copy; Geonuch (CC BY-SA 4.0) &middot;
      <a href="https://commons.wikimedia.org/wiki/File:Chulalongkorn_University_Language_Institute_06.23.jpg" target="_blank" rel="noopener">CU Language Institute</a> &copy; Supanut Arunoprayote (CC BY 4.0) &middot;
      <a href="https://commons.wikimedia.org/wiki/File:Axis_landscape_in_Chula2.jpg" target="_blank" rel="noopener">Axis Landscape</a> &copy; Theerapon Bunnak (CC BY-SA 4.0) &middot;
      <a href="https://commons.wikimedia.org/wiki/File:Mahachulalongkorn_ChulalongkornUniversity.jpg" target="_blank" rel="noopener">Mahachulalongkorn Building</a> &copy; BunBn (CC BY-SA 4.0)', 93, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/page-banner', 'about.html', 'แบนเนอร์หัวหน้า — About TEFL', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">About</span>
      </nav>
      <h1>About TEFL</h1>
      <p class="subtitle">Program overview, goals, academic staff and guest lecturers of the TEFL Program</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/program-overview', 'about.html', 'Program Overview', '<div class="eyebrow">Who We Are</div>
        <span class="rule"></span>
        <h2>Program Overview</h2>
        <p>
          TEFL Chula is the Master of Education program in Teaching English as a
          Foreign Language (International Program) at the Faculty of Education,
          Chulalongkorn University. The program has run for many years; it moved to an English-medium
          curriculum in 2003, and since 2009 has operated fully as an
          international program. The department continues working to broaden its
          international academic environment by recruiting more overseas students
          and inviting visiting scholars.
        </p>
        <div class="feature-img">
          <img src="img/about-program.jpg" alt="TEFL students in a seminar session at the Faculty of Education, Chulalongkorn University" loading="lazy" decoding="async" width="2000" height="1333">
        </div>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/goals', 'about.html', 'Goals and Objectives', '<div class="mission-band is-compact">

          <!-- เส้นสีเคลื่อนไหว (ตกแต่ง) -->
          <div class="band-bg" aria-hidden="true">
            <svg class="w w-1" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goalLineA" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="35%" stop-color="#ffd9cf" stop-opacity=".9"/>
                  <stop offset="70%" stop-color="#ffb3a0" stop-opacity=".75"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 300 C 180 190, 380 380, 620 250 S 1020 120, 1250 220"
                    fill="none" stroke="url(#goalLineA)" stroke-width="2" stroke-linecap="round"/>
              <path d="M-50 340 C 200 250, 420 420, 660 300 S 1040 190, 1250 270"
                    fill="none" stroke="url(#goalLineA)" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
            </svg>

            <svg class="w w-2" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goalLineB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="45%" stop-color="#ffffff" stop-opacity=".85"/>
                  <stop offset="100%" stop-color="#ffd2b0" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 140 C 220 40, 400 220, 640 110 S 1030 30, 1250 130"
                    fill="none" stroke="url(#goalLineB)" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M-50 90 C 240 20, 460 180, 700 70 S 1060 -10, 1250 80"
                    fill="none" stroke="url(#goalLineB)" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
            </svg>

            <svg class="w w-3" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goalLineC" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffb27a" stop-opacity="0"/>
                  <stop offset="50%" stop-color="#ffe0cf" stop-opacity=".8"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 220 C 260 320, 420 60, 680 200 S 1000 330, 1250 180"
                    fill="none" stroke="url(#goalLineC)" stroke-width="2.6" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="inner">
            <div class="band-head">
              <div class="eyebrow">What Drives Us</div>
              <span class="rule"></span>
              <h2 class="band-title">Goals and Objectives</h2>
            </div>

            <div class="mission-cards is-duo">

              <a href="academics.html" class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M24 9 44 18 24 27 4 18z"/>
                    <path d="M12 22v11c0 3.3 5.4 6 12 6s12-2.7 12-6V22"/>
                    <path d="M40 20v11"/>
                  </svg>
                </span>
                <h4>Graduating professional teachers</h4>
                <p>
                  To graduate teachers who can competently develop EFL curricula and
                  manage instruction by drawing on linguistics, pedagogy and
                  research, while working effectively across culturally diverse
                  settings.
                </p>
              </a>

              <a href="research.html" class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M7 12a5 5 0 0 1 5-5h12v33H12a5 5 0 0 0-5 5z"/>
                    <path d="M24 7h12a5 5 0 0 1 5 5v10"/>
                    <circle cx="33" cy="31" r="8"/>
                    <path d="m39 37 5 5"/>
                  </svg>
                </span>
                <h4>Generating research and new knowledge</h4>
                <p>
                  To generate research and new knowledge that improves English
                  instruction, learner development and teaching methods across
                  different contexts.
                </p>
              </a>

            </div>
          </div>
        </div>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/academic-staff', 'about.html', 'หัวข้อ Academic Staff (การ์ดอยู่ในแท็บอาจารย์)', '<div class="eyebrow">Our People</div>
        <span class="rule"></span>
        <h2>Academic Staff</h2>

        <!-- Program Chair — featured portrait -->
        <div class="staff-lead" data-cms="staff-lead"></div>

        <div class="staff-grid" data-cms="staff-grid"></div>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/guest-lecturers', 'about.html', 'หัวข้อ Guest Lecturers (การ์ดอยู่ในแท็บ Guest Lecturers)', '<div class="eyebrow">Beyond the Classroom</div>
        <span class="rule"></span>
        <h2>Guest Lecturers</h2>
        <p>A selection of recent visiting lecturers hosted by the program.</p>
        <div class="lecturer-grid" data-cms="lecturers"></div>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('about/cta-band', 'about.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-bg" aria-hidden="true">
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
      <h3>Interested in Joining the TEFL Program?</h3>
      <p>Explore our curriculum, admissions information and student life.</p>
      <a href="index.html#academics" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 5, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/page-banner', 'academics.html', 'แบนเนอร์หัวหน้า — Academic Program', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Academics</span>
      </nav>
      <h1>Academic Program</h1>
      <p class="subtitle">Our academic structure is designed to support both theoretical understanding and practical training for future English language educators.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/overview', 'academics.html', 'Overview', '<div class="eyebrow">At a Glance</div>
        <span class="rule"></span>
        <h2>Overview</h2>
        <p>
          This is a two-year program aimed at both pre-service and in-service
          English teachers, offering study plans that combine research and
          coursework in different proportions to suit different student
          backgrounds.
        </p>
        <p>
          Students have up to four academic years from admission to complete all
          requirements, and thesis-track students must have their research
          proposal approved within the first two years.
        </p>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/curriculum-info', 'academics.html', 'Curriculum Info.', '<div class="eyebrow">How It Works</div>
        <span class="rule"></span>
        <h2>Curriculum Info.</h2>

        <div class="mission-band">

          <!-- เส้นสีเคลื่อนไหว (ตกแต่ง) -->
          <div class="band-bg" aria-hidden="true">
            <svg class="w w-1" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineA" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="35%" stop-color="#ffd9cf" stop-opacity=".9"/>
                  <stop offset="70%" stop-color="#ffb3a0" stop-opacity=".75"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 300 C 180 190, 380 380, 620 250 S 1020 120, 1250 220"
                    fill="none" stroke="url(#bandLineA)" stroke-width="2" stroke-linecap="round"/>
              <path d="M-50 340 C 200 250, 420 420, 660 300 S 1040 190, 1250 270"
                    fill="none" stroke="url(#bandLineA)" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
            </svg>

            <svg class="w w-2" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="45%" stop-color="#ffffff" stop-opacity=".85"/>
                  <stop offset="100%" stop-color="#ffd2b0" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 140 C 220 40, 400 220, 640 110 S 1030 30, 1250 130"
                    fill="none" stroke="url(#bandLineB)" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M-50 90 C 240 20, 460 180, 700 70 S 1060 -10, 1250 80"
                    fill="none" stroke="url(#bandLineB)" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
            </svg>

            <svg class="w w-3" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineC" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffb27a" stop-opacity="0"/>
                  <stop offset="50%" stop-color="#ffe0cf" stop-opacity=".8"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 220 C 260 320, 420 60, 680 200 S 1000 330, 1250 180"
                    fill="none" stroke="url(#bandLineC)" stroke-width="2.6" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="inner">
            <div class="band-title">Five Things to Know</div>
            <div class="mission-cards">

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6v3H9z"/><path d="M15 4.5h3a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h3"/><path d="m8.5 13 2 2 4-4"/></svg>
                </span>
                <h4>Enrollment</h4>
                <p>Register for at least 9 and no more than 15 credits per semester; fewer than 9 credits requires special permission.</p>
              </div>

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>
                </span>
                <h4>Grading</h4>
                <p>Coursework A&ndash;F; thesis credits S/U each semester, then Very Good, Good, Pass or Fail after the defense. Keep a cumulative GPA of 3.00.</p>
              </div>

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>
                </span>
                <h4>Thesis-Hour Enrollment</h4>
                <p>Consult your advisor each term, submit a work plan, and file a Work-in-Progress Report. Two consecutive U grades end student status.</p>
              </div>

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M9 3v8l2.5-1.8L14 11V3"/></svg>
                </span>
                <h4>Publication Requirement</h4>
                <p>Part of the thesis (Plans A/B) or the master project output (Plan C) must be published in a peer-reviewed journal or presented with full proceedings.</p>
              </div>

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/><path d="M14 3v4h4"/><path d="m9 14 2 2 4-4"/></svg>
                </span>
                <h4>Comprehensive Exam</h4>
                <p>Non-thesis students may sit the exam after all four required courses and must pass before graduating, with one re-sit the following semester.</p>
              </div>

            </div>
          </div>
        </div>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/study-plan', 'academics.html', 'Study Plan', '<div class="sec-head">
          <div class="eyebrow">Choose Your Track</div>
          <span class="rule"></span>
          <h2>Study Plan</h2>
        </div>
        <p>
          The current curriculum (B.E. 2568, for students admitted from academic
          year 2025 onward) offers two tracks:
        </p>

        <div class="tile-grid">

          <a href="#list-of-courses" class="tile-card">
            <span class="t-label">Plan A</span>
            <div class="t-name">Academic Track<br>Coursework + Thesis</div>
            <p class="t-meta">36 credit hours of coursework, plus a thesis &mdash; part of which must be published or presented at an academic conference.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10z"/><path d="M22 4v6h6"/><path d="M13 18h10M13 23h7"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="#list-of-courses" class="tile-card">
            <span class="t-label">Plan B</span>
            <div class="t-name">Professional Track<br>Coursework + Project</div>
            <p class="t-meta">33 credit hours of coursework, plus a 3-credit research-based master project and a comprehensive exam.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 4a9 9 0 0 0-5 16.5V25h10v-4.5A9 9 0 0 0 18 4z"/><path d="M14.5 29h7M15.5 32h5"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="#curriculum-info" class="tile-card">
            <span class="t-label">Plan A</span>
            <div class="t-name">About the Thesis</div>
            <p class="t-meta">Supervised independent research on an explicit theoretical foundation &mdash; problem, framework, methodology, findings and conclusions.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="16" r="10"/><path d="m23.5 23.5 7 7"/><path d="M16 11v10M11 16h10"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="#curriculum-info" class="tile-card">
            <span class="t-label">Plan B</span>
            <div class="t-name">About the Master Project</div>
            <p class="t-meta">More applied than a thesis &mdash; a tangible product plus a written report covering its basis, development and any trial results.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 4 4 11l14 7 14-7z"/><path d="M4 11v12l14 7 14-7V11"/><path d="M18 18v12"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

        </div>

        <p class="note">
          The prior curriculum (B.E. 2566) had three plans: <strong>Plan A</strong>
          (thesis only, no required coursework), <strong>Plan B</strong>
          (36 credits plus thesis), and <strong>Plan C</strong> (33 credits plus
          master project plus comprehensive exam).
        </p>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/list-of-courses', 'academics.html', 'หัวข้อ + ตาราง List of Courses', '<div class="sec-head">
          <div class="eyebrow">What You Study</div>
          <span class="rule"></span>
          <h2>List of Courses</h2>
        </div>
        <p>Required courses under Curriculum B.E. 2568.</p>

        <div class="table-label">
          <span class="t-tag">Plan A</span>
          <span class="t-title">Academic Track &mdash; 12 credits</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Course Title</th>
                <th scope="col">Credits</th>
              </tr>
            </thead>
            <tbody data-cms="courses" data-group="Plan A — Academic Track — 12 credits"></tbody>
          </table>
        </div>

        <div class="table-label">
          <span class="t-tag">Plan B</span>
          <span class="t-title">Professional Track &mdash; 12 credits</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Course Title</th>
                <th scope="col">Credits</th>
              </tr>
            </thead>
            <tbody data-cms="courses" data-group="Plan B — Professional Track — 12 credits"></tbody>
          </table>
        </div>

        <div class="table-label">
          <span class="t-tag">Electives</span>
          <span class="t-title">Two elective groups</span>
        </div>
        <div class="tile-grid">

          <a href="https://portal.edu.chula.ac.th/pub/tefl/index.php/academics/list-of-courses" target="_blank" rel="noopener" class="tile-card">
            <span class="t-label">Group 1</span>
            <div class="t-name">English Language, Learning and Teaching</div>
            <p class="t-meta">For example: Second Language Acquisition, Sociolinguistics for ELT, Teaching English for Young Learners, Teaching English for Adolescent Learners.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8.5A3.5 3.5 0 0 1 8.5 5H30v23H8.5A3.5 3.5 0 0 0 5 31.5z"/><path d="M5 8.5V31"/><path d="M12 12h11M12 17h8"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="https://portal.edu.chula.ac.th/pub/tefl/index.php/academics/list-of-courses" target="_blank" rel="noopener" class="tile-card">
            <span class="t-label">Group 2</span>
            <div class="t-name">Innovations and Professional Development</div>
            <p class="t-meta">For example: ELT Materials and Media, ELT Innovations, Multimedia and Digital Technology for ELT.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="28" height="18" rx="2"/><path d="M13 31h10M18 25v6"/><path d="m15 12 6 4-6 4z"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

        </div>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/class-schedule', 'academics.html', 'Class Schedule', '<div class="sec-head">
          <div class="eyebrow">When You Study</div>
          <span class="rule"></span>
          <h2>Class Schedule</h2>
        </div>
        <div class="mission-band is-compact">

          <!-- เส้นสีเคลื่อนไหว (ตกแต่ง) -->
          <div class="band-bg" aria-hidden="true">
            <svg class="w w-1" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineD" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="35%" stop-color="#ffd9cf" stop-opacity=".9"/>
                  <stop offset="70%" stop-color="#ffb3a0" stop-opacity=".75"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 300 C 180 190, 380 380, 620 250 S 1020 120, 1250 220"
                    fill="none" stroke="url(#bandLineD)" stroke-width="3" stroke-linecap="round"/>
              <path d="M-50 340 C 200 250, 420 420, 660 300 S 1040 190, 1250 270"
                    fill="none" stroke="url(#bandLineD)" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
            </svg>

            <svg class="w w-2" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineE" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
                  <stop offset="45%" stop-color="#ffffff" stop-opacity=".85"/>
                  <stop offset="100%" stop-color="#ffd2b0" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 140 C 220 40, 400 220, 640 110 S 1030 30, 1250 130"
                    fill="none" stroke="url(#bandLineE)" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M-50 90 C 240 20, 460 180, 700 70 S 1060 -10, 1250 80"
                    fill="none" stroke="url(#bandLineE)" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
            </svg>

            <svg class="w w-3" viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bandLineF" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#ffb27a" stop-opacity="0"/>
                  <stop offset="50%" stop-color="#ffe0cf" stop-opacity=".8"/>
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-50 220 C 260 320, 420 60, 680 200 S 1000 330, 1250 180"
                    fill="none" stroke="url(#bandLineF)" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="inner">
            <div class="band-title">Weekend Classes</div>
            <div class="mission-cards is-single">

              <div class="mission-card">
                <span class="m-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
                </span>
                <h4>Friday afternoon &ndash; Sunday</h4>
                <p>Classes are scheduled at the weekend so that in-service teachers can study alongside their work.</p>
              </div>

            </div>
          </div>
        </div>', 5, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/tentative-schedule', 'academics.html', 'Tentative Schedule', '<div class="sec-head">
          <div class="eyebrow">Each Semester</div>
          <span class="rule"></span>
          <h2>Tentative Schedule</h2>
        </div>
        <p>
          Each semester&rsquo;s approximate course schedule is published as image
          or PDF files (e.g. the 2026 academic year schedule). Because this is
          updated periodically, enrolled students should check the program
          announcements for the latest version.
        </p>', 6, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/tuition-and-fees', 'academics.html', 'หัวข้อ Tuition and Fees', '<div class="sec-head">
          <div class="eyebrow">Costs</div>
          <span class="rule"></span>
          <h2>Tuition and Fees</h2>
        </div>
        <p>Charged per semester, in two parts.</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Group</th>
                <th scope="col">Part 1 (University)</th>
                <th scope="col">Part 2 (Faculty)</th>
                <th scope="col" class="is-total">Total / Semester</th>
              </tr>
            </thead>
            <tbody data-cms="tuition"></tbody>
          </table>
        </div>
        <p class="note">
          The <strong>Total / Semester</strong> column is the sum of Part 1 and
          Part 2. The application fee and comprehensive exam fee are charged
          separately.
        </p>', 7, true, '2026-09-08T15:23:57.632871+00:00'),
  ('academics/cta-band', 'academics.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-inner">
      <h3>Ready to Apply?</h3>
      <p>Check the requirements, procedures and deadlines for the next intake.</p>
      <a href="admission.html" class="btn-base is-outline">VIEW ADMISSION<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 8, true, '2026-09-08T15:23:57.632871+00:00'),
  ('activities/page-banner', 'activities.html', 'แบนเนอร์หัวหน้า — Activities', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Activities</span>
      </nav>
      <h1>Activities</h1>
      <p class="subtitle">Students take part in a wide range of learning experiences that build confidence, leadership, teamwork, and teaching practice.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('activities/activities-list', 'activities.html', 'Activities', '<div class="eyebrow">Beyond the Classroom</div>
        <span class="rule"></span>
        <h2>Activities</h2>
        <p>
          The program runs ongoing extracurricular activities such as intensive
          courses, public talks and courses for young learners.
        </p>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('activities/recent-activities', 'activities.html', 'หัวข้อกิจกรรมล่าสุด', '<!-- สไลด์การ์ดกิจกรรม (รูปแบบเดียวกับ Latest News หน้าแรก) -->
        <div class="news-carousel" aria-label="Recent activities">
          <div class="nc-inner">

            <div class="nc-viewport" tabindex="0" role="region" aria-label="Activity cards, scrollable">
              <div class="nc-track" data-cms="news-activities"></div>
            </div>

            <div class="nc-controls">
              <div class="nc-dots"></div>
              <div class="nc-arrows">
                <button type="button" class="btn-base is-outline is-icon" data-nc="prev" aria-label="Previous activities">
                  <svg class="arrow arrow-left" viewBox="0 0 26 14" aria-hidden="true"><path d="M25 7H1M7 1L1 7l6 6"/></svg>
                </button>
                <button type="button" class="btn-base is-outline is-icon" data-nc="next" aria-label="Next activities">
                  <svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg>
                </button>
              </div>
            </div>

          </div>
        </div>
        <p class="note">
          The full activity list spans several areas &mdash;
          <strong>TEFL Academic Expedition</strong>,
          <strong>Other Activities</strong> and
          <strong>TEFL Roundtable</strong>.
        </p>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('activities/cta-band', 'activities.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-bg" aria-hidden="true">
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
    </div>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('admission/page-banner', 'admission.html', 'แบนเนอร์หัวหน้า — Admission', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Admission</span>
      </nav>
      <h1>Admission</h1>
      <p class="subtitle">We welcome applicants who are committed to professional growth in English language teaching and education.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('admission/admission-procedures', 'admission.html', 'Admission Procedures', '<div class="eyebrow">How to Apply</div>
        <span class="rule"></span>
        <h2>Admission Procedures</h2>
        <p>
          Applicants must meet all admission requirements before being
          considered. The application runs through both the TEFL program and the
          Graduate School.
        </p>', 1, true, '2026-09-08T15:25:16.135517+00:00'),
  ('admission/application-steps', 'admission.html', 'Application Steps', '<div class="sec-head">
          <div class="eyebrow">Step by Step</div>
          <span class="rule"></span>
          <h2>Application Steps</h2>
        </div>
        <p>
          Every applicant completes the same five steps, in this order:
        </p>

        <div class="tile-grid is-5up">

          <div class="tile-card is-static">
            <span class="t-label">Application</span>
            <div class="t-name">Apply Online<br>Twice</div>
            <p class="t-meta">Complete both the online TEFL program application and the Graduate School application through the university&rsquo;s online registration system.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="28" height="19" rx="2"/><path d="M2 30h32"/><path d="m13 15 3 3 7-7"/></svg>
              </span>
              <span class="t-step">1</span>
            </div>
          </div>

          <div class="tile-card is-static">
            <span class="t-label">Documents</span>
            <div class="t-name">Prepare Your<br>Documents</div>
            <p class="t-meta">Gather every item listed on the List of Required Documents page before submitting the application.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10z"/><path d="M22 4v6h6"/><path d="M13 18h10M13 23h7"/></svg>
              </span>
              <span class="t-step">2</span>
            </div>
          </div>

          <div class="tile-card is-static">
            <span class="t-label">Fee</span>
            <div class="t-name">Pay the<br>Application Fee</div>
            <p class="t-meta">A non-refundable fee of 34 USD or 1,000 THB, payable as part of the application process.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="30" height="18" rx="2"/><circle cx="18" cy="18" r="4.5"/><path d="M8 18h.5M27.5 18h.5"/></svg>
              </span>
              <span class="t-step">3</span>
            </div>
          </div>

          <div class="tile-card is-static">
            <span class="t-label">Statement</span>
            <div class="t-name">Statement<br>of Purpose</div>
            <p class="t-meta">A written statement explaining your academic background, teaching interests and reasons for applying.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M27.5 4.5a3.5 3.5 0 0 1 5 5L16 26l-6.5 1.5L11 21z"/><path d="M5 32h26"/></svg>
              </span>
              <span class="t-step">4</span>
            </div>
          </div>

          <div class="tile-card is-static">
            <span class="t-label">References</span>
            <div class="t-name">Two Letters of<br>Recommendation</div>
            <p class="t-meta">Both letters are submitted online by your referees, directly through the application system.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14" cy="12" r="5.5"/><path d="M4 29a10 10 0 0 1 20 0"/><path d="M25.5 8.2a5.5 5.5 0 0 1 0 9.6"/><path d="M27 20.6A10 10 0 0 1 32 29"/></svg>
              </span>
              <span class="t-step">5</span>
            </div>
          </div>

        </div>
        <p class="note">
          <strong>Document guidelines:</strong> all documents must be in English,
          saved as PDFs named after the applicant, and certified as true copies
          with a signature; incomplete applications may be declined. Applicants
          to the ASEAN / Non-ASEAN Graduate Scholarship Programme must submit a
          separate scholarship application after being admitted and interviewed,
          and will then be nominated by the program committee.
        </p>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('admission/admission-requirements', 'admission.html', 'Admission Requirements', '<div class="sec-head">
          <div class="eyebrow">Who Can Apply</div>
          <span class="rule"></span>
          <h2>Admission Requirements</h2>
        </div>
        <p>
          The program has two codes: <strong>4987</strong> (Plan 1, Academic
          Track) and <strong>4988</strong> (Plan 2, Professional Track). General
          eligibility requires a bachelor&rsquo;s degree related to English or
          linguistics, a minimum cumulative GPA of <strong>2.75</strong> on a
          4.00 scale, and one of the following minimum English proficiency
          scores:
        </p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">English Test</th>
                <th scope="col">Minimum Score</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>CU-TEP</td><td class="num-cell">75</td></tr>
              <tr><td>TOEFL iBT</td><td class="num-cell">79</td></tr>
              <tr><td>TOEFL ITP / PBT</td><td class="num-cell">550</td></tr>
              <tr><td>IELTS</td><td class="num-cell">Band 6</td></tr>
            </tbody>
          </table>
        </div>
        <p class="note">
          Applicants with a bachelor&rsquo;s degree from an accredited
          institution in a country where English is the primary language (e.g.
          the UK, USA, Australia, New Zealand, Canada) may be exempted from the
          English test requirement.
        </p>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('admission/admission-deadline', 'admission.html', 'Admission Deadline', '<div class="sec-head">
          <div class="eyebrow">Key Dates</div>
          <span class="rule"></span>
          <h2>Admission Deadline</h2>
        </div>
        <p>Example timeline for First Semester, Academic Year 2025 (First Round):</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Applications open</td><td class="num-cell">Now &ndash; Mar 31, 2025</td></tr>
              <tr><td>Notification of interview candidates</td><td class="num-cell">Apr 25, 2025</td></tr>
              <tr><td>Interview date</td><td class="num-cell">Apr 27, 2025</td></tr>
              <tr><td>Admission notification</td><td class="num-cell">May 13, 2025</td></tr>
              <tr><td>Orientation</td><td class="num-cell">Jul 5, 2025</td></tr>
              <tr><td>First day of classes</td><td class="num-cell">Aug 2025</td></tr>
            </tbody>
          </table>
        </div>
        <p class="note">
          A second admission round typically follows the first each year, and
          exact dates vary by year &mdash; please check the current schedule
          before applying.
        </p>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('admission/cta-band', 'admission.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-inner">
      <h3>Questions About Applying?</h3>
      <p>The FAQs for applicants cover documents, English tests, fees and deadlines.</p>
      <a href="faqs.html#faqs-applicants" class="btn-base is-outline">READ THE FAQS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 5, true, '2026-09-08T15:23:57.632871+00:00'),
  ('contact/page-banner', 'contact.html', 'แบนเนอร์หัวหน้า — Contact', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Contact</span>
      </nav>
      <h1>Contact</h1>
      <p class="subtitle">For inquiries about the program, admissions, or academic matters, please contact us through the official channels below.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('contact/contact-information', 'contact.html', 'หัวข้อ TEFL Office', '<div class="eyebrow">Get in Touch</div>
        <span class="rule"></span>
        <h2>TEFL Office</h2>
        <p>
          We would love to hear from you. Reach us by email or telephone, or send a
          message using the form below and we will reply as soon as we can.
        </p>', 1, true, '2026-09-21T00:20:02.665903+00:00'),
  ('contact/contact-details', 'contact.html', 'ฟอร์มติดต่อและแผนที่', '<div class="contact-split">

          <!-- ---------- การ์ดซ้าย: ข้อมูลติดต่อ ---------- -->
          <div class="contact-panel">
            <h3>Contact Information</h3>
            <p class="panel-lead">
              Contact the TEFL Office for questions about the program, admissions
              or student services. We are happy to help!
            </p>

            <div class="ci-list">

              <div class="ci-item">
                <span class="ci-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.5s7-5.7 7-11.2a7 7 0 1 0-14 0c0 5.5 7 11.2 7 11.2z"/><circle cx="12" cy="10" r="2.7"/></svg>
                </span>
                <div>
                  <div class="ci-title">Our Location</div>
                  <p class="ci-text">
                    Faculty of Education, Chulalongkorn University<br>
                    254 Phayathai Road, Wang Mai, Pathum Wan, Bangkok 10330
                  </p>
                </div>
              </div>

              <div class="ci-item">
                <span class="ci-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.7 8.5 6.4 8.5-6.4"/></svg>
                </span>
                <div>
                  <div class="ci-title">Email Address</div>
                  <p class="ci-text"><a href="mailto:TEFL.Chula@gmail.com" data-setting-href="contact.email" data-setting-prefix="mailto:" data-setting-text="contact.email">TEFL.Chula@gmail.com</a></p>
                </div>
              </div>

              <div class="ci-item">
                <span class="ci-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 3.5h3l1.5 4-2 1.4a12.4 12.4 0 0 0 6.2 6.2l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.3 17.3 0 0 1 4.4 5.7 2 2 0 0 1 6.4 3.5z"/></svg>
                </span>
                <div>
                  <div class="ci-title">Phone Number</div>
                  <p class="ci-text"><a href="tel:+6622182565">(662) 218-2565-97</a> ext. 8143</p>
                </div>
              </div>

              <div class="ci-item">
                <span class="ci-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8.5V3.5h10v5"/><rect x="3" y="8.5" width="18" height="7" rx="2"/><path d="M7 13.5h10v7H7z"/><path d="M17.2 11.4h.01"/></svg>
                </span>
                <div>
                  <div class="ci-title">Fax</div>
                  <p class="ci-text">(662) 218-2563</p>
                </div>
              </div>

              <div class="ci-item">
                <span class="ci-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.3 2.4 3.5 5.3 3.5 8.6S14.3 18.2 12 20.6C9.7 18.2 8.5 15.3 8.5 12S9.7 5.8 12 3.4z"/></svg>
                </span>
                <div>
                  <div class="ci-title">Faculty Website</div>
                  <p class="ci-text"><a href="https://www.edu.chula.ac.th/" target="_blank" rel="noopener">edu.chula.ac.th</a></p>
                </div>
              </div>

            </div>

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

            <!-- แผนที่ที่ตั้ง — ยืดเต็มพื้นที่ว่างท้ายการ์ด -->
            <div class="ci-map" id="location">
              <iframe data-setting-map="embed"
                title="Map showing the Faculty of Education, Chulalongkorn University"
                src="https://www.google.com/maps?q=Faculty%20of%20Education%2C%20Chulalongkorn%20University&amp;hl=en&amp;z=17&amp;output=embed"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen></iframe>
              <a class="map-btn" data-setting-map="directions"
                 href="https://www.google.com/maps/dir/?api=1&amp;destination=Faculty%20of%20Education%2C%20Chulalongkorn%20University"
                 target="_blank" rel="noopener">
                Get Directions
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1.8 1.8 0 0 1-1.8 1.8H5A1.8 1.8 0 0 1 3.2 19V7.8A1.8 1.8 0 0 1 5 6h5"/></svg>
              </a>
            </div>
          </div>

          <!-- ---------- การ์ดขวา: ฟอร์มส่งข้อความ ---------- -->
          <div class="contact-panel" id="send-a-message">
            <h3>Send Us a Message</h3>
            <p class="panel-lead">
              Please fill out the form below and we will get back to you as soon as possible.
            </p>

            <noscript>
              <div class="form-status is-warn is-shown">
                This form needs JavaScript to work. Please email us directly at
                <a href="mailto:TEFL.Chula@gmail.com" data-setting-href="contact.email" data-setting-prefix="mailto:" data-setting-text="contact.email">TEFL.Chula@gmail.com</a>.
              </div>
            </noscript>

            <form id="contactForm" novalidate>
              <div class="form-grid">

                <div class="field">
                  <label for="cf-first">First Name <span class="req" aria-hidden="true">*</span></label>
                  <input type="text" id="cf-first" name="firstName" autocomplete="given-name"
                         required data-msg-required="Please enter your first name.">
                  <span class="f-error" id="err-first" role="alert"></span>
                </div>

                <div class="field">
                  <label for="cf-last">Last Name <span class="req" aria-hidden="true">*</span></label>
                  <input type="text" id="cf-last" name="lastName" autocomplete="family-name"
                         required data-msg-required="Please enter your last name.">
                  <span class="f-error" id="err-last" role="alert"></span>
                </div>

                <div class="field is-full">
                  <label for="cf-email">Email <span class="req" aria-hidden="true">*</span></label>
                  <input type="email" id="cf-email" name="email" autocomplete="email"
                         required data-msg-required="Please enter the email address we should reply to.">
                  <span class="f-error" id="err-email" role="alert"></span>
                </div>

                <div class="field is-full">
                  <label for="cf-phone">Phone <span class="opt">(optional)</span></label>
                  <input type="tel" id="cf-phone" name="phone" autocomplete="tel">
                  <span class="f-error" id="err-phone" role="alert"></span>
                </div>

                <div class="field is-full">
                  <label for="cf-subject">Subject <span class="req" aria-hidden="true">*</span></label>
                  <select id="cf-subject" name="subject" required
                          data-msg-required="Please choose a subject.">
                    <option value="">&mdash; Please select &mdash;</option>
                    <option>Admissions</option>
                    <option>Program and Curriculum</option>
                    <option>Student Services</option>
                    <option>Thesis and Research</option>
                    <option>Other</option>
                  </select>
                  <span class="f-error" id="err-subject" role="alert"></span>
                </div>

                <div class="field is-full">
                  <label for="cf-message">Message <span class="req" aria-hidden="true">*</span></label>
                  <textarea id="cf-message" name="message" maxlength="1500"
                            required data-msg-required="Please write your message."></textarea>
                  <span class="f-error" id="err-message" role="alert"></span>
                </div>

                <!-- กับดักบอท: คนจริงมองไม่เห็นและไม่ต้องกรอก -->
                <div class="hp-field" aria-hidden="true">
                  <label for="cf-company">Company</label>
                  <input type="text" id="cf-company" name="company" tabindex="-1" autocomplete="off">
                </div>

              </div>

              <div class="form-actions">
                <button type="submit" class="btn-send" id="cf-submit">
                  Send Message
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 14.8 21.5l-3.8-8.5-8.5-3.8z"/></svg>
                </button>
                <p class="form-hint">
                  Fields marked <span aria-hidden="true">*</span> are required.
                  Your message goes to TEFL.Chula@gmail.com.
                </p>
              </div>

              <div class="form-status" id="cf-status" role="status" aria-live="polite"></div>
            </form>
          </div>

        </div>', 2, true, '2026-09-21T00:20:02.777552+00:00'),
  ('contact/cta-band', 'contact.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-bg" aria-hidden="true">
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
      <h3>Interested in Joining the TEFL Program?</h3>
      <p>Explore our curriculum, admissions information and student life.</p>
      <a href="academics.html" class="btn-base is-outline">EXPLORE ACADEMICS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('faqs/page-banner', 'faqs.html', 'แบนเนอร์หัวหน้า — Frequently Asked Questions', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">FAQs</span>
      </nav>
      <h1>Frequently Asked Questions</h1>
      <p class="subtitle">Answers to common questions from applicants and current TEFL students.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('faqs/faqs-applicants', 'faqs.html', 'หัวข้อ FAQs for Applicants', '<div class="eyebrow">Before You Apply</div>
        <span class="rule"></span>
        <h2>FAQs for Applicants</h2>
        <p>Common questions from prospective students, with short answers.</p>

        <div class="faq-list" data-cms="faqs-applicants"></div>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('faqs/faqs-students', 'faqs.html', 'หัวข้อ FAQs for TEFL Students', '<div class="eyebrow">Already Enrolled</div>
        <span class="rule"></span>
        <h2>FAQs for TEFL Students</h2>
        <p>Course registration questions from enrolled students, with short answers.</p>

        <div class="faq-list" data-cms="faqs-students"></div>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('faqs/cta-band', 'faqs.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-inner">
      <h3>Still Have Questions?</h3>
      <p>Reach the TEFL office by email or phone &mdash; we&rsquo;re happy to help.</p>
      <a href="contact.html" class="btn-base is-outline">CONTACT US<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/page-banner', 'forms-and-links.html', 'แบนเนอร์หัวหน้า — Forms and Links', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Forms &amp; Links</span>
      </nav>
      <h1>Forms and Links</h1>
      <p class="subtitle">Useful forms and resources for students, applicants, and academic staff.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/request-forms', 'forms-and-links.html', 'Request Forms Submission Procedures', '<div class="eyebrow">Student Services</div>
        <span class="rule"></span>
        <h2>Request Forms Submission Procedures</h2>
        <p>
          Students request forms via the Registrar&rsquo;s Google Form; on
          submission, a PDF is emailed to the student&rsquo;s university address.
          The student signs it, routes it to their advisor for approval by email,
          and then forwards the approved form to the program office for
          processing.
        </p>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/thesis-forms', 'forms-and-links.html', 'หัวข้อ Thesis & Master Project Forms', '<div class="sec-head">
          <div class="eyebrow">Downloads</div>
          <span class="rule"></span>
          <h2>Thesis &amp; Master Project Forms</h2>
        </div>
        <p>
          All 11 forms for theses and master projects, numbered as on the program
          portal. Click any card to open the file &mdash; every form is a PDF, and
          Form 11 is also available as Word.
        </p>

        <!-- การ์ดดาวน์โหลด 1 ใบ = 1 ฟอร์ม ครบทั้ง 11 รายการ เรียงเลขตรงกับพอร์ทัล
             ทั้งใบเป็นลิงก์ด้วย .dl-stretch (ซ้อนทับการ์ด) กดตรงไหนก็ได้ไฟล์ PDF
             ฟอร์มที่ 11 มีไฟล์ Word ด้วย จึงมีชิป "Word" ลอยอยู่เหนือ .dl-stretch อีกชั้น
             ไฟล์ทั้งหมดโฮสต์ที่ portal.edu.chula.ac.th — ช่องว่างในชื่อไฟล์ต้องเขียนเป็น %20 -->
        <div class="tile-grid is-4up dl-grid" data-cms="links-form"></div>

        <p class="dl-note">
          Files are hosted on the
          <a href="https://portal.edu.chula.ac.th/pub/tefl/index.php/forms-and-links/thesis-and-master-project-forms" target="_blank" rel="noopener">TEFL program portal</a>
          and open in a new tab. If a link does not work, please
          <a href="contact.html">contact the program office</a>.
        </p>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/research-collaboration-letters', 'forms-and-links.html', 'Research Collaboration Letters', '<div class="sec-head">
          <div class="eyebrow">Research Support</div>
          <span class="rule"></span>
          <h2>Research Collaboration Letters</h2>
        </div>
        <p>
          Students conducting research with schools or other institutions can
          request official letters supporting the collaboration. The request is
          submitted to the program office, which prepares the letter on the
          student&rsquo;s behalf.
        </p>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/graduation-request', 'forms-and-links.html', 'Graduation Request', '<div class="sec-head">
          <div class="eyebrow">Finishing Up</div>
          <span class="rule"></span>
          <h2>Graduation Request</h2>
        </div>
        <p>
          The graduation request covers the procedures and documents that must be
          submitted to the Faculty of Education in order to graduate, including
          the final thesis or master project deliverables.
        </p>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/useful-links', 'forms-and-links.html', 'หัวข้อ Useful Links', '<div class="sec-head">
          <div class="eyebrow">Elsewhere</div>
          <span class="rule"></span>
          <h2>Useful Links</h2>
        </div>
        <div class="tile-grid is-5up" data-cms="links-useful"></div>', 5, true, '2026-09-08T15:23:57.632871+00:00'),
  ('forms-and-links/cta-band', 'forms-and-links.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-inner">
      <h3>Can&rsquo;t Find a Form?</h3>
      <p>Contact the TEFL office and we&rsquo;ll point you to the right document.</p>
      <a href="contact.html" class="btn-base is-outline">CONTACT US<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 6, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/home', 'index.html', 'สไลด์ใหญ่หน้าแรก (Hero)', '<div class="hero-track" id="heroTrack">
        <div class="hero-slide slide-1" role="img" aria-label="TEFL students and instructors in the computer lab"></div>
        <div class="hero-slide slide-2" role="img" aria-label="TEFL students in the faculty computer lab"></div>
        <div class="hero-slide slide-3" role="img" aria-label="Students working together in a TEFL class"></div>
        <div class="hero-slide slide-4" role="img" aria-label="Group work in the faculty library"></div>
        <div class="hero-slide slide-5" role="img" aria-label="Faculty of Education campus"></div>
      </div>

      <div class="hero-inner">
        <div class="hero-copy" id="heroCopy">
          <h1>Teaching English as a<br>Foreign Language Program</h1>
          <p class="sub">Faculty of Education, Chulalongkorn University</p>
        </div>
      </div>

      <div class="slider-dots" id="sliderDots">
        <button class="active" data-slide="0" aria-label="Slide 1"></button>
        <button data-slide="1" aria-label="Slide 2"></button>
        <button data-slide="2" aria-label="Slide 3"></button>
        <button data-slide="3" aria-label="Slide 4"></button>
        <button data-slide="4" aria-label="Slide 5"></button>
      </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/about', 'index.html', 'ย่อหน้าต้อนรับ', '<div class="section-head">
        <div class="eyebrow">Faculty of Education</div>
        <span class="rule"></span>
        <h2>Welcome to the Teaching English as a Foreign Language Program</h2>
      </div>
      <p>
        The TEFL Program at the Faculty of Education, Chulalongkorn University,
        is committed to developing knowledgeable, skilled and professional
        English language educators. Our students are cultivated to develop
        pedagogical knowledge, language proficiency, research skills and
        practical teaching experience, well-equipped to grow personally and
        professionally in the international community.
      </p>
      <a href="#academics" class="btn-base is-outline">Read More<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/missions', 'index.html', 'Our Missions', '<div class="inner">
        <h2>Our Missions</h2>
        <div class="mission-cards">

          <a href="#about" class="mission-card">
            <span class="m-icon">
              <img src="img/icon-research.png" alt="" loading="lazy" decoding="async" width="400" height="400">
            </span>
            <h4>Research Excellence</h4>
            <p>Advancing knowledge through innovative research in language teaching, learning and assessment.</p>
          </a>

          <a href="#about" class="mission-card">
            <span class="m-icon">
              <img src="img/icon-global.png" alt="" loading="lazy" decoding="async" width="400" height="400">
            </span>
            <h4>Global Perspective</h4>
            <p>Preparing educators to teach English effectively in diverse and international contexts.</p>
          </a>

          <a href="#about" class="mission-card">
            <span class="m-icon">
              <img src="img/icon-collab.png" alt="" loading="lazy" decoding="async" width="400" height="400">
            </span>
            <h4>Collaborative Learning</h4>
            <p>Fostering a vibrant academic community where diverse perspectives enhance understanding.</p>
          </a>

          <a href="#about" class="mission-card">
            <span class="m-icon">
              <img src="img/icon-practical.png" alt="" loading="lazy" decoding="async" width="400" height="400">
            </span>
            <h4>Practical Application</h4>
            <p>Bridging theory and practice to prepare graduates for meaningful teaching careers.</p>
          </a>

        </div>
        <a href="#about" class="btn-base is-outline">VIEW ALL MISSIONS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
      </div>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/academics', 'index.html', 'การ์ดหมวดรายวิชา', '<div class="inner">

        <div class="section-head">
          <div class="eyebrow">Discover Our</div>
          <span class="rule"></span>
          <h2>Courses</h2>
        </div>

        <div class="course-index" id="courses">
          <a class="course-card" href="academics.html#list-of-courses">
            <div class="c-photo" style="--img:url(''img/course-required.jpg'')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Required Courses</h5>
              <p>Core courses essential for all TEFL students</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="academics.html#list-of-courses">
            <div class="c-photo" style="--img:url(''img/course-elective.jpg'')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Elective Courses</h5>
              <p>Specialized courses based on your interests</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="academics.html#curriculum-info">
            <div class="c-photo" style="--img:url(''img/course-practicum.jpg'')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Teaching Practicum</h5>
              <p>Supervised practical teaching experience in real classrooms</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="about.html#guest-lecturers">
            <div class="c-photo" style="--img:url(''img/course-guest.jpg'')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Guest Lectures</h5>
              <p>Talks by visiting scholars and professionals</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
          <a class="course-card" href="academics.html#list-of-courses">
            <div class="c-photo" style="--img:url(''img/course-edtech.jpg'')"></div>
            <div class="c-bg"></div>
            <div class="c-body">
              <h5>Educational Technology</h5>
              <p>Digital tools and technology for modern language education</p>
            </div>
            <span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
          </a>
        </div>

        <div class="course-cta">
          <a href="academics.html#curriculum-info" class="btn-base is-outline is-sm">CURRICULUM INFO<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </div>

      </div>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/faculty', 'index.html', 'TEFL Program Overview', '<div class="program-block">
        <div class="program-text">
          <h3>TEFL Program Overview</h3>
          <p>
            The program combines theoretical knowledge with practical experience
            in English language teaching and learning. Students are encouraged
            to develop critical thinking, creativity, communication and
            professional teaching competencies.
          </p>
          <a href="#contact" class="btn-base is-outline">LEARN MORE<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </div>
        <div class="program-img"><img src="img/program-overview.jpg" alt="An instructor guiding TEFL students during a computer lab session" loading="lazy" decoding="async" width="1800" height="1200"></div>
      </div>

      <div class="program-block reverse">
        <div class="program-text">
          <h3>Learning Beyond the Classroom</h3>
          <p>
            Students have opportunities to participate in academic activities,
            workshops, educational projects and professional learning
            communities. These experiences support the development of practical
            skills and professional identity.
          </p>
          <a href="#students" class="btn-base is-outline">EXPLORE ACTIVITIES<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </div>
        <div class="program-img alt"><img src="img/program-beyond.jpg" alt="TEFL students reading together in the faculty library" loading="lazy" decoding="async" width="1800" height="1200"></div>
      </div>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/students', 'index.html', 'แถบตัวเลขสถิติ', '<div class="intro-bg" aria-hidden="true">
        <div class="w w-1">
          <svg viewBox="0 0 1440 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="introGradA" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffeadf"/>
                <stop offset="55%" stop-color="#ffcdb4"/>
                <stop offset="100%" stop-color="#ffb08a"/>
              </linearGradient>
            </defs>
            <path fill="url(#introGradA)"
              d="M-200,250 C 120,110 320,300 640,246 C 960,192 1140,52 1640,128 L1640,-140 L-200,-140 Z"/>
          </svg>
        </div>

        <div class="w w-2">
          <svg viewBox="0 0 1440 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="introGradB" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#ffdccb" stop-opacity="0"/>
                <stop offset="40%" stop-color="#ffbe9c" stop-opacity=".9"/>
                <stop offset="100%" stop-color="#f79f72" stop-opacity=".5"/>
              </linearGradient>
            </defs>
            <path fill="none" stroke="url(#introGradB)" stroke-width="90" stroke-linecap="round"
              d="M-220,330 C 180,210 340,420 700,340 C 1020,268 1240,150 1660,214"/>
          </svg>
        </div>

        <div class="w w-3">
          <svg viewBox="0 0 1440 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="introGradC" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stop-color="#fff0e7"/>
                <stop offset="100%" stop-color="#ffd6c0" stop-opacity=".6"/>
              </linearGradient>
            </defs>
            <path fill="url(#introGradC)"
              d="M-200,520 C 220,430 400,566 780,486 C 1090,420 1300,528 1640,470 L1640,760 L-200,760 Z"/>
          </svg>
        </div>

        <span class="glow glow-1"></span>
        <span class="glow glow-2"></span>
      </div>

      <div class="intro-inner">
        <div class="intro-stats">
          <div class="i-stat">
            <div class="num">2001</div>
            <div class="label">Year Established</div>
          </div>
          <div class="i-stat">
            <div class="num">25+</div>
            <div class="label">Years of Excellence</div>
          </div>
          <div class="i-stat">
            <div class="num">500+</div>
            <div class="label">Graduates &amp; Alumni</div>
          </div>
          <div class="i-stat">
            <div class="num">30+</div>
            <div class="label">Expert Faculty</div>
          </div>
        </div>
      </div>', 5, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/news', 'index.html', 'หัวข้อ Latest News', '<div class="nc-inner">

        <div class="nc-head">
          <h2>Latest News</h2>
          <a href="#" class="btn-base is-outline is-sm">View All<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
        </div>

        <div class="nc-viewport" tabindex="0" role="region" aria-label="News items, scrollable">
          <div class="nc-track" data-cms="news-home"></div>
        </div>

        <div class="nc-controls">
          <div class="nc-dots"></div>
          <div class="nc-arrows">
            <button type="button" class="btn-base is-outline is-icon" data-nc="prev" aria-label="Previous news">
              <svg class="arrow arrow-left" viewBox="0 0 26 14" aria-hidden="true"><path d="M25 7H1M7 1L1 7l6 6"/></svg>
            </button>
            <button type="button" class="btn-base is-outline is-icon" data-nc="next" aria-label="Next news">
              <svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg>
            </button>
          </div>
        </div>

      </div>', 6, true, '2026-09-08T15:23:57.632871+00:00'),
  ('index/faq', 'index.html', 'หัวข้อ FAQ (คำถามอยู่ในแท็บ FAQ)', '<h2>Frequently Asked Questions</h2>

      <div class="faq-list" data-cms="faqs-home"></div>', 7, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/page-banner', 'research.html', 'แบนเนอร์หัวหน้า — Research', '<div class="inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" aria-label="Home">
          <svg class="home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 3 10.4V21h6v-6h6v6h6V10.4z"/></svg>
        </a>
        <svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
        <span class="current" aria-current="page">Research</span>
      </nav>
      <h1>Research</h1>
      <p class="subtitle">Research is a central component of the TEFL Program, helping students connect theory with practice and produce meaningful contributions to English language education.</p>
    </div>', 0, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/research-overview', 'research.html', 'TEFL Research Overview', '<div class="eyebrow">What We Study</div>
        <span class="rule"></span>
        <h2>TEFL Research Overview</h2>
        <p>
          Student theses vary widely in the language skills addressed, the
          learner level, whether the focus is on teachers or learners, the type
          of intervention (e.g. new instructional processes or courses), and the
          research design &mdash; quantitative, qualitative, mixed-methods or R&amp;D.
        </p>
        <p>
          Recurring topics include communicative activities, web-based reading
          instruction, multiple-intelligences-based reading, media-based
          instruction, English accent variety, team-based learning, willingness
          to communicate, task-based reading instruction, self-directed learning,
          English counseling programs, inquiry-based reading instruction,
          drama-based instruction and locally-contextualized content.
        </p>', 1, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/research-guidelines', 'research.html', 'Guidelines for Research Procedures', '<div class="sec-head">
          <div class="eyebrow">Step by Step</div>
          <span class="rule"></span>
          <h2>Guidelines for Research Procedures</h2>
        </div>
        <p>
          Downloadable PDF guides are provided for each stage of the research
          process:
        </p>

        <div class="tile-grid">

          <a href="forms-and-links.html#thesis-forms" class="tile-card">
            <span class="t-label">Step 1</span>
            <div class="t-name">Proposal Defense</div>
            <p class="t-meta">Preparing for the proposal defense and using the EDU-Thesis system to submit and track your documents.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10z"/><path d="M22 4v6h6"/><path d="m13 21 3 3 7-7"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="forms-and-links.html#research-collaboration-letters" class="tile-card">
            <span class="t-label">Step 2</span>
            <div class="t-name">Research<br>Collaboration Letters</div>
            <p class="t-meta">Requesting official letters that support data collection with schools and other institutions.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="28" height="20" rx="2"/><path d="m4 11 14 9 14-9"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="forms-and-links.html#graduation-request" class="tile-card">
            <span class="t-label">Step 3</span>
            <div class="t-name">Thesis Defense<br>&amp; Graduation</div>
            <p class="t-meta">The thesis defense, the documents due afterwards, and the graduation request submitted to the Faculty.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 3 13l15 7 15-7z"/><path d="M9 16.5V25c0 2.2 4 4 9 4s9-1.8 9-4v-8.5"/><path d="M33 13v8"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

          <a href="#tefl-research-ojed" class="tile-card">
            <span class="t-label">Step 4</span>
            <div class="t-name">Publication</div>
            <p class="t-meta">Writing and submitting research papers for publication in peer-reviewed journals or conference proceedings.</p>
            <div class="t-foot">
              <span class="t-ic">
                <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h20a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M28 12h4v16a2 2 0 0 1-2 2"/><path d="M10 13h12M10 18h12M10 23h8"/></svg>
              </span>
              <span class="t-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>
            </div>
          </a>

        </div>

        <p class="note">
          Each guide is available as a downloadable PDF from the
          <a href="forms-and-links.html">Forms &amp; Links</a> page.
        </p>', 2, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/tefl-research-thesis', 'research.html', 'TEFL Research [Thesis]', '<div class="sec-head">
          <div class="eyebrow">Thesis Archive</div>
          <span class="rule"></span>
          <h2>TEFL Research [Thesis]</h2>
        </div>
        <p>
          The archive lists TEFL program theses from 2011 to the present (over
          100 entries), linking out to the Chulalongkorn University Intellectual
          Repository (CUIR) and Chula Digiverse. Recent examples:
        </p>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Author</th>
                <th scope="col">Topic (abridged)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="num-cell">2025</td><td>Xiaoyi Wu</td><td class="muted">Digital extensive reading for Chinese EFL students&rsquo; reading ability</td></tr>
              <tr><td class="num-cell">2025</td><td>Chudakarn Pakarasang</td><td class="muted">Guidelines for EFL textbooks promoting critical reading</td></tr>
              <tr><td class="num-cell">2024</td><td>Jingxuan Wang</td><td class="muted">Translanguaging in reading instruction &mdash; Chinese undergraduates</td></tr>
              <tr><td class="num-cell">2024</td><td>Tin Lin Kyaw</td><td class="muted">AI-assisted collaborative learning &mdash; Myanmar students&rsquo; speaking skill</td></tr>
              <tr><td class="num-cell">2024</td><td>Nang Phong Noan</td><td class="muted">Drama-based instruction with digital activities &mdash; oral communication</td></tr>
              <tr><td class="num-cell">2023</td><td>Wipasinee Honboonherm</td><td class="muted">Memory-based vocabulary instruction via online games</td></tr>
            </tbody>
          </table>
        </div>
        <p class="note">The complete list goes back to <strong>2011</strong>.</p>', 3, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/tefl-research-ojed', 'research.html', 'TEFL Research from OJED', '<div class="sec-head">
          <div class="eyebrow">Published Work</div>
          <span class="rule"></span>
          <h2>TEFL Research from OJED</h2>
        </div>
        <p>
          This collection compiles student research published in the Faculty of
          Education&rsquo;s <strong>Online Journal of Education (OJED)</strong>
          from 2007 to 2014, covering topics such as politeness strategies in
          workplace disagreements, online English learning materials, vocabulary
          instruction, and foreign-language curriculum studies at various
          schools.
        </p>', 4, true, '2026-09-08T15:23:57.632871+00:00'),
  ('research/cta-band', 'research.html', 'แถบชวนสมัครท้ายหน้า', '<div class="cta-inner">
      <h3>Need Research Forms?</h3>
      <p>Thesis and master project forms, plus research collaboration letters.</p>
      <a href="forms-and-links.html#thesis-forms" class="btn-base is-outline">GO TO FORMS<svg class="arrow" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h24M19 1l6 6-6 6"/></svg></a>
    </div>', 5, true, '2026-09-08T15:23:57.632871+00:00')
on conflict do nothing;

-- nav: 31 แถว
insert into public.nav (id, parent_id, label, href, dd_title, sort_order, is_visible, updated_at) values
  ('dc415dc7-9e30-45c2-92a0-4021bff2416c', null, 'About', 'about.html', 'About the Program', 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('b86173c8-705f-4be0-b98e-b42f67be02db', null, 'Academics', 'academics.html', 'Academics', 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('6fb6571e-2933-4ad6-863f-1378ddfbaca7', null, 'Admission', 'admission.html', 'Admission', 2, true, '2026-09-21T00:23:56.024991+00:00'),
  ('1399ec75-0f7b-4a18-82ee-e682603387c3', null, 'Research', 'research.html', 'Research', 3, true, '2026-09-21T00:16:37.243654+00:00'),
  ('247cce30-fdc0-49eb-814b-2df4607fa5b7', null, 'Activities', 'activities.html', 'Activities', 4, true, '2026-09-21T00:16:37.243654+00:00'),
  ('82037ec5-79d9-4e4c-a54a-952a1e5089b2', null, 'Forms & Links', 'forms-and-links.html', 'Forms and Links', 5, true, '2026-09-21T00:16:37.243654+00:00'),
  ('bc1f8216-dbdd-4c90-892c-df2d2cf00c08', null, 'FAQs', 'faqs.html', null, 6, true, '2026-09-21T00:16:37.243654+00:00'),
  ('22500f5f-b6b5-4752-bfe7-cb8356207f1a', null, 'Contact', 'contact.html', null, 7, true, '2026-09-21T00:16:37.243654+00:00'),
  ('ad1535c0-9bdc-4af1-b986-4a37f6c4633a', '1399ec75-0f7b-4a18-82ee-e682603387c3', 'Guidelines for Research Procedures', 'research.html#research-guidelines', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('97a4f39e-d651-4210-b29e-7830c9e1005c', '1399ec75-0f7b-4a18-82ee-e682603387c3', 'TEFL Research [THESIS]', 'research.html#tefl-research-thesis', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('fb804bda-d8a8-4213-a918-dfa7c77f3027', '1399ec75-0f7b-4a18-82ee-e682603387c3', 'TEFL Research from OJED', 'research.html#tefl-research-ojed', null, 2, true, '2026-09-21T00:16:37.243654+00:00'),
  ('96237496-e51a-4d20-8ac2-6cca6d8b7b78', '247cce30-fdc0-49eb-814b-2df4607fa5b7', 'Activities List', 'activities.html#activities-list', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('a416404b-86b5-4a47-a6c1-98a0485628c4', '247cce30-fdc0-49eb-814b-2df4607fa5b7', 'Intensive Course', 'activities.html#intensive-course', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('4e2108af-77fc-47c8-b69c-af888ec501c2', '247cce30-fdc0-49eb-814b-2df4607fa5b7', 'News & Events', 'index.html#news', null, 2, true, '2026-09-21T00:16:37.243654+00:00'),
  ('8807a737-1cac-49c5-af16-65c9112d256c', '6fb6571e-2933-4ad6-863f-1378ddfbaca7', 'Admission Requirements', 'admission.html#admission-requirements', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('bbe9db67-2606-4d85-a57b-51252deeb6f2', '6fb6571e-2933-4ad6-863f-1378ddfbaca7', 'Admission Procedures', 'admission.html#admission-procedures', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('ce20dc1d-be33-4dab-bc66-5b2090d38b80', '6fb6571e-2933-4ad6-863f-1378ddfbaca7', 'Admission Deadline', 'admission.html#admission-deadline', null, 2, true, '2026-09-21T00:16:37.243654+00:00'),
  ('08fbc8ac-47d1-4cc4-8c4d-ff27f0cd67c6', '82037ec5-79d9-4e4c-a54a-952a1e5089b2', 'Request Forms', 'forms-and-links.html#request-forms', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('511b8d60-b184-40be-911a-88e2fc31106d', '82037ec5-79d9-4e4c-a54a-952a1e5089b2', 'Thesis and Master Project Forms', 'forms-and-links.html#thesis-forms', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('7dd7b0a8-6d37-4d92-aa8c-7ef3a9e61b83', '82037ec5-79d9-4e4c-a54a-952a1e5089b2', 'Research Collaboration Letters', 'forms-and-links.html#research-collaboration-letters', null, 2, true, '2026-09-21T00:16:37.243654+00:00'),
  ('3fcc3816-70f9-4668-bca4-1cad943c9429', '82037ec5-79d9-4e4c-a54a-952a1e5089b2', 'Graduation Request', 'forms-and-links.html#graduation-request', null, 3, true, '2026-09-21T00:16:37.243654+00:00'),
  ('e57419de-cf86-436f-8457-6794fba51714', '82037ec5-79d9-4e4c-a54a-952a1e5089b2', 'Useful Links', 'forms-and-links.html#useful-links', null, 4, true, '2026-09-21T00:16:37.243654+00:00'),
  ('d79d9a15-a64f-4205-8a69-b487dbc31926', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'Curriculum Info.', 'academics.html#curriculum-info', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('8c9e1af2-d491-40ab-894f-57310127a86c', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'List of Courses', 'academics.html#list-of-courses', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('55660352-8165-496d-920e-d8d82f497d99', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'Study Plan', 'academics.html#study-plan', null, 2, true, '2026-09-21T00:16:37.243654+00:00'),
  ('49a90e2d-358e-4897-9ce9-d56ac8772caf', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'Class Schedule', 'academics.html#class-schedule', null, 3, true, '2026-09-21T00:16:37.243654+00:00'),
  ('2d1c443e-7fb2-4b3b-8e03-45675abdd078', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'Tentative Schedule', 'academics.html#tentative-schedule', null, 4, true, '2026-09-21T00:16:37.243654+00:00'),
  ('23054c50-74a6-46b2-a813-bc08614d0151', 'b86173c8-705f-4be0-b98e-b42f67be02db', 'Tuition and Fees', 'academics.html#tuition-and-fees', null, 5, true, '2026-09-21T00:16:37.243654+00:00'),
  ('14fade68-4c77-4b9f-8258-adc9bcca161e', 'dc415dc7-9e30-45c2-92a0-4021bff2416c', 'Goals and Objectives', 'about.html#goals', null, 0, true, '2026-09-21T00:16:37.243654+00:00'),
  ('35d66b7c-df85-4a55-a9b3-a2b3e07f3935', 'dc415dc7-9e30-45c2-92a0-4021bff2416c', 'Academic Staff', 'about.html#academic-staff', null, 1, true, '2026-09-21T00:16:37.243654+00:00'),
  ('65dfb05e-241c-450d-b654-fac8ffb3f2d5', 'dc415dc7-9e30-45c2-92a0-4021bff2416c', 'Guest Lecturers', 'about.html#guest-lecturers', null, 2, true, '2026-09-21T00:16:37.243654+00:00')
on conflict do nothing;

-- settings: 10 แถว
insert into public.settings (key, label, hint, value, kind, sort_order, is_visible, updated_at) values
  ('form.endpoint', 'ปลายทางฟอร์มติดต่อ', 'URL ของ Formspree หรือ FormSubmit เช่น https://formspree.io/f/abcd1234 — เว้นว่างแล้วฟอร์มจะเปิดโปรแกรมอีเมลของผู้ใช้แทน', '', 'url', 0, true, '2026-09-21T00:15:56.672902+00:00'),
  ('contact.email', 'อีเมลติดต่อโครงการ', 'ใช้ในหน้า Contact และเป็นผู้รับข้อความจากฟอร์ม', 'TEFL.Chula@gmail.com', 'email', 1, true, '2026-09-21T00:15:56.672902+00:00'),
  ('contact.phone', 'เบอร์โทรที่แสดง', 'ข้อความที่คนเห็น เช่น 0–2218–2565', '0–2218–2565', 'text', 2, true, '2026-09-21T00:15:56.672902+00:00'),
  ('contact.phone_href', 'เบอร์โทรสำหรับกดโทร', 'รูปแบบสากลไม่มีช่องว่าง เช่น +6622182565', '+6622182565', 'text', 3, true, '2026-09-21T00:15:56.672902+00:00'),
  ('map.place', 'สถานที่บนแผนที่', 'ชื่อสถานที่ที่ Google Maps ค้นเจอ — ใช้ทั้งแผนที่ฝังและปุ่มนำทาง', 'Faculty of Education, Chulalongkorn University', 'text', 4, true, '2026-09-21T00:15:56.672902+00:00'),
  ('social.facebook', 'Facebook', 'URL เต็มของเพจ', 'https://www.facebook.com/TEFL.Chula/', 'url', 10, true, '2026-09-21T00:23:56.024991+00:00'),
  ('social.line', 'LINE', 'ลิงก์ LINE Official เช่น https://lin.ee/xxxx — เว้นว่างแล้วไอคอนจะถูกซ่อน', '', 'url', 11, true, '2026-09-21T00:23:56.024991+00:00'),
  ('social.instagram', 'Instagram', 'URL เต็มของบัญชีหรือโพสต์', 'https://www.instagram.com/p/DbiparfD3FO/?img_index=18', 'url', 12, true, '2026-09-21T00:15:56.672902+00:00'),
  ('music.enabled', 'เปิดเพลงประกอบ', 'ปิดแล้วปุ่มลำโพงกับเพลงจะหายจากทุกหน้า', 'true', 'bool', 20, true, '2026-09-21T00:15:56.672902+00:00'),
  ('music.src', 'ไฟล์เพลง', 'อัปโหลดไฟล์ .m4a/.mp3 แล้ววาง URL หรือใช้พาธในเว็บ เช่น img/song.m4a', 'img/song.m4a', 'url', 21, true, '2026-09-21T00:15:56.672902+00:00')
on conflict do nothing;
