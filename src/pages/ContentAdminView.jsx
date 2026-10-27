import {useCallback,useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowUpRight,Check,CheckSquare,ExternalLink,Layers,LogOut,Package,Percent,Plus,RefreshCw,Search,Trash2,UploadCloud} from 'lucide-react';
import {useStore} from '../context/StoreContext';
import {adminRequest,prepareImage} from '../services/contentAdmin';
import {publishedUploads} from '../services/adminUploadState';
import {referencedMedia,removeProduct,validateContent} from '../../shared/contentSchema';
import {EmptyState,GarmentEditor,OrderButtons,ProductEditor} from '../components/admin/ContentEditors';
import '../components/admin/content-admin.css';
import {AffiliateSettings} from '../components/admin/AffiliateSettings';

const tabs=[['catalogue','Katalog produk',Package],['highlights','Highlight beranda',CheckSquare],['garments','Koleksi kaos 3D',Layers],['affiliate','Komisi affiliate',Percent]];
const copy=value=>JSON.parse(JSON.stringify(value));
const reorder=(list,index,direction)=>{const result=[...list];[result[index],result[index+direction]]=[result[index+direction],result[index]];return result;};
export default function ContentAdminView(){
  const {setView,applyContent}=useStore();
  const [session,setSession]=useState(null),[draft,setDraft]=useState(null),[baseline,setBaseline]=useState(''),[revision,setRevision]=useState('');
  const [tab,setTab]=useState('catalogue'),[query,setQuery]=useState(''),[editor,setEditor]=useState(null),[uploads,setUploads]=useState({});
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const assets=useRef(new Set());
  const dirty=!!draft&&JSON.stringify(draft)!==baseline;
  const load=useCallback(async(signal)=>{
    setError('');
    const auth=await adminRequest('session',{signal});setSession(auth);
    if(auth.authenticated){const data=await adminRequest('content',{signal});setDraft(copy(data.content));setBaseline(JSON.stringify(data.content));setRevision(data.revision);const refs=referencedMedia(data.content);setUploads(prev=>Object.fromEntries(Object.entries(prev).filter(([path])=>refs.has(path)).map(([path,file])=>[path,{...file,pending:false}])));}
  },[]);
  useEffect(()=>{const controller=new AbortController();load(controller.signal).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>controller.abort();},[load]);
  useEffect(()=>()=>{for(const url of assets.current)URL.revokeObjectURL(url);},[]);
  useEffect(()=>{if(!dirty)return;const warn=event=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const resolveMedia=useCallback(path=>uploads[path]?.preview||path,[uploads]);
  const stage=async(file,artwork)=>{const result=await prepareImage(file,artwork);assets.current.add(result.preview);setUploads(prev=>({...prev,[result.path]:{...result,pending:true}}));return result.path;};
  const change=next=>{setDraft(next);setNotice('');setError('');};
  const openProduct=()=>setEditor({kind:'product',value:{id:`p-${crypto.randomUUID()}`,name:'',type:'Kaos',gender:'Unisex',desc:'',sizes:[],ages:[],colors:[],images:[],img:'',model:'Oversize Boxy',order:draft.products.length+1}});
  const openGarment=()=>setEditor({kind:'garment',value:{id:`g-${crypto.randomUUID()}`,name:'',description:'',color:'white',initialView:'back',frontLayout:'chest',front:'',back:'',productId:''}});
  const saveEditor=value=>{
    try{
      const key=editor.kind==='product'?'products':'garments',exists=draft[key].some(item=>String(item.id)===String(value.id));
      const next={...draft,[key]:exists?draft[key].map(item=>String(item.id)===String(value.id)?value:item):[...draft[key],value]};
      change(validateContent(next));setEditor(null);setNotice('Tersimpan di draft. Tekan Terbitkan untuk menyimpan perubahan.');
    }catch(e){setError(e.message);}
  };
  const remove=(kind,item)=>{
    if(!window.confirm(`Hapus ${item.name} dari ${kind==='product'?'katalog':'koleksi 3D'}? Perubahan baru berlaku setelah diterbitkan.`))return;
    change(kind==='product'?removeProduct(draft,item.id):{...draft,garments:draft.garments.filter(g=>g.id!==item.id)});
  };
  const publish=async()=>{
    setBusy(true);setError('');setNotice('');
    try{
      const content=validateContent(draft),references=referencedMedia(content);
      const pending=Object.values(uploads).filter(file=>references.has(file.path)&&file.pending!==false).map(({path,base64})=>({path,base64}));
      const result=await adminRequest('content',{method:'POST',csrf:session.csrf,body:{content,revision,uploads:pending}});
      setDraft(copy(result.content));setBaseline(JSON.stringify(result.content));setRevision(result.revision);setUploads(prev=>publishedUploads(prev,pending));setNotice(result.message);
      if(result.mode==='local')applyContent(result.content);
    }catch(e){setError(e.message);}finally{setBusy(false);}
  };
  const refresh=async()=>{if(dirty&&!window.confirm('Buang draft yang belum diterbitkan dan muat ulang versi tersimpan?'))return;setBusy(true);try{await load();setEditor(null);setNotice('Versi tersimpan sudah dimuat.');}catch(e){setError(e.message);}finally{setBusy(false);}};
  const leave=()=>{if(!dirty||window.confirm('Draft belum diterbitkan. Tinggalkan panel?'))setView('home');};
  const logout=async()=>{if(dirty&&!window.confirm('Draft belum diterbitkan. Keluar sekarang?'))return;setBusy(true);try{await adminRequest('logout',{method:'POST',csrf:session.csrf,body:{}});setDraft(null);setSession(prev=>({...prev,authenticated:false}));}catch(e){setError(e.message);}finally{setBusy(false);}};

  if(!session?.authenticated||!draft)return <main className="content-admin ca-gate"><a href="/" className="ca-back"><ArrowLeft size={16}/>Kembali ke toko</a><div className="ca-login-card"><span className="ca-eyebrow">KAINORA / CONTENT STUDIO</span><h1>Ruang di balik<br/>koleksi.</h1><p>Kelola katalog, pilihan beranda, dan desain kaos 3D dari satu tempat.</p>{error&&<p className="ca-error" role="alert">{error}</p>}{!session&&!error?<p role="status">Memeriksa akses admin…</p>:session?.configured?<><a className="ca-primary" href="/api/admin/login">Login dengan GitHub <ArrowUpRight size={18}/></a><small>Hanya akun pengelola Kainora yang dapat masuk.</small></>:<div className="ca-setup-message"><strong>Admin online belum diaktifkan.</strong><p>Login GitHub dan hosting Cloudflare perlu disiapkan sekali terlebih dahulu. Panduannya tersedia dalam file admin-online-setup.md di project.</p><p>Untuk mencoba editor di komputer ini, jalankan <code>npm run dev:admin</code>, lalu buka <a href="http://127.0.0.1:5174/?view=admin">editor lokal <ExternalLink size={13}/></a>.</p><button onClick={refresh} disabled={busy}><RefreshCw size={14}/>Periksa kembali</button></div>}</div></main>;

  const filtered=draft.products.filter(p=>`${p.name} ${p.gender}`.toLowerCase().includes(query.toLowerCase()));
  const heading=tab==='catalogue'?'Semua koleksi.':tab==='highlights'?'Pilihan di depan.':tab==='affiliate'?'Atur peluangnya.':'Desain jadi nyata.';
  return <main className="content-admin ca-shell"><aside className="ca-sidebar"><button className="ca-brand" disabled={busy} onClick={leave}>KAINORA<span>CONTENT STUDIO</span></button><div className="ca-account"><span className="ca-dot"/>{session.mode==='local'?'Editor lokal':session.login}</div><nav aria-label="Pengelolaan konten">{tabs.map(([key,label,Icon])=><button key={key} className={tab===key?'selected':''} onClick={()=>{setTab(key);setQuery('');setEditor(null);}} disabled={!!editor||busy}><Icon size={18}/>{label}<span>{key==='catalogue'?draft.products.length:key==='highlights'?`${draft.highlights.length}/12`:key==='affiliate'?draft.products.filter(p=>typeof p.affiliateCommissionPercent==='number').length:draft.garments.length}</span></button>)}</nav><button className="ca-back" disabled={busy} onClick={leave}><ArrowLeft size={16}/>Kembali ke toko</button>{session.mode==='git'&&<button className="ca-back" disabled={busy} onClick={logout}><LogOut size={16}/>Keluar admin</button>}<p>Little fits.<br/>Big possibilities.</p></aside>
    <div className="ca-workspace"><header className="ca-toolbar"><span className={dirty?'ca-status is-dirty':'ca-status'}><span/>{dirty?'Draft belum diterbitkan':'Tidak ada perubahan draft'}</span><div><button disabled={busy||!!editor} onClick={refresh} aria-label="Muat ulang konten tersimpan"><RefreshCw size={16}/><span>Muat ulang</span></button><button className="ca-primary" disabled={busy||!dirty||!!editor} onClick={publish}><UploadCloud size={17}/>{busy?'Menyimpan…':session.mode==='local'?'Simpan ke project':'Terbitkan'}</button></div></header>
    <fieldset className="ca-main" disabled={busy}><div className="ca-mode-note">{session.mode==='local'?<><strong>MODE LOKAL</strong> Perubahan disimpan ke komputer ini. Website kainorakids.com belum berubah.</>:<><strong>PUBLIKASI ONLINE</strong> Terbitkan mengirim perubahan ke GitHub. Website diperbarui setelah build Cloudflare berhasil.</>}</div>
      {error&&<p className="ca-error" role="alert">{error}</p>}{notice&&<p className="ca-success" role="status"><Check size={16}/>{notice}</p>}
      {editor?editor.kind==='product'?<ProductEditor key={editor.value.id} product={editor.value} onSave={saveEditor} onClose={()=>setEditor(null)} onUpload={stage} resolveMedia={resolveMedia}/>:<GarmentEditor key={editor.value.id} garment={editor.value} products={draft.products} onSave={saveEditor} onClose={()=>setEditor(null)} onUpload={stage} resolveMedia={resolveMedia}/>:<>
      <div className="ca-page-heading"><div><span className="ca-eyebrow">{tab==='catalogue'?'01 / CATALOGUE':tab==='highlights'?'02 / HOME EDIT':tab==='affiliate'?'04 / CREATOR PROGRAM':'03 / A CLOSER LOOK'}</span><h1>{heading}</h1><p>{tab==='catalogue'?'Satu katalog untuk semua produk di toko.':tab==='highlights'?'Pilih dan susun maksimal 12 produk yang muncul di beranda.':tab==='affiliate'?'Persentase per produk untuk simulator di halaman affiliate.':'Koleksi 3D terpisah dari katalog. Upload PNG, pilih warna, lalu tentukan tampak awal.'}</p></div>{(tab==='catalogue'||tab==='garments')&&<button className="ca-primary" onClick={tab==='catalogue'?openProduct:openGarment}><Plus size={18}/>{tab==='catalogue'?'Tambah produk':'Tambah kaos 3D'}</button>}</div>
      {tab==='catalogue'&&<><label className="ca-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama atau kategori produk…" aria-label="Cari produk katalog"/></label><div className="ca-product-grid">{filtered.map(p=><article className="ca-product" key={p.id}><button className="ca-product-image" onClick={()=>setEditor({kind:'product',value:p})}><img src={resolveMedia(p.img)} alt={p.name} loading="lazy"/></button><div className="ca-product-copy"><small>{p.gender==='Laki-laki'?'BOYS':p.gender==='Perempuan'?'GIRLS':'UNISEX'}{draft.highlights.includes(String(p.id))?' / HIGHLIGHT':''}</small><h2>{p.name}</h2><p>{p.price===undefined?'Harga belum tersedia':`Rp ${Number(p.price).toLocaleString('id-ID')}`}</p><div><button onClick={()=>setEditor({kind:'product',value:p})}>Edit produk <ArrowUpRight size={15}/></button><button aria-label={`Hapus ${p.name}`} onClick={()=>remove('product',p)}><Trash2 size={16}/></button></div><OrderButtons index={draft.products.indexOf(p)} length={draft.products.length} label={p.name} onMove={(i,direction)=>change({...draft,products:reorder(draft.products,i,direction).map((item,index)=>({...item,order:index+1}))})}/></div></article>)}</div>{!filtered.length&&<EmptyState onAdd={query?undefined:openProduct}>{query?'Produk tidak ditemukan.':'Katalog masih kosong.'}</EmptyState>}</>}
      {tab==='affiliate'&&<AffiliateSettings products={draft.products} resolveMedia={resolveMedia} onChange={(id,rate)=>change({...draft,products:draft.products.map(p=>String(p.id)===String(id)?{...p,affiliateCommissionPercent:rate}:p)})}/>}
      {tab==='highlights'&&<div className="ca-highlights-layout"><section><h2>Urutan beranda <span>{draft.highlights.length}/12</span></h2><p className="ca-note">Produk baru tidak otomatis menjadi highlight.</p>{draft.highlights.map((id,index)=>{const p=draft.products.find(item=>String(item.id)===id);return <article className="ca-highlight-row" key={id}><b>{String(index+1).padStart(2,'0')}</b><img src={resolveMedia(p.img)} alt="" loading="lazy"/><span>{p.name}</span><OrderButtons index={index} length={draft.highlights.length} label={p.name} onMove={(i,direction)=>change({...draft,highlights:reorder(draft.highlights,i,direction)})}/><button aria-label={`Hapus highlight ${p.name}`} onClick={()=>change({...draft,highlights:draft.highlights.filter(key=>key!==id)})}><XIcon/></button></article>;})}{!draft.highlights.length&&<EmptyState>Belum ada highlight. Pilih produk dari katalog di sebelah.</EmptyState>}</section><section><h2>Pilih dari katalog</h2><label className="ca-search"><Search size={16}/><input aria-label="Cari produk untuk highlight" placeholder="Cari produk…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="ca-highlight-options">{filtered.map(p=>{const checked=draft.highlights.includes(String(p.id));return <label key={p.id}><input type="checkbox" checked={checked} disabled={!checked&&draft.highlights.length>=12} onChange={()=>change({...draft,highlights:checked?draft.highlights.filter(id=>id!==String(p.id)):[...draft.highlights,String(p.id)]})}/><img src={resolveMedia(p.img)} alt="" loading="lazy"/><span>{p.name}</span></label>;})}</div>{draft.highlights.length===12&&<p className="ca-note">12 slot terisi. Lepas satu pilihan untuk mengganti produk.</p>}</section></div>}
      {tab==='garments'&&<><div className="ca-garment-list">{draft.garments.map((g,index)=><article className="ca-garment-card" key={g.id}><button className={`ca-garment-thumb ${g.color==='black'?'is-black':''}`} onClick={()=>setEditor({kind:'garment',value:g})}><img src={resolveMedia(g[g.initialView]||g.back||g.front)} alt={`Desain ${g.name}`} loading="lazy"/></button><div><small>OVERSIZE / {g.color==='black'?'HITAM':'PUTIH'} / AWAL {g.initialView==='back'?'BELAKANG':'DEPAN'}</small><h2>{g.name}</h2><p>{g.productId?`Produk: ${draft.products.find(p=>String(p.id)===g.productId)?.name}`:'Tanpa tautan produk katalog'}</p><button onClick={()=>setEditor({kind:'garment',value:g})}>Edit desain <ArrowUpRight size={15}/></button></div><OrderButtons index={index} length={draft.garments.length} label={g.name} onMove={(i,direction)=>change({...draft,garments:reorder(draft.garments,i,direction)})}/><button aria-label={`Hapus kaos 3D ${g.name} ${index+1}`} onClick={()=>remove('garment',g)}><Trash2 size={17}/></button></article>)}</div>{!draft.garments.length&&<EmptyState onAdd={openGarment}>Koleksi 3D kosong. Section disembunyikan sampai ada kaos.</EmptyState>}<p className="ca-note">Hanya kaos tengah yang berputar otomatis. Kaos di kiri dan kanan tetap tampak belakang.</p></>}
      </>}
    </fieldset></div></main>;
}
function XIcon(){return <span aria-hidden="true">×</span>;}
