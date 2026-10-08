/* =========================================================
   admin/js/views/list.js — หน้ารายการ (หน้าตาเดียวกับเมนู "หน้าเว็บ")
   แท็บตามกลุ่ม · ค้นหา · กรองสถานะ · เรียงตามคอลัมน์ · ปุ่ม ⋯ (ซ่อน/เลื่อนลำดับ/ดูบนเว็บ/ลบ)
   ใช้กับทุกชุดข้อมูลใน SCHEMA ที่ไม่ได้กำหนด view เอง
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- โหลด ---------- */
/* ดึงแถวของชุดข้อมูล k ใส่ rows — ถ้าระหว่างรอผู้ใช้เปลี่ยนไปชุดอื่น ไม่เขียนทับ rows ของหน้าใหม่ */
async function fetchRows(k){
  const def = SCHEMA[k];
  const r = await api('/rest/v1/' + k + '?select=*&order=' + (def.order || 'sort_order.asc'));
  if(!r.ok){
    if(current === k) $('#view').innerHTML = '<div class="empty">โหลดไม่สำเร็จ (' + r.status + ')</div>';
    return false;
  }
  let data = await r.json();
  if(current !== k) return false;
  if(def.sortRows) data = def.sortRows(data);
  rows = data; rowsKey = k; counts[k] = rows.length;
  return true;
}
async function load(){
  const k = current;
  setTitle(SCHEMA[k].label);
  $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>';
  if(await fetchRows(k)) render();
}

/* ---------- วาดตาราง ----------
   หน้าตาเดียวกับเมนู "หน้าเว็บ" (ภาพอ้างอิงที่ผู้ใช้ส่งมา ต.ค. 2026 — ไม่เอาตารางแบบ WordPress ที่มีแถบกลุ่มสีชมพู/ติ๊กเลือก/ลูกศรทุกแถว):
   แท็บขีดเส้นใต้ = กลุ่มจาก groupBy (ถ้ามี 2–8 กลุ่ม) · การ์ดมีช่องค้นหา + ตัวกรองสถานะ + ปุ่มเพิ่มใหม่ · หัวคอลัมน์กดเรียงได้
   แถวบรรทัดเดียว คลิกทั้งแถว = แก้ไข · ซ่อน/เลื่อนขึ้นลง/ดูบนเว็บ/ลบ อยู่ในปุ่ม ⋯ ท้ายแถว
   ชุดที่มีหลายชั้น (เมนู) ไม่ใช้แท็บ แต่เยื้องตามชั้น + ป้ายบอกชั้น (schema: depth / badge) */
