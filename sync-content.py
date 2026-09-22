#!/usr/bin/env python3
"""
sync-content.py — เขียนเนื้อหาจากฐานข้อมูล CMS กลับลงไฟล์ HTML

ทำไมต้องมี:
  cms.js ดึงเนื้อหาจาก Supabase มาทับตอนหน้าเว็บโหลด คนทั่วไปจึงเห็นของใหม่เสมอ
  แต่ HTML ในไฟล์จะค้างอยู่ที่เนื้อหาวันที่ commit ล่าสุด ซึ่งมีผลสองอย่าง
    1. Google อ่าน HTML ดิบเป็นหลัก ถ้าไฟล์ค้าง เนื้อหาที่ถูก index ก็ค้างตาม
    2. ถ้า Supabase ล่ม ผู้ชมจะเห็นเนื้อหาสำรองในไฟล์ ซึ่งควรใกล้เคียงของจริง
  สคริปต์นี้จึงดึงของล่าสุดมาเขียนทับส่วนที่อยู่ในกรอบ data-cms ให้ไฟล์ตรงกับฐานข้อมูล

วิธีใช้:
    python3 sync-content.py           # เขียนทับไฟล์จริง
    python3 sync-content.py --check   # ดูว่ามีอะไรต่างบ้าง ไม่แก้ไฟล์

ควรรันเมื่อไหร่: หลังแก้เนื้อหาผ่าน /admin เสร็จแล้ว ก่อน commit + deploy
มาร์กอัปที่สร้างต้องตรงกับ cms.js เป๊ะ ๆ — แก้ที่ไหนต้องแก้อีกที่ด้วยเสมอ
"""

import json
import re
import subprocess
import sys

URL = 'https://dpyhvsdtbihssapuwert.supabase.co'
KEY = 'sb_publishable_f5Y0D69E80W_f7B5E5cgtQ_NV-H2kyN'


def fetch(table):
    """ใช้ curl แทน urllib โดยตั้งใจ

    Python ที่ติดตั้งจาก python.org บน macOS ไม่ได้ผูกกับ CA ของระบบ
    urllib จึงล้มด้วย CERTIFICATE_VERIFY_FAILED เว้นแต่จะรัน
    "Install Certificates.command" ก่อน ซึ่งเป็นกับดักที่คนเจอบ่อย
    ส่วน curl ใช้ keychain ของ macOS อยู่แล้วและมีติดเครื่องเสมอ
    """
    out = subprocess.run(
        ['curl', '-fsS',
         f'{URL}/rest/v1/{table}?select=*&is_visible=eq.true&order=sort_order.asc',
         '-H', f'apikey: {KEY}', '-H', f'Authorization: Bearer {KEY}'],
        capture_output=True, text=True)
    if out.returncode != 0:
        raise SystemExit(f'ดึงตาราง {table} ไม่สำเร็จ: {out.stderr.strip()}')
    return json.loads(out.stdout)


def esc(v):
    return (str('' if v is None else v).replace('&', '&amp;').replace('<', '&lt;')
            .replace('>', '&gt;').replace('"', '&quot;'))


ARROW = ('<span class="l-arrow" aria-hidden="true">'
         '<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>')
TILE_ARROW = ('<span class="t-arrow" aria-hidden="true">'
              '<svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></span>')
DL_ARROW = ('<span class="t-arrow" aria-hidden="true">'
            '<svg viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4"/>'
            '<path d="M5 19.2h14"/></svg></span>')

