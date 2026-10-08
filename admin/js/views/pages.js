/* =========================================================
   admin/js/views/pages.js — เมนู "หน้าเว็บ" (#pages): รายการหน้าทั้งหมดของเว็บ
   ไม่มีตารางของตัวเอง: รวมแถวในตาราง blocks ตามคอลัมน์ page แล้วสรุปเป็นหนึ่งแถวต่อหน้า
   (สถานะ = มีส่วนที่ซ่อนไหม · แก้ไขล่าสุด/ผู้แก้ไข = ของส่วนที่แก้ล่าสุดในหน้านั้น)
   กดหน้าแล้วเปิดตัวแก้แบบบล็อกของทั้งหน้า (views/blockeditor.js)
   หน้าตาตามภาพอ้างอิงที่ผู้ใช้ส่งมา (ต.ค. 2026): แท็บขีดเส้นใต้ · ช่องค้นหา + ตัวกรองสถานะ · หัวคอลัมน์กดเรียงได้ · ปุ่ม ⋯
   ไม่มีปุ่มสร้างหน้าใหม่โดยตั้งใจ — หน้าเว็บเป็นไฟล์ HTML ตายตัว (ผู้ใช้เลือกไม่เอา)
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* สถานะของหน้ารายการ — คงไว้ตอนเข้าไปแก้แล้วกด Back กลับมา */
let pgOpen = null;   /* หน้าที่กำลังเปิดอยู่ในตัวแก้แบบบล็อก — กันผลโหลดช้าของหน้าก่อนมาวาดทับ */
let pgData = null, pgTab = 'all', pgStatus = 'all', pgQuery = '', pgSort = null;   /* pgSort = { k, dir } · null = ลำดับตาม PAGES */
const PG_TYPE = { home:'หน้าแรก', main:'หน้าหลัก', sub:'หน้าย่อย', shared:'ใช้ร่วมทุกหน้า' };
const pgBadge = t => '<span class="pg-badge ' + t + '">' + PG_TYPE[t] + '</span>';
const pgHref = p => H('pages/' + encodeURIComponent(p));
/* ลิงก์ "ดูบนเว็บ": footer อยู่ทุกหน้า ใช้หน้าแรกเป็นตัวแทน · หน้าย่อย = ไฟล์#id ใช้ได้ตรง ๆ */
const pgLive = p => p === '(ทุกหน้า)' ? 'index.html' : p;

/* ---------- หน้าย่อย ----------
   บนเว็บ เมนูดรอปดาวน์ลิงก์ไป <หน้า>#<id> แล้ว site.js (filterSections → sectionGroups) โชว์เฉพาะ "กลุ่ม" ของ section นั้น
   กลุ่ม = section ที่มีลิงก์ในเมนู + section ถัดไปที่ไม่มีลิงก์ (จนถึงตัวที่มีลิงก์ตัวถัดไป) · section ก่อนตัวแรกติดไปกับกลุ่มแรก
   ที่นี่คำนวณแบบเดียวกันจากฐานข้อมูล: ลำดับ = sort_order ของ blocks, id ของ section = ส่วนท้ายของ key (about/goals → goals)
   แบนเนอร์และแถบชวนสมัคร (page-banner, cta-band) อยู่นอก .content ไม่มี id — ไม่นับเป็นของหน้าย่อยไหน (โชว์ทุกหน้าย่อย)
   ต้องตรงกับ sectionGroups ใน site.js — แก้ที่นั่นแล้วต้องแก้ที่นี่ด้วย */
function pageSubs(page, pageBlocks, navRows){
  const menu = {};
  (navRows || []).forEach(n => {
    const [f, id] = String(n.href || '').split('#');
    if(n.parent_id && f === page && id && !(id in menu)) menu[id] = n.label;
  });
  const secs = pageBlocks.filter(b => !/\/(page-banner|cta-band)$/.test(b.key));
  const sid = b => b.key.split('/').slice(1).join('/');
  if(!secs.some(b => sid(b) in menu)) return [];
  const groups = []; let leading = [];
  secs.forEach(b => {
    if(sid(b) in menu){ groups.push({ id: sid(b), label: menu[sid(b)], members: leading.concat(b) }); leading = []; }
    else if(groups.length) groups[groups.length - 1].members.push(b);
    else leading.push(b);
  });
  return groups;
}
const pgSummary = bl => {
  const last = bl.reduce((a, b) => (!a || (b.updated_at || '') > (a.updated_at || '')) ? b : a, null);
  return { updated: last ? last.updated_at : '', by: byWho(last), hidden: bl.filter(b => b.is_visible === false).length };
};

