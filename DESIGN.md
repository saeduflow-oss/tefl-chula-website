# DESIGN.md — ระบบดีไซน์เว็บไซต์ TEFL

เอกสารอ้างอิงสไตล์และคอมโพเนนต์ของเว็บไซต์ **(TEFL) Teaching English as a Foreign Language**
ใช้เป็นคู่มือเวลาเพิ่มหน้าใหม่ / แก้สไตล์ ให้ทุกหน้าหน้าตาไปในทางเดียวกัน

ไฟล์ที่คุมดีไซน์:

| ไฟล์ | หน้าที่ |
|---|---|
| `fonts/chula.css` | โหลดฟอนต์จุฬาฯ + ประกาศตัวแปรฟอนต์ (`--font-body`, `--font-display`) |
| `site.css` | ตัวแปรสี, reset, ปุ่ม, หัวข้อ, HEADER, FOOTER, PAGE BANNER, การ์ดหน้าย่อย |
| `site.js` | ลิ้นชักเมนู, ค้นหา, ปุ่มกลับขึ้นบน, ปุ่ม Esc |
| `<style>` ในแต่ละหน้า | สไตล์เฉพาะหน้านั้น (hero, missions, staff, ตาราง ฯลฯ) |

ลำดับการโหลดใน `<head>` ต้องเป็น **chula.css → site.css → `<style>` ของหน้า** เสมอ
(ตัวแปรฟอนต์ถูกประกาศใน chula.css และ site.css เรียกใช้)

---

## 1. โครงสร้างเว็บ (Information Architecture)

หน้าเว็บทั้งหมดเป็น HTML ล้วน แบน 1 ชั้น อยู่ที่ root เดียวกัน

```
index.html            หน้าแรก (hero + welcome + missions + courses + programs + intro + news + FAQ)
about.html            About the Program   → #goals, #academic-staff, #guest-lecturers
academics.html        Academics           → #curriculum-info, #list-of-courses, #study-plan,
                                            #class-schedule, #tentative-schedule, #tuition-and-fees
admission.html        Admission           → #admission-requirements, #admission-procedures, #admission-deadline
research.html         Research            → #research-guidelines, #tefl-research-thesis, #tefl-research-ojed
activities.html       Activities          → #activities-list, #intensive-course
forms-and-links.html  Forms and Links     → #request-forms, #thesis-forms,
                                            #research-collaboration-letters, #graduation-request, #useful-links
faqs.html             FAQs
contact.html          Contact
index.backup.html     สำรองหน้าแรก (ไม่ใช้งานจริง)
```

**หลักสำคัญ:** เมนูดรอปดาวน์ลิงก์ไปที่ `#anchor` ของหน้าย่อยโดยตรง
ดังนั้นทุก `<section>` ที่เป็นเป้าหมายเมนู **ต้องมี `id` ตรงตามรายการข้างบน** และต้องมี
`scroll-margin-top:110px` (กัน header sticky บังหัวข้อ) — ค่านี้ตั้งไว้แล้วใน `.content section` และ `.page-content .card`

---

## 2. Design Tokens

### 2.1 สี (`site.css` → `:root`)

| ตัวแปร | ค่า | ใช้ที่ไหน |
|---|---|---|
| `--brand` | `#e8401a` | สีแบรนด์หลัก: eyebrow, ลิงก์, ตัวเลขสถิติ, hover เมนู, จุด carousel |
| `--brand-dark` | `#c33414` | hover ของลิงก์สีแบรนด์, outline โฟกัส |
| `--brand-soft` | `#fff5f2` | พื้นอ่อน: hover ปุ่มไอคอน, แถวตารางที่เน้น, ผลค้นหา |
| `--brand-mid` | `#f3813f` | สต็อปกลางของไล่สีประจำแบรนด์ |
| `--orange` | `#f39a3d` | ปลายไล่สีของแถบ accent / rule |
| `--orange-deep` | `#ef8823` | สำรองสำหรับสีส้มเข้ม |
| `--blue` | `var(--orange)` | alias เก่า (ชี้มาที่ส้มแล้ว) |
| `--blue-dark` | `#9d5543` | alias เก่า |
| `--text-dark` | `#2b2b2b` | ตัวหนังสือหลัก, หัวข้อ |
| `--text-muted` | `#5c5c5c` | เนื้อความรอง, คำอธิบาย |
| `--border-light` | `#ececec` | เส้นขอบการ์ด / เส้นคั่น |
| `--bg` | `#ffffff` | พื้นหลังหน้า |
| `--btn-solid-bg` | `#000000` | ปุ่มทึบ |
| `--btn-solid-bg-hover` | `#2b2b2b` | ปุ่มทึบตอน hover |
| `--btn-outline-border` / `--btn-outline-text` | `#000000` | ปุ่มเส้นขอบ |