# ชุดไอคอนเดียวกับใน cms.js (ย่อบรรทัดเดียวเพื่อให้ HTML ที่เขียนออกไปอ่านง่าย)
ICONS = {
    'pdf': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11z"/><path d="M21 4v7h7"/><path d="M13 19h10M13 24h7"/></svg>',
    'university': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 4 4 11h28z"/><path d="M8 11v14M14 11v14M22 11v14M28 11v14"/><path d="M4 25h28"/><path d="M2 31h32"/></svg>',
    'faculty': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30V9l12-5 12 5v21"/><path d="M6 30h24"/><path d="M14 30v-8h8v8"/><path d="M13 14h10M13 18h10"/></svg>',
    'library': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h10a3 3 0 0 1 3 3v19a3 3 0 0 0-3-3H5z"/><path d="M31 7H21a3 3 0 0 0-3 3v19a3 3 0 0 1 3-3h10z"/></svg>',
    'registrar': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h20a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M13 12h10M13 18h10M13 24h6"/></svg>',
    'graduate-school': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 3 13l15 7 15-7z"/><path d="M9 16v8c0 2 4 4 9 4s9-2 9-4v-8"/></svg>',
    'link': '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="14"/><path d="M4 18h28"/><path d="M18 4c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14z"/></svg>',
}


def icon(name):
    return ICONS.get(name or 'link', ICONS['link'])


# ---------- ตัวสร้างมาร์กอัป (ต้องตรงกับ cms.js) ----------

def staff_lead(s):
    badge = f'<span class="badge">{esc(s["badge"])}</span>' if s.get('badge') else ''
    return (f'<div class="staff-photo">'
            f'<img src="{esc(s["photo"])}" alt="{esc(s["name"])}" loading="lazy" decoding="async">'
            f'{badge}</div>'
            f'<div class="lead-info"><div class="li-role">{esc(s["role"])}</div>'
            f'<h3 class="li-name">{esc(s["name"])}</h3><span class="li-rule"></span></div>')


def staff_card(s):
    ext = f'<div class="s-ext">{esc(s["ext"])}</div>' if s.get('ext') else ''
    return (f'<div class="staff-card"><div class="staff-photo">'
            f'<img src="{esc(s["photo"])}" alt="{esc(s["name"])}" loading="lazy" decoding="async">'
            f'<div class="s-body"><div class="s-name">{esc(s["name"])}</div>'
            f'<div class="s-role">{esc(s["role"])}</div>{ext}</div></div></div>')


def lecturer_card(l):
    badge = f'<span class="badge">{esc(l["badge"])}</span>' if l.get('badge') else ''
    when = f'<span class="when">{esc(l["when_text"])}</span>' if l.get('when_text') else ''
    return (f'<a class="lecturer-card" href="{esc(l["url"])}" target="_blank" rel="noopener">'
            f'<img class="l-photo" src="{esc(l["photo"])}" alt="{esc(l["name"])}" loading="lazy" decoding="async">'
            f'{badge}<div class="l-body"><div class="l-name">{esc(l["name"])}</div>'
            f'<p class="l-meta">{esc(l["course"])}{when}</p></div>{ARROW}</a>')


def faq_item(f):
    # answer เก็บเป็น HTML อยู่แล้ว จึงไม่ escape
    return (f'<details class="faq-item"><summary>{esc(f["question"])}</summary>'
            f'<div class="answer">{f["answer"]}</div></details>')


def news_card(n):
    tag = f'<span class="nc-tag">{esc(n["tag"])}</span>' if n.get('tag') else ''
    return (f'<article class="nc-card"><a href="{esc(n.get("url") or "#")}">'
            f'<div class="nc-thumb"><img src="{esc(n["image"])}" alt=""></div>'
            f'<div class="nc-body"><h3>{esc(n["title"])}</h3>{tag}</div></a></article>')


MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December']


