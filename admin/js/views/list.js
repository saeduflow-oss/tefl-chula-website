/* =========================================================
   admin/js/views/list.js — หน้ารายการแบบตาราง WordPress (All Posts)
   แท็บกรอง ทั้งหมด/แสดงบนเว็บ/ซ่อนอยู่ · ค้นหา · การกระทำหลายรายการ · ปุ่มใต้ชื่อโผล่ตอนชี้ · เลื่อนลำดับ
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

/* ---------- วาดตาราง ---------- */
function render(){
  const def = SCHEMA[current];
  const canHide = !def.noHide, canDel = !def.noDelete;
  /* ปุ่มเลื่อนลำดับซ่อนตอนค้นหา/กรอง: แถวข้างเคียงที่ถูกกรองออกยังสลับด้วยได้ ผู้ใช้จะงงว่าทำไมไม่ขยับ */
  const canOrder = !def.noOrder && !query && filter === 'all';
  const bulk = canHide || canDel;
  const nOn = rows.filter(r => r.is_visible !== false).length, nOff = rows.length - nOn;

  const head = heading(def.title,
      (def.noAdd ? '' : '<a class="btn page-title-action" href="' + H(current + '/new') + '">เพิ่มใหม่</a>') +
      (def.tools || []).map(t => '<button class="btn page-title-action" id="' + t.id + '">' + ICON[t.icon] + esc(t.label) + '</button>').join('')) +
    (def.where ? '<p class="where">' + ICON.site + '<span>แสดงที่: ' + esc(def.where) + '</span>' +
      (def.link ? ' <a href="' + esc(def.link) + '" target="_blank" rel="noopener">ดูบนเว็บ ↗</a>' : '') + '</p>' : '');

  /* แท็บกรองแบบ "All (12) | Published (10) | Draft (2)" — ชุดที่ซ่อนไม่ได้ไม่มีแท็บ */
  const tab = (f, label, n) => '<a data-f="' + f + '"' + (filter === f ? ' class="on"' : '') + '>' + label + ' <span class="cnt">(' + n + ')</span></a>';
  const subsub = canHide
    ? '<div class="subsubsub">' + tab('all','ทั้งหมด',rows.length) + ' | ' + tab('on','แสดงบนเว็บ',nOn) +
      (nOff ? ' | ' + tab('off','ซ่อนอยู่',nOff) : '') + '</div>'
    : '<div class="subsubsub"><a class="on">ทั้งหมด <span class="cnt">(' + rows.length + ')</span></a></div>';
  const search = '<label class="search-box">' +
    '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
    '<input type="search" id="q" placeholder="ค้นหา' + esc(def.label) + '" value="' + esc(query) + '"></label>';

  const show = rows.map((r, i) => ({ r, i })).filter(x =>
    (filter === 'all' || (filter === 'on') === (x.r.is_visible !== false)) &&
    (!query || (def.listT(x.r) + ' ' + (def.listS(x.r) || '')).toLowerCase().includes(query)));

  const nav = '<div class="tablenav">' +
    (bulk ? '<select id="bulk"><option value="">การกระทำหลายรายการ</option>' +
      (canHide ? '<option value="off">ซ่อนจากเว็บ</option><option value="on">แสดงบนเว็บ</option>' : '') +
      (canDel ? '<option value="del">ลบถาวร</option>' : '') + '</select>' +
      '<button class="btn" id="bulkGo">นำไปใช้</button>' : '') +
    '<span class="num">' + show.length + ' รายการ</span></div>';

  const cols = (bulk ? '<td class="cb"><input type="checkbox" class="cbAll" aria-label="เลือกทั้งหมด"></td>' : '') +
    '<th class="c1">ชื่อ</th><th class="c2">รายละเอียด</th>' + (canHide ? '<th class="c3">สถานะ</th>' : '') +
    '<th class="c4">แก้ไขล่าสุด</th>' + (canOrder ? '<th class="c5">ลำดับ</th>' : '');
  const span = cols.split('<t').length - 1;

  let h = '<table class="wp-list"><thead><tr>' + cols + '</tr></thead><tbody>';
  let lastGroup = null;
  show.forEach(function(x){
    const r = x.r, i = x.i, off = r.is_visible === false, href = editHref(current, r);
    if(def.groupBy && !query){
      const g = def.groupBy(r);
      if(g !== lastGroup){ h += '<tr class="g"><td colspan="' + span + '">' + esc(g) + '</td></tr>'; lastGroup = g; }
    }
    const thumb = def.thumb ? (r[def.thumb] ? '<img src="' + esc(r[def.thumb]) + '" alt="">' : '<span class="noimg">' + ICON.media + '</span>') : '';
    /* ปุ่มใต้ชื่อ (row actions) โผล่ตอนชี้แถว — ตามแบบ WordPress */
    const acts = ['<a href="' + href + '">แก้ไข</a>'];
    if(canHide) acts.push('<a class="vis" data-i="' + i + '">' + (off ? 'แสดงบนเว็บ' : 'ซ่อนจากเว็บ') + '</a>');
    if(canDel) acts.push('<a class="del" data-i="' + i + '">ลบถาวร</a>');
    if(def.link) acts.push('<a href="' + esc(def.link) + '" target="_blank" rel="noopener">ดูบนเว็บ</a>');
    h += '<tr class="' + (off ? 'off' : '') + '">' +
      (bulk ? '<th class="cb"><input type="checkbox" class="cbRow" data-i="' + i + '" aria-label="เลือก"></th>' : '') +
      '<td class="c1"><div class="w">' + thumb + '<div class="tx">' +
        '<a class="row-title" href="' + href + '">' + esc(def.listT(r) || '(ไม่มีชื่อ)') + '</a>' +
        (off ? ' <span class="post-state">— ซ่อนอยู่</span>' : '') +
        '<div class="row-actions">' + acts.join('<span class="pipe"> | </span>') + '</div>' +
        '<div class="mob">' + esc(def.listS(r) || '') + '</div>' +
      '</div></div></td>' +
      '<td class="c2" title="' + esc(def.listS(r) || '') + '">' + esc(def.listS(r) || '') + '</td>' +
      (canHide ? '<td class="c3"><span class="tag ' + (off ? 'off">ซ่อนอยู่' : 'on">แสดงบนเว็บ') + '</span></td>' : '') +
      '<td class="c4">' + (r.updated_at ? 'แก้ไขล่าสุด<br><span>' + when(r.updated_at) + '</span>' : '') + '</td>' +
      (canOrder ? '<td class="c5"><div class="ord">' +
        '<button class="mv" data-i="' + i + '" data-d="-1" title="เลื่อนขึ้น (บนเว็บจะแสดงก่อน)">&#9650;</button>' +
        '<button class="mv" data-i="' + i + '" data-d="1" title="เลื่อนลง">&#9660;</button></div></td>' : '') +
      '</tr>';
  });
  if(!show.length) h += '<tr class="none"><td colspan="' + span + '">' +
    (rows.length ? 'ไม่พบรายการที่ตรงกับเงื่อนไข' : 'ยังไม่มีรายการ' + (def.noAdd ? '' : ' — กด "เพิ่มใหม่" ด้านบน')) + '</td></tr>';
  h += '</tbody><tfoot><tr>' + cols + '</tr></tfoot></table>';

  $('#view').innerHTML = '<div class="wrap">' + head + '<div class="list-top">' + subsub + search + '</div>' + nav + h + '</div>';
  wire();
}