**สีอื่นที่ใช้ซ้ำแต่ยังไม่เป็นตัวแปร** (ถ้าจะ refactor ให้เก็บเป็น token):

- footer: `#111111` (พื้น), `#c9c9c9`/`#c4c4c4` (ลิงก์), `#8c8c8c` (copyright), `#2e2e2e` (วงกลมโซเชียล)
- missions: ม่านสีส้มแบรนด์ `rgba(235,91,54,.90) → rgba(232,64,26,.92) → rgba(205,68,33,.94)` (135deg ชุดเดียวกับ `.mission-band`)
- hero/stats: พื้นมืด `#110e0d` + ม่านดำโปร่ง
- social: FB `#1877f2`, LINE `#06c755`, IG gradient `#f9ce34 → #ee2a7b → #6228d7`

### 2.2 ไล่สีประจำแบรนด์ (Signature gradient)

ใช้ซ้ำ 2 จุด — แถบบนสุดของ header และขีดใต้ eyebrow (`.section-head .rule`)

```css
linear-gradient(90deg, var(--brand) 0%, var(--brand-mid) 50%, var(--orange) 100%)
```

ส้มแดง → ส้ม → ส้มทอง คือ "ลายเซ็น" ของเว็บนี้ ห้ามเปลี่ยนลำดับสี

### 2.3 ฟอนต์ (`fonts/chula.css`)

```css
--font-body:    'Chula Charas New','Chulalongkorn','Segoe UI',Tahoma,sans-serif;
--font-display: 'Chulalongkorn','Chula Charas New',Georgia,serif;
```

| ตระกูล | น้ำหนัก/สไตล์ที่มี | ใช้กับ |
|---|---|---|
| Chulalongkorn (display) | 400, 700 | `h1` ในแบนเนอร์/hero, `h2` หัวเซคชัน, eyebrow, ตัวเลขสถิติ, หัวคอลัมน์ footer |
| Chula Charas New (body) | 400, 700, italic, bold-italic | เนื้อความ, เมนู, ปุ่ม, การ์ด, ตาราง |

ทุกไฟล์ฟอนต์ใช้ `font-display:swap` (กันข้อความหายตอนโหลด)
ข้อยกเว้นที่จงใจ: `.intro-title` ใช้ `--font-body` น้ำหนัก 400 ขนาดใหญ่ เพื่อให้ดูเป็นย่อหน้าเล่าเรื่อง ไม่ใช่หัวข้อ

### 2.4 สเกลตัวอักษร

| บทบาท | ขนาด | หมายเหตุ |
|---|---|---|
| Hero h1 | `clamp(31px, 4.8vw, 70px)` / line-height 1.2 | |
| Page banner h1 | `52px` (≤900px → `34px`) | |
| Section h2 | `clamp(28px, 4.2vw, 44px)` | คอมโพเนนต์ `.section-head h2` |
| News/Missions h2 | `clamp(27px, 3.4vw, 40px)` / `clamp(28px, 3vw, 38px)` | |
| Program h3 | `30px` สีแบรนด์ส้ม | |
| การ์ดหน้าย่อย h2 | `24px` | `.page-content .card h2` |
| Eyebrow | `15px`, `letter-spacing:4px`, uppercase | ≤560px → 13px / 2.5px |
| เนื้อความ | `14.5–15px`, line-height `1.75–2` | เว้นบรรทัดกว้างเพราะเป็นภาษาไทย |
| ตัวอักษรปุ่ม | `12.5px`, `700`, `letter-spacing:1px` | variant `is-sm` → 12px |
| ตัวเลขสถิติ | `44px` (stats) / `clamp(38px,4.4vw,56px)` (intro) | |
| คำอธิบายเล็ก / เครดิตรูป | `12.5px` / `10.5px` | |

