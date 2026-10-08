/* =========================================================
   admin/js/views/account.js — โปรไฟล์ (ชื่อ/รหัสผ่าน) และตั้งค่า (ธีม/รายชื่อผู้ดูแล)
   เข้าถึงจากกลุ่ม "ตั้งค่า" ในเมนูซ้าย และเมนูผู้ใช้มุมขวาบน ไม่อยู่ใน SCHEMA
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* โครงหน้าตั้งค่าแบบเดียวกันทั้งสองหน้า (ทำใหม่ ต.ค. 2026 — แบบเดิมการ์ดแคบ 720px ขนาดตัวอักษรไม่เข้าชุด)
   หัวใหญ่แบบหน้ารายการ (.pg-head) แล้วเป็นแถว: คำอธิบายซ้าย · กล่องช่องกรอกขวา (ปุ่มบันทึกชิดขวาในแถบล่างของกล่อง) */
const stSec = (title, desc, body, foot) =>
  '<section class="st-sec"><div class="st-info"><h2>' + esc(title) + '</h2><p>' + desc + '</p></div>' +
  '<div class="st-card"><div class="st-body">' + body + '</div>' + (foot ? '<div class="st-foot">' + foot + '</div>' : '') + '</div></section>';
const stField = (label, input, hint) => '<div class="field"><label>' + esc(label) + '</label>' + input + (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div>';

/* ---------- โปรไฟล์: ชื่อที่แสดง + เปลี่ยนรหัสผ่าน ---------- */
function profileView(){
  setTitle('โปรไฟล์');
  const name = (me.user_metadata && me.user_metadata.full_name) || '';
  const shown = name || me.email.split('@')[0];
  $('#view').innerHTML = '<div class="pg st-page">' +
    '<div class="pg-head"><h1>โปรไฟล์ของฉัน</h1><p>ชื่อที่แสดงในระบบและรหัสผ่านสำหรับเข้าสู่ระบบ</p></div>' +
    '<div class="st-me"><span class="st-av">' + esc(shown[0].toUpperCase()) + '</span>' +
      '<div><b>' + esc(shown) + '</b><span>' + esc(me.email) + '</span></div><span class="pg-badge main">ผู้ดูแลระบบ</span></div>' +
    stSec('ข้อมูลส่วนตัว', 'ชื่อที่แสดงจะขึ้นที่มุมขวาบน (สวัสดี, …) บนแดชบอร์ด และในคอลัมน์ "ผู้แก้ไข" ของทุกรายการที่คุณแก้',
      '<div class="msg" id="pMsg"></div>' +
      stField('ชื่อที่แสดง', '<input type="text" id="pName" value="' + esc(name) + '" placeholder="เช่น อาจารย์กิตติยา">') +
      stField('อีเมล', '<input type="text" value="' + esc(me.email) + '" disabled>', 'ใช้เข้าสู่ระบบ เปลี่ยนจากหน้านี้ไม่ได้'),
      '<button class="btn primary" id="pSave">บันทึก</button>') +
    stSec('รหัสผ่าน', 'ตั้งรหัสใหม่อย่างน้อย 8 ตัวอักษร ครั้งหน้าเข้าสู่ระบบด้วยรหัสนี้ — ลืมรหัสเมื่อไหร่ กด "ลืมรหัสผ่าน?" ที่หน้าเข้าสู่ระบบได้',
      '<div class="msg" id="pwMsg"></div>' +
      '<div class="st-row2">' +
        stField('รหัสผ่านใหม่', '<div class="pw"><input type="password" id="pw1" autocomplete="new-password">' + EYE + '</div>', 'อย่างน้อย 8 ตัวอักษร') +
        stField('พิมพ์อีกครั้ง', '<div class="pw"><input type="password" id="pw2" autocomplete="new-password">' + EYE + '</div>') +
      '</div>',
      '<button class="btn primary" id="pwSave">เปลี่ยนรหัสผ่าน</button>') +
  '</div>';

  wireEyes($('#view'));
  $('#pSave').addEventListener('click', async function(){
    const r = await api('/auth/v1/user', { method:'PUT', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ data: { full_name: $('#pName').value.trim() } }) });
    if(!r.ok) return msg($('#pMsg'), 'บันทึกไม่สำเร็จ', 'err');
    me = await r.json(); paintMe();
    msg($('#pMsg'), 'บันทึกชื่อแล้ว ✓', 'ok');
  });
  $('#pwSave').addEventListener('click', async function(){
    const a = $('#pw1').value, b = $('#pw2').value;
    if(a.length < 8) return msg($('#pwMsg'), 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร', 'err');
    if(a !== b) return msg($('#pwMsg'), 'รหัสผ่านสองช่องไม่ตรงกัน', 'err');
    const r = await api('/auth/v1/user', { method:'PUT', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ password: a }) });
    if(!r.ok){ const t = await r.json().catch(()=>({})); return msg($('#pwMsg'), t.msg || t.error_description || 'เปลี่ยนไม่สำเร็จ', 'err'); }
    $('#pw1').value = $('#pw2').value = '';
    msg($('#pwMsg'), 'เปลี่ยนรหัสผ่านแล้ว ✓ ครั้งหน้าใช้รหัสใหม่ล็อกอิน', 'ok');
  });
  return Promise.resolve();
}

