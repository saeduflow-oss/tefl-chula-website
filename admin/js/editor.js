/* =========================================================
   admin/js/editor.js — หน้าแก้ไขแบบ WordPress (Classic Editor) เต็มหน้า
   ซ้าย: ช่องชื่อเรื่องตัวใหญ่ · ตัวแก้ข้อความ (แท็บ ภาพ/โค้ด HTML + ปุ่มเพิ่มสื่อ) · กล่องรายละเอียด
   ขวา: กล่องเผยแพร่ (สถานะ/อัปเดต/ลบ) · กล่องหมวดหมู่ (select/bool) · กล่องรูปภาพ
   ช่องกรอกสร้างใหม่ทุกครั้งที่เปิด ตามชนิด t ของแต่ละ field ใน SCHEMA
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

const postbox = (title, inner, cls) =>
  '<div class="postbox ' + (cls || '') + '"><h2 class="hndle">' + esc(title) + '</h2><div class="inside">' + inner + '</div></div>';
const hintOf = f => f.hint ? '<div class="hint">' + esc(f.hint) + '</div>' : '';
/* หน้าที่บล็อกนั้นอยู่ (blocks มีคอลัมน์ page) ใช้ลิงก์ "ดูบนเว็บ" ให้ตรงหน้า ไม่ใช่หน้าแรกเสมอ */
const linkOf = (def, row) => (current === 'blocks' && row && /\.html$/.test(row.page || '')) ? row.page : def.link;