### 2.5 ระยะ, มุมโค้ง, เงา

**คอนเทนเนอร์:** เนื้อหาหลักกว้าง `1180px` + `padding:0 24px` (คลาส `.container`, `.inner`, `.footer-inner`, `.nc-inner`)
header กว้างกว่าเล็กน้อยที่ `1280px` เพื่อให้เมนูหายใจได้

**ความกว้างพิเศษ:** welcome `860px` · faq `840px` · intro-copy `760px` · search-box `760px` · stats-inner `1080px`

**Padding เซคชัน:** ใช้ `clamp()` เกือบทั้งหมด เช่น
`clamp(48px,5vw,72px)` (missions) · `clamp(40px,4.2vw,58px)` (discover) · `clamp(64px,8vw,112px)` (intro) · `76px 0 84px` (news)

**มุมโค้ง:**

| ค่า | ใช้กับ |
|---|---|
| `999px` | ปุ่มทุกชนิด, breadcrumb, ขีด rule |
| `50%` | ไอคอนกลม, จุดสไลด์, ปุ่มกลับขึ้นบน, ปุ่ม + บนการ์ดคอร์ส |
| `18px` | การ์ดคอร์ส, การ์ดหน้าย่อย |
| `16px` | การ์ดข่าว |
| `14px` | ดรอปดาวน์ (เฉพาะมุมล่าง `0 0 14px 14px`), รูป program |
| `10px` | รายการ FAQ, ผลค้นหา |
| `40px` | `.program-img` (กฎท้ายไฟล์ทับค่า 14px ก่อนหน้า) |

**เงา (ยกสูงขึ้นตามลำดับ):**

```css
0 6px 18px rgba(43,43,43,.10)    /* การ์ดปกติ */
0 12px 28px rgba(0,0,0,.05)      /* การ์ดหน้าย่อย */
0 18px 38px rgba(43,43,43,.20)   /* การ์ดตอน hover */
0 20px 38px -14px rgba(0,0,0,.24)/* ดรอปดาวน์ */
0 8px 22px rgba(0,0,0,.35)       /* ปุ่มกลับขึ้นบน */
```

### 2.6 Breakpoints

| จุดตัด | เกิดอะไรขึ้น |
|---|---|
| `1360px` | header หด (โลโก้ 60px, `--hdr-h:87px`), เมนูตัวเล็กลง |
| `1100px` | **ซ่อนเมนูหลัก → แสดงปุ่มเบอร์เกอร์**, โลโก้ 54px, `--hdr-h:81px` |
| `1024px` | การ์ดคอร์ส 5 → 3 คอลัมน์ |
| `980px` | mission cards 4 → 2 คอลัมน์ |
| `900px` | footer 4 → 2 คอลัมน์, banner h1 เล็กลง, hero padding ลด |
| `760px` | การ์ดคอร์ส 3 → 2 คอลัมน์ |
| `700px` | ปุ่มไอคอน header 40 → 36px |
| `640px` | news padding ลด + หัวเรียงตั้ง, intro-stats เป็นกริด 2×2 |
| `600px` | footer 1 คอลัมน์, footer-bottom จัดกลาง |
| `560px` | mission 1 คอลัมน์, eyebrow เล็กลง, การ์ด staff/ตารางปรับ |
| `460px` | การ์ดคอร์ส 1 คอลัมน์ + เปลี่ยนสัดส่วนเป็น 16/10 |

`--hdr-h` คือความสูง header จริง (97 / 87 / 81px) ใช้คำนวณ `min-height` ของ hero — **ถ้าแก้ขนาดโลโก้หรือ padding ของ header ต้องแก้ `--hdr-h` ตาม** ไม่งั้น hero จะสูงเกินจอ

---

## 3. คอมโพเนนต์ร่วม (อยู่ใน `site.css` ใช้ได้ทุกหน้า)

### 3.1 ปุ่ม — `.btn-base`