def render_events(rows):
    """ปฏิทินกิจกรรม — ต้องตรงกับ renderEvents() ใน cms.js
    คืนเป็นรายการบรรทัด (หัวเดือน + การ์ด) เรียงตามวันเริ่ม ไม่ใช่ sort_order
    .is-past คำนวณจาก "วันนี้" ตอนรัน ไฟล์จึงอาจต่างจากที่เบราว์เซอร์คำนวณเล็กน้อยเมื่อเวลาผ่านไป
    """
    from datetime import date
    today = date.today().isoformat()

    def ymd(iso):
        y, m, d = iso.split('-')
        return int(y), int(m) - 1, int(d)

    out, month = [], ''
    for e in sorted(rows, key=lambda r: r['starts_on']):
        y, m, d = ymd(e['starts_on'])
        key = f'{MONTHS[m]} {y}'
        if key != month:
            out.append(f'<div class="ev-month">{key}</div>')
            month = key
        meta = []
        if e.get('ends_on') and e['ends_on'] != e['starts_on']:
            _, tm, td = ymd(e['ends_on'])
            meta.append(f'{MONTHS[m][:3]} {d} \u2013 {MONTHS[tm][:3]} {td}')
        if e.get('time_text'):
            meta.append(esc(e['time_text']))
        if e.get('location'):
            meta.append(esc(e['location']))
        past = ' is-past' if (e.get('ends_on') or e['starts_on']) < today else ''
        title = (f'<a href="{esc(e["url"])}" target="_blank" rel="noopener">{esc(e["title"])}</a>'
                 if e.get('url') else esc(e['title']))
        meta_h = f'<p class="ev-meta">{" \u00b7 ".join(meta)}</p>' if meta else ''
        desc = f'<p class="ev-desc">{esc(e["description"])}</p>' if e.get('description') else ''
        out.append(f'<article class="ev-item{past}"><div class="ev-date"><span class="ev-d">{d}</span>'
                   f'<span class="ev-m">{MONTHS[m][:3]}</span></div>'
                   f'<div class="ev-body"><h3>{title}</h3>{meta_h}{desc}</div></article>')
    return out


def form_card(l):
    label = f'<span class="t-label">{esc(l["label"])}</span>' if l.get('label') else ''
    meta = f'<p class="t-meta">{esc(l["meta"])}</p>' if l.get('meta') else ''
    return (f'<article class="tile-card dl-card">{label}'
            f'<div class="t-name">{esc(l["title"])}</div>{meta}'
            f'<div class="t-foot"><span class="t-ic">{icon(l.get("icon"))}</span>{DL_ARROW}</div>'
            f'<a class="dl-stretch" href="{esc(l["url"])}" target="_blank" rel="noopener">'
            f'<span class="sr-only">Download {esc(l["title"])}</span></a></article>')


def useful_card(l):
    label = f'<span class="t-label">{esc(l["label"])}</span>' if l.get('label') else ''
    meta = f'<p class="t-meta">{esc(l["meta"])}</p>' if l.get('meta') else ''
    return (f'<a href="{esc(l["url"])}" target="_blank" rel="noopener" class="tile-card">{label}'
            f'<div class="t-name">{esc(l["title"])}</div>{meta}'
            f'<div class="t-foot"><span class="t-ic">{icon(l.get("icon"))}</span>{TILE_ARROW}</div></a>')


def course_row(c):
    return (f'<tr><td class="code">{esc(c["code"])}</td><td>{esc(c["title"])}</td>'
            f'<td class="credits">{esc(c["credits"])}</td></tr>')


CHEV = ('<svg class="chev" viewBox="0 0 24 24" fill="currentColor">'
        '<path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>')


def slug(v):
    return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', str(v).lower()))


def nav_items(rows, page):
    """เมนูหลัก — ต้องตรงกับ renderNav() ใน cms.js
    class="active" ใส่ให้เมนูของหน้าที่กำลังเขียน จึงต้องเรียกแยกทีละหน้า"""
    out = []
    for t in [r for r in rows if not r.get('parent_id')]:
        kids = [r for r in rows if r.get('parent_id') == t['id']]
        active = ' class="active"' if t['href'].split('#')[0] == page else ''
        dd = f' data-dropdown="dd-{slug(t["label"])}"' if kids else ''
        h = f'<li><a href="{esc(t["href"])}"{active}{dd}>{esc(t["label"])}{CHEV if kids else ""}</a>'
        if kids:
            title = (f'<a class="dd-title" href="{esc(t["href"])}">{esc(t["dd_title"])}</a>'
                     if t.get('dd_title') else '')
            h += (f'<div class="dropdown" id="dd-{slug(t["label"])}"><div class="dd-menu">{title}<ul>'
                  + ''.join(f'<li><a href="{esc(k["href"])}">{esc(k["label"])}</a></li>' for k in kids)
                  + '</ul></div></div>')
        out.append(h + '</li>')
    return out


