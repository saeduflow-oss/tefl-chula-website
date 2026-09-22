/* =========================================================
   admin/js/editor.js — แผงแก้ไข (modal): สร้างช่องกรอกจาก SCHEMA, rich editor, อัปโหลดรูป, บันทึก/ลบ
   ช่องกรอกสร้างใหม่ทุกครั้งที่เปิด ตามชนิด t ของแต่ละ field ใน SCHEMA
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- แผงแก้ไข ---------- */
function openEdit(row){
  editing = row || null;
  const def = SCHEMA[current];
  $('#modalTitle').textContent = (row ? 'แก้ไข ' : 'เพิ่ม ') + def.label;
  $('#editHelp').textContent = row
    ? 'แก้เสร็จกด "บันทึก" แล้วรีเฟรชหน้าเว็บจะเห็นผลทันที'
    : 'รายการใหม่จะไปต่อท้าย ถ้าอยากให้ขึ้นก่อน ใช้ปุ่มลูกศรในตารางเลื่อนได้ทีหลัง';
  $('#delBtn').style.display = (row && !def.noDelete) ? '' : 'none';
  msg($('#editMsg'), '');

  const fields = typeof def.fields === 'function' ? def.fields(row || {}) : def.fields;
  $('#fields').innerHTML = fields.map(function(f){
    const v = row ? (row[f.k] == null ? '' : row[f.k]) : '';
    const hint = f.hint ? '<div class="hint">' + esc(f.hint) + '</div>' : '';
    let input;
    if(f.t === 'bool' || f.t === 'boolstr'){
      /* boolstr = ติ๊กถูกแต่เก็บเป็นข้อความ 'true'/'false' (คอลัมน์ value ของ settings เป็น text) */
      const on = f.t === 'boolstr' ? String(v) === 'true' : !!v;
      return '<div class="field"><label style="font-weight:400">' +
        '<input type="checkbox" data-k="' + f.k + '" data-boolstr="' + (f.t === 'boolstr') + '" style="width:auto;margin-right:7px"' +
        (on ? ' checked' : '') + '>' + esc(f.label) + '</label>' + hint + '</div>';
    }
    if(f.t === 'rich'){
      /* contenteditable คือ WYSIWYG ตัวจริง ส่วน textarea ที่ซ่อนไว้เป็นตัวถือค่า
         เพราะ contenteditable ไม่มี .value ให้ตัวบันทึกอ่าน จึง sync กันทุกครั้งที่พิมพ์ */
      return '<div class="field"><label>' + esc(f.label) + '</label><div class="rich">' +
        '<div class="rt-bar">' +
          '<button type="button" data-cmd="bold" title="ตัวหนา"><b>B</b></button>' +
          '<button type="button" data-cmd="italic" title="ตัวเอียง"><i>I</i></button>' +
          '<span class="sep"></span>' +
          '<button type="button" data-block="h2">หัวข้อใหญ่</button>' +
          '<button type="button" data-block="h3">หัวข้อรอง</button>' +
          '<button type="button" data-block="p">ย่อหน้า</button>' +
          '<span class="sep"></span>' +
          '<button type="button" data-cmd="insertUnorderedList" title="รายการ">• รายการ</button>' +
          '<button type="button" data-link>ลิงก์</button>' +
          '<button type="button" data-unlink>เอาลิงก์ออก</button>' +
          '<span class="sep"></span>' +
          '<button type="button" data-clean>ล้างรูปแบบ</button>' +
          '<button type="button" data-code>&lt;/&gt; โค้ด HTML</button>' +
        '</div>' +
        '<div class="rt-edit" contenteditable="true">' + v + '</div>' +
        '<textarea class="rt-code" data-k="' + f.k + '" hidden></textarea>' +
        '</div>' + hint + '</div>';
    }
    if(f.t === 'select'){
      const opts = typeof f.opts === 'function' ? f.opts(rows) : f.opts;
      input = '<select data-k="' + f.k + '">' + opts.map(o =>
        '<option value="' + esc(o[0]) + '"' + (String(v) === o[0] ? ' selected' : '') + '>' +
        esc(o[1]) + '</option>').join('') + '</select>';
    } else if(f.t === 'html' || f.t === 'area'){
      input = '<textarea data-k="' + f.k + '"' + (f.req ? ' required' : '') + '>' + esc(v) + '</textarea>';
    } else if(f.t === 'date'){
      input = '<input type="date" data-k="' + f.k + '" value="' + esc(v) + '"' + (f.req ? ' required' : '') + '>';
    } else if(f.t === 'image'){
      input = '<div class="thumbrow">' +
        '<img id="prev_' + f.k + '" src="' + esc(v) + '" alt="">' +
        '<div style="flex:1">' +
          '<input type="text" data-k="' + f.k + '" value="' + esc(v) + '" placeholder="img/… หรือ URL">' +
          '<input type="file" accept="image/*" data-up="' + f.k + '" style="margin-top:7px;font-size:12px">' +
        '</div></div>';
    } else {
      input = '<input type="text" data-k="' + f.k + '" value="' + esc(v) + '"' + (f.req ? ' required' : '') + '>';
    }
    return '<div class="field"><label>' + esc(f.label) +
           (f.req ? ' <span style="color:var(--muted);font-weight:400">(จำเป็น)</span>' : '') + '</label>' + input + hint + '</div>';
  }).join('');

  $('#fields').querySelectorAll('[data-up]').forEach(inp => inp.addEventListener('change', ()=>upload(inp)));
  $('#fields').querySelectorAll('.rich').forEach(wireRichEditor);
  $('#modal .box').classList.toggle('wide', fields.some(f => f.t === 'rich'));
  $('#modal').classList.add('show');
  const first = $('#fields').querySelector('input[type=text],textarea,[contenteditable]'); if(first) first.focus();
}

