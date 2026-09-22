/* =========================================================
   admin/js/config.js — ค่าเชื่อมต่อ Supabase ของหน้า admin
   URL กับ publishable key ต้องตรงกับ cms.js และ sync-content.py (ย้ายโปรเจกต์ = แก้ทั้งสามที่)
   publishable key เปิดเผยได้ตามการออกแบบ สิทธิ์จริงคุมด้วย RLS ที่ฐานข้อมูล
   ทุกไฟล์ใน admin/js เป็น classic script ที่ประกาศตัวแปร/ฟังก์ชันไว้ระดับบนสุด
   จึงมองเห็นกันข้ามไฟล์ได้ ลำดับการโหลดกำหนดใน admin/index.html — อย่าสลับ
   ========================================================= */
'use strict';

const URL_ = 'https://dpyhvsdtbihssapuwert.supabase.co';
const KEY  = 'sb_publishable_f5Y0D69E80W_f7B5E5cgtQ_NV-H2kyN';
const STORE = 'tefl-cms-session';
const THEME = 'tefl-cms-theme';