/* ---------- ช่องกรอกทั่วไป ---------- */
function fieldHtml(f, v){
  const id = 'f_' + f.k;
  if(f.t === 'bool' || f.t === 'boolstr'){
    /* boolstr = ติ๊กถูกแต่เก็บเป็นข้อความ 'true'/'false' (คอลัมน์ value ของ settings เป็น text) */
    const on = f.t === 'boolstr' ? String(v) === 'true' : !!v;
    return '<div class="field chk"><label><input type="checkbox" data-k="' + f.k + '" data-boolstr="' + (f.t === 'boolstr') + '"' +
      (on ? ' checked' : '') + '>' + esc(f.label) + '</label>' + hintOf(f) + '</div>';
  }
  let input;
  if(f.t === 'select'){
    const opts = typeof f.opts === 'function' ? f.opts(rows) : f.opts;
    input = '<select id="' + id + '" data-k="' + f.k + '"' + (f.req ? ' required' : '') + '>' + opts.map(o =>
      '<option value="' + esc(o[0]) + '"' + (String(v) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
  } else if(f.t === 'html' || f.t === 'area'){
    input = '<textarea id="' + id + '" data-k="' + f.k + '"' + (f.req ? ' required' : '') + '>' + esc(v) + '</textarea>';
  } else if(f.t === 'date'){
    input = '<input type="date" id="' + id + '" data-k="' + f.k + '" value="' + esc(v) + '"' + (f.req ? ' required' : '') + '>';
  } else {
    input = '<input type="text" id="' + id + '" data-k="' + f.k + '" value="' + esc(v) + '"' + (f.req ? ' required' : '') + '>';
  }
  return '<div class="field"><label for="' + id + '">' + esc(f.label) + (f.req ? ' <span class="req">*</span>' : '') + '</label>' +
    input + hintOf(f) + '</div>';
}

/* ---------- กล่องรูป (Featured image) ---------- */
function imageHtml(f, v){
  return '<div class="feat" data-img="' + f.k + '">' +
    '<button type="button" class="feat-pic" data-pick title="เลือกรูปจากเครื่อง"></button>' +
    '<input type="file" accept="image/*" data-up hidden>' +
    '<div class="feat-acts"></div>' +
    '<label class="feat-url">หรือวางลิงก์/พาธของรูป<input type="text" data-k="' + f.k + '" value="' + esc(v) + '" placeholder="img/… หรือ https://…"></label>' +
    hintOf(f) + '</div>';
}
function wireImage(fe){
  const inp = fe.querySelector('[data-k]'), file = fe.querySelector('[data-up]');
  const pic = fe.querySelector('.feat-pic'), acts = fe.querySelector('.feat-acts');
  const paint = () => {
    const u = inp.value.trim();
    pic.classList.toggle('empty', !u);
    pic.innerHTML = u ? '<img src="' + esc(u) + '" alt="">' : ICON.media + '<span>คลิกเพื่ออัปโหลดรูป</span>';
    acts.innerHTML = u ? '<a data-pick>เปลี่ยนรูป</a><a class="rm" data-rm>ลบรูป</a>' : '';
  };
  paint();
  fe.addEventListener('click', e => {
    if(e.target.closest('[data-pick]')) file.click();
    if(e.target.closest('[data-rm]')){ inp.value = ''; dirty = true; paint(); }
  });
  file.addEventListener('change', async ()=>{
    const u = await uploadFile(file.files[0]); file.value = '';
    if(u){ inp.value = u; paint(); }
  });
  inp.addEventListener('input', paint);
}

/* ---------- ตัวแก้ข้อความ (แบบ Classic Editor: แท็บ ภาพ / โค้ด HTML) ---------- */
function richHtml(f, v){
  const cmd = (c, title, icon) => '<button type="button" data-cmd="' + c + '" title="' + title + '">' + icon + '</button>';
  const sep = '<span class="sep"></span>';
  return '<div class="wp-editor">' +
    '<div class="ed-tools">' +
      '<button type="button" class="btn" data-media>' + ICON.media + 'เพิ่มสื่อ</button>' +
      '<input type="file" accept="image/*" data-media-file hidden>' +
      '<span class="ed-label">' + esc(f.label) + (f.req ? ' <span class="req">*</span>' : '') + '</span>' +
      '<div class="ed-tabs"><button type="button" class="on" data-mode="visual">ภาพ</button><button type="button" data-mode="code">โค้ด HTML</button></div>' +
    '</div>' +
    '<div class="ed-wrap">' +
      '<div class="rt-bar">' +
        '<select data-format title="รูปแบบย่อหน้า"><option value="p">ย่อหน้า</option><option value="h2">หัวข้อ 2</option>' +
          '<option value="h3">หัวข้อ 3</option><option value="h4">หัวข้อ 4</option></select>' + sep +
        cmd('bold', 'ตัวหนา (Ctrl+B)', ICON.bold) + cmd('italic', 'ตัวเอียง (Ctrl+I)', ICON.italic) + sep +
        cmd('insertUnorderedList', 'รายการแบบจุด', ICON.ul) + cmd('insertOrderedList', 'รายการแบบตัวเลข', ICON.ol) + sep +
        '<button type="button" data-link title="แทรกลิงก์ (Ctrl+K)">' + ICON.link + '</button>' + cmd('unlink', 'เอาลิงก์ออก', ICON.unlink) + sep +
        cmd('removeFormat', 'ล้างรูปแบบตัวอักษร', ICON.clean) + cmd('undo', 'เลิกทำ (Ctrl+Z)', ICON.undo) + cmd('redo', 'ทำซ้ำ', ICON.redo) +
      '</div>' +
      '<div class="rt-edit" contenteditable="true">' + v + '</div>' +
      '<textarea class="rt-code" data-k="' + f.k + '" data-rich="' + esc(f.label) + '"' + (f.req ? ' data-req="1"' : '') + ' hidden spellcheck="false"></textarea>' +
      '<div class="ed-status"><span class="path"></span><span class="wc"></span></div>' +
    '</div>' + hintOf(f) + '</div>';
}

/* contenteditable คือ WYSIWYG ตัวจริง ส่วน textarea เป็นทั้งตัวถือค่า (ตัวบันทึกอ่าน .value) และโหมดโค้ด HTML
   จึง sync กันทุกครั้งที่พิมพ์

   ใช้ document.execCommand ทั้งที่ถูกประกาศเลิกใช้ เพราะทางเลือกคือเขียน
   ตัวจัดการ Range/Selection เองทั้งชุด ซึ่งเกินความจำเป็นสำหรับหน้า admin
   ที่ใช้กันไม่กี่คน และเบราว์เซอร์ทุกตัวยังรองรับอยู่ */
function wireRichEditor(ed){
  const edit = ed.querySelector('.rt-edit'), code = ed.querySelector('.rt-code'), bar = ed.querySelector('.rt-bar');
  const fmt = bar.querySelector('[data-format]'), path = ed.querySelector('.path'), wc = ed.querySelector('.wc');
  /* ตำแหน่งเคอร์เซอร์ล่าสุดในตัวแก้: กดเลือกรูปแบบ/เพิ่มสื่อ/ใส่ลิงก์แล้วโฟกัสหลุด ต้องคืนตำแหน่งก่อนสั่งงาน
     ไม่งั้นหัวข้อหรือรูปจะไปโผล่ต้นเนื้อหาแทนที่ตรงที่ผู้ใช้วางเคอร์เซอร์ไว้ */
  let saved = null;
  const count = () => {
    const txt = code.hidden ? edit.textContent : code.value.replace(/<[^>]+>/g, '');
    wc.textContent = 'ตัวอักษร: ' + txt.replace(/\s+/g, '').length.toLocaleString('th-TH');
  };
  const sync = () => { code.value = edit.innerHTML; count(); };
  sync();
  edit.addEventListener('input', sync);
  code.addEventListener('input', count);
  /* วางข้อความจากที่อื่นให้ตัดรูปแบบทิ้ง ไม่งั้นสีและฟอนต์จาก Word จะติดมาด้วย */
  edit.addEventListener('paste', function(e){
    e.preventDefault();
    document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text'));
  });

  function restore(){ if(!saved) return; const s = getSelection(); s.removeAllRanges(); s.addRange(saved); }
  function run(fn){ edit.focus(); restore(); fn(); sync(); paint(); dirty = true; }
  function paint(){
    bar.querySelectorAll('[data-cmd]').forEach(b => {
      let on = false;
      if(/^(bold|italic|insert\w+List)$/.test(b.dataset.cmd)){ try{ on = document.queryCommandState(b.dataset.cmd); }catch(e){} }
      b.classList.toggle('on', on);
    });
    let blk = ''; try{ blk = String(document.queryCommandValue('formatBlock') || '').toLowerCase(); }catch(e){}
    fmt.value = ['h2','h3','h4'].includes(blk) ? blk : 'p';
    /* แถบล่างบอกตำแหน่งแบบ WordPress เช่น "ul » li » strong" ให้รู้ว่าเคอร์เซอร์อยู่ในอะไร */
    const parts = [];
    for(let n = getSelection().anchorNode; n && n !== edit; n = n.parentNode) if(n.nodeType === 1) parts.unshift(n.tagName.toLowerCase());
    path.textContent = parts.join(' » ');
  }
  /* ฟัง selectionchange ระดับ document ตัวเดียวต่อตัวแก้ แล้วถอดตัวเองเมื่อหน้าแก้ไขถูกวาดใหม่ (edit หลุดจากหน้า) */
  const onSel = () => {
    if(!edit.isConnected) return document.removeEventListener('selectionchange', onSel);
    const s = getSelection();
    if(s.rangeCount && edit.contains(s.anchorNode)){ saved = s.getRangeAt(0).cloneRange(); paint(); }
  };
  document.addEventListener('selectionchange', onSel);

  /* mousedown ไม่ให้ปุ่มแย่งโฟกัส ข้อความที่เลือกไว้จึงไม่หลุดก่อนกดตัวหนา/ตัวเอียง */
  bar.addEventListener('mousedown', e => { if(e.target.closest('button')) e.preventDefault(); });
  const addLink = () => {
    const url = prompt('ใส่ลิงก์ เช่น admission.html หรือ https://www.chula.ac.th/');
    if(url && url.trim()) run(()=>document.execCommand('createLink', false, url.trim()));
  };
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.cmd) run(()=>document.execCommand(b.dataset.cmd));
    else if(b.hasAttribute('data-link')) addLink();
  });
  fmt.addEventListener('change', ()=>run(()=>document.execCommand('formatBlock', false, '<' + fmt.value + '>')));
  edit.addEventListener('keydown', e => {
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); addLink(); }
  });

  /* แท็บ ภาพ / โค้ด HTML */
  ed.querySelectorAll('[data-mode]').forEach(t => t.addEventListener('click', ()=>{
    const toCode = t.dataset.mode === 'code';
    if(toCode === !code.hidden) return;
    if(toCode) code.value = edit.innerHTML; else { edit.innerHTML = code.value; saved = null; }
    code.hidden = !toCode; edit.hidden = toCode; bar.classList.toggle('off', toCode);
    ed.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === t));
    count();
  }));

  /* เพิ่มสื่อ: อัปโหลดแล้วแทรกรูปตรงเคอร์เซอร์ (ยังไม่เคยคลิกในตัวแก้ = ต่อท้ายเนื้อหา) */
  const file = ed.querySelector('[data-media-file]');
  ed.querySelector('[data-media]').addEventListener('click', ()=>file.click());
  file.addEventListener('change', async ()=>{
    const url = await uploadFile(file.files[0]); file.value = '';
    if(!url) return;
    const alt = prompt('คำอธิบายรูป (alt) สำหรับผู้ใช้โปรแกรมอ่านหน้าจอ — เว้นว่างได้') || '';
    const html = '<img src="' + esc(url) + '" alt="' + esc(alt) + '">';
    if(!code.hidden){
      const p = code.selectionStart || code.value.length;
      code.value = code.value.slice(0, p) + html + code.value.slice(p);
      count(); dirty = true;
    } else if(saved){
      run(()=>document.execCommand('insertHTML', false, html));
    } else {
      edit.insertAdjacentHTML('beforeend', '<p>' + html + '</p>'); sync(); dirty = true;
    }
  });
}