/* ผูกปุ่มแถบเครื่องมือของตัวแก้ข้อความ

   ใช้ document.execCommand ทั้งที่ถูกประกาศเลิกใช้ เพราะทางเลือกคือเขียน
   ตัวจัดการ Range/Selection เองทั้งชุด ซึ่งเกินความจำเป็นสำหรับหน้า admin
   ที่ใช้กันไม่กี่คน และเบราว์เซอร์ทุกตัวยังรองรับอยู่ */
function wireRichEditor(box){
  const edit = box.querySelector('.rt-edit');
  const code = box.querySelector('.rt-code');
  const bar  = box.querySelector('.rt-bar');
  const sync = () => { code.value = edit.innerHTML; };
  sync();
  edit.addEventListener('input', sync);
  /* วางข้อความจากที่อื่นให้ตัดรูปแบบทิ้ง ไม่งั้นสีและฟอนต์จาก Word จะติดมาด้วย */
  edit.addEventListener('paste', function(e){
    e.preventDefault();
    document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text'));
  });
  function run(fn){ edit.focus(); fn(); sync(); paintBar(); }
  bar.addEventListener('click', function(e){
    const b = e.target.closest('button');
    if(!b) return;
    if(b.dataset.cmd)      return run(()=>document.execCommand(b.dataset.cmd));
    if(b.dataset.block)    return run(()=>document.execCommand('formatBlock', false, b.dataset.block));
    if(b.hasAttribute('data-unlink')) return run(()=>document.execCommand('unlink'));
    if(b.hasAttribute('data-clean'))  return run(()=>document.execCommand('removeFormat'));
    if(b.hasAttribute('data-link')){
      const url = prompt('ใส่ลิงก์ เช่น admission.html หรือ https://www.chula.ac.th/');
      if(url) run(()=>document.execCommand('createLink', false, url));
      return;
    }
    if(b.hasAttribute('data-code')){
      const toCode = code.hidden;
      if(toCode){ code.value = edit.innerHTML; } else { edit.innerHTML = code.value; }
      code.hidden = !toCode; edit.hidden = toCode;
      b.classList.toggle('on', toCode);
    }
  });
  function paintBar(){
    bar.querySelectorAll('[data-cmd]').forEach(function(b){
      try{ b.classList.toggle('on', document.queryCommandState(b.dataset.cmd)); }catch(e){}
    });
  }
  edit.addEventListener('keyup', paintBar);
  edit.addEventListener('mouseup', paintBar);
}