function wire(){
  const v = $('#view');
  (SCHEMA[current].tools || []).forEach(t => {
    const b = v.querySelector('#' + t.id); if(b) b.addEventListener('click', ()=>t.run(b));
  });
  v.querySelectorAll('.subsubsub [data-f]').forEach(a => a.addEventListener('click', ()=>{ filter = a.dataset.f; render(); }));
  const q = v.querySelector('#q');
  q.addEventListener('input', function(){
    query = this.value.trim().toLowerCase();
    const pos = this.selectionStart;
    render();
    /* render สร้างช่องใหม่ ต้องคืนโฟกัสและตำแหน่งเคอร์เซอร์ให้ ไม่งั้นพิมพ์ได้ทีละตัว */
    const nq = $('#view #q'); if(nq){ nq.focus(); try{ nq.setSelectionRange(pos, pos); }catch(e){} }
  });
  v.querySelectorAll('.cbAll').forEach(c => c.addEventListener('change', ()=>
    v.querySelectorAll('.cbRow, .cbAll').forEach(x => { x.checked = c.checked; })));
  v.querySelectorAll('.vis').forEach(b => b.addEventListener('click', ()=>toggleVis(rows[+b.dataset.i])));
  v.querySelectorAll('.del').forEach(b => b.addEventListener('click', ()=>removeRows([rows[+b.dataset.i]])));
  v.querySelectorAll('.mv').forEach(b => b.addEventListener('click', ()=>move(+b.dataset.i, +b.dataset.d)));
  const go_ = v.querySelector('#bulkGo');
  if(go_) go_.addEventListener('click', async ()=>{
    const act = $('#bulk').value;
    const picked = [...v.querySelectorAll('.cbRow:checked')].map(c => rows[+c.dataset.i]);
    if(!act) return toast('เลือกการกระทำก่อน');
    if(!picked.length) return toast('ติ๊กเลือกรายการก่อน');
    if(act === 'del') return removeRows(picked);
    const res = await Promise.all(picked.map(r => patchRow(r, { is_visible: act === 'on' })));
    res.forEach((ok, n) => { if(ok) picked[n].is_visible = act === 'on'; });
    toast(res.every(Boolean) ? 'บันทึกแล้ว ' + picked.length + ' รายการ' : 'บันทึกไม่สำเร็จบางรายการ');
    render();
  });
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