ปุ่มทรงแคปซูล + ลูกศรเส้นบาง เป็นระบบเดียวของทั้งเว็บ (คลาสเก่า `.btn-link` `.btn-ghost` `.btn-solid` ถูกยุบมารวมที่นี่แล้ว)

```html
<a href="#" class="btn-base is-solid">
  ดูรายละเอียด
  <svg class="arrow" viewBox="0 0 26 14" aria-hidden="true">…</svg>
</a>
```

| variant | หน้าตา |
|---|---|
| `.is-solid` | พื้นดำ ตัวหนังสือขาว → hover เป็น `#2b2b2b` |
| `.is-outline` | พื้นขาว ขอบดำ → hover/active พื้นดำตัวหนังสือขาว |
| `.is-sm` | เล็กลง (padding `10px 24px`, ลูกศร 20px) |
| `.is-icon` | ลูกศรอย่างเดียว ไม่มีข้อความ |

- hover → ลูกศรเลื่อน `translateX(4px)` (ใส่ `.arrow-left` ถ้าเป็นลูกศรซ้าย จะเลื่อนกลับทาง)
- focus → `outline:2px solid #000` + `outline-offset:3px`
- **override รายเซคชัน:** ใน `.missions` ปุ่ม outline กลับเป็นขาวล้วน (พื้นส้มเข้ม) และ `.intro-btn` เป็นขาวโปร่ง + blur

### 3.2 หัวเซคชัน — `.section-head`

```html
<div class="section-head">
  <p class="eyebrow">ABOUT US</p>
  <span class="rule"></span>
  <h2>หัวข้อเซคชัน</h2>
</div>
```

eyebrow ส้ม uppercase → ขีดไล่สีแบรนด์ 120×5px → หัวข้อ display font จัดกึ่งกลางทั้งหมด

### 3.3 Header (`.site-header`)

sticky top, `z-index:200`, พื้นขาว, มีแถบ gradient 6px พาดบนสุด (`::before`)
เลย์เอาต์เป็นกริด 3 ช่อง: โลโก้ | เมนู (ชิดขวา) | ปุ่มเครื่องมือ

- **เมนูระดับบน:** hover/focus/`.active` → ขีดดำใต้ข้อความ (`::after` ที่ `top:calc(50% + 13px)` — ผูกกับตัวหนังสือ ไม่ใช่ความสูงแถว เพราะโลโก้สูงกว่าเมนูมาก)
- **ดรอปดาวน์:** การ์ดขาว มุมล่างโค้ง 14px มี `::before` เป็น "สะพานล่องหน" คร่อมช่องว่าง padding เพื่อไม่ให้ hover หลุด
  รายการ **3 อันสุดท้าย** ยึดขวา (`li:nth-last-child(-n+3) .dropdown{left:auto;right:0}`) กันหลุดขอบจอ
- เปิดได้ทั้ง `:hover`, `:focus-within` และคลาส `.open` (เผื่อ JS/สัมผัส)

### 3.4 ลิ้นชักเมนู + ค้นหา (`site.js`)

- **Drawer:** ปุ่มเบอร์เกอร์ (โผล่ ≤1100px) → `site.js` **สร้างเนื้อหาลิ้นชักอัตโนมัติ** โดย clone `.dd-menu` จากเมกะเมนูในมาร์กอัป → ไม่ต้องเขียนเมนูซ้ำสองที่
- **Search:** overlay เต็มจอ, สร้าง index จากลิงก์ในเมนู + footer + `h2` ของ section ที่มี `id` ในหน้านั้น (กลุ่ม "On this page"), แสดงผลสูงสุด 12 รายการ, พิมพ์ ≥2 ตัวอักษรจึงค้น
- ทั้งคู่ล็อก `body` ไม่ให้สกรอลล์ตอนเปิด และปิดด้วย **Esc**
- เปิด API ไว้ที่ `window.siteHeader` → `setDrawer()`, `setSearch()`, `isOverlayOpen()` (หน้าแรกใช้เช็คก่อนรับปุ่มลูกศรเลื่อนสไลด์)

### 3.5 Page banner (`.page-banner`) — ใช้ทุกหน้าย่อย

