/* =========================================================
   admin/js/views/account.js — โปรไฟล์ (ชื่อ/รหัสผ่าน) และตั้งค่า (ธีม/รายชื่อผู้ดูแล)
   เข้าถึงจากเมนูผู้ใช้มุมล่างซ้าย ไม่อยู่ใน SCHEMA
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- โปรไฟล์: ชื่อที่แสดง + เปลี่ยนรหัสผ่าน ---------- */
function profileView(){
  $('#title').textContent = 'โปรไฟล์';
  const name = (me.user_metadata && me.user_metadata.full_name) || '';
  $('#view').innerHTML =
    '<div class="card"><h3>ข้อมูลของฉัน</h3>' +
      '<div class="msg" id="pMsg"></div>' +
      '<div class="field"><label>ชื่อที่แสดง</label><input type="text" id="pName" value="' + esc(name) + '" placeholder="เช่น อาจารย์กิตติยา">' +
      '<div class="hint">แสดงมุมล่างซ้ายแทนอีเมล</div></div>' +
      '<div class="field"><label>อีเมล</label><input type="text" value="' + esc(me.email) + '" disabled>' +
      '<div class="hint">ใช้ล็อกอิน เปลี่ยนไม่ได้จากหน้านี้</div></div>' +
      '<button class="btn primary" id="pSave">บันทึกชื่อ</button>' +
    '</div>' +
    '<div class="card"><h3>เปลี่ยนรหัสผ่าน</h3>' +
      '<div class="msg" id="pwMsg"></div>' +
      '<div class="row2">' +
        '<div class="field"><label>รหัสผ่านใหม่</label><input type="password" id="pw1" autocomplete="new-password"><div class="hint">อย่างน้อย 8 ตัวอักษร</div></div>' +
        '<div class="field"><label>พิมพ์อีกครั้ง</label><input type="password" id="pw2" autocomplete="new-password"></div>' +
      '</div>' +
      '<button class="btn primary" id="pwSave">เปลี่ยนรหัสผ่าน</button>' +
    '</div>';

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

/* ---------- ตั้งค่า: ธีม + รายชื่อผู้ดูแล ---------- */
async function prefsView(){
  $('#title').textContent = 'ตั้งค่า';
  let themePref = 'system'; try{ themePref = localStorage.getItem(THEME) || 'system'; }catch(e){}
  const v = $('#view');
  v.innerHTML =
    '<div class="card"><h3>หน้าตา</h3><div class="radio">' +
      ['light','dark','system'].map(t => '<label><input type="radio" name="th" value="' + t + '"' + (themePref === t ? ' checked' : '') + '>' +
        ({light:'สว่าง', dark:'มืด', system:'ตามเครื่อง'})[t] + '</label>').join('') +
    '</div></div>' +
    '<div class="card"><h3>ผู้ดูแลระบบ</h3>' +
      '<p class="hint" style="margin-bottom:12px">คนที่แก้เนื้อหาเว็บได้ ต้องมีอีเมลในรายชื่อนี้ <b>และ</b> มีบัญชีใน Supabase (Authentication → Add user) ครบทั้งสองอย่างถึงจะเข้าได้</p>' +
      '<div class="msg" id="aMsg"></div><div id="admins"><div class="empty">กำลังโหลด…</div></div>' +
      '<div style="display:flex;gap:8px;margin-top:14px"><input type="text" id="aNew" placeholder="อีเมลผู้ดูแลคนใหม่" style="flex:1;border:1px solid var(--line-strong);border-radius:8px;padding:9px 11px">' +
      '<button class="btn primary" id="aAdd">เพิ่ม</button></div>' +
    '</div>';

  v.querySelectorAll('[name=th]').forEach(r => r.addEventListener('change', function(){
    if(this.value === 'system'){
      try{ localStorage.removeItem(THEME); }catch(e){}
      document.documentElement.setAttribute('data-theme',
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else applyTheme(this.value);
  }));

  async function loadAdmins(){
    const r = await api('/rest/v1/admins?select=email,note&order=created_at.asc');
    const list = r.ok ? await r.json() : [];
    $('#admins').innerHTML = list.length ? list.map(a =>
      '<div class="adm"><span class="e">' + esc(a.email) + (a.email.toLowerCase() === me.email.toLowerCase() ? ' <span class="you">(คุณ)</span>' : '') + '</span>' +
      (a.email.toLowerCase() === me.email.toLowerCase() ? '' : '<button class="btn mini danger" data-del="' + esc(a.email) + '">เอาออก</button>') + '</div>').join('')
      : '<div class="empty">ไม่มีรายชื่อ</div>';
    $('#admins').querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async function(){
      if(!confirm('เอา ' + b.dataset.del + ' ออกจากผู้ดูแล? คนนี้จะแก้เนื้อหาไม่ได้อีก')) return;
      const r2 = await api('/rest/v1/admins?email=eq.' + encodeURIComponent(b.dataset.del), { method:'DELETE' });
      if(r2.ok){ toast('เอาออกแล้ว'); loadAdmins(); } else msg($('#aMsg'), 'เอาออกไม่สำเร็จ', 'err');
    }));
  }
  $('#aAdd').addEventListener('click', async function(){
    const email = $('#aNew').value.trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg($('#aMsg'), 'รูปแบบอีเมลไม่ถูกต้อง', 'err');
    const r = await api('/rest/v1/admins', { method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email, note: 'เพิ่มจากหน้า admin โดย ' + me.email }) });
    if(!r.ok){ const t = await r.text(); return msg($('#aMsg'), t.includes('duplicate') ? 'มีอีเมลนี้อยู่แล้ว' : 'เพิ่มไม่สำเร็จ', 'err'); }
    $('#aNew').value = ''; msg($('#aMsg'), 'เพิ่มแล้ว ✓ อย่าลืมสร้างบัญชีให้คนนี้ใน Supabase ด้วย', 'ok'); loadAdmins();
  });
  loadAdmins();
}
