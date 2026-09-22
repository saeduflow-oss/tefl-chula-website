/* =========================================================
   admin/js/views/facebook.js — หน้าเชื่อมต่อ Facebook
   สถานะการเชื่อมต่อ แก้ token/Page ID (ตาราง integrations) การแสดงผล (settings) และรายการโพสต์ที่ดึงมา
   ทุกอย่างที่แตะ Graph API ผ่าน Edge Function fb-sync (ดู DESIGN.md §9.8)
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

/* ---------- Facebook ----------
   ทุกอย่างที่แตะ Graph API ทำผ่าน Edge Function fb-sync ด้วย token ของผู้ดูแล (api() ใส่ให้เอง)
   ฟังก์ชันตรวจกับตาราง admins อีกชั้น token ของเพจอยู่ฝั่งเซิร์ฟเวอร์ หน้านี้เห็นแค่ 4 ตัวท้าย */
async function fbCall(action){
  const r = await api('/functions/v1/fb-sync', { method:'POST', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ action }) });
  const d = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
  return d;
}
async function syncFacebook(btn){
  btn.disabled = true; const was = btn.innerHTML; btn.innerHTML = ICON.clock + 'กำลังดึง…';
  try{
    const d = await fbCall('sync');
    if(d.skipped) toast('ปิดการดึงโพสต์อยู่ — เปิดสวิตช์ในหน้า Facebook ก่อน');
    else {
      /* unresolved = โพสต์ที่ Graph API ไม่ให้รูปมาเลย (เช่น ชนิด native_templates: การ์ดเทมเพลตของ Facebook)
         ฟังก์ชันจะลองใหม่ทุกรอบ แต่ถ้าอยากให้มีรูป ผู้ดูแลต้องใส่เองในหน้าข่าว — sync จะไม่มาทับรูปที่ใส่แล้ว */
      const noPic = (d.unresolved || []).length;
      toast((d.added ? 'เพิ่มโพสต์ใหม่ ' + d.added + ' รายการ' + (d.removed ? ' เอาออก ' + d.removed : '') : 'ไม่มีโพสต์ใหม่ (ล่าสุด ' + d.total + ' โพสต์ตรงกันแล้ว)') +
            (d.refilled ? ' · เติมรูปย้อนหลัง ' + d.refilled : '') +
            (noPic ? ' · Facebook ไม่ให้รูป ' + noPic + ' โพสต์ (ใส่รูปเองได้ในหน้าข่าว)' : ''));
    }
    return d;
  }catch(e){
    toast('ดึงไม่สำเร็จ: ' + e.message);
  }finally{
    btn.disabled = false; btn.innerHTML = was;
  }
}

/* หน้า Facebook: การเชื่อมต่อ (สถานะ + แก้ token) · การแสดงผล · โพสต์ที่ดึงมาแล้ว
   ค่าตั้งการแสดงผลเป็นแถวในตาราง settings ตัวเดียวกับหน้า "ข้อมูลติดต่อและลิงก์" แค่จัดหน้าให้ใช้ง่ายขึ้น
   token/Page ID อยู่ในตาราง integrations ซึ่งคนทั่วไปอ่านไม่ได้ (ต่างจาก settings) */