```html
<section class="page-banner" style="--banner-img:url('img/pic1.jpeg')">
  <div class="inner">
    <nav class="breadcrumb">…</nav>
    <h1>ชื่อหน้า</h1>
    <p class="subtitle">คำอธิบายสั้น ๆ</p>
  </div>
</section>
```

- ภาพพื้นหลัง **เบลอ 7px** อยู่คนละชั้น (`::before`) เพื่อไม่ให้ข้อความเบลอตาม, `inset:-30px` กันขอบขาวจากการเบลอ
- ม่านไล่สีส้ม-ปะการัง (`::after`) เข้มซ้าย → จางขวา ทำให้ข้อความฝั่งซ้ายอ่านได้เสมอ
- ค่าเริ่มต้นคือ `img/pic3.jpeg` — ตอนนี้ทุกหน้าย่อยยังใช้ค่าเริ่มต้น ถ้าอยากให้แต่ละหน้าต่างกัน ให้ตั้ง `--banner-img` inline ตามตัวอย่าง
- breadcrumb เป็นแคปซูลกระจกฝ้า (`backdrop-filter:blur(6px)`) ตัวปัจจุบันตัวหนา

### 3.6 การ์ดหน้าย่อย (`.page-content .card`)

กริด `repeat(auto-fit, minmax(280px,1fr))` gap 22px · การ์ดขาว ขอบ `--border-light` โค้ง 18px · ลิงก์ในการ์ดเป็นสีแบรนด์ส้มขีดเส้นใต้

### 3.7 Footer

4 บล็อกเรียงลงมา:

1. `.footer-cols` — ลิงก์ 4 คอลัมน์ (`1fr 1fr 1fr 1.35fr`) คอลัมน์สุดท้ายใส่ `.is-split` เพื่อแตกเป็น 2 คอลัมน์ย่อยด้วย CSS `columns`
2. `.footer-mid` — โลโก้ + ที่อยู่/ติดต่อ (`auto 1.4fr 1fr`)
3. `.footer-bottom` — copyright + ไอคอนโซเชียล (มีสีแบรนด์จริงของแต่ละแพลตฟอร์ม)
4. `.photo-credits` — เครดิตรูป 10.5px

`.back-top` เป็นปุ่มกลมลอยมุมขวาล่าง โผล่เมื่อเลื่อนเกิน **500px** hover เป็นสีแบรนด์ส้ม

---

## 4. คอมโพเนนต์เฉพาะหน้าแรก (`index.html`)

| เซคชัน | สาระสำคัญ |
|---|---|
| **Hero** | สไลด์ 5 ภาพเต็มจอ (`min-height:calc(100vh - var(--hdr-h))`) เลื่อนด้วย `transform` `.8s cubic-bezier(.4,0,.2,1)` · ม่านดำไล่ทึบล่างให้อ่านออก · ข้อความเฟดเข้า-ออกด้วย `.is-out` · จุดบอกสไลด์ + ปุ่ม ←/→ บนคีย์บอร์ด |
| **Welcome** | ย่อหน้าแนะนำจัดกึ่งกลาง กว้าง 860px |
| **Missions** | พื้นภาพตึก + ม่านสีส้มแบรนด์ · 4 การ์ดไอคอนวงกลมขาว (hover ยก 6px) · 4 → 2 → 1 คอลัมน์ |
| **Discover our courses** | 5 การ์ดแนวตั้ง `aspect-ratio:3/4` · รูปเต็มใบ + ม่านขาวไล่จากบน (ข้อความอ่านออก, เห็นรูปด้านล่าง) · ปุ่ม `+` มุมล่างขวา hover หมุน 90° เป็นพื้นดำ · ใส่รูปผ่าน `style="--img:url(…)"` |
| **Program blocks** | สลับซ้าย-ขวาด้วย `.reverse` · รูปสูง 420px มุมโค้ง 40px · หัวข้อสีแบรนด์ส้ม |
| **Intro (ทำความรู้จักจุฬาฯ)** | พื้นหลังคลื่น SVG 3 ชั้นเบลอ + ดวงแสง 2 ดวง เคลื่อนช้า 22–30s · ม่านขาวไล่จากซ้ายให้ตัวอักษรอ่านง่าย · แถวสถิติสีแบรนด์ส้ม (≤640px เป็นกริด 2×2) |
| **Stats** | แถบภาพมืด ตัวเลขไล่เฉดเทาด้วย `background-clip:text` (มี fallback สีทึบสำหรับเบราว์เซอร์เก่า) |
| **News carousel** | เลื่อนแนวนอนด้วย `scroll-snap` · track ทะลุออกขอบขวาจอ (`margin-right:calc(50% - 50vw)`) · ซ่อน scrollbar · การ์ดกว้าง `clamp(238px,25vw,330px)` หัวข้อ clamp 3 บรรทัด · ปุ่มลูกศร disabled เมื่อสุดทาง |
| **FAQ** | `<details>/<summary>` ล้วน ไม่ใช้ JS · เครื่องหมาย `+` → `–` ตอนเปิด · เปิดอยู่มีเงา |