/* อัปโหลดรูปขึ้น Supabase Storage แล้วเอา public URL ใส่ช่องข้อความให้เลย
   ตั้งชื่อไฟล์ใหม่ด้วย timestamp กันชนกันและกัน CDN คืนรูปเก่าที่แคชไว้ */
async function upload(inp){
  const file = inp.files[0];
  if(!file) return;
  const key = inp.dataset.up;
  const name = Date.now() + '-' + file.name.replace(/[^\w.\-]/g, '_');
  msg($('#editMsg'), 'กำลังอัปโหลดรูป…', 'ok');
  const r = await api('/storage/v1/object/media/' + name, { method:'POST', headers:{ 'Content-Type': file.type }, body: file });
  if(!r.ok){ return msg($('#editMsg'), 'อัปโหลดไม่สำเร็จ (' + r.status + ')'); }
  const url = URL_ + '/storage/v1/object/public/media/' + name;
  $('#fields').querySelector('[data-k="' + key + '"]').value = url;
  $('#prev_' + key).src = url;
  msg($('#editMsg'), '');
}

$('#cancelBtn').addEventListener('click', ()=>$('#modal').classList.remove('show'));
$('#modal').addEventListener('click', e => { if(e.target.id === 'modal') $('#modal').classList.remove('show'); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') $('#modal').classList.remove('show'); });

$('#editForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const body = {};
  $('#fields').querySelectorAll('[data-k]').forEach(function(el){
    if(el.type === 'checkbox'){
      body[el.dataset.k] = el.dataset.boolstr === 'true' ? String(el.checked) : el.checked;
    } else {
      const v = el.value.trim();
      /* select ที่เลือก "แถบเมนูบนสุด" ต้องเป็น null ไม่ใช่ '' (คอลัมน์ uuid รับ '' ไม่ได้)
         ช่องวันที่ก็เช่นกัน — คอลัมน์ date รับ '' ไม่ได้ */
      body[el.dataset.k] = ((el.tagName === 'SELECT' || el.type === 'date') && v === '') ? null : v;
    }
  });
  let res;
  if(editing){
    res = await api('/rest/v1/' + current + pkUrl(editing), {
      method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  } else {
    /* ของใหม่ไปต่อท้ายเสมอ ผู้ใช้ค่อยเลื่อนขึ้นเองทีหลัง */
    body.sort_order = rows.length ? Math.max.apply(null, rows.map(r=>r.sort_order)) + 1 : 0;
    res = await api('/rest/v1/' + current, {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  }
  if(!res.ok){ const t = await res.text(); return msg($('#editMsg'), 'บันทึกไม่สำเร็จ: ' + t.slice(0, 200)); }
  $('#modal').classList.remove('show');
  toast('บันทึกแล้ว ✓ รีเฟรชหน้าเว็บจะเห็นผลทันที');
  load();
});

$('#delBtn').addEventListener('click', async function(){
  if(!editing || !confirm('ลบ "' + SCHEMA[current].listT(editing) + '" ออกถาวร กู้คืนไม่ได้\n\nถ้าแค่อยากเอาออกจากเว็บชั่วคราว กด "ยกเลิก" แล้วใช้ปุ่ม "ซ่อนจากเว็บ" ในตารางแทน')) return;
  const r = await api('/rest/v1/' + current + pkUrl(editing), { method:'DELETE' });
  if(!r.ok) return msg($('#editMsg'), 'ลบไม่สำเร็จ');
  $('#modal').classList.remove('show');
  toast('ลบแล้ว');
  load();
});