async function facebookView(){
  $('#title').textContent = 'Facebook';
  const v = $('#view');
  v.innerHTML =
    '<div class="head"><h2><span class="ico c2">' + ICON.facebook + '</span>เชื่อมต่อ Facebook</h2></div>' +
    '<div class="where"><span>แสดงที่: สไลด์ Latest News หน้าแรก และหน้า Activities ส่วน Announcements</span><a href="activities.html#announcements" target="_blank" rel="noopener">ดูบนเว็บ ↗</a></div>' +
    '<div class="card wide"><div class="conn">' +
      '<span class="ico fb"><svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z"/></svg></span>' +
      '<div class="info"><b>การเชื่อมต่อเพจ</b><div class="st wait" id="fbSt">กำลังตรวจสอบ…</div><div class="kv" id="fbKv"></div></div>' +
      '<div class="acts"><button class="btn" id="fbEdit">' + ICON.edit + 'แก้ Token / Page ID</button>' +
      '<button class="btn primary" id="fbSyncNow">' + ICON.refresh + 'ดึงโพสต์ตอนนี้</button></div>' +
    '</div>' +
    '<div id="fbForm" style="display:none;margin-top:18px;padding-top:18px;border-top:1px solid var(--line)">' +
      '<div class="msg" id="fbMsg"></div>' +
      '<div class="field"><label>Page Access Token</label><input type="password" id="fbTok" autocomplete="off" placeholder="วาง token ใหม่ (เว้นว่าง = ไม่เปลี่ยน)">' +
      '<div class="hint">สร้างจาก Meta for Developers → Graph API Explorer เลือกเพจแล้วขอสิทธิ์ pages_read_engagement + pages_read_user_content แล้วแปลงเป็น long-lived token — token จะไม่โผล่ในเว็บสาธารณะ</div></div>' +
      '<div class="field"><label>Page ID</label><input type="text" id="fbPid" placeholder="เว้นว่างได้ ระบบใช้เพจของ token นั้นเอง"></div>' +
      '<div style="display:flex;gap:8px"><button class="btn primary" id="fbSave">บันทึกและตรวจสอบ</button><button class="btn" id="fbCancel">ยกเลิก</button></div>' +
    '</div></div>' +
    '<div class="card wide"><h3>การแสดงผล</h3><div class="msg" id="fbSetMsg"></div><div class="nums">' +
      '<div class="field"><label>ดึงมากี่โพสต์ล่าสุด</label><input type="number" min="1" max="50" id="fbCount"></div>' +
      '<div class="field"><label>แสดงบนหน้าแรกกี่ใบ</label><input type="number" min="1" max="20" id="fbHome"></div>' +
      '<div class="field chk"><label><input type="checkbox" id="fbOn"> ดึงอัตโนมัติทุก 6 ชั่วโมง</label></div>' +
      '<button class="btn primary" id="fbSetSave">บันทึก</button>' +
    '</div><div class="hint" style="margin-top:12px">โพสต์ที่เก่ากว่าจำนวนที่ดึงจะถูกเอาออกจากเว็บเอง · ข่าวที่พิมพ์เองในหน้า "ข่าว/กิจกรรม" ไม่ถูกแตะ · ส่วน Announcements ในหน้า Activities แสดงครบทุกใบ หน้าแรกแสดงแค่ N ใบแรก</div></div>' +
    '<div class="sec">โพสต์ที่ดึงมาแล้ว</div><div class="list feed" id="fbFeed"><div class="empty">กำลังโหลด…</div></div>' +
    '<div class="hint" style="margin-top:10px">แก้หัวข้อหรือรูปได้ในหน้า "ข่าว/กิจกรรม" (แถวที่ขึ้นว่า จาก Facebook) — อย่าลบ ให้ใช้ "ซ่อนจากเว็บ" แทน ไม่งั้นรอบดึงถัดไปจะกลับมาใหม่</div>';

  /* --- สถานะการเชื่อมต่อ --- */
  const paintStatus = async () => {
    const st = $('#fbSt'), kv = $('#fbKv');
    st.className = 'st wait'; st.textContent = 'กำลังตรวจสอบ…'; kv.innerHTML = '';
    try{
      const d = await fbCall('status');
      if(d.connected){
        st.className = 'st ok'; st.textContent = 'เชื่อมต่อแล้ว';
        kv.innerHTML = 'เพจ: <code>' + esc(d.page.name) + '</code><br>Page ID: <code>' + esc(d.page.id) + '</code><br>' +
          'Token: <code>••••' + esc(d.token_tail) + '</code>' +
          (d.synced_at ? '<br>ดึงล่าสุด: ' + when(d.synced_at) : '<br>ยังไม่เคยดึงโพสต์');
      } else {
        st.className = 'st bad'; st.textContent = 'ยังไม่เชื่อมต่อ';
        kv.innerHTML = d.reason === 'no-token' ? 'ยังไม่ได้ใส่ token — กด "แก้ Token / Page ID"' :
          'Facebook ปฏิเสธ: <code>' + esc(d.reason) + '</code><br>ลองสร้าง token ใหม่แล้วใส่อีกครั้ง';
      }
    }catch(e){
      st.className = 'st bad'; st.textContent = 'ตรวจสอบไม่ได้';
      kv.innerHTML = esc(e.message) + ' — ถ้าเพิ่ง deploy ฟังก์ชัน ลองรีเฟรชอีกครั้ง';
    }
  };

  /* --- แก้ token --- */
  $('#fbEdit').addEventListener('click', async ()=>{
    const f = $('#fbForm'); f.style.display = f.style.display === 'none' ? '' : 'none';
    if(f.style.display === 'none') return;
    const r = await api('/rest/v1/integrations?select=key,value&key=eq.facebook.page_id');
    const rows = r.ok ? await r.json() : [];
    $('#fbPid').value = rows[0] ? rows[0].value : '';
    $('#fbTok').focus();
  });
  $('#fbCancel').addEventListener('click', ()=>{ $('#fbForm').style.display = 'none'; });
  $('#fbSave').addEventListener('click', async ()=>{
    const tok = $('#fbTok').value.trim(), pid = $('#fbPid').value.trim();
    const put = (key, value) => api('/rest/v1/integrations?key=eq.' + key, { method:'PATCH',
      headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ value }) });
    const jobs = [put('facebook.page_id', pid)];
    if(tok) jobs.push(put('facebook.token', tok));
    const rs = await Promise.all(jobs);
    if(rs.some(x => !x.ok)) return msg($('#fbMsg'), 'บันทึกไม่สำเร็จ (' + rs.map(x=>x.status).join(',') + ')');
    $('#fbTok').value = ''; $('#fbForm').style.display = 'none';
    toast('บันทึกแล้ว กำลังตรวจสอบการเชื่อมต่อ…');
    paintStatus();
  });

  /* --- ดึงตอนนี้ --- */
  $('#fbSyncNow').addEventListener('click', async function(){
    const d = await syncFacebook(this);
    if(d){ paintFeed(); paintStatus(); }
  });

  /* --- การแสดงผล (settings) --- */
  const S = {};
  const rs = await api('/rest/v1/settings?select=key,value&key=in.(facebook.sync_count,facebook.sync_enabled,news.home_count)');
  (rs.ok ? await rs.json() : []).forEach(x => { S[x.key] = x.value; });
  $('#fbCount').value = S['facebook.sync_count'] || 12;
  $('#fbHome').value = S['news.home_count'] || 6;
  $('#fbOn').checked = S['facebook.sync_enabled'] !== 'false';
  $('#fbSetSave').addEventListener('click', async ()=>{
    const put = (key, value) => api('/rest/v1/settings?key=eq.' + key, { method:'PATCH',
      headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ value: String(value) }) });
    const cnt = Math.min(50, Math.max(1, +$('#fbCount').value || 12));
    const home = Math.min(20, Math.max(1, +$('#fbHome').value || 6));
    const r2 = await Promise.all([put('facebook.sync_count', cnt), put('news.home_count', home), put('facebook.sync_enabled', $('#fbOn').checked)]);
    if(r2.some(x => !x.ok)) return msg($('#fbSetMsg'), 'บันทึกไม่สำเร็จ');
    $('#fbCount').value = cnt; $('#fbHome').value = home;
    toast('บันทึกแล้ว — มีผลรอบดึงถัดไป (กด "ดึงโพสต์ตอนนี้" ได้เลย)');
  });

  /* --- รายการโพสต์ที่ดึงมาแล้ว --- */
  async function paintFeed(){
    const box = $('#fbFeed');
    const r = await api('/rest/v1/news?select=id,title,image,url,is_visible,updated_at&fb_post_id=not.is.null&order=sort_order.asc');
    const list = r.ok ? await r.json() : [];
    if(!list.length){ box.innerHTML = '<div class="empty">ยังไม่มีโพสต์ — กด "ดึงโพสต์ตอนนี้"</div>'; return; }
    box.innerHTML = list.map((n, i) =>
      '<div class="it' + (n.is_visible ? '' : ' off') + '">' +
        '<img src="' + esc(n.image || '') + '" alt="">' +
        '<div style="min-width:0;flex:1"><div class="t">' + esc(n.title) + '</div>' +
        '<div class="s"><a href="' + esc(n.url) + '" target="_blank" rel="noopener">เปิดโพสต์ ↗</a></div></div>' +
        '<span class="tag ' + (n.is_visible ? 'on">แสดงบนเว็บ' : 'off">ซ่อนอยู่') + '</span>' +
        '<button class="btn mini fbVis" data-i="' + i + '">' + (n.is_visible ? 'ซ่อนจากเว็บ' : 'แสดงบนเว็บ') + '</button>' +
      '</div>').join('');
    box.querySelectorAll('.fbVis').forEach(b => b.addEventListener('click', async ()=>{
      const n = list[+b.dataset.i];
      const res = await api('/rest/v1/news?id=eq.' + n.id, { method:'PATCH', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ is_visible: !n.is_visible }) });
      if(res.ok){ toast('บันทึกแล้ว'); paintFeed(); } else toast('บันทึกไม่สำเร็จ');
    }));
  }

  paintStatus();
  paintFeed();
}
