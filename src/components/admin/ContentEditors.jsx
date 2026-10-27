import {lazy,Suspense,useMemo,useState} from 'react';
import {ArrowDown,ArrowUp,Plus,Trash2,X,Upload} from 'lucide-react';
const GarmentCanvas=lazy(()=>import('../fashion/GarmentCanvas'));
export function EmptyState({children,onAdd}) {return <div className="ca-empty"><p>{children}</p>{onAdd&&<button className="ca-primary" onClick={onAdd}><Plus size={16}/>Tambah item</button>}</div>;}
export function OrderButtons({index,length,onMove,label}) {return <div className="ca-order"><button disabled={!index} onClick={()=>onMove(index,-1)} aria-label={`Naikkan ${label}`}><ArrowUp size={16}/></button><button disabled={index===length-1} onClick={()=>onMove(index,1)} aria-label={`Turunkan ${label}`}><ArrowDown size={16}/></button></div>;}
export function ProductEditor({product,onSave,onClose,onUpload,resolveMedia}) {
  const [form,setForm]=useState(()=>({...product,sizes:(product.sizes||[]).join(', '),price:product.price??'',stock:product.stock??''}));
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const set=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  const upload=async event=>{
    const files=[...event.target.files];event.target.value='';if(!files.length)return;
    if(form.images.length+files.length>8){setError('Maksimal 8 foto per produk.');return;}
    setBusy(true);setError('');
    try{const paths=[];for(const file of files)paths.push(await onUpload(file,false));setForm(prev=>({...prev,images:[...prev.images,...paths],img:prev.img||paths[0]}));}catch(e){setError(e.message);}finally{setBusy(false);}
  };
  return <section className="ca-editor" aria-labelledby="product-editor-title"><div className="ca-editor-heading"><div><small>EDITOR KATALOG</small><h2 id="product-editor-title">{product.name?'Edit produk':'Produk baru'}</h2></div><button aria-label="Tutup editor produk" onClick={onClose}><X/></button></div>
    <form onSubmit={event=>{event.preventDefault();setError('');if(!form.images.length){setError('Tambahkan minimal satu foto produk.');return;}const sizes=form.sizes.split(',').map(s=>s.trim()).filter(Boolean);onSave({...form,img:form.images[0],price:form.price===''?undefined:Number(form.price),stock:form.stock===''?undefined:Number(form.stock),sizes,photoOnly:form.price===''||!sizes.length});}}>
      <div className="ca-form-grid"><label>Nama produk<input required maxLength={120} value={form.name} onChange={e=>set('name',e.target.value)}/></label><label>Kategori<select value={form.gender||'Unisex'} onChange={e=>set('gender',e.target.value)}><option>Unisex</option><option value="Laki-laki">Boys</option><option value="Perempuan">Girls</option></select></label>
      <label>Harga (Rp)<input type="number" min="0" step="1" value={form.price} placeholder="Kosongkan jika belum tersedia" onChange={e=>set('price',e.target.value)}/></label><label>Ukuran, pisahkan dengan koma<input maxLength={400} value={form.sizes} placeholder="5-6Y, 7-8Y, 9-10Y" onChange={e=>set('sizes',e.target.value)}/></label>
      <label>Stok (opsional)<input type="number" min="0" step="1" value={form.stock} placeholder="Belum ditentukan" onChange={e=>set('stock',e.target.value)}/></label><label>Warna produk<input maxLength={200} value={form.warna||''} onChange={e=>set('warna',e.target.value)} placeholder="Broken White"/></label>
      <label>Ketersediaan<select value={form.availability||''} onChange={e=>set('availability',e.target.value)}><option value="">Belum dikonfirmasi</option><option value="InStock">Tersedia</option><option value="OutOfStock">Sedang habis</option></select><small>Jika angka stok diisi, angka tersebut menjadi acuan utama.</small></label>
      <label>Bahan<input maxLength={200} value={form.bahan||''} onChange={e=>set('bahan',e.target.value)}/></label><label>Jahitan<input maxLength={200} value={form.jahitan||''} onChange={e=>set('jahitan',e.target.value)}/></label></div>
      <label>Deskripsi<textarea maxLength={5000} rows={4} value={form.desc||''} onChange={e=>set('desc',e.target.value)}/></label>
      <div className="ca-field-title"><strong>Foto produk</strong><span>Foto pertama menjadi sampul. Utamakan foto produk berlatar kuning.</span></div>
      <div className="ca-photo-list">{form.images.map((url,index)=><div key={`${url}-${index}`}><img src={resolveMedia(url)} alt={`Foto produk ${index+1}`}/><span>{index===0?'Sampul':`Foto ${index+1}`}</span><div><button type="button" disabled={!index} onClick={()=>{const images=[...form.images];[images[index],images[index-1]]=[images[index-1],images[index]];set('images',images);}} aria-label={`Jadikan foto ${index+1} lebih awal`}><ArrowUp size={14}/></button><button type="button" aria-label={`Hapus foto ${index+1}`} onClick={()=>set('images',form.images.filter((_,i)=>i!==index))}><Trash2 size={14}/></button></div></div>)}</div>
      <label className="ca-upload"><Upload size={17}/>{busy?'Menyiapkan foto…':'Tambah foto'}<input type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={busy} onChange={upload}/></label>
      <label className="ca-checkbox"><input type="checkbox" checked={form.catalogPreview===true} onChange={e=>set('catalogPreview',e.target.checked)}/>Harga dan ukuran masih data pratinjau</label>
      <p className="ca-note">Harga atau ukuran yang dikosongkan akan ditampilkan sebagai motif dengan detail belum tersedia.</p>
      {error&&<p className="ca-error" role="alert">{error}</p>}<div className="ca-editor-actions"><button type="button" onClick={onClose}>Batal</button><button className="ca-primary" disabled={busy} type="submit">Simpan ke draft</button></div>
    </form></section>;
}
export function GarmentEditor({garment,products,onSave,onClose,onUpload,resolveMedia}) {
  const [form,setForm]=useState(garment),[busy,setBusy]=useState(''),[error,setError]=useState('');
  const [previewView,setPreviewView]=useState(garment.initialView);
  const set=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  const preview=useMemo(()=>[{...form,initialView:previewView,front:resolveMedia(form.front),back:resolveMedia(form.back)}],[form,previewView,resolveMedia]);
  const upload=async(side,file)=>{if(!file)return;setBusy(side);setError('');try{set(side,await onUpload(file,true));}catch(e){setError(e.message);}finally{setBusy('');}};
  return <section className="ca-editor" aria-labelledby="garment-editor-title"><div className="ca-editor-heading"><div><small>EDITOR KOLEKSI 3D</small><h2 id="garment-editor-title">{garment.name?'Edit kaos 3D':'Kaos 3D baru'}</h2></div><button aria-label="Tutup editor kaos 3D" onClick={onClose}><X/></button></div>
    <div className="ca-garment-layout"><div className="ca-3d-preview"><div className="ca-preview-label">PRATINJAU LANGSUNG <span>{form.color==='black'?'HITAM':'PUTIH'}</span></div>{form.front||form.back?<Suspense fallback={<p className="ca-empty">Menyiapkan kaos…</p>}><GarmentCanvas key={`${previewView}:${form.color}:${form.front}:${form.back}:${form.frontLayout}`} entries={preview} active autoRotate={false}/></Suspense>:<EmptyState>Upload PNG untuk melihat sablon pada kaos.</EmptyState>}<div className="ca-preview-controls"><button aria-pressed={previewView==='front'} onClick={()=>setPreviewView('front')}>Depan</button><button aria-pressed={previewView==='back'} onClick={()=>setPreviewView('back')}>Belakang</button></div><p className="ca-note">Seret kaos untuk memutar. Tampilan awal pengunjung diatur pada form.</p></div>
    <form onSubmit={event=>{event.preventDefault();if(!form.front&&!form.back){setError('Upload minimal satu desain PNG.');return;}onSave(form);}}>
      <label>Nama koleksi 3D<input required maxLength={120} value={form.name} onChange={e=>set('name',e.target.value)}/></label>
      <div className="ca-form-grid"><label>Warna kaos<select value={form.color} onChange={e=>set('color',e.target.value)}><option value="white">Putih</option><option value="black">Hitam</option></select></label><label>Tampak awal<select value={form.initialView} onChange={e=>{set('initialView',e.target.value);setPreviewView(e.target.value);}}><option value="back">Belakang</option><option value="front">Depan</option></select></label></div>
      <label>Ukuran sablon depan<select value={form.frontLayout} onChange={e=>set('frontLayout',e.target.value)}><option value="chest">Kecil di dada (melebar)</option><option value="badge">Badge di dada (tegak / bulat)</option><option value="large">Besar di tengah</option></select></label>
      <p className="ca-note">Posisi dan batas sablon tersimpan di kode. PNG baru mengikuti preset yang sama; ruang transparan di tepi gambar dirapikan otomatis.</p>
      <div className="ca-artwork-grid">{['front','back'].map(side=><div key={side}><strong>PNG {side==='front'?'depan':'belakang'}</strong><div className="ca-artwork-image">{form[side]?<img src={resolveMedia(form[side])} alt={`Desain ${side==='front'?'depan':'belakang'}`}/>:<span>Belum ada desain</span>}</div><label className="ca-upload"><Upload size={14}/>{busy===side?'Memproses…':form[side]?'Ganti PNG':'Upload PNG'}<input type="file" accept="image/png" disabled={!!busy} onChange={e=>{upload(side,e.target.files[0]);e.target.value='';}}/></label>{form[side]&&<button type="button" className="ca-text-button" onClick={()=>set(side,'')}>Hapus desain {side==='front'?'depan':'belakang'}</button>}</div>)}</div>
      <label>Deskripsi singkat<textarea rows={2} maxLength={500} value={form.description} onChange={e=>set('description',e.target.value)}/></label>
      <label>Tautkan ke produk katalog (opsional)<select value={form.productId} onChange={e=>set('productId',e.target.value)}><option value="">Tanpa tombol Lihat Produk</option>{products.map(p=><option key={p.id} value={String(p.id)}>{p.name}</option>)}</select></label>
      {error&&<p className="ca-error" role="alert">{error}</p>}<div className="ca-editor-actions"><button type="button" onClick={onClose}>Batal</button><button type="submit" disabled={!!busy} className="ca-primary">Simpan ke draft</button></div>
    </form></div></section>;
}