/* อัปโหลดรูปขึ้น Supabase Storage แล้วคืน public URL
   ตั้งชื่อไฟล์ใหม่ด้วย timestamp กันชนกันและกัน CDN คืนรูปเก่าที่แคชไว้ */
async function uploadFile(file){
  if(!file) return null;
  const name = Date.now() + '-' + file.name.replace(/[^\w.\-]/g, '_');
  msg($('#editMsg'), 'กำลังอัปโหลดรูป…', 'ok');
  const r = await api('/storage/v1/object/media/' + name, { method:'POST', headers:{ 'Content-Type': file.type }, body: file });
  if(!r.ok){ msg($('#editMsg'), 'อัปโหลดไม่สำเร็จ (' + r.status + ')'); return null; }
  msg($('#editMsg'), '');
  dirty = true;
  return URL_ + '/storage/v1/object/public/media/' + name;
}

/* ---------- หน้าแก้ไข ----------
   notice = ข้อความเขียวบนสุดหลังบันทึก (แบบ "Post updated. View post") */
function openEdit(row, notice){
  editing = row || null;
  dirty = false;
  const def = SCHEMA[current];
  setTitle((row ? 'แก้ไข' : 'เพิ่ม') + def.label);
  const fields = typeof def.fields === 'function' ? def.fields(row || {}) : def.fields;
  const val = f => row ? (row[f.k] == null ? '' : row[f.k]) : '';
  const titleF = def.titleKey ? fields.find(f => f.k === def.titleKey) : null;
  const rich = fields.filter(f => f.t === 'rich');
  const imgs = fields.filter(f => f.t === 'image');
  const side = fields.filter(f => f.t === 'select' || f.t === 'bool');
  const rest = fields.filter(f => f !== titleF && !rich.includes(f) && !imgs.includes(f) && !side.includes(f));
  const link = linkOf(def, row);
  const vis = row ? row.is_visible !== false : true;

  const title = titleF
    ? '<div class="titlediv"><input type="text" class="title-input" data-k="' + titleF.k + '" value="' + esc(val(titleF)) + '"' +
        ' placeholder="ใส่' + esc(titleF.label) + 'ที่นี่" aria-label="' + esc(titleF.label) + '"' + (titleF.req ? ' required' : '') + '>' + hintOf(titleF) + '</div>'
    /* blocks/settings: ชื่อผูกกับตำแหน่งบนเว็บ แก้ไม่ได้ จึงแสดงเป็นหัวอ่านอย่างเดียว */
    : '<div class="fixed-title"><span>' + esc(def.groupBy ? def.groupBy(row) : def.label) + '</span><b>' + esc(def.listT(row)) + '</b></div>';

  const publish =
    '<div class="misc">' +
      (def.noHide ? '' : '<div class="misc-row">' + ICON.eye + '<label for="pubStatus">สถานะ:</label>' +
        '<select id="pubStatus"><option value="1"' + (vis ? ' selected' : '') + '>แสดงบนเว็บ</option>' +
        '<option value="0"' + (vis ? '' : ' selected') + '>ซ่อน (ฉบับร่าง)</option></select></div>') +
      (row && row.updated_at ? '<div class="misc-row">' + ICON.clock + '<span>แก้ไขล่าสุด: <b>' + when(row.updated_at) + '</b>' +
        (row.updated_by ? ' โดย <b>' + esc(row.updated_by) + '</b>' : '') + '</span></div>' : '') +
      (link ? '<div class="misc-row">' + ICON.site + '<a href="' + esc(link) + '" target="_blank" rel="noopener">ดูหน้านี้บนเว็บ ↗</a></div>' : '') +
    '</div>' +
    '<div class="major">' +
      (row && !def.noDelete ? '<a class="submitdelete" id="delBtn">ลบถาวร</a>' : '<span></span>') +
      '<button class="btn primary" id="saveBtn">' + (row ? 'อัปเดต' : vis ? 'เผยแพร่' : 'บันทึกฉบับร่าง') + '</button>' +
    '</div>';

  $('#view').innerHTML = '<div class="wrap">' +
    /* ข้อความในหน้าเข้ามาจากเมนู "หน้าเว็บ" → ย้อนกลับไปรายการส่วนของหน้านั้น ไม่ใช่ตาราง blocks ทั้งก้อน */
    (current === 'blocks' && row
      ? '<a class="back" href="' + H('pages/' + encodeURIComponent(row.page)) + '">' + ICON.back + esc(pageOf(row.page).title) + '</a>'
      : '<a class="back" href="' + H(current) + '">' + ICON.back + esc(def.title) + '</a>') +
    heading((row ? 'แก้ไข' : 'เพิ่ม') + def.label + (row ? '' : 'ใหม่'),
      row && !def.noAdd ? '<a class="btn page-title-action" href="' + H(current + '/new') + '">เพิ่มใหม่</a>' : '') +
    (notice ? '<div class="notice ok"><p>' + esc(notice) + (link ? ' <a href="' + esc(link) + '" target="_blank" rel="noopener">ดูบนเว็บ ↗</a>' : '') +
      '</p><button type="button" class="dismiss" aria-label="ปิด">×</button></div>' : '') +
    '<div class="msg err" id="editMsg"></div>' +
    '<form id="editForm" class="post-body">' +
      '<div class="post-main">' + title +
        (def.where ? '<p class="where">' + ICON.site + '<span>แสดงที่: ' + esc(def.where) + '</span></p>' : '') +
        rich.map(f => richHtml(f, val(f))).join('') +
        (rest.length ? postbox(rich.length || titleF ? 'รายละเอียด' : def.label, rest.map(f => fieldHtml(f, val(f))).join('')) : '') +
      '</div>' +
      '<div class="post-side">' +
        postbox('เผยแพร่', publish, 'pub') +
        (side.length ? postbox('หมวดหมู่และตำแหน่ง', side.map(f => fieldHtml(f, val(f))).join('')) : '') +
        imgs.map(f => postbox(f.label, imageHtml(f, val(f)))).join('') +
      '</div>' +
    '</form></div>';

  const form = $('#editForm');
  form.querySelectorAll('.wp-editor').forEach(wireRichEditor);
  form.querySelectorAll('.feat').forEach(wireImage);
  form.addEventListener('input', ()=>{ dirty = true; });
  form.addEventListener('change', ()=>{ dirty = true; });
  form.addEventListener('submit', save);
  const st = $('#pubStatus');
  if(st && !row) st.addEventListener('change', ()=>{ $('#saveBtn').textContent = st.value === '1' ? 'เผยแพร่' : 'บันทึกฉบับร่าง'; });
  const del = $('#delBtn');
  if(del) del.addEventListener('click', async ()=>{
    const was = dirty; dirty = false;
    if(!(await removeRows([editing]))) dirty = was;
  });
  const n = $('#view .notice .dismiss'); if(n) n.addEventListener('click', ()=>n.parentNode.remove());
  if(!row){ const t = form.querySelector('.title-input'); if(t) t.focus(); }
}

