import { MAX_PUBLISH_BYTES } from '../../shared/contentSchema.js';
import { base64url, checkMutation, cookieValue, json, randomToken, seal, sessionCookie, unseal } from './security.js';
import { github, readGitContent, publishGitContent, repoConfig } from './github.js';
const SESSION='kainora_admin', OAUTH='kainora_oauth';
function config(env) {
  if (!env.ADMIN_ORIGIN || !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length<32 || !/^\d+(,\d+)*$/.test(env.ADMIN_GITHUB_USER_IDS || '')) return false;
  try { repoConfig(env); return new URL(env.ADMIN_ORIGIN).origin===env.ADMIN_ORIGIN&&env.ADMIN_ORIGIN.startsWith('https://'); } catch { return false; }
}
export async function readBody(request) {
  if (!(request.headers.get('content-type') || '').startsWith('application/json')) throw Object.assign(new Error('Format permintaan harus JSON.'),{status:415});
  if (Number(request.headers.get('content-length'))>MAX_PUBLISH_BYTES) throw Object.assign(new Error('Upload terlalu besar.'),{status:413});
  const reader=request.body?.getReader(); if(!reader) throw Object.assign(new Error('Permintaan kosong.'),{status:400});
  const chunks=[];let size=0;
  while(true) { const {done,value}=await reader.read(); if(done)break;size+=value.length;if(size>MAX_PUBLISH_BYTES){await reader.cancel();throw Object.assign(new Error('Upload terlalu besar.'),{status:413});}chunks.push(value); }
  const all=new Uint8Array(size);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}
  try{return JSON.parse(new TextDecoder().decode(all));}catch{throw Object.assign(new Error('JSON tidak valid.'),{status:400});}
}
export async function handleAdmin(request, env, {fetcher=fetch}={}) {
  const url=new URL(request.url), route=url.pathname.replace(/^\/api\/admin\/?/,'');
  try {
    const configured=config(env);
    if(route==='session'&&!configured) return json({configured:false,authenticated:false,mode:'unconfigured'});
    if(!configured) return json({error:'Admin online belum diaktifkan. Ikuti panduan pengaturan Cloudflare dan GitHub App.'},503);
    if(url.origin!==env.ADMIN_ORIGIN) return json({error:'Gunakan alamat admin resmi toko.'},403);
    if(route==='login'&&request.method==='GET') {
      const state=randomToken(), verifier=randomToken();
      const challenge=base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))));
      const cookie=await seal({state,verifier,expires:Date.now()+600000},env.ADMIN_SESSION_SECRET);
      const authorize=new URL('https://github.com/login/oauth/authorize');
      for(const [key,value] of Object.entries({client_id:env.GITHUB_CLIENT_ID,redirect_uri:`${env.ADMIN_ORIGIN}/api/admin/callback`,state,code_challenge:challenge,code_challenge_method:'S256'})) authorize.searchParams.set(key,value);
      return new Response(null,{status:302,headers:{Location:authorize.href,'Set-Cookie':sessionCookie(OAUTH,cookie,600),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
    }
    if(route==='callback'&&request.method==='GET') {
      const state=await unseal(cookieValue(request,OAUTH),env.ADMIN_SESSION_SECRET);
      if(!state||url.searchParams.get('state')!==state.state||!url.searchParams.get('code')) return json({error:'Login tidak valid atau kedaluwarsa. Mulai login kembali.'},400,{'Set-Cookie':sessionCookie(OAUTH,'',0)});
      const response=await fetcher('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code:url.searchParams.get('code'),code_verifier:state.verifier,redirect_uri:`${env.ADMIN_ORIGIN}/api/admin/callback`})});
      const token=await response.json();
      if(!response.ok||!token.access_token) throw Object.assign(new Error('Login GitHub gagal. Mulai login kembali.'),{status:401});
      const user=await github('/user',token.access_token,fetcher);
      if(!env.ADMIN_GITHUB_USER_IDS.split(',').includes(String(user.id))) return json({error:'Akun ini tidak diizinkan mengelola Kainora.'},403,{'Set-Cookie':sessionCookie(OAUTH,'',0)});
      const {repo}=repoConfig(env), repository=await github(`/repos/${repo}`,token.access_token,fetcher);
      if(!repository.permissions?.push) throw Object.assign(new Error('Aplikasi GitHub belum diberi akses tulis ke repositori Kainora.'),{status:403});
      const seconds=Math.max(1,Math.min(28800,Number(token.expires_in)||28800)-60);
      const session=await seal({token:token.access_token,userId:String(user.id),login:user.login,csrf:randomToken(),expires:Date.now()+seconds*1000},env.ADMIN_SESSION_SECRET);
      const headers=new Headers({Location:`${env.ADMIN_ORIGIN}/?view=admin`,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});
      headers.append('Set-Cookie',sessionCookie(SESSION,session,seconds));headers.append('Set-Cookie',sessionCookie(OAUTH,'',0));
      return new Response(null,{status:302,headers});
    }
    const session=await unseal(cookieValue(request,SESSION),env.ADMIN_SESSION_SECRET);
    const allowed=session&&env.ADMIN_GITHUB_USER_IDS.split(',').includes(session.userId);
    if(route==='session'&&request.method==='GET') return json({configured:true,authenticated:!!allowed,...(allowed?{csrf:session.csrf,login:session.login,repo:env.ADMIN_REPO,branch:env.ADMIN_BRANCH||'main'}:{}),mode:'git'});
    if(!allowed) return json({error:'Silakan login sebagai admin.'},401);
    if(request.method==='POST') checkMutation(request,session,env.ADMIN_ORIGIN);
    if(route==='logout'&&request.method==='POST') return json({ok:true},200,{'Set-Cookie':sessionCookie(SESSION,'',0)});
    if(route==='content'&&request.method==='GET') return json(await readGitContent(session.token,env,fetcher));
    if(route==='content'&&request.method==='POST') {
      const body=await readBody(request);
      let content;
      try { content=await publishGitContent(body.content,body.uploads||[],body.revision,session.token,env,fetcher); } catch(error) { if(!error.status)error.status=400;throw error; }
      return json(content);
    }
    return json({error:'Endpoint tidak ditemukan.'},404);
  } catch(error) { return json({error:error.status?error.message:'Layanan admin belum dapat memproses permintaan.'},error.status||500); }
}
