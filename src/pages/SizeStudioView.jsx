import {useRef,useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {ArrowRight,ArrowUpRight,Accessibility,Ruler,Weight,Info,MoveHorizontal,Check,ShieldCheck} from 'lucide-react';
import {SEO} from '../constants/data';
import {useStore} from '../context/StoreContext';
import {SIZE_CATEGORIES,SIZE_SOURCES,SIZE_STUDIO,measurementFields,sizeSelection} from '../content/sizeStudio';
import {analyseMeasurements,valuesForNewGarment,editMeasurementErrors} from '../utils/sizeStudio';
import {plainClick} from '../utils/productRoutes';
import {openGuide} from '../utils/guideLinks';
import {useShopSchema} from '../components/shop/ShopShared';
import {MeasurementStage} from '../components/size-guide/MeasurementStage';
import './size-studio.css';

const fieldIcons={height:Accessibility,weight:Weight};
const FITS=[['regular','Regular'],['relaxed','Relaxed'],['oversize','Oversize']];
const site='https://kainorakids.com';

export function SizeStudioView(){
  const {setView}=useStore();
  const [categoryId,setCategoryId]=useState('tops'),[typeId,setTypeId]=useState('tee');
  const [fit,setFit]=useState('regular'),[mode,setMode]=useState('body');
  const [values,setValues]=useState({}),[errors,setErrors]=useState({}),[result,setResult]=useState(null),[focused,setFocused]=useState(null);
  const resultRef=useRef(null),formTitleRef=useRef(null),reduce=useReducedMotion();
  const {category,type}=sizeSelection(categoryId,typeId);
  const fields=measurementFields(categoryId,typeId,mode);
  const foot=type.dimensions.includes('footLength');
  const canonical=site+SIZE_STUDIO.path;
  useShopSchema([{'@context':'https://schema.org','@type':'WebPage',name:SIZE_STUDIO.title,description:SIZE_STUDIO.description,url:canonical,inLanguage:'id-ID'},
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Beranda',item:site+'/'},{'@type':'ListItem',position:2,name:'Panduan ukuran anak',item:canonical}]}]);
  const clearResult=()=>{setResult(null);setErrors({});};
  const chooseCategory=id=>{if(id===categoryId)return;setCategoryId(id);setTypeId(SIZE_CATEGORIES.find(c=>c.id===id).types[0].id);setValues(valuesForNewGarment);setFocused(null);clearResult();};
  const submit=event=>{
    event.preventDefault();
    const next=analyseMeasurements({categoryId,typeId,mode,values,fit});
    setErrors(next.errors);setResult(next.ok?next:null);
    if(!next.ok){document.getElementById(`ss-${Object.keys(next.errors)[0]}`)?.focus();return;}
    requestAnimationFrame(()=>{resultRef.current?.focus({preventScroll:true});resultRef.current?.scrollIntoView({behavior:reduce?'instant':'smooth',block:'nearest'});});
  };
  const changeMode=()=>{setMode(mode==='body'?'compare':'body');setFocused(null);clearResult();requestAnimationFrame(()=>{formTitleRef.current?.focus({preventScroll:true});formTitleRef.current?.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});});};
  return <main className="size-studio">
    <SEO title={SIZE_STUDIO.title} description={SIZE_STUDIO.description} canonicalPath={SIZE_STUDIO.path} robots="index, follow"/>
    <div className="ss-container">
      <nav className="ss-breadcrumb" aria-label="Breadcrumb"><a href="/" onClick={event=>{if(plainClick(event)){event.preventDefault();setView('home');}}}>Beranda</a><span>/</span><a href="/panduan/ukuran-kaos-anak/" onClick={e=>openGuide(e,'/panduan/ukuran-kaos-anak/')}>Panduan pembeli</a><span>/</span><span>Studio Ukuran</span></nav>
      <header className="ss-heading"><p className="ss-overline">STUDIO UKURAN</p><h1>Panduan ukuran pakaian anak</h1><p>Ukur tubuh atau pakaian pembanding, lalu cocokkan dengan tabel ukuran produk.<br className="ss-desktop-break"/> Tersedia panduan untuk baju, celana, sepatu, dan pakaian anak lainnya.</p><span className="sr-only">Panduan ukuran baju, celana, sepatu dan fashion anak di Indonesia.</span></header>
      <nav className="ss-categories" aria-label="Kategori panduan ukuran">{SIZE_CATEGORIES.map(item=><button type="button" key={item.id} aria-pressed={item.id===categoryId} onClick={()=>chooseCategory(item.id)}>{item.id===categoryId&&<motion.span className="ss-category-active" layoutId="ss-category-selection" transition={{duration:reduce?0:.25}}/>}<span>{item.label}</span></button>)}</nav>
      <div className="ss-workspace">
        <section className="ss-form-area" aria-labelledby="ss-form-title">
          <div className="ss-form-intro"><h2 id="ss-form-title" ref={formTitleRef} tabIndex={-1}>{mode==='body'?(foot?'Ukur kedua kaki si kecil.':'Masukkan ukuran tubuh anak.'):(foot?'Bandingkan panjang kaki.':'Bandingkan ukuran pakaian.')}</h2><p>{mode==='body'?(fields.some(field=>field.id==='weight')?'Isi ukuran dalam sentimeter. Berat badan opsional untuk catatan Anda.':'Isi ukuran dalam sentimeter. Ikuti petunjuk cara mengukur di bawah. '):'Gunakan metode dan satuan yang sama pada kedua kolom.'}</p></div>
          <form onSubmit={submit} noValidate>
            {mode==='compare'&&<div className="ss-compare-head"><span>{foot?'Panjang kaki pembanding':'Yang sudah nyaman'}</span><span>Size chart pilihan</span></div>}
            <div className={mode==='compare'?'ss-fields ss-fields--compare':'ss-fields'}>{fields.map(field=>{
              const Icon=fieldIcons[field.id]||Ruler;
              return <div className="ss-field" key={field.id}><label htmlFor={`ss-${field.id}`}>{field.label} <span>({field.unit})</span>{field.optional&&<em>Opsional</em>}{mode==='compare'&&<span className="sr-only">{field.side==='ref'?'pembanding':'size chart pilihan'}</span>}</label><div className={`ss-input-wrap ${errors[field.id]?'has-error':''}`}><Icon size={20} aria-hidden="true"/><input id={`ss-${field.id}`} name={field.id} value={values[field.id]??''} onChange={event=>{const value=event.target.value;setValues(current=>({...current,[field.id]:value}));setResult(null);setErrors(current=>editMeasurementErrors(current,field.id,value,fields));}} onFocus={()=>setFocused(field.id)} inputMode="decimal" autoComplete="off" placeholder={field.placeholder} aria-invalid={!!errors[field.id]} aria-describedby={errors[field.id]?`ss-error-${field.id}`:focused===field.id?'ss-field-help':undefined} maxLength={7} required={!field.optional}/></div>{errors[field.id]&&<p className="ss-field-error" id={`ss-error-${field.id}`}>{errors[field.id]}</p>}</div>;
            })}</div>
            {focused&&<p className="ss-field-help" id="ss-field-help">{fields.find(field=>field.id===focused)?.help}</p>}
            {category.fit&&mode==='body'&&<fieldset className="ss-fit"><legend>Pilih fit yang diinginkan. <a href="#pahami-fit" aria-label="Pelajari perbedaan fit"><Info size={15}/></a></legend><div>{FITS.map(([id,label])=><button key={id} type="button" aria-pressed={id===fit} onClick={()=>{setFit(id);setResult(null);}}>{label}</button>)}</div></fieldset>}
            <button className="ss-primary" type="submit">{mode==='body'?'Temukan panduan':'Bandingkan ukuran'}<ArrowRight size={19} aria-hidden="true"/></button>
            {Object.keys(errors).length>0&&<p className="ss-form-error" role="alert">Periksa kembali kolom yang ditandai.</p>}
          </form>
          <button className="ss-mode-link" type="button" onClick={changeMode}><MoveHorizontal size={16}/>{mode==='body'?(foot?'Bandingkan dengan chart panjang kaki':'Punya pakaian pembanding?'):'Kembali ke ukuran tubuh'}</button>
          <label className="ss-type-label" htmlFor="ss-type">Jenis yang ingin diukur<select id="ss-type" value={typeId} onChange={event=>{setTypeId(event.target.value);setValues(valuesForNewGarment);setFocused(null);clearResult();}}>{category.types.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        </section>
        <MeasurementStage category={category} type={type} fit={fit} focused={focused} values={values} mode={mode} onSelectDimension={id=>setFocused(mode==='compare'?`${focused?.startsWith('ref_')?'ref':'chart'}_${id}`:null)}/>
      </div>
      {result&&<motion.section className="ss-result" ref={resultRef} tabIndex={-1} aria-labelledby="ss-result-title" key={`${categoryId}-${mode}`} initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduce?0:.24}}><span className="ss-overline"><Check size={15}/>PANDUAN PENGUKURAN</span><h2 id="ss-result-title">{result.heading}</h2><div className="ss-result-values">{result.items.map(item=><div key={item.id}><span>{item.label}</span><strong>{item.value}</strong><p>{item.detail}</p></div>)}</div><ul>{result.notes.map(note=><li key={note}>{note}</li>)}</ul><button className="ss-text-link" onClick={changeMode} type="button">{mode==='body'?'Lanjut bandingkan dengan size chart':'Catat ukuran tubuh'}<ArrowUpRight size={17}/></button></motion.section>}
      <section className="ss-learning" id="cara-mengukur" aria-labelledby="ss-learning-title"><div><span className="ss-overline">UKUR DENGAN LEBIH YAKIN</span><h2 id="ss-learning-title">Cara mengukur<br/>dengan tepat</h2><p>{category.description} Mulai dari pengukuran yang tepat, bukan hanya usia atau label ukuran.</p></div><div className="ss-steps" key={typeId}>{type.steps.map((step,index)=><div key={step}><span>{index+1}</span><p>{step}</p></div>)}</div></section>
      <section className="ss-fit-explainer" id="pahami-fit" aria-labelledby="ss-fit-title"><div><span className="ss-overline">PAHAMI POTONGANNYA</span><h2 id="ss-fit-title">Perbedaan<br/>potongan pakaian</h2></div><div>{[['Regular','Siluet rapi dengan ruang gerak sesuai desain produk.'],['Relaxed','Potongan lebih rileks; cek lebar dada, bahu dan panjang.'],['Oversize','Pola sengaja lebih leluasa. Berbeda dari sekadar naik satu ukuran.']].map(([name,copy])=><article key={name}><h3>{name}</h3><p>{copy}</p></article>)}</div></section>
      <section className="ss-methodology" aria-labelledby="ss-source-title"><div><span className="ss-overline"><ShieldCheck size={15}/>METODE PENGUKURAN</span><h2 id="ss-source-title">Sumber panduan ukuran</h2><p>Menggunakan metode pengukuran dari sumber resmi, untuk membantu orang tua di Indonesia. Ukuran berbeda menurut merek, model, bahan dan potongan; selisihnya tidak selalu 1–2 cm.</p><p>Riset tabel tubuh dan pakaian belum cukup untuk menetapkan rata-rata setiap cutting di Indonesia. Karena itu, alat ini menyajikan catatan ukuran serta perbandingan angka yang Anda masukkan, bukan satu label ukuran universal.</p><p className="ss-privacy">Perhitungan berlangsung di perangkat Anda. Ukuran anak tidak dikirim atau disimpan oleh alat ini.</p><small>Sumber diperiksa {SIZE_STUDIO.checkedOn}. Referensi adidas berasal dari situs regional UAE. Ilustrasi bukan foto produk yang dijual.</small></div><div className="ss-sources">{SIZE_SOURCES.map(source=><a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer"><span><strong>{source.name}</strong><span>{source.label}</span></span><ArrowUpRight size={19}/></a>)}</div></section>
      <div className="ss-kainora-link"><span>Ingin memilih kaos Kainora?</span><a href="/panduan/ukuran-kaos-anak/" onClick={e=>openGuide(e,'/panduan/ukuran-kaos-anak/')}>Lihat size chart khusus Kainora<ArrowUpRight size={17}/></a></div>
    </div>
  </main>;
}