async function save(e){
  e.preventDefault();
  const k = current, def = SCHEMA[k], pk = def.pk || 'id', wasNew = !editing;
  const body = {};
  $('#editForm').querySelectorAll('[data-k]').forEach(function(el){
    if(el.type === 'checkbox'){
      body[el.dataset.k] = el.dataset.boolstr === 'true' ? String(el.checked) : el.checked;
    } else {
      const v = el.value.trim();
      /* select ที่เลือก "แถบเมนูบนสุด" ต้องเป็น null ไม่ใช่ '' (คอลัมน์ uuid รับ '' ไม่ได้)
         ช่องวันที่ก็เช่นกัน — คอลัมน์ date รับ '' ไม่ได้ */
      body[el.dataset.k] = ((el.tagName === 'SELECT' || el.type === 'date') && v === '') ? null : v;
    }
  });
  /* ตัวแก้ข้อความไม่ใช่ช่อง form จริง เบราว์เซอร์ตรวจ required ให้ไม่ได้ ต้องเช็กเอง */
  const empty = [...$('#editForm').querySelectorAll('[data-req]')].find(el => !el.value.replace(/<[^>]+>/g, '').trim());
  if(empty) return msg($('#editMsg'), 'กรุณาใส่' + empty.dataset.rich + 'ก่อนบันทึก');
  const st = $('#pubStatus'); if(st) body.is_visible = st.value === '1';

  const btn = $('#saveBtn'), label = btn.textContent;
  btn.disabled = true; btn.textContent = 'กำลังบันทึก…';
  const opts = { headers:{ 'Content-Type':'application/json', Prefer:'return=representation' } };
  let res;
  if(editing){
    res = await api('/rest/v1/' + k + pkUrl(editing), Object.assign(opts, { method:'PATCH', body: JSON.stringify(body) }));
  } else {
    /* ของใหม่ไปต่อท้ายเสมอ ผู้ใช้ค่อยเลื่อนขึ้นเองทีหลังในหน้ารายการ */
    body.sort_order = rows.length ? Math.max.apply(null, rows.map(r => r.sort_order || 0)) + 1 : 0;
    res = await api('/rest/v1/' + k, Object.assign(opts, { method:'POST', body: JSON.stringify(body) }));
  }
  btn.disabled = false; btn.textContent = label;
  if(!res.ok){ const t = await res.text(); return msg($('#editMsg'), 'บันทึกไม่สำเร็จ: ' + t.slice(0, 200)); }
  const saved = (await res.json())[0] || {};
  dirty = false;
  /* โหลดรายการใหม่ทั้งชุด: ตัวเลือก "อยู่ที่ไหน" ของเมนูและลำดับของรายการถัดไปต้องเห็นแถวที่เพิ่งบันทึก */
  await fetchRows(k);
  if(current !== k) return;
  const row = rows.find(r => String(r[pk]) === String(saved[pk])) || saved;
  if(wasNew){
    /* เปลี่ยน URL เป็นหน้าแก้ไขของแถวใหม่ โดยไม่ยิง hashchange (ไม่งั้นวาดหน้าใหม่ซ้ำและ notice หาย) */
    const h = editHash(k, row);
    history.replaceState(null, '', H(h)); lastHash = h;
    paintMenu('edit');
  }
  openEdit(row, (wasNew ? (body.is_visible === false ? 'บันทึกฉบับร่างแล้ว (ยังซ่อนจากเว็บ)' : 'เผยแพร่แล้ว') : 'อัปเดตแล้ว') +
    ' — รีเฟรชหน้าเว็บจะเห็นผลทันที');
}

/* Ctrl/Cmd+S = บันทึก เมื่ออยู่หน้าแก้ไข */
document.addEventListener('keydown', e => {
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's'){
    const f = $('#editForm');
    if(f){ e.preventDefault(); f.requestSubmit(); }
    else if($('#beSave')){ e.preventDefault(); $('#beSave').click(); }   /* ตัวแก้แบบบล็อกของทั้งหน้า */
  }
});