---

## 5. คอมโพเนนต์เฉพาะ `about.html` (ใช้ซ้ำได้)

- **`.about-intro`** — บล็อกเปิดหน้าจัดกึ่งกลาง (eyebrow + rule + h2 + ย่อหน้า + ปุ่ม)
- **`.goal-grid` / `.goal-card`** — การ์ดเป้าหมาย มีไอคอน 46px, ท้ายการ์ดมีปุ่มกลม `.go` ที่ hover เป็นสีแบรนด์ส้ม
- **`.staff-lead` / `.staff-grid` / `.staff-card`** — การ์ดบุคลากรรูปวงกลม มี `.initials` เป็น fallback เมื่อไม่มีรูป
- **`.table-wrap` + `.data-table`** — ตารางข้อมูล: หัวตารางเน้น, แถวคู่พื้น `#fcfcfd`, hover เป็น `--brand-soft`, แถว `.is-lead` ไฮไลต์ส้ม, `.course` จำกัดกว้าง 330px, จอเล็กเลื่อนแนวนอนได้
- **`.source-note`** — บรรทัดอ้างอิงแหล่งข้อมูล ตัวเล็กสีจาง
- **`.cta-band`** — แถบชวนดำเนินการสีเข้มปิดท้ายหน้า

---

## 5.1 คอมโพเนนต์เฉพาะ `contact.html`

สไตล์อยู่ท้าย `site.css` (บล็อก **CONTACT PAGE**) · สคริปต์ฟอร์มอยู่ท้าย `contact.html`

- **`.contact-split`** — กริดสองการ์ด `1fr 1.14fr` (≤900px ซ้อนลงมาเป็นคอลัมน์เดียว)
  ซ้าย = ข้อมูลติดต่อ · ขวา = ฟอร์ม · ทั้งคู่ใช้ `.contact-panel` (การ์ดขาว โค้ง 18px สูงเท่ากัน)
- **`.ci-list` / `.ci-item`** — แถวข้อมูลติดต่อ กริด `26px 1fr` ไอคอนเส้นสีแบรนด์ส้ม + `.ci-title` + `.ci-text`
  ปิดท้ายด้วย `.ci-social` (ไอคอนกลมพื้น `--brand-soft` hover เป็นไล่สีแบรนด์ส้ม→ส้ม)
- **`.ci-map`** — แผนที่ Google Maps (iframe แบบไม่ต้องใช้ API key) ปิดท้ายการ์ดซ้าย
  `.contact-panel` เป็น flex column และ `.ci-map` ใส่ `flex:1` จึงยืดเติมพื้นที่ว่างให้การ์ดสองใบสูงเท่ากันพอดี
  ปุ่ม `.map-btn` ลอยมุมขวาล่าง (เลี่ยงปุ่ม "Open in Maps" ของ Google ที่อยู่มุมซ้ายบน)
- **`.form-grid` / `.field`** — ฟอร์ม 2 คอลัมน์ (ชื่อ-นามสกุล) ที่เหลือใส่ `.is-full`
  แต่ละช่องมี `.f-error` สำหรับข้อความเตือน และคลาส `.has-error` ที่ตัวหุ้ม `.field`
  `.hp-field` คือกับดักบอทที่ซ่อนไว้ ห้ามลบ
