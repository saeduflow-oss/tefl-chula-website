/* =========================================================
   admin/js/schema.js — นิยามของแต่ละชุดข้อมูล (ตาราง ช่องกรอก การจัดกลุ่ม)
   หน้ารายการและแผงแก้ไขทั้งหมดสร้างจากตารางนี้ตัวเดียว เพิ่มชุดข้อมูลใหม่ = เพิ่มบล็อกที่นี่
   อ้างถึงฟังก์ชันของหน้าอื่น (facebookView, syncFacebook, dmy) แบบเรียกทีหลังเสมอ
   เพราะไฟล์นี้โหลดก่อนพวกนั้น ถ้าอ้างตรง ๆ ตอนประกาศจะได้ undefined
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- นิยามของแต่ละชุดข้อมูล ----------
   หน้าจอทั้งหมดสร้างจากตารางนี้ตัวเดียว เพิ่มชุดข้อมูลใหม่ = เพิ่มบล็อกที่นี่
   t: text | area | html | rich | bool | boolstr | image | select
   listT/listS = ข้อความคอลัมน์ชื่อ/รายละเอียดในตาราง
   menu = กลุ่มในแถบข้าง */
const SCHEMA = {
  blocks: {
    label:'ข้อความในหน้า', title:'ข้อความและหัวข้อในแต่ละหน้า', menu:'เนื้อหาเว็บ',
    where:'ย่อหน้า หัวข้อ และคำอธิบายทุกหน้าของเว็บ กดแก้ไขแล้วพิมพ์ได้เหมือนใน Word', link:'index.html',
    /* บล็อกผูกกับตำแหน่งในไฟล์ HTML: เพิ่ม ลบ หรือสลับลำดับเองไม่ได้
       ต้องเรียงตามหน้าก่อน ไม่งั้นบล็อกของแต่ละหน้าจะสลับปนกันเพราะ sort_order ซ้ำข้ามหน้า */
    pk:'key', noAdd:true, noDelete:true, noOrder:true,
    order:'page.asc,sort_order.asc',
    listT:r=>r.label,
    listS:r=>r.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,120),
    groupBy:r=>({'(ทุกหน้า)':'ส่วนท้ายเว็บ (ใช้ร่วมทุกหน้า)','index.html':'หน้าแรก',
                 'about.html':'About','academics.html':'Academics','admission.html':'Admission',
                 'research.html':'Research','activities.html':'Activities','faqs.html':'FAQs',
                 'forms-and-links.html':'Forms and Links','contact.html':'Contact'})[r.page] || r.page,
    fields:[ {k:'html', t:'rich', label:'เนื้อหา'} ]
  },
  nav: {
    label:'เมนู', title:'เมนูหลักด้านบน', menu:'เนื้อหาเว็บ',
    where:'แถบเมนูบนสุดของทุกหน้า และเมนูในมือถือ', link:'index.html',
    listT:r=>r.label, listS:r=>r.href + (r.dd_title ? '  ·  หัวดรอปดาวน์: ' + r.dd_title : ''),
    /* เรียงเป็นต้นไม้: รายการบนตามลำดับ แล้วตามด้วยรายการย่อยของมัน
       ถ้าเรียงตาม sort_order ดิบ ๆ รายการย่อยของทุกเมนูจะปนกันหมด */
    sortRows:rows=>{
      const tops = rows.filter(r=>!r.parent_id).sort((a,b)=>a.sort_order-b.sort_order);
      return tops.flatMap(t=>[t, ...rows.filter(r=>r.parent_id===t.id).sort((a,b)=>a.sort_order-b.sort_order)]);
    },
    groupBy:r=>r.parent_id ? '↳ ในดรอปดาวน์ของ ' + (rows.find(x=>x.id===r.parent_id)||{}).label : 'แถบเมนูบน: ' + r.label,
    fields:[
      {k:'label', t:'text', label:'ข้อความบนเมนู', req:true},
      {k:'href', t:'text', label:'ลิงก์', req:true,
       hint:'พิมพ์ชื่อหน้า เช่น about.html หรือถ้าจะให้เลื่อนไปหัวข้อในหน้านั้น ใส่ # ต่อท้าย เช่น about.html#goals'},
      {k:'parent_id', t:'select', label:'อยู่ที่ไหน',
       opts:rows=>[['','แถบเมนูบนสุด'], ...rows.filter(r=>!r.parent_id).map(r=>[r.id, 'ในดรอปดาวน์ของ ' + r.label])]},
      {k:'dd_title', t:'text', label:'หัวดรอปดาวน์',
       hint:'ใช้เฉพาะรายการบนสุดที่มีรายการย่อย เช่น "About the Program" ไม่มีรายการย่อยเว้นว่างได้'}
    ]
  },
  settings: {
    label:'ข้อมูลติดต่อและลิงก์', title:'ข้อมูลติดต่อ โซเชียล และการตั้งค่า', menu:'เนื้อหาเว็บ',
    where:'อีเมล เบอร์โทร แผนที่ ปุ่มโซเชียลท้ายเว็บ และเพลงประกอบ', link:'contact.html',
    /* ค่าตั้งไม่มีแนวคิด "ซ่อน": ซ่อนแล้ว cms.js จะไม่ได้รับค่านั้นเลย หน้าเว็บกลับไปใช้ค่าในไฟล์
       ซึ่งดูเหมือน "แก้แล้วไม่ขึ้น" จึงตัดปุ่มออก อยากปิดให้ล้างค่าเป็นว่างแทน */
    pk:'key', noAdd:true, noDelete:true, noOrder:true, noHide:true,
    listT:r=>r.label, listS:r=>r.value || 'ยังไม่ได้ใส่',
    groupBy:r=>({form:'ฟอร์มติดต่อ', contact:'ช่องทางติดต่อ', map:'แผนที่', social:'โซเชียลมีเดีย', facebook:'โพสต์จาก Facebook', music:'เพลงประกอบ'})[r.key.split('.')[0]] || 'อื่น ๆ',
    /* แต่ละแถวคือค่าคนละชนิด ช่องกรอกจึงต้องสร้างจากตัวแถวเอง ไม่ใช่รายการตายตัว */
    fields:r=>[{k:'value', t:r.kind==='bool' ? 'boolstr' : 'text', label:r.label, hint:r.hint}]
  },
  staff: {
    label:'อาจารย์', title:'อาจารย์ประจำ', thumb:'photo', menu:'บุคลากร',
    where:'หน้า About ส่วน Academic Staff', link:'about.html#academic-staff',
    listT:r=>r.name, listS:r=>[r.role, r.ext].filter(Boolean).join(' · '),
    groupBy:r=>r.is_lead ? 'หัวหน้าสาขา (การ์ดใหญ่)' : 'อาจารย์ประจำ',
    fields:[
      {k:'name', t:'text', label:'ชื่อ-นามสกุล', req:true},
      {k:'role', t:'text', label:'ตำแหน่ง', hint:'เช่น Instructor, Program Secretary'},
      {k:'ext',  t:'text', label:'เบอร์ต่อ', hint:'เช่น Ext. 8044 (เว้นว่างได้)'},
      {k:'photo', t:'image', label:'รูปถ่าย'},
      {k:'is_lead', t:'bool', label:'เป็นหัวหน้าสาขา (แสดงเป็นการ์ดใหญ่ด้านบน)'},
      {k:'badge', t:'text', label:'ป้ายบนรูป', hint:'ใช้เฉพาะหัวหน้าสาขา เช่น Program Chair'}
    ]
  },
  lecturers: {
    label:'Guest Lecturers', title:'อาจารย์รับเชิญ (Guest Lecturers)', thumb:'photo', menu:'บุคลากร',
    where:'หน้า About ส่วน Guest Lecturers', link:'about.html#guest-lecturers',
    listT:r=>r.name, listS:r=>[r.course, r.when_text].filter(Boolean).join(' · '),
    fields:[
      {k:'name', t:'text', label:'ชื่อ', req:true},
      {k:'course', t:'text', label:'รหัส + ชื่อวิชา'},
      {k:'when_text', t:'text', label:'ช่วงเวลา', hint:'เช่น Jul 17–26, 2026'},
      {k:'badge', t:'text', label:'ป้าย', hint:'เช่น Most Recent (เว้นว่างได้)'},
      {k:'photo', t:'image', label:'รูปถ่าย'},
      {k:'url', t:'text', label:'ลิงก์ประวัติ'}
    ]
  },
  news: {
    label:'ข่าว/กิจกรรม', title:'ข่าวและกิจกรรม', thumb:'image', menu:'ข้อมูล',
    where:'สไลด์ Latest News หน้าแรก + Announcements หน้า Activities (ข่าว) · สไลด์ Recent Activities (กิจกรรม)', link:'activities.html#announcements',
    listT:r=>r.title, listS:r=>(r.fb_post_id ? 'จาก Facebook' : r.tag),
    /* โพสต์จากเพจดึงเข้ามาโดย Edge Function fb-sync (มี fb_post_id) แก้หัวข้อ/ซ่อนได้ตามปกติ
       แต่ถ้าลบ รอบ sync ถัดไปจะดึงกลับมาใหม่ — ใช้ "ซ่อนจากเว็บ" แทน */
    tools:[{id:'fbSync', label:'ดึงโพสต์จาก Facebook', icon:'facebook', run:b=>syncFacebook(b).then(load)}],
    groupBy:r=>r.placement==='home' ? 'ข่าว — สไลด์หน้าแรก + Announcements' : 'กิจกรรม — สไลด์ Recent Activities',
    fields:[
      {k:'placement', t:'select', label:'แสดงที่', req:true,
       opts:[['home','ข่าว (สไลด์หน้าแรก + Announcements)'],['activities','กิจกรรม (สไลด์ Recent Activities)']]},
      {k:'title', t:'text', label:'หัวข้อ', req:true},
      {k:'tag', t:'text', label:'ป้ายหมวด', hint:'เช่น News & Announcements'},
      {k:'image', t:'image', label:'ภาพประกอบ'},
      {k:'url', t:'text', label:'กดแล้วไปที่ไหน', hint:'วางลิงก์ข่าวหรือโพสต์ Facebook ถ้ายังไม่มีให้ใส่ # ไว้ก่อน'}
    ]
  },
  /* หน้าพิเศษ ไม่ใช่ตาราง: view คือฟังก์ชันวาดหน้าเอง (go() แยกทางให้) */
  facebook: { label:'Facebook', menu:'ข้อมูล', noAdd:true, view:()=>facebookView() },
  events: {
    label:'ปฏิทินกิจกรรม', title:'ปฏิทินกิจกรรม (Event Calendar)', menu:'ข้อมูล',
    where:'หน้า Activities ส่วน Event Calendar เรียงตามวันที่เริ่มเสมอ', link:'activities.html#calendar',
    /* เรียงตามวันบนเว็บอยู่แล้ว ปุ่มเลื่อนลำดับจึงไม่มีความหมาย */
    noOrder:true, order:'starts_on.desc',
    listT:r=>r.title,
    listS:r=>[dmy(r.starts_on) + (r.ends_on && r.ends_on !== r.starts_on ? ' – ' + dmy(r.ends_on) : ''), r.time_text, r.location].filter(Boolean).join(' · '),
    groupBy:r=>((r.ends_on || r.starts_on) >= today() ? 'กำลังจะมาถึง' : 'ผ่านไปแล้ว (ยังแสดงบนเว็บแบบจาง)'),
    fields:[
      {k:'title', t:'text', label:'ชื่อกิจกรรม', req:true},
      {k:'starts_on', t:'date', label:'วันที่เริ่ม', req:true},
      {k:'ends_on', t:'date', label:'วันที่สิ้นสุด', hint:'เว้นว่างถ้าเป็นกิจกรรมวันเดียว'},
      {k:'time_text', t:'text', label:'เวลา', hint:'พิมพ์อิสระ เช่น 9:00 AM – 4:00 PM หรือ Every Wednesday'},
      {k:'location', t:'text', label:'สถานที่'},
      {k:'description', t:'area', label:'รายละเอียดสั้น ๆ'},
      {k:'url', t:'text', label:'ลิงก์รายละเอียด', hint:'เช่น โพสต์ Facebook หรือแบบฟอร์มลงทะเบียน (เว้นว่างได้)'}
    ]
  },
  faqs: {
    label:'FAQ', title:'คำถามที่พบบ่อย', menu:'ข้อมูล',
    where:'หน้า FAQs และส่วนคำถามท้ายหน้าแรก', link:'faqs.html',
    listT:r=>r.question, listS:r=>r.answer.replace(/<[^>]+>/g,'').slice(0,110),
    groupBy:r=>({home:'หน้าแรก', applicants:'ผู้สมัคร', students:'นิสิตปัจจุบัน'})[r.category],
    fields:[
      {k:'category', t:'select', label:'แสดงที่หน้า', req:true,
       opts:[['home','หน้าแรก'],['applicants','FAQs for Applicants'],['students','FAQs for TEFL Students']]},
      {k:'question', t:'text', label:'คำถาม', req:true},
      {k:'answer', t:'rich', label:'คำตอบ', req:true}
    ]
  },
  links: {
    label:'ฟอร์ม/ลิงก์', title:'ฟอร์มดาวน์โหลดและลิงก์ที่มีประโยชน์', menu:'ข้อมูล',
    where:'หน้า Forms and Links', link:'forms-and-links.html',
    listT:r=>r.title, listS:r=>r.url,
    groupBy:r=>r.kind==='form' ? 'ฟอร์มดาวน์โหลด' : 'ลิงก์ที่มีประโยชน์',
    fields:[
      {k:'kind', t:'select', label:'ชนิด', req:true,
       opts:[['form','ฟอร์มดาวน์โหลด'],['useful','ลิงก์ที่มีประโยชน์']]},
      {k:'label', t:'text', label:'ป้ายมุมบน', hint:'เช่น Form 01 หรือ University'},
      {k:'title', t:'text', label:'ชื่อรายการ', req:true},
      {k:'meta', t:'text', label:'คำอธิบายใต้ชื่อ', hint:'เช่น PDF file หรือ chula.ac.th'},
      {k:'url', t:'text', label:'ลิงก์ไฟล์หรือเว็บ', req:true,
       hint:'คัดลอกลิงก์ทั้งบรรทัดจากช่องที่อยู่ของเบราว์เซอร์มาวาง จะได้ไม่พิมพ์ผิด'},
      {k:'icon', t:'select', label:'ไอคอน',
       opts:[['pdf','เอกสาร PDF'],['university','มหาวิทยาลัย'],['faculty','คณะ'],
             ['library','ห้องสมุด'],['registrar','สำนักทะเบียน'],
             ['graduate-school','บัณฑิตวิทยาลัย'],['link','ลิงก์ทั่วไป']]}
    ]
  },
  courses: {
    label:'รายวิชา', title:'รายวิชา', menu:'ข้อมูล',
    where:'หน้า Academics ตาราง List of Courses', link:'academics.html#list-of-courses',
    listT:r=>r.title, listS:r=>[r.code, r.credits].filter(Boolean).join(' · '),
    groupBy:r=>r.group_name,
    fields:[
      {k:'group_name', t:'text', label:'กลุ่มวิชา', req:true,
       hint:'คัดลอกชื่อกลุ่มจากรายการที่มีอยู่มาวาง ต้องเหมือนกันทุกตัวอักษร วิชาถึงจะไปอยู่ตารางเดียวกัน'},
      {k:'code', t:'text', label:'รหัสวิชา'},
      {k:'title', t:'text', label:'ชื่อวิชา', req:true},
      {k:'credits', t:'text', label:'หน่วยกิต', hint:'เช่น 3(3-0-9)'}
    ]
  },
  tuition: {
    label:'ค่าเล่าเรียน', title:'ค่าเล่าเรียน', menu:'ข้อมูล',
    where:'หน้า Academics ตาราง Tuition and Fees', link:'academics.html#tuition-and-fees',
    listT:r=>r.student_group, listS:r=>'รวม ' + (r.total_per_semester||'-') + ' /ภาคการศึกษา',
    fields:[
      {k:'group_name', t:'text', label:'กลุ่มตาราง', req:true},
      {k:'student_group', t:'text', label:'กลุ่มผู้เรียน', req:true},
      {k:'part_university', t:'text', label:'Part 1 (University)'},
      {k:'part_faculty', t:'text', label:'Part 2 (Faculty)'},
      {k:'total_per_semester', t:'text', label:'รวมต่อภาคการศึกษา'}
    ]
  }
};