/* แถวของรายการ: หน้าหลักตามด้วยหน้าย่อยของมัน — id = ไฟล์ (หน้าหลัก) หรือ ไฟล์#id (หน้าย่อย) ใช้เป็นที่อยู่ของตัวแก้ */
async function loadPages(){
  const cols = 'key,page,label,html,is_visible,updated_at,sort_order' + (hasAuthor ? ',updated_by' : '');
  const [r, rn] = await Promise.all([api('/rest/v1/blocks?select=' + cols + '&order=sort_order.asc'),
    api('/rest/v1/nav?select=label,href,parent_id,sort_order&order=sort_order.asc')]);
  if(!r.ok) return null;
  const all = await r.json(), nav = rn.ok ? await rn.json() : [];
  const list = PAGES.slice();
  all.forEach(b => { if(!list.some(p => p.page === b.page)) list.push(pageOf(b.page)); });
  const out = [];
  list.forEach(p => {
    const bl = all.filter(b => b.page === p.page);
    if(!bl.length) return;
    out.push(Object.assign({}, p, { id: p.page, blocks: bl }, pgSummary(bl)));
    if(p.type === 'main') pageSubs(p.page, bl, nav).forEach(g => out.push({
      id: p.page + '#' + g.id, page: p.page, title: g.label, parent: p.title, path: p.path + '#' + g.id,
      type: 'sub', blocks: g.members, ...pgSummary(g.members) }));
  });
  out.forEach((p, i) => { p.i = i; });
  return out;
}

/* ---------- รายการหน้า ---------- */
async function pagesView(){
  pgOpen = null;
  setTitle('หน้าเว็บ');
  $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>';
  const data = await loadPages();
  if(current !== 'pages' || pgOpen !== null) return;
  if(!data){ $('#view').innerHTML = '<div class="empty">โหลดไม่สำเร็จ</div>'; return; }
  pgData = data;
  renderPages();
}