let lsFor = null, lsTab = 'all', lsSort = null;   /* แท็บ/การเรียงของชุดข้อมูลที่เปิดอยู่ — เปลี่ยนชุดแล้วล้าง */
function render(){
  const def = SCHEMA[current];
  if(lsFor !== current){ lsFor = current; lsTab = 'all'; lsSort = null; }
  const canHide = !def.noHide, canDel = !def.noDelete;
  const groups = def.groupBy ? [...new Set(rows.map(def.groupBy))] : [];
  const useTabs = groups.length > 1 && groups.length <= 8 && !def.depth;
  if(lsTab !== 'all' && !groups.includes(lsTab)) lsTab = 'all';
  const inTab = r => !useTabs || lsTab === 'all' || def.groupBy(r) === lsTab;

  let show = rows.map((r, i) => ({ r, i })).filter(x => inTab(x.r) &&
    (filter === 'all' || (filter === 'on') === (x.r.is_visible !== false)) &&
    (!query || (def.listT(x.r) + ' ' + (def.listS(x.r) || '')).toLowerCase().includes(query)));
  if(lsSort){
    const val = { title:r => String(def.listT(r) || '').toLowerCase(), detail:r => String(def.listS(r) || '').toLowerCase(),
      status:r => r.is_visible === false ? 1 : 0, updated:r => r.updated_at || '', by:r => byWho(r) }[lsSort.k];
    show = show.slice().sort((a, b) => { const x = val(a.r), y = val(b.r); return (x < y ? -1 : x > y ? 1 : 0) * lsSort.dir; });
  }
  /* เลื่อนลำดับได้เฉพาะตอนเห็นลำดับจริงครบ (ไม่ค้น/กรอง/เรียง/อยู่แท็บย่อย) — ไม่งั้นสลับกับแถวที่มองไม่เห็นแล้วงง */
  const canOrder = !def.noOrder && !query && filter === 'all' && !lsSort && lsTab === 'all';

  const tabs = useTabs ? '<div class="pg-tabs" role="tablist">' +
    [['all','ทั้งหมด', rows.length]].concat(groups.map(g => [g, g, rows.filter(r => def.groupBy(r) === g).length]))
      .map(([t, label, n]) => '<button role="tab" data-ltab="' + esc(t) + '" aria-selected="' + (lsTab === t) + '">' + esc(label) + ' <span>(' + n + ')</span></button>').join('') +
    '</div>' : '<div class="pg-tabs"><button aria-selected="true">ทั้งหมด <span>(' + rows.length + ')</span></button></div>';

  const th = (k, label) => '<th data-lsort="' + k + '"' + (lsSort && lsSort.k === k ? ' class="on"' : '') + '>' + label +
    (lsSort && lsSort.k === k ? (lsSort.dir < 0 ? ICON.sortDown : ICON.sortUp) : ICON.sort) + '</th>';
  const ncol = 4 + (canHide ? 1 : 0) + 1;

  const body = show.length ? show.map(({ r, i }) => {
    const off = r.is_visible === false, href = editHref(current, r);
    const depth = def.depth ? def.depth(r) : 0;
    const badge = def.badge ? def.badge(r) : null;
    const thumb = def.thumb ? (r[def.thumb] ? '<img class="ls-thumb" src="' + esc(r[def.thumb]) + '" alt="">' : '<span class="ls-thumb none">' + ICON.media + '</span>') : '';
    const items = [['แก้ไข', href]];
    if(canHide) items.push([off ? 'แสดงบนเว็บ' : 'ซ่อนจากเว็บ', '', false, 'vis:' + i]);
    if(canOrder) items.push(['เลื่อนขึ้น', '', false, 'up:' + i], ['เลื่อนลง', '', false, 'down:' + i]);
    if(def.link) items.push(['ดูบนเว็บ ↗', def.link, true]);
    if(canDel) items.push(['ลบถาวร', '', false, 'del:' + i, 'danger']);
    return '<tr data-go="' + esc(href) + '"' + (off ? ' class="off"' : '') + '>' +
      '<td class="t"><div class="ls-t"' + (depth ? ' style="padding-left:' + depth * 22 + 'px"' : '') + '>' + (depth ? '<span class="ls-arrow">↳</span>' : '') + thumb +
        '<a href="' + esc(href) + '">' + esc(def.listT(r) || '(ไม่มีชื่อ)') + '</a>' +
        (badge ? '<span class="pg-badge ' + badge[1] + '">' + esc(badge[0]) + '</span>' : '') + '</div></td>' +
      '<td class="ex" title="' + esc(def.listS(r) || '') + '">' + esc(def.listS(r) || '') + '</td>' +
      (canHide ? '<td>' + (off ? '<span class="pg-st warn">ซ่อนอยู่</span>' : '<span class="pg-st ok">แสดงบนเว็บ</span>') + '</td>' : '') +
      '<td class="d">' + (r.updated_at ? fullDate(r.updated_at) : '—') + '</td>' +
      '<td class="by">' + esc(byWho(r)) + '</td>' +
      '<td class="m">' + pgMore(items) + '</td></tr>';
  }).join('') : '<tr><td colspan="' + ncol + '" class="none">' +
    (rows.length ? 'ไม่พบรายการที่ตรงกับเงื่อนไข' : 'ยังไม่มีรายการ' + (def.noAdd ? '' : ' — กด "เพิ่มใหม่"')) + '</td></tr>';

  $('#view').innerHTML = '<div class="pg">' +
    '<div class="pg-head"><h1>' + esc(def.title) + '</h1>' +
      (def.where ? '<p>แสดงที่: ' + esc(def.where) + (def.link ? ' · <a href="' + esc(def.link) + '" target="_blank" rel="noopener">ดูบนเว็บ ↗</a>' : '') + '</p>' : '') + '</div>' +
    tabs +
    '<div class="pg-card">' +
      '<div class="pg-tools">' +
        '<label class="pg-search"><svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="search" id="q" placeholder="ค้นหา' + esc(def.label) + '…" value="' + esc(query) + '"></label>' +
        (canHide ? '<label class="pg-filter">' + ICON.filter + '<b>สถานะ</b><select id="lsSt">' +
          [['all','ทั้งหมด'],['on','แสดงบนเว็บ'],['off','ซ่อนอยู่']].map(o =>
            '<option value="' + o[0] + '"' + (filter === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' : '') +
        (def.tools || []).map(t => '<button class="btn" id="' + t.id + '">' + ICON[t.icon] + esc(t.label) + '</button>').join('') +
        (def.noAdd ? '' : '<a class="btn primary pg-new" href="' + H(current + '/new') + '">' + ICON.add + 'เพิ่มใหม่</a>') +
      '</div>' +
      '<div class="pg-scroll"><table class="pg-table"><thead><tr>' +
        th('title','ชื่อ') + th('detail','รายละเอียด') + (canHide ? th('status','สถานะ') : '') + th('updated','แก้ไขล่าสุด') + th('by','ผู้แก้ไข') + '<th class="m"></th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="pg-foot">' + show.length + ' จาก ' + rows.length + ' รายการ' +
        (def.noOrder ? '' : canOrder ? ' · เลื่อนลำดับได้จากปุ่ม ⋯ ท้ายแถว' : ' · ล้างการค้นหา/กรอง/เรียง แล้วอยู่แท็บ "ทั้งหมด" เพื่อเลื่อนลำดับ') + '</div>' +
    '</div></div>';
  wire();
}

function wire(){
  const v = $('#view');
  (SCHEMA[current].tools || []).forEach(t => {
    const b = v.querySelector('#' + t.id); if(b) b.addEventListener('click', ()=>t.run(b));
  });
  v.querySelectorAll('[data-ltab]').forEach(b => b.addEventListener('click', ()=>{ lsTab = b.dataset.ltab; render(); }));
  const st = v.querySelector('#lsSt'); if(st) st.addEventListener('change', ()=>{ filter = st.value; render(); });
  v.querySelectorAll('[data-lsort]').forEach(h => h.addEventListener('click', ()=>{
    const k = h.dataset.lsort, first = k === 'updated' ? -1 : 1;
    lsSort = !lsSort || lsSort.k !== k ? { k, dir: first } : lsSort.dir === first ? { k, dir: -first } : null;
    render();
  }));
  const q = v.querySelector('#q');
  q.addEventListener('input', function(){
    query = this.value.trim().toLowerCase();
    const pos = this.selectionStart;
    render();
    /* render สร้างช่องใหม่ ต้องคืนโฟกัสและตำแหน่งเคอร์เซอร์ให้ ไม่งั้นพิมพ์ได้ทีละตัว */
    const nq = $('#view #q'); if(nq){ nq.focus(); try{ nq.setSelectionRange(pos, pos); }catch(e){} }
  });
  wireRows(v);   /* คลิกทั้งแถว + เปิด/ปิดปุ่ม ⋯ (pages.js) */
  v.querySelectorAll('[data-act]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const [act, n] = a.dataset.act.split(':'), r = rows[+n];
    if(act === 'vis') toggleVis(r);
    else if(act === 'up') move(+n, -1);
    else if(act === 'down') move(+n, 1);
    else if(act === 'del') removeRows([r]);
  }));
}

/* ---------- การกระทำกับแถว ---------- */
async function patchRow(r, body){
  const res = await api('/rest/v1/' + current + pkUrl(r), {
    method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  return res.ok;
}
async function toggleVis(r){
  if(await patchRow(r, { is_visible: r.is_visible === false })){
    r.is_visible = r.is_visible === false; render(); toast('บันทึกแล้ว');
  } else toast('บันทึกไม่สำเร็จ');
}
/* ไม่มีถังขยะแบบ WordPress — ลบแล้วหายจริง จึงเตือนให้ใช้ "ซ่อนจากเว็บ" แทนถ้าแค่อยากเอาออกชั่วคราว */
async function removeRows(list){
  const def = SCHEMA[current];
  const what = list.length === 1 ? '"' + def.listT(list[0]) + '"' : list.length + ' รายการที่เลือก';
  if(!confirm('ลบ ' + what + ' ออกถาวร กู้คืนไม่ได้\n\nถ้าแค่อยากเอาออกจากเว็บชั่วคราว กด "ยกเลิก" แล้วใช้ "ซ่อนจากเว็บ" แทน')) return false;
  const res = await Promise.all(list.map(r => api('/rest/v1/' + current + pkUrl(r), { method:'DELETE' }).then(x => x.ok)));
  toast(res.every(Boolean) ? 'ลบแล้ว' : 'ลบไม่สำเร็จบางรายการ');
  if(location.hash.slice(1) === current) load(); else go(current);
  return true;
}

/* สลับ sort_order ของสองแถว แล้วเขียนกลับทั้งคู่
   ต้องสลับ "ค่า" ไม่ใช่แค่ลำดับใน array ไม่งั้นรีเฟรชแล้วกลับที่เดิม */
async function move(i, d){
  /* เลื่อนได้เฉพาะกับ "พี่น้อง" (parent_id เดียวกัน): ในหน้าเมนู รายการที่อยู่ติดกัน
     อาจเป็นเมนูบนกับรายการย่อย ถ้าสลับ sort_order ข้ามชั้นลำดับจะเพี้ยนทั้งต้นไม้ */
  const same = k => (rows[k].parent_id ?? null) === (rows[i].parent_id ?? null);
  let j = i + d;
  while(j >= 0 && j < rows.length && !same(j)) j += d;
  if(j < 0 || j >= rows.length) return;
  const a = rows[i], b = rows[j];
  const av = a.sort_order, bv = b.sort_order;
  const [r1, r2] = await Promise.all([patchRow(a, { sort_order: bv }), patchRow(b, { sort_order: av })]);
  if(r1 && r2){
    a.sort_order = bv; b.sort_order = av;
    /* หน้าที่เรียงเป็นต้นไม้ต้องจัดใหม่ทั้งชุด (เมนูบนย้ายแล้วรายการย่อยต้องตามไปด้วย)
       หน้าธรรมดาแค่สลับตำแหน่งในรายการก็พอ */
    const def = SCHEMA[current];
    if(def.sortRows){ rows = def.sortRows(rows); }
    else { rows[i] = b; rows[j] = a; }
    render();
  } else toast('เลื่อนลำดับไม่สำเร็จ');
}