- **`.btn-send`** — ปุ่มส่งพิลล์ไล่สีประจำแบรนด์ (ส้มแดง → ส้ม → ส้มทอง) พร้อมไอคอนเครื่องบินกระดาษ
- **`.form-status`** — กล่องแจ้งผลใต้ฟอร์ม 3 แบบ `.is-ok` / `.is-warn` / `.is-bad` (เพิ่ม `.is-shown` เพื่อแสดง)

**วิธีส่งอีเมลของฟอร์ม:** เว็บนี้เป็น HTML ล้วนไม่มีเซิร์ฟเวอร์ ค่าเริ่มต้นจึงประกอบข้อความแล้ว
เปิดโปรแกรมอีเมลของผู้ใช้ด้วย `mailto:` (ผู้ใช้กด Send เอง) พร้อมปุ่ม "COPY MESSAGE" สำรอง
ถ้าต้องการให้ส่งได้เลยในหน้าเว็บ ให้ใส่ URL ของบริการรับฟอร์ม (Formspree / FormSubmit)
ลงในตัวแปร `FORM_ENDPOINT` ในสคริปต์ท้าย `contact.html` — สคริปต์จะเปลี่ยนไปใช้ `fetch` POST ให้เอง

---

## 5.2 คอมโพเนนต์เฉพาะ `forms-and-links.html`

สไตล์อยู่ท้าย `site.css` (บล็อก **FORMS & LINKS**)

- **`.tile-grid.is-4up`** — กริดการ์ด 4 ใบต่อแถว (11 ใบ = 4+4+3) ลดเหลือ 3 → 2 → 1 คอลัมน์
  ที่ 900 / 640 / 420px เป็นตัวเลือกของ `.tile-grid` เหมือน `.is-5up` ที่ Useful Links ใช้
- **`.dl-card`** — การ์ดดาวน์โหลดฟอร์ม 1 ใบ = 1 ฟอร์ม ใช้หน้าตาและ hover ของ `.tile-card` เดิมทั้งหมด
  `.t-label` = เลขฟอร์ม (Form 01–11 ตรงกับลำดับบนพอร์ทัล) · `.t-meta` = ชนิดไฟล์ · `.t-arrow` = ไอคอนดาวน์โหลด
- **`.dl-stretch`** — `<a>` โปร่งใส `position:absolute; inset:0` ซ้อนทับทั้งใบ ทำให้การ์ด (`<article>`) กดได้ทั้งใบ
  โดยไม่ต้องซ้อนลิงก์ใน `<a>` (ซึ่ง HTML ไม่อนุญาต) · โฟกัสคีย์บอร์ดใช้ `:has(.dl-stretch:focus-visible)`
- **`.t-alt`** — ชิปลิงก์สำรองในการ์ด (ตอนนี้มีแค่ฟอร์มที่ 11 ที่มีไฟล์ Word) ต้องมี `z-index:1` จึงจะกดได้เหนือ `.dl-stretch`
- **`.sr-only`** — ยูทิลิตี้ซ่อนข้อความไว้ให้โปรแกรมอ่านหน้าจอ ใช้บอกชื่อฟอร์มในลิงก์ที่ไม่มีข้อความ
- **`.dl-note`** — บรรทัดหมายเหตุใต้กริด (บอกว่าไฟล์อยู่ที่พอร์ทัลและเปิดในแท็บใหม่)

**ที่มาของไฟล์:** ทั้ง 11 ฟอร์มลิงก์ตรงไปยังไฟล์บน `portal.edu.chula.ac.th` (ไม่ได้เก็บไฟล์ไว้ในเว็บนี้)
ชื่อไฟล์บนพอร์ทัลมีช่องว่าง ต้องเขียนเป็น `%20` ใน `href` เสมอ ไม่งั้นลิงก์จะพัง
ถ้าโปรแกรมอัปเดตฟอร์มแล้วเปลี่ยนชื่อไฟล์ ต้องมาแก้ `href` ในหน้านี้ตาม

---

## 6. Motion & Accessibility

**จังหวะเวลาที่ใช้ซ้ำ:** `.18–.25s ease` (hover ทั่วไป) · `.3s ease` (ยกการ์ด) · `.5s ease` (ซูมรูปในการ์ด) · `.8s cubic-bezier(.4,0,.2,1)` (สไลด์ hero) · 22–30s (แอนิเมชันพื้นหลัง intro)