function renderPages(){
  const tabs = [['all','ทั้งหมด']].concat(Object.keys(PG_TYPE).map(t => [t, PG_TYPE[t]]))
    .map(([t, label]) => [t, label, pgData.filter(p => t === 'all' || p.type === t).length])
    .filter(x => x[2] > 0);
  let list = pgData.filter(p =>
    (pgTab === 'all' || p.type === pgTab) &&
    (pgStatus === 'all' || (pgStatus === 'off') === (p.hidden > 0)) &&
    (!pgQuery || (p.title + ' ' + p.path + ' ' + p.page + ' ' + (p.parent || '')).toLowerCase().includes(pgQuery)));
  if(pgSort){
    const val = { title:p => p.title.toLowerCase(), path:p => p.path, status:p => p.hidden, updated:p => p.updated || '', by:p => p.by }[pgSort.k];
    list = list.slice().sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * pgSort.dir; });
  }
  const th = (k, label) => '<th data-sort="' + k + '"' + (pgSort && pgSort.k === k ? ' class="on"' : '') + '>' + label +
    (pgSort && pgSort.k === k ? (pgSort.dir < 0 ? ICON.sortDown : ICON.sortUp) : ICON.sort) + '</th>';

  $('#view').innerHTML = '<div class="pg">' +
    '<div class="pg-head"><h1>หน้าเว็บ</h1><p>หน้าทั้งหมดของเว็บไซต์ TEFL — คลิกที่หน้าเพื่อแก้ข้อความและหัวข้อแต่ละส่วน</p></div>' +
    '<div class="pg-tabs" role="tablist">' + tabs.map(([t, label, n]) =>
      '<button role="tab" data-tab="' + t + '" aria-selected="' + (pgTab === t) + '">' + label + ' <span>(' + n + ')</span></button>').join('') + '</div>' +
    '<div class="pg-card">' +
      '<div class="pg-tools">' +
        '<label class="pg-search">' + '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="search" id="pgQ" placeholder="ค้นหาหน้า…" value="' + esc(pgQuery) + '"></label>' +
        '<label class="pg-filter">' + ICON.filter + '<b>สถานะ</b><select id="pgSt">' +
          [['all','ทั้งหมด'],['on','แสดงครบ'],['off','มีส่วนที่ซ่อน']].map(o =>
            '<option value="' + o[0] + '"' + (pgStatus === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' +
      '</div>' +
      '<div class="pg-scroll"><table class="pg-table"><thead><tr>' +
        th('title','ชื่อหน้า') + th('path','Path') + th('status','สถานะ') + th('updated','แก้ไขล่าสุด') + th('by','ผู้แก้ไข') + '<th class="m"></th>' +
      '</tr></thead><tbody>' +
      (list.length ? list.map(p =>
        '<tr data-go="' + esc(pgHref(p.id)) + '">' +
          '<td class="t"><div class="ls-t"' + (p.type === 'sub' && !pgSort ? ' style="padding-left:22px"' : '') + '>' +
            (p.type === 'sub' ? '<span class="ls-arrow">↳</span>' : '') +
            '<a href="' + esc(pgHref(p.id)) + '" title="' + p.blocks.length + ' ส่วน">' + esc(p.title) + '</a>' + pgBadge(p.type) +
            (p.type === 'sub' && (pgSort || pgTab === 'sub') ? '<small class="pg-parent">ใน ' + esc(p.parent) + '</small>' : '') + '</div></td>' +
          '<td class="path"><code>' + esc(p.path) + '</code></td>' +
          '<td>' + (p.hidden ? '<span class="pg-st warn">ซ่อน ' + p.hidden + ' ส่วน</span>' : '<span class="pg-st ok">แสดงบนเว็บ</span>') + '</td>' +
          '<td class="d">' + fullDate(p.updated) + '</td>' +
          '<td class="by">' + esc(p.by) + '</td>' +
          '<td class="m">' + pgMore([['แก้ไขเนื้อหา', pgHref(p.id), false], ['ดูบนเว็บ ↗', pgLive(p.id), true]]) + '</td>' +
        '</tr>').join('')
        : '<tr><td colspan="6" class="none">ไม่พบหน้าที่ตรงกับเงื่อนไข</td></tr>') +
      '</tbody></table></div>' +
    '</div>' +
    (hasAuthor ? '' : '<p class="pg-note">คอลัมน์ "ผู้แก้ไข" จะเริ่มแสดงชื่อหลังรัน migration <code>20261005000001_updated_by.sql</code> ใน Supabase แล้วมีคนแก้ครั้งถัดไป</p>') +
  '</div>';

  const v = $('#view');
  v.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', ()=>{ pgTab = b.dataset.tab; renderPages(); }));
  v.querySelector('#pgSt').addEventListener('change', e => { pgStatus = e.target.value; renderPages(); });
  v.querySelector('#pgQ').addEventListener('input', function(){
    pgQuery = this.value.trim().toLowerCase(); const pos = this.selectionStart;
    renderPages();
    const q = $('#pgQ'); q.focus(); try{ q.setSelectionRange(pos, pos); }catch(e){}
  });
  /* กดหัวคอลัมน์: เรียงน้อย→มาก → มาก→น้อย → กลับลำดับเดิม */
  v.querySelectorAll('[data-sort]').forEach(h => h.addEventListener('click', ()=>{
    const k = h.dataset.sort;
    pgSort = !pgSort || pgSort.k !== k ? { k, dir: k === 'updated' ? -1 : 1 } : pgSort.dir === (k === 'updated' ? -1 : 1) ? { k, dir: -pgSort.dir } : null;
    renderPages();
  }));
  wireRows(v);
}

/* ---------- ปุ่ม ⋯ และการคลิกทั้งแถว ---------- */
/* items: [ข้อความ, ลิงก์, เปิดแท็บใหม่?, data-act, class] — ใช้ทั้งหน้าเว็บและหน้ารายการ (list.js) */
function pgMore(items){
  return '<div class="pg-more"><button type="button" aria-label="ตัวเลือก" aria-haspopup="menu">' + ICON.more + '</button><div class="pg-menu" role="menu">' +
    items.map(([t, href, ext, act, cls]) => '<a role="menuitem"' + (cls ? ' class="' + cls + '"' : '') + (href ? ' href="' + esc(href) + '"' : ' href="javascript:void(0)"') +
      (ext ? ' target="_blank" rel="noopener"' : '') + (act ? ' data-act="' + act + '"' : '') + '>' + esc(t) + '</a>').join('') +
    '</div></div>';
}
function wireRows(v){
  /* คลิกที่ไหนก็ได้ในแถว = เปิดหน้านั้น (ยกเว้นลิงก์และปุ่ม ⋯ ที่ทำงานของมันเอง) */
  v.querySelectorAll('tr[data-go]').forEach(tr => tr.addEventListener('click', e => {
    if(e.target.closest('a,button,.pg-menu')) return;
    location.href = tr.dataset.go;
  }));
  v.querySelectorAll('.pg-more > button').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const m = b.parentNode, open = !m.classList.contains('open');
    document.querySelectorAll('.pg-more.open').forEach(x => x.classList.remove('open'));
    m.classList.toggle('open', open);
  }));
}
document.addEventListener('click', e => {
  if(!e.target.closest('.pg-more')) document.querySelectorAll('.pg-more.open').forEach(x => x.classList.remove('open'));
});
