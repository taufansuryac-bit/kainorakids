import {MAX_UPLOAD_BYTES} from '../../shared/contentSchema';
export async function adminRequest(route,{method='GET',body,csrf,signal}={}) {
  const response=await fetch(`/api/admin/${route}`,{method,credentials:'same-origin',cache:'no-store',signal,headers:{...(body?{'Content-Type':'application/json'}:{}),...(csrf?{'X-CSRF-Token':csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});
  let data;
  try {data=await response.json();}catch {throw new Error('Layanan admin belum tersedia pada hosting ini.');}
  if(!response.ok)throw Object.assign(new Error(data.error||'Permintaan admin gagal.'),{status:response.status});
  return data;
}
export async function prepareImage(file,artwork=false) {
  if(!file||file.size>20*1024*1024||!(artwork?file.type==='image/png':['image/png','image/jpeg','image/webp'].includes(file.type)))throw new Error(artwork?'Pilih PNG transparan, maksimal 20 MB.':'Pilih JPG, WebP atau PNG, maksimal 20 MB.');
  const bitmap=await createImageBitmap(file);
  const canvas=document.createElement('canvas');const scale=Math.min(1,2048/Math.max(bitmap.width,bitmap.height));
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const context=canvas.getContext('2d',{willReadFrequently:artwork});context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  let output=canvas;
  if(artwork) {
    const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
    let left=canvas.width,right=-1,top=canvas.height,bottom=-1,transparent=false;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++) {const alpha=pixels[(y*canvas.width+x)*4+3];if(alpha<250)transparent=true;if(alpha>3){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
    if(!transparent||right<left)throw new Error('PNG harus berisi desain dengan latar transparan, tanpa kotak warna di belakangnya.');
    output=document.createElement('canvas');output.width=right-left+1;output.height=bottom-top+1;
    output.getContext('2d').drawImage(canvas,left,top,output.width,output.height,0,0,output.width,output.height);
  }
  const blob=await new Promise(resolve=>output.toBlob(resolve,artwork?'image/png':'image/webp',.9));
  if(!blob||blob.size>MAX_UPLOAD_BYTES)throw new Error('Hasil gambar masih melebihi 4 MB. Kurangi detail atau ukuran gambar.');
  const bytes=await blob.arrayBuffer(),digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
  const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});
  return{path:`/images/uploads/${digest}.${artwork?'png':'webp'}`,base64,preview:URL.createObjectURL(blob)};
}