/* ---------- หน้าตา: ธีม ---------- */
async function prefsView(){
  setTitle('หน้าตา');
  let themePref = 'light'; try{ themePref = localStorage.getItem(THEME) || 'light'; }catch(e){}
  const v = $('#view');
  /* ตัวเลือกธีมเป็นการ์ดมีภาพย่อของหน้าจอ (แถบน้ำตาล + พื้นขาว/ดำ) ให้เห็นว่าเลือกแล้วหน้าตาเป็นยังไง */
  const themes = [['light','สว่าง','พื้นขาว (ค่าเริ่มต้น)'],['dark','มืด','พื้นดำ ถนอมสายตาตอนกลางคืน'],['system','ตามเครื่อง','สลับตามการตั้งค่าของคอมพิวเตอร์']];
  v.innerHTML = '<div class="pg st-page">' +
    '<div class="pg-head"><h1>หน้าตา</h1><p>ธีมของระบบจัดการเนื้อหา — รายชื่อผู้ดูแลย้ายไปที่เมนู "ผู้ดูแลระบบ"</p></div>' +
    stSec('ธีม', 'จำค่าไว้ในเบราว์เซอร์นี้เท่านั้น — เครื่องอื่นตั้งแยกกัน',
      '<div class="st-themes">' + themes.map(([t, l, d]) =>
        '<label class="st-theme"><input type="radio" name="th" value="' + t + '"' + (themePref === t ? ' checked' : '') + '>' +
        '<span class="st-prev ' + t + '"><i></i><i></i></span><b>' + l + '</b><small>' + d + '</small></label>').join('') + '</div>') +
  '</div>';

  v.querySelectorAll('[name=th]').forEach(r => r.addEventListener('change', function(){
    if(this.value === 'system'){
      try{ localStorage.setItem(THEME, 'system'); }catch(e){}
      document.documentElement.setAttribute('data-theme',
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else applyTheme(this.value);
  }));

}


/* ---------- ผู้ดูแลระบบ (#users) — แบบ "Role manager" ในภาพอ้างอิงที่ผู้ใช้ส่งมา (ต.ค. 2026) ----------
   ตาราง admins: อีเมล · ชื่อ · บทบาท (admin/editor) · ใช้งานอยู่ไหม — สิทธิ์จริงบังคับที่ RLS (migration 20261006000001_admin_roles.sql)
   หน้านี้แค่ซ่อนปุ่มที่ไม่มีสิทธิ์ ถ้าฝืนกด ฐานข้อมูลก็ปฏิเสธเอง
   ไม่มี service role ในเบราว์เซอร์ จึงสร้าง/ลบบัญชีใน Supabase Auth ตรง ๆ ไม่ได้ — ใช้ลิงก์ทางอีเมลแทน:
     เพิ่มคน = ส่งลิงก์เข้าสู่ระบบ (/auth/v1/otp, create_user) ซึ่งสร้างบัญชีให้เองถ้ายังไม่มี
     🔑 = ส่งลิงก์ตั้งรหัสผ่านใหม่ (/auth/v1/recover) · ลบออกจากรายชื่อ = เข้าได้แต่ไม่มีสิทธิ์อะไร (บัญชี Auth ยังอยู่) */
const ROLE = { admin:['ผู้ดูแลระบบ','main'], editor:['ผู้แก้ไขเนื้อหา','shared'] };
let usQuery = '', usFilter = 'all', usRows = [];

async function usersView(){
  setTitle('ผู้ดูแลระบบ');
  $('#view').innerHTML = '<div class="empty">กำลังโหลด…</div>';
  await loadMyRole();
  const r = await api('/rest/v1/admins?select=' + (hasRoles ? '*' : 'email,note,created_at') + '&order=created_at.asc');
  if(current !== 'users') return;
  usRows = r.ok ? await r.json() : [];
  renderUsers();
}

function renderUsers(){
  const owner = myRole === 'admin';
  const mine = a => a.email.toLowerCase() === me.email.toLowerCase();
  const nameOf = a => a.full_name || (mine(a) && me.user_metadata && me.user_metadata.full_name) || a.email.split('@')[0];
  const list = usRows.filter(a =>
    (usFilter === 'all' || (usFilter === 'off' ? a.is_active === false : (a.role || 'admin') === usFilter && a.is_active !== false)) &&
    (!usQuery || (nameOf(a) + ' ' + a.email).toLowerCase().includes(usQuery)));
  const ic = (act, title, icon, cls) => '<button class="us-ic' + (cls ? ' ' + cls : '') + '" data-us="' + act + '" title="' + title + '" aria-label="' + title + '">' + icon + '</button>';

  $('#view').innerHTML = '<div class="pg">' +
    '<div class="pg-head"><h1>ผู้ดูแลระบบ</h1><p>คนที่เข้าระบบจัดการเนื้อหานี้ได้ บทบาท และสถานะการใช้งาน</p></div>' +
    (hasRoles ? '' : '<div class="msg err show">ยังไม่ได้รัน migration <code>20261006000001_admin_roles.sql</code> ใน Supabase — ตอนนี้ยังตั้งชื่อ บทบาท และปิดใช้งานไม่ได้ (ทุกคนเป็นผู้ดูแลระบบ)</div>') +
    (owner ? '' : '<div class="msg ok show">คุณเป็นผู้แก้ไขเนื้อหา — ดูรายชื่อได้ แต่เพิ่ม/แก้/ลบผู้ดูแลได้เฉพาะผู้ดูแลระบบ</div>') +
    '<div class="msg" id="usMsg"></div>' +
    '<div class="pg-card">' +
      '<div class="pg-tools">' +
        '<label class="pg-search"><svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="search" id="usQ" placeholder="ค้นหาชื่อหรืออีเมล…" value="' + esc(usQuery) + '"></label>' +
        (hasRoles ? '<label class="pg-filter">' + ICON.filter + '<b>แสดง</b><select id="usF">' +
          [['all','ทั้งหมด'],['admin','ผู้ดูแลระบบ'],['editor','ผู้แก้ไขเนื้อหา'],['off','ปิดใช้งาน']].map(o =>
            '<option value="' + o[0] + '"' + (usFilter === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' : '') +
        '<button class="btn us-ref" id="usRef" title="โหลดใหม่">' + ICON.refresh + '</button>' +
        (owner ? '<button class="btn primary pg-new" id="usAdd">' + ICON.add + 'เพิ่มผู้ดูแล</button>' : '') +
      '</div>' +
      '<div class="pg-scroll"><table class="pg-table us-table"><thead><tr><th>ชื่อ</th><th>อีเมล</th>' +
        (hasRoles ? '<th>สถานะ</th><th>บทบาท</th>' : '') + '<th class="us-acts">จัดการ</th></tr></thead><tbody>' +
      (list.length ? list.map(a => {
        const i = usRows.indexOf(a), off = a.is_active === false, role = ROLE[a.role || 'admin'];
        return '<tr' + (off ? ' class="off"' : '') + ' data-i="' + i + '">' +
          '<td class="t"><div class="ls-t"><span class="st-av sm">' + esc(nameOf(a)[0].toUpperCase()) + '</span><span class="us-name">' + esc(nameOf(a)) + '</span>' +
            (mine(a) ? '<span class="pg-badge shared">คุณ</span>' : '') + '</div></td>' +
          '<td><div class="us-mail">' + esc(a.email) + '</div><small class="us-sub">' + (a.updated_at || a.created_at ? 'อัปเดต ' + fullDate(a.updated_at || a.created_at) : '') + '</small></td>' +
          (hasRoles ? '<td>' + (off ? '<span class="pg-st warn">ปิดใช้งาน</span>' : '<span class="pg-st ok">ใช้งานอยู่</span>') + '</td>' +
            '<td><span class="pg-badge ' + role[1] + '">' + role[0] + '</span></td>' : '') +
          '<td class="us-acts"><div class="us-btns">' +
            (owner && hasRoles ? ic('edit', 'แก้ชื่อ/บทบาท', ICON.edit) : '') +
            ic('reset', 'ส่งลิงก์ตั้งรหัสผ่านใหม่ทางอีเมล', I('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 9.2-9.2M17 6l3 3M15 8l2 2"/>')) +
            (owner && hasRoles && !mine(a) ? ic('lock', off ? 'เปิดใช้งาน' : 'ปิดใช้งาน', off ? I('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>') : I('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')) : '') +
            (owner && !mine(a) ? ic('del', 'เอาออกจากรายชื่อ', ICON.trash, 'del') : '') +
          '</div></td></tr>';
      }).join('') : '<tr><td colspan="5" class="none">ไม่พบรายชื่อที่ตรงกับเงื่อนไข</td></tr>') +
      '</tbody></table></div>' +
      '<div class="pg-foot">' + list.length + ' จาก ' + usRows.length + ' คน · ทุกคนต้องอยู่ในรายชื่อนี้และใช้งานอยู่ ถึงจะเห็นและแก้ข้อมูลหลังบ้านได้</div>' +
    '</div></div>';

  const v = $('#view');
  v.querySelector('#usQ').addEventListener('input', function(){
    usQuery = this.value.trim().toLowerCase(); const pos = this.selectionStart;
    renderUsers(); const q = $('#usQ'); q.focus(); try{ q.setSelectionRange(pos, pos); }catch(e){}
  });
  const f = v.querySelector('#usF'); if(f) f.addEventListener('change', ()=>{ usFilter = f.value; renderUsers(); });
  v.querySelector('#usRef').addEventListener('click', usersView);
  const add = v.querySelector('#usAdd'); if(add) add.addEventListener('click', ()=>userDialog(null));
  v.querySelectorAll('[data-us]').forEach(b => b.addEventListener('click', ()=>userAction(b.dataset.us, usRows[+b.closest('tr').dataset.i])));
}

async function userAction(act, a){
  const put = body => api('/rest/v1/admins?email=eq.' + encodeURIComponent(a.email), {
    method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  const fail = async r => { const t = await r.text(); msg($('#usMsg'), /อย่างน้อย 1 คน/.test(t) ? 'ทำไม่ได้: ต้องเหลือผู้ดูแลระบบที่ใช้งานอยู่อย่างน้อย 1 คน' : 'ไม่สำเร็จ (' + r.status + ') — อาจไม่มีสิทธิ์', 'err'); };
  if(act === 'edit') return userDialog(a);
  if(act === 'reset'){
    if(!confirm('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ ' + a.email + ' ?')) return;
    const r = await fetch(URL_ + '/auth/v1/recover?redirect_to=' + encodeURIComponent(SELF), {
      method:'POST', headers:{ apikey: KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ email: a.email }) });
    return r.ok ? toast('ส่งลิงก์ไปที่ ' + a.email + ' แล้ว') : msg($('#usMsg'), authErr(await r.json().catch(()=>({})), 'ส่งไม่สำเร็จ'), 'err');
  }
  if(act === 'lock'){
    const r = await put({ is_active: a.is_active === false });
    if(!r.ok) return fail(r);
    toast(a.is_active === false ? 'เปิดใช้งาน ' + a.email + ' แล้ว' : 'ปิดใช้งาน ' + a.email + ' แล้ว — เข้าระบบได้แต่แก้อะไรไม่ได้');
    return usersView();
  }
  if(act === 'del'){
    if(!confirm('เอา ' + a.email + ' ออกจากรายชื่อผู้ดูแล?\n\nคนนี้จะเห็นและแก้ข้อมูลหลังบ้านไม่ได้อีก (ถ้าแค่ชั่วคราว ใช้ปุ่มปิดใช้งานแทน)')) return;
    const r = await api('/rest/v1/admins?email=eq.' + encodeURIComponent(a.email), { method:'DELETE' });
    if(!r.ok) return fail(r);
    toast('เอาออกแล้ว'); return usersView();
  }
}

/* เพิ่ม/แก้ผู้ดูแล — กล่องลอยแบบเดียวกับแก้โค้ดบล็อก (.be-modal) */
function userDialog(a){
  const isNew = !a;
  const box = document.createElement('div');
  box.className = 'be-modal';
  box.innerHTML = '<form class="be-modal-box us-dlg"><h3>' + (isNew ? 'เพิ่มผู้ดูแล' : 'แก้ไขผู้ดูแล') + '</h3>' +
    '<div class="msg" id="usDlgMsg"></div>' +
    '<div class="field"><label>อีเมล</label><input type="email" id="usE" value="' + esc(a ? a.email : '') + '"' + (isNew ? ' required' : ' disabled') + ' placeholder="name@chula.ac.th"></div>' +
    (hasRoles ? '<div class="field"><label>ชื่อที่แสดง</label><input type="text" id="usN" value="' + esc(a && a.full_name || '') + '" placeholder="เช่น อาจารย์กิตติยา"></div>' +
      '<div class="field"><label>บทบาท</label><div class="us-roles">' +
        [['editor','ผู้แก้ไขเนื้อหา','แก้ข้อความ ข่าว อาจารย์ ฯลฯ ได้ทั้งหมด แต่จัดการรายชื่อผู้ดูแลไม่ได้'],['admin','ผู้ดูแลระบบ','ทำได้ทุกอย่าง รวมถึงเพิ่ม/ลบ/ปิดใช้งานผู้ดูแลคนอื่น']]
          .map(([v, l, d]) => '<label class="us-role"><input type="radio" name="usR" value="' + v + '"' + (((a && a.role) || 'editor') === v ? ' checked' : '') + '><b>' + l + '</b><small>' + d + '</small></label>').join('') +
      '</div></div>' : '') +
    (isNew ? '<label class="us-invite"><input type="checkbox" id="usInv" checked> ส่งลิงก์เข้าสู่ระบบไปที่อีเมลนี้เลย <small>(สร้างบัญชีให้เองถ้ายังไม่มี — ไม่ต้องไปเพิ่มใน Supabase)</small></label>' : '') +
    '<div class="be-modal-foot"><button type="button" class="btn" data-x>ยกเลิก</button><button class="btn primary">' + (isNew ? 'เพิ่มผู้ดูแล' : 'บันทึก') + '</button></div></form>';
  document.body.appendChild(box);
  const close = () => box.remove();
  box.addEventListener('click', e => { if(e.target === box || e.target.matches('[data-x]')) close(); });
  (isNew ? box.querySelector('#usE') : box.querySelector('#usN') || box.querySelector('[data-x]')).focus();
  box.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = (isNew ? box.querySelector('#usE').value : a.email).trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg(box.querySelector('#usDlgMsg'), 'รูปแบบอีเมลไม่ถูกต้อง', 'err');
    const body = { email };
    if(hasRoles){
      body.full_name = box.querySelector('#usN').value.trim() || null;
      body.role = box.querySelector('[name=usR]:checked').value;
    }
    if(isNew) body.note = 'เพิ่มโดย ' + me.email;
    const r = isNew
      ? await api('/rest/v1/admins', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) })
      : await api('/rest/v1/admins?email=eq.' + encodeURIComponent(a.email), { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    if(!r.ok){
      const t = await r.text();
      return msg(box.querySelector('#usDlgMsg'), /duplicate/.test(t) ? 'มีอีเมลนี้ในรายชื่ออยู่แล้ว' : /อย่างน้อย 1 คน/.test(t) ? 'ทำไม่ได้: ต้องเหลือผู้ดูแลระบบที่ใช้งานอยู่อย่างน้อย 1 คน' : 'บันทึกไม่สำเร็จ (' + r.status + ')', 'err');
    }
    let note = isNew ? 'เพิ่ม ' + email + ' แล้ว' : 'บันทึกแล้ว';
    if(isNew && box.querySelector('#usInv').checked){
      /* ลิงก์เข้าสู่ระบบทางอีเมล — ไม่มีบัญชีก็สร้างให้ (ต้องเปิด "Allow new users to sign up" ใน Supabase ซึ่งเปิดอยู่)
         ลิงก์พากลับมา /admin (redirect_to ต้องอยู่ใน Redirect URLs) แล้ว app.js เข้าระบบให้ */
      const o = await fetch(URL_ + '/auth/v1/otp?redirect_to=' + encodeURIComponent(SELF), {
        method:'POST', headers:{ apikey: KEY, 'Content-Type':'application/json' }, body: JSON.stringify({ email, create_user: true }) });
      note += o.ok ? ' · ส่งลิงก์เข้าสู่ระบบไปที่อีเมลแล้ว' : ' · แต่ส่งอีเมลไม่สำเร็จ: ' + authErr(await o.json().catch(()=>({})), 'ลองกด 🔑 ส่งลิงก์อีกครั้งภายหลัง');
    }
    close(); toast(note); usersView();
  });
}
