import {requireAdmin,USERNAME_RE} from '../../_lib/admin.js';
import {json,body,hashPassword} from '../../_lib/auth.js';

export async function onRequestGet({request,env}){
  try{
    const r=await requireAdmin(request,env);if(r.err)return r.err;
    const rows=await env.DB.prepare('SELECT u.id,u.username,u.created_at,u.is_admin,b.updated_at AS backup_at,b.size_bytes FROM users u LEFT JOIN backups b ON b.user_id=u.id ORDER BY u.created_at DESC').all();
    return json({users:rows.results||[]});
  }catch(e){return json({error:'Liste alınamadı: '+e.message},500)}
}

export async function onRequestPost({request,env}){
  try{
    const r=await requireAdmin(request,env);if(r.err)return r.err;
    const x=await body(request);
    const username=String(x?.username||'').trim();
    const password=String(x?.password||'');
    if(!USERNAME_RE.test(username))return json({error:'Kullanıcı adı 3-24 karakter olmalı (harf, rakam, . _ -).'},400);
    if(password.length<8||password.length>128)return json({error:'Şifre 8-128 karakter olmalı.'},400);
    const exists=await env.DB.prepare('SELECT id FROM users WHERE username_norm=?').bind(username.toLowerCase()).first();
    if(exists)return json({error:'Bu kullanıcı adı zaten var.'},409);
    const id=crypto.randomUUID();
    const p=await hashPassword(password);
    const backupSalt=btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    await env.DB.prepare('INSERT INTO users(id,username,username_norm,password_salt,password_hash,backup_salt,created_at,is_admin) VALUES(?,?,?,?,?,?,?,0)')
      .bind(id,username,username.toLowerCase(),p.salt,p.hash,backupSalt,Date.now()).run();
    return json({ok:true,id,username});
  }catch(e){return json({error:'Hesap oluşturulamadı: '+e.message},500)}
}
