import {createHash,randomBytes} from 'node:crypto';
import {mkdir,readFile,rename,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {CONTENT_PATH,referencedMedia,validateContent,validateUploads} from '../shared/contentSchema.js';
import {checkMutation,json} from '../server/admin/security.js';
import {readBody} from '../server/admin/handler.js';
const loopback=host=>['127.0.0.1','localhost','[::1]','::1','::ffff:127.0.0.1'].includes(host);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function createLocalAdmin(root) {
  const csrf=randomBytes(32).toString('hex');let writing=false;
  const contentPath=path.resolve(root,CONTENT_PATH);
  const read=async()=>{const raw=await readFile(contentPath);return{content:validateContent(JSON.parse(raw)),revision:digest(raw),raw};};
  return async(request,remoteAddress)=>{
    const url=new URL(request.url),route=url.pathname.replace(/^\/api\/admin\/?/,'');
    try{
      if(!loopback(url.hostname)||!loopback(remoteAddress))return json({error:'Editor lokal hanya tersedia dari komputer ini.'},403);
      if(route==='session'&&request.method==='GET')return json({configured:true,authenticated:true,mode:'local',csrf,login:'Editor lokal',repo:'Folder project di komputer ini'});
      if(route==='content'&&request.method==='GET'){const {content,revision}=await read();return json({content,revision});}
      if(route==='content'&&request.method==='POST'){
        checkMutation(request,{csrf},url.origin);
        if(writing)return json({error:'Penyimpanan lain sedang berjalan. Coba kembali.'},409);
        writing=true;
        try{
          const body=await readBody(request),previous=await read();
          if(body.revision!==previous.revision)return json({error:'Konten telah berubah. Muat ulang versi terbaru.'},409);
          const content=validateContent(body.content),uploads=await validateUploads(body.uploads||[],content);
          const old=referencedMedia(previous.content),uploaded=new Set(uploads.map(file=>file.path));
          for(const media of referencedMedia(content))if(!old.has(media)&&!uploaded.has(media))throw new Error('Gambar baru belum diupload. Pilih ulang gambar.');
          await mkdir(path.join(root,'.admin-backups'),{recursive:true});
          await writeFile(path.join(root,'.admin-backups',`${Date.now()}-${previous.revision.slice(0,12)}.json`),previous.raw,{flag:'wx'});
          for(const file of uploads){const target=path.join(root,'public',file.path.slice(1));await mkdir(path.dirname(target),{recursive:true});await writeFile(target,file.bytes);}
          const raw=`${JSON.stringify(content,null,2)}\n`,temporary=`${contentPath}.${randomBytes(6).toString('hex')}.tmp`;
          await writeFile(temporary,raw);await rename(temporary,contentPath);
          return json({content,revision:digest(raw),mode:'local',message:'Tersimpan ke folder project. Website online belum berubah.'});
        } finally {writing=false;}
      }
      return json({error:'Endpoint tidak ditemukan.'},404);
    }catch(error){return json({error:error.message||'Penyimpanan gagal.'},error.status||400);}
  };
}
export function localAdminPlugin(enabled) {
  return{name:'kainora-local-content-admin',apply:'serve',configureServer(server){
    const admin=createLocalAdmin(server.config.root);
    server.middlewares.use('/api/admin',async(req,res)=>{
      if(!enabled){res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({configured:false,authenticated:false,mode:'unconfigured'}));return;}
      try{
        const origin=`http://${req.headers.host}`,chunks=[];let size=0;
        if(!loopback(new URL(origin).hostname)||!loopback(req.socket.remoteAddress)){res.statusCode=403;res.end('Local access only');return;}
        for await(const chunk of req){size+=chunk.length;if(size>12*1024*1024){res.statusCode=413;res.end('Upload too large');return;}chunks.push(chunk);}
        const request=new Request(`${origin}/api/admin${req.url}`,{method:req.method,headers:req.headers,...(chunks.length?{body:Buffer.concat(chunks)}:{})});
        const response=await admin(request,req.socket.remoteAddress);
        res.statusCode=response.status;response.headers.forEach((value,key)=>res.setHeader(key,value));res.end(Buffer.from(await response.arrayBuffer()));
      }catch{res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Editor lokal belum dapat memproses permintaan.'}));}
    });
  }};
}