def apply_settings(html, st):
    """ใส่ค่าเชื่อมต่อลงองค์ประกอบที่มาร์ก data-setting-* — กติกาเดียวกับ applySettings() ใน cms.js"""
    def set_attr(tag, attr, val):
        if re.search(rf'\s{attr}="', tag):
            return re.sub(rf'(\s{attr}=")[^"]*(")', lambda m: m.group(1) + val + m.group(2), tag, count=1)
        return tag[:-1] + f' {attr}="{val}">'

    def href_sub(m):
        tag, key = m.group(0), m.group(1)
        if key not in st:
            return tag
        v = st[key].strip()
        pre = re.search(r'data-setting-prefix="([^"]*)"', tag)
        return set_attr(tag, 'href', esc((pre.group(1) if pre else '') + v) if v else '#')
    html = re.sub(r'<a\b[^>]*data-setting-href="([^"]+)"[^>]*>', href_sub, html)

    def text_sub(m):
        key = m.group(2)
        return m.group(1) + esc(st[key]) + m.group(3) if st.get(key, '').strip() else m.group(0)
    html = re.sub(r'(<a\b[^>]*data-setting-text="([^"]+)"[^>]*>)[^<]*(</a>)', text_sub, html)

    place = st.get('map.place', '').strip()
    if place:
        from urllib.parse import quote
        q = quote(place, safe='')
        html = re.sub(r'(<iframe\b[^>]*data-setting-map="embed"[^>]*?\ssrc=")[^"]*(")',
                      lambda m: m.group(1) + f'https://www.google.com/maps?q={q}&amp;hl=en&amp;z=17&amp;output=embed' + m.group(2), html)
        html = re.sub(r'(<a\b[^>]*data-setting-map="directions"[^>]*?\shref=")[^"]*(")',
                      lambda m: m.group(1) + f'https://www.google.com/maps/dir/?api=1&amp;destination={q}' + m.group(2), html)
    return html


def tuition_row(t):
    return (f'<tr><td>{esc(t["student_group"])}</td>'
            f'<td class="num-cell">{esc(t["part_university"])}</td>'
            f'<td class="num-cell">{esc(t["part_faculty"])}</td>'
            f'<td class="total">{esc(t["total_per_semester"])}</td></tr>')


# ---------- แทนที่เนื้อหาในกรอบ data-cms ----------

def empty_collections(inner):
    """ล้างเนื้อในกรอบ data-cms ทิ้ง ใช้ตอน 'เทียบ' บล็อกเท่านั้น

    บล็อกเก็บแค่โครง section ส่วนการ์ดข้างในเป็นของตารางคอลเลกชัน
    ถ้าเทียบตรง ๆ จะเห็นว่าต่างทุกครั้ง (ไฟล์มีการ์ดเต็ม ฐานข้อมูลว่าง) ทั้งที่ถูกต้องแล้ว
    """
    out, pos = '', 0
    for m in re.finditer(r'<(\w+)([^>]*data-cms="[^"]*"[^>]*)>', inner):
        out += inner[pos:m.end()]
        pos = close_tag(inner, m.end(), m.group(1))
    return out + inner[pos:]


def close_tag(s, open_end, tag):
    depth, pos = 1, open_end
    pat = re.compile(rf'</?{tag}\b', re.I)
    while depth:
        m = pat.search(s, pos)
        if not m:
            raise SystemExit('หาแท็กปิดไม่เจอ')
        depth += -1 if s[m.start():m.start() + 2] == '</' else 1
        pos = m.end()
    return s.rfind('<', open_end, pos)


