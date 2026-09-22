/* =========================================================
   admin/js/views/list.js — หน้ารายการ: โหลด วาดตาราง ค้นหา ซ่อน/แสดง เลื่อนลำดับ
   ใช้กับทุกชุดข้อมูลใน SCHEMA ที่ไม่ได้กำหนด view เอง
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- รายการ ---------- */
async function load(){
  const def = SCHEMA[current];
  $('#title').textContent = def.label;   /* แถบบนใช้ชื่อสั้น ส่วนหัวในหน้าใช้ชื่อเต็ม จะได้ไม่ซ้ำกัน */
  $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>';

  const r = await api('/rest/v1/' + current + '?select=*&order=' + (def.order || 'sort_order.asc'));
  if(!r.ok){ $('#view').innerHTML = '<div class="empty">โหลดไม่สำเร็จ (' + r.status + ')</div>'; return; }
  rows = await r.json();
  if(def.sortRows) rows = def.sortRows(rows);
  counts[current] = rows.length; paintMenu();
  render();
}

function render(){
  const def = SCHEMA[current];
  const head = '<div class="head"><h2><span class="ico ' + (TINT[current] || 'c1') + '">' + (ICON[current] || '') + '</span>' + esc(def.title) + '</h2></div>' +
    (def.where ? '<div class="where"><span>แสดงที่: ' + esc(def.where) + '</span>' +
      (def.link ? '<a href="' + esc(def.link) + '" target="_blank" rel="noopener">ดูบนเว็บ ↗</a>' : '') + '</div>' : '');
  /* แถบเครื่องมืออยู่ในกรอบตาราง (ค้นหา + เพิ่ม) แบบเดียวกับภาพอ้างอิง
     ช่องค้นหาต้องคง value ไว้ตอน render ซ้ำ ไม่งั้นพิมพ์ทีเดียวหาย */
  const bar = '<div class="bar"><label class="search">' +
    '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
    '<input type="search" id="q" placeholder="ค้นหา' + esc(def.label) + '..." value="' + esc(query) + '"></label>' +
    (def.tools || []).map(t => '<button class="btn" id="' + t.id + '">' + ICON[t.icon] + esc(t.label) + '</button>').join('') +
    (def.noAdd ? '' : '<button class="btn primary" id="addBtn">' + ICON.add + 'เพิ่ม' + esc(def.label) + '</button>') + '</div>';

  if(!rows.length){ $('#view').innerHTML = head + '<div class="tbl">' + bar + '<div class="empty">ยังไม่มีรายการ</div></div>'; wire(); return; }

  /* ช่องค้นหาด้านบนกรองเฉพาะหน้านี้ ค้นจากชื่อและรายละเอียด */
  const show = rows.map((r, i) => ({ r, i })).filter(x => !query ||
    (def.listT(x.r) + ' ' + (def.listS(x.r) || '')).toLowerCase().includes(query));

  let h = '<table><thead><tr><th class="c1">ชื่อ</th><th class="c2">รายละเอียด</th>' +
    '<th class="c3">สถานะ</th><th class="c4">แก้ไขล่าสุด</th><th class="c5"></th></tr></thead><tbody>';
  let lastGroup = null;
  show.forEach(function(x){
    const r = x.r, i = x.i;
    if(def.groupBy && !query){
      const g = def.groupBy(r);
      if(g !== lastGroup){ h += '<tr class="g"><td colspan="5">' + esc(g) + '</td></tr>'; lastGroup = g; }
    }
    const thumb = def.thumb && r[def.thumb] ? '<img src="' + esc(r[def.thumb]) + '" alt="">' : '';
    h += '<tr class="' + (r.is_visible === false ? 'off' : '') + '">' +
      '<td class="c1"><div class="w">' + thumb + '<div class="t">' + esc(def.listT(r)) + '</div></div></td>' +
      '<td class="c2" title="' + esc(def.listS(r) || '') + '">' + esc(def.listS(r) || '') + '</td>' +
      '<td class="c3">' + (def.noHide ? '' :
        '<span class="tag ' + (r.is_visible === false ? 'off">ซ่อนอยู่' : 'on">แสดงบนเว็บ') + '</span>') + '</td>' +
      '<td class="c4">' + when(r.updated_at) + '</td>' +
      '<td class="c5"><div class="acts">' +
        (def.noOrder || query ? '' :
          '<div class="ord"><button class="mv" data-i="' + i + '" data-d="-1" title="เลื่อนลำดับขึ้น (บนเว็บจะแสดงก่อน)">&#9650;</button>' +
          '<button class="mv" data-i="' + i + '" data-d="1" title="เลื่อนลำดับลง">&#9660;</button></div>') +
        (def.noHide ? '' :
          '<button class="btn mini vis" data-i="' + i + '" title="' + (r.is_visible === false ? 'กลับมาแสดงบนเว็บ' : 'เอาออกจากเว็บชั่วคราว ไม่ลบข้อมูล') + '">' +
            (r.is_visible === false ? 'แสดงบนเว็บ' : 'ซ่อนจากเว็บ') + '</button>') +
        '<button class="btn mini ed" data-i="' + i + '">แก้ไข</button>' +
      '</div></td></tr>';
  });
  h += '</tbody></table>';
  if(!show.length) h = '<div class="empty">ไม่พบรายการที่ตรงกับ "' + esc(query) + '"</div>';
  h += '<div class="foot-note">แสดง ' + show.length + ' / ' + rows.length + ' รายการ</div>';
  $('#view').innerHTML = head + '<div class="tbl">' + bar + h + '</div>';
  wire();
}
function wire(){
  const v = $('#view');
  const add = v.querySelector('#addBtn'); if(add) add.addEventListener('click', ()=>openEdit(null));
  (SCHEMA[current].tools || []).forEach(t => {
    const b = v.querySelector('#' + t.id); if(b) b.addEventListener('click', ()=>t.run(b));
  });
  const q = v.querySelector('#q');
  if(q){
    q.addEventListener('input', function(){
      query = this.value.trim().toLowerCase();
      const pos = this.selectionStart;
      render();
      /* render สร้างช่องใหม่ ต้องคืนโฟกัสและตำแหน่งเคอร์เซอร์ให้ ไม่งั้นพิมพ์ได้ทีละตัว */
      const nq = $('#view #q'); if(nq){ nq.focus(); try{ nq.setSelectionRange(pos, pos); }catch(e){} }
    });
  }
  v.querySelectorAll('.ed').forEach(b => b.addEventListener('click', ()=>openEdit(rows[+b.dataset.i])));
  v.querySelectorAll('.vis').forEach(b => b.addEventListener('click', ()=>toggleVis(rows[+b.dataset.i])));
  v.querySelectorAll('.mv').forEach(b => b.addEventListener('click', ()=>move(+b.dataset.i, +b.dataset.d)));
}

async function toggleVis(r){
  const res = await api('/rest/v1/' + current + pkUrl(r), {
    method:'PATCH', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ is_visible: !r.is_visible })
  });
  if(res.ok){ r.is_visible = !r.is_visible; render(); toast('บันทึกแล้ว'); }
  else toast('บันทึกไม่สำเร็จ');
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
  const send = (row, val) => api('/rest/v1/' + current + pkUrl(row), {
    method:'PATCH', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ sort_order: val })
  });
  const [r1, r2] = await Promise.all([send(a, bv), send(b, av)]);
  if(r1.ok && r2.ok){
    a.sort_order = bv; b.sort_order = av;
    /* หน้าที่เรียงเป็นต้นไม้ต้องจัดใหม่ทั้งชุด (เมนูบนย้ายแล้วรายการย่อยต้องตามไปด้วย)
       หน้าธรรมดาแค่สลับตำแหน่งในรายการก็พอ */
    const def = SCHEMA[current];
    if(def.sortRows){ rows = def.sortRows(rows); }
    else { rows[i] = b; rows[j] = a; }
    render();
  } else toast('เลื่อนลำดับไม่สำเร็จ');
}