**สิ่งที่ทำไว้แล้ว:**

- `@media (prefers-reduced-motion:reduce)` ปิดแอนิเมชันของการ์ดคอร์สและพื้นหลัง intro
- `:focus-visible` มี outline ชัดเจนบนปุ่ม, การ์ดคอร์ส, การ์ดข่าว
- ดรอปดาวน์เปิดด้วย `:focus-within` → เข้าถึงได้ด้วยคีย์บอร์ด
- Esc ปิด overlay ทุกชนิด, `aria-expanded` sync กับปุ่ม toggle
- `scroll-margin-top:110px` กัน header บังหัวข้อเวลากดลิงก์ anchor
- ไอคอน SVG ตกแต่งใส่ `aria-hidden="true"`

**สิ่งที่ควรตรวจเพิ่มถ้าจะขยายงาน:**

- คอนทราสต์ของ `--brand` (#e8401a) บนพื้นขาว ≈ **4.0:1** → ผ่านเกณฑ์ AA เฉพาะตัวใหญ่/ตัวหนา (≥18.5px หรือ ≥14px ตัวหนา) **ไม่ผ่านสำหรับข้อความขนาดปกติ** — ถ้าใช้กับข้อความเล็กควรเปลี่ยนเป็น `--brand-dark`
- `.nc-tag` สี `#9b9b9b` บนพื้นขาว ≈ **2.8:1** → ต่ำกว่าเกณฑ์ ควรเข้มขึ้นเป็นราว `#767676`
- `.photo-credits` (10.5px) และ `.stat .label` (12.5px) ผ่านคอนทราสต์แต่ตัวเล็กมาก อ่านยากบนมือถือ
- `prefers-reduced-motion` ยังไม่ครอบคลุมสไลด์ hero (ยังเลื่อนอัตโนมัติ)

---

## 7. Assets

```
fonts/  CHULALONGKORNReg.otf, CHULALONGKORNBold.otf
        ChulaCharasNewReg/Bold/Ita/BoldIta.ttf, chula.css
img/    logo.png, logo.jpg, icon.png
        icon-collab.png, icon-global.png, icon-practical.png, icon-research.png
        mission-collab.jpg, mission-global.jpg, mission-practical.jpg, mission-research.jpg
        pic1–pic5.jpeg   (hero 5 สไลด์ / พื้นหลัง banner, missions, stats)
```

การใช้รูปพื้นหลังซ้ำ: `pic2` = missions · `pic3` = stats + banner ค่าเริ่มต้น · `pic1–pic5` = hero

---

## 8. วิธีเพิ่มหน้าใหม่ (เช็กลิสต์)

1. คัดลอกโครงจาก `about.html` (มีครบทั้ง header, search overlay, drawer, banner, footer)
2. แก้ `<title>` เป็น `ชื่อหน้า | (TEFL) Teaching English as a Foreign Language`
3. ตั้งภาพแบนเนอร์: `<section class="page-banner" style="--banner-img:url('img/…')">` + แก้ breadcrumb
4. ใส่ `class="active"` ให้เมนูหลักของหมวดนั้น และ `class="current"` ให้ลิงก์ในดรอปดาวน์
5. เขียนเนื้อหาใน `.content` โดยทุก `<section>` มี `id` ตรงกับที่เมนูลิงก์ไป
6. **เพิ่มลิงก์หน้าใหม่ในเมนูของ *ทุก* หน้า** (header เป็นมาร์กอัปซ้ำในทุกไฟล์ ไม่ได้ include) — ลิ้นชักและช่องค้นหาจะอัปเดตตามเอง
7. ปิดท้ายด้วย `<script src="site.js"></script>`
8. ตรวจที่ 1360 / 1100 / 900 / 560px และลองกด Tab กับ Esc

> **ข้อจำกัดที่ควรรู้:** header/footer ถูกทำซ้ำใน HTML ทุกไฟล์ (ไม่มี templating) → แก้เมนูครั้งหนึ่งต้องแก้ 9 ไฟล์ ถ้าเว็บโตกว่านี้ควรย้ายไปใช้ static site generator หรือฉีด header ด้วย JS