def replace_block(html, hook, inner, group=None, attr=None, norm=None):
    """หาแท็กเปิดที่มีแอตทริบิวต์ที่ระบุ แล้วแทนที่เนื้อหาข้างในจนถึงแท็กปิดที่คู่กัน

    ต้องนับแท็กซ้อนเอง เพราะ regex แบบ non-greedy จะไปหยุดที่ </div> ตัวแรก
    ซึ่งเป็น div ลูกข้างใน ไม่ใช่ตัวปิดของกรอบ
    """
    if attr is None:
        attr = f'data-cms="{hook}"'
        if group is not None:
            attr += f' data-group="{group}"'
    m = re.search(r'<(\w+)[^>]*' + re.escape(attr) + r'[^>]*>', html)
    if not m:
        return html, False
    tag, start = m.group(1), m.end()
    depth, pos = 1, start
    pattern = re.compile(rf'</?{tag}\b', re.I)
    while depth:
        n = pattern.search(html, pos)
        if not n:
            raise SystemExit(f'หาแท็กปิดของ {hook} ไม่เจอ')
        depth += -1 if html[n.start():n.start() + 2] == '</' else 1
        pos = n.end()
    end = html.rfind('<', start, pos)

    indent = ' ' * (m.start() - html.rfind('\n', 0, m.start()) - 1 + 2)
    body = '\n' + '\n'.join(indent + x for x in inner) + '\n' + indent[:-2]

    # เทียบแบบยุบช่องว่างทิ้งก่อน ไม่งั้นจะรายงานว่า "ต่าง" ทุกครั้ง
    # ทั้งที่เนื้อหาเหมือนกันเป๊ะ ต่างแค่การจัดย่อหน้าในไฟล์ที่เขียนด้วยมือ
    squash = lambda s: re.sub(r'>\s+<', '><', re.sub(r'\s+', ' ', s)).strip()
    prep = (lambda s: squash(norm(s))) if norm else squash
    return html[:start] + body + html[end:], prep(html[start:end]) != prep(body)


ALL_PAGES = ['index.html', 'about.html', 'academics.html', 'admission.html',
             'research.html', 'activities.html', 'faqs.html',
             'forms-and-links.html', 'contact.html']


def sync_blocks(blocks, check, st):
    """เขียนข้อความบรรยายกลับลงไฟล์

    ต้องทำก่อนคอลเลกชันเสมอ เพราะข้อความที่เก็บไว้มีกรอบ data-cms แบบว่างเปล่าอยู่ข้างใน
    ถ้าเขียนทีหลังจะไปลบการ์ดที่เพิ่งเติมเสร็จทิ้ง (เหตุผลเดียวกับใน cms.js)
    """
    changed = 0
    for path in ALL_PAGES:
        html = open(path, encoding='utf-8').read()
        original = html
        for b in blocks:
            # บล็อก site/* คือ footer ที่ซ้ำอยู่ในทุกหน้า ต้องเขียนให้ครบทุกไฟล์
            if b['page'] not in (path, '(ทุกหน้า)'):
                continue
            attr = f'data-cms-block="{b["key"]}"'
            if attr not in html:
                continue
            # ใส่ค่าเชื่อมต่อลงบล็อก "ก่อน" เขียน ไม่งั้นบล็อกกับ settings จะเขียนทับกันไปมาไม่รู้จบ
            # (บล็อกเขียน &ndash; → settings แทนเป็นอักขระตรง → รอบหน้าบล็อกเห็นว่าต่างอีก)
            html, diff = replace_block(html, None, [apply_settings(b['html'], st)], attr=attr,
                                       norm=empty_collections)
            if diff:
                changed += 1
                print(f'  {path:24} {b["label"][:40]}')
        if html != original and not check:
            open(path, 'w', encoding='utf-8').write(html)
    return changed


