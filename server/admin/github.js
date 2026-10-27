import { CONTENT_PATH, referencedMedia, validateContent, validateUploads } from '../../shared/contentSchema.js';
const utf8Base64 = value => { const bytes=new TextEncoder().encode(value); let binary=''; for(const byte of bytes) binary+=String.fromCharCode(byte); return btoa(binary); };
export function repoConfig(env) {
  const repo=env.ADMIN_REPO, branch=env.ADMIN_BRANCH || 'main';
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo || '') || !/^[\w/-]+$/.test(branch) || branch.includes('..')) throw Object.assign(new Error('Repositori admin belum dikonfigurasi.'),{status:503});
  return {repo,branch};
}
export async function github(path, token, fetcher=fetch, method='GET', body) {
  const response=await fetcher(`https://api.github.com${path}`,{method,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','User-Agent':'Kainora-Content-Admin','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  if (!response.ok) {
    const conflict=response.status===409 || response.status===422;
    throw Object.assign(new Error(conflict?'Konten berubah saat diterbitkan. Muat ulang versi terbaru dan terapkan perubahan Anda lagi.':response.status===401?'Sesi GitHub berakhir. Silakan login lagi.':response.status===403?'GitHub menolak akses. Periksa izin aplikasi atau batas permintaan.':'Repositori belum dapat diakses. Periksa instalasi aplikasi GitHub.'),{status:conflict?409:response.status===401?401:502});
  }
  return response.status===204?null:response.json();
}
export async function readGitContent(token,env,fetcher=fetch,ref) {
  const {repo,branch}=repoConfig(env);
  const file=await github(`/repos/${repo}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(ref||branch)}`,token,fetcher);
  const encoded=file.encoding==='none'?await github(`/repos/${repo}/git/blobs/${file.sha}`,token,fetcher):file;
  const bytes=Uint8Array.from(atob(encoded.content.replace(/\s/g,'')),char=>char.charCodeAt(0));
  return {content:validateContent(JSON.parse(new TextDecoder().decode(bytes))),revision:file.sha};
}
export async function publishGitContent(input,uploads,revision,token,env,fetcher=fetch) {
  const content=validateContent(input), validated=await validateUploads(uploads,content);
  const {repo,branch}=repoConfig(env), base=`/repos/${repo}`;
  const head=await github(`${base}/git/ref/heads/${branch}`,token,fetcher);
  const previous=await readGitContent(token,env,fetcher,head.object.sha);
  if (!revision || revision!==previous.revision) throw Object.assign(new Error('Konten sudah berubah di perangkat lain. Muat ulang sebelum menerbitkan.'),{status:409});
  const oldMedia=referencedMedia(previous.content), newMedia=referencedMedia(content), uploaded=new Set(validated.map(file=>file.path));
  for(const path of newMedia) if(!oldMedia.has(path)&&!uploaded.has(path)) throw Object.assign(new Error('Ada gambar baru yang belum diupload. Pilih ulang file gambar.'),{status:400});
  const parent=await github(`${base}/git/commits/${head.object.sha}`,token,fetcher);
  const tree=[];
  for(const file of validated) {
    const blob=await github(`${base}/git/blobs`,token,fetcher,'POST',{content:file.base64,encoding:'base64'});
    tree.push({path:`public${file.path}`,mode:'100644',type:'blob',sha:blob.sha});
  }
  const contentBlob=await github(`${base}/git/blobs`,token,fetcher,'POST',{content:utf8Base64(`${JSON.stringify(content,null,2)}\n`),encoding:'base64'});
  tree.push({path:CONTENT_PATH,mode:'100644',type:'blob',sha:contentBlob.sha});
  for(const path of oldMedia) if(/^\/images\/uploads\/[a-f0-9]{64}\.(png|webp|jpg)$/.test(path)&&!newMedia.has(path)) tree.push({path:`public${path}`,mode:'100644',type:'blob',sha:null});
  const nextTree=await github(`${base}/git/trees`,token,fetcher,'POST',{base_tree:parent.tree.sha,tree});
  const commit=await github(`${base}/git/commits`,token,fetcher,'POST',{message:'content: perbarui katalog dan koleksi Kainora',tree:nextTree.sha,parents:[head.object.sha]});
  await github(`${base}/git/refs/heads/${branch}`,token,fetcher,'PATCH',{sha:commit.sha,force:false});
  return {commit:commit.sha,content,revision:contentBlob.sha,mode:'git',message:'Perubahan dikirim ke GitHub. Website menunggu proses build dan publikasi Cloudflare selesai.'};
}