def main():
    check = '--check' in sys.argv
    data = {t: fetch(t) for t in
            ('staff', 'lecturers', 'faqs', 'news', 'links', 'courses', 'tuition', 'events')}
    st = {r['key']: r.get('value') or '' for r in fetch('settings')}
    blocks_changed = sync_blocks(fetch('blocks'), check, st)
    nav_rows = fetch('nav')

    lead = [s for s in data['staff'] if s['is_lead']]
    rest = [s for s in data['staff'] if not s['is_lead']]
    by = lambda t, k, v: [r for r in data[t] if r[k] == v]

    plan = {
        'about.html': [
            ('staff-lead', [staff_lead(lead[0])] if lead else [], None),
            ('staff-grid', [staff_card(s) for s in rest], None),
            ('lecturers', [lecturer_card(l) for l in data['lecturers']], None),
        ],
        'index.html': [
            # หน้าแรกโชว์แค่ N ใบแรก (news.home_count) หน้า Activities (Announcements) โชว์ครบ — กติกาเดียวกับ cms.js
            ('news-home', [news_card(n) for n in by('news', 'placement', 'home')][:int(st.get('news.home_count') or 6)], None),
            ('faqs-home', [faq_item(f) for f in by('faqs', 'category', 'home')], None),
        ],
        'faqs.html': [
            ('faqs-applicants', [faq_item(f) for f in by('faqs', 'category', 'applicants')], None),
            ('faqs-students', [faq_item(f) for f in by('faqs', 'category', 'students')], None),
        ],
        'activities.html': [
            ('news-activities', [news_card(n) for n in by('news', 'placement', 'activities')], None),
            # Announcements + Event Calendar เคยอยู่หน้า news.html (ยุบรวมมาที่นี่ ก.ย. 2569)
            ('news-all', [news_card(n) for n in by('news', 'placement', 'home')], None),
            ('events', render_events(data['events']), None),
        ],
        'forms-and-links.html': [
            ('links-form', [form_card(l) for l in by('links', 'kind', 'form')], None),
            ('links-useful', [useful_card(l) for l in by('links', 'kind', 'useful')], None),
        ],
        'academics.html': [
            ('tuition', [tuition_row(t) for t in data['tuition']], None),
        ],
    }
    for g in sorted({c['group_name'] for c in data['courses']}):
        plan['academics.html'].append(
            ('courses', [course_row(c) for c in data['courses']
                         if c['group_name'] == g], g))

    changed = blocks_changed
    for path in ALL_PAGES:
        html = open(path, encoding='utf-8').read()
        original = html
        html, diff = replace_block(html, 'nav', nav_items(nav_rows, path))
        if diff:
            changed += 1
            print(f'  {path:24} เมนูหลัก')
        html2 = apply_settings(html, st)
        if html2 != html:
            changed += 1
            print(f'  {path:24} ค่าการเชื่อมต่อ')
            html = html2
        if html != original and not check:
            open(path, 'w', encoding='utf-8').write(html)

    for path, blocks in plan.items():
        html = open(path, encoding='utf-8').read()
        original = html
        for hook, inner, group in blocks:
            if not inner:
                continue
            html, diff = replace_block(html, hook, inner, group)
            if diff:
                changed += 1
                print(f'  {path:24} {hook}{" / " + group if group else ""}')
        if html != original and not check:
            open(path, 'w', encoding='utf-8').write(html)

    if not changed:
        print('ไฟล์ HTML ตรงกับฐานข้อมูลอยู่แล้ว ไม่มีอะไรต้องแก้')
    elif check:
        print(f'\nพบส่วนที่ต่างจากฐานข้อมูล {changed} จุด (โหมด --check ไม่ได้แก้ไฟล์)')
    else:
        print(f'\nเขียนกลับลงไฟล์แล้ว {changed} จุด — อย่าลืม commit')


if __name__ == '__main__':
    main()
