import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Loader2, Mail } from 'lucide-react';
import { useMotionPreference } from './useMotionPreference';
import { openGuide } from '../../utils/guideLinks';
import './journal-newsletter.css';

let challengeScript;
function loadChallenge() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!challengeScript) challengeScript = new Promise((resolve,reject) => {
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
    script.onload=()=>resolve(window.turnstile);
    script.onerror=()=>{script.remove();challengeScript=null;reject(new Error('Verifikasi belum dapat dimuat. Muat ulang halaman untuk mencoba kembali.'));};
    document.head.appendChild(script);
  });
  return challengeScript;
}

export function JournalNewsletter() {
  const reduce=useMotionPreference();
  const [config,setConfig]=useState(null),[email,setEmail]=useState(''),[consent,setConsent]=useState(false),[token,setToken]=useState(''),[engaged,setEngaged]=useState(false);
  const [state,setState]=useState('idle'),[message,setMessage]=useState('');
  const challenge=useRef(null),widget=useRef(null),honey=useRef(null);
  useEffect(()=>{
    const existing=document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    if(existing)return undefined;
    const feed=document.createElement('link');feed.rel='alternate';feed.type='application/rss+xml';feed.title='Artikel Kainora Kids';feed.href='/blog/feed.xml';document.head.appendChild(feed);
    return()=>feed.remove();
  },[]);
  useEffect(()=>{
    let active=true;
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    fetch('/api/newsletter',{signal:controller.signal,cache:'no-store'}).then(response=>response.ok?response.json():Promise.reject()).then(data=>{if(active)setConfig(data);}).catch(()=>{if(active)setConfig({configured:false});}).finally(()=>clearTimeout(timer));
    return()=>{active=false;clearTimeout(timer);controller.abort();};
  },[]);
  useEffect(()=>{
    if(!config?.configured||!engaged)return undefined;
    let active=true;
    loadChallenge().then(api=>{
      if(!active||!challenge.current)return;
      widget.current=api.render(challenge.current,{sitekey:config.siteKey,action:'newsletter',theme:'light',size:'flexible',callback:value=>setToken(value),'expired-callback':()=>setToken(''),'error-callback':()=>{setToken('');setState('error');setMessage('Verifikasi belum berhasil. Silakan coba kembali.');}});
    }).catch(error=>{if(active){setState('error');setMessage(error.message);}});
    return()=>{active=false;if(widget.current!==null&&window.turnstile){window.turnstile.remove(widget.current);widget.current=null;}};
  },[config,engaged]);
  const submit=async event=>{
    event.preventDefault();
    if(!config?.configured||state==='sending'||state==='confirmation')return;
    if(!token){setState('error');setMessage('Selesaikan verifikasi formulir terlebih dahulu.');return;}
    setState('sending');setMessage('Menyiapkan permintaan berlangganan…');
    try{
      const response=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,consent,token,website:honey.current?.value||''}),signal:AbortSignal.timeout(20000)});
      const result=await response.json();
      if(!response.ok||result.status!=='confirmation_required')throw new Error(result.error||'Permintaan belum dapat diproses. Silakan coba kembali.');
      setState('confirmation');setMessage('Periksa email Anda. Klik tautan konfirmasi untuk mengaktifkan langganan.');
    }catch(error){setState('error');setMessage(error.name==='TimeoutError'?'Layanan belum merespons. Silakan coba kembali.':error.message||'Pendaftaran belum dapat diproses.');}
    finally{setToken('');if(widget.current!==null&&window.turnstile)window.turnstile.reset(widget.current);}
  };
  const sending=state==='sending',waiting=config===null;
  return <section className={`j-newsletter ${state==='confirmation'?'is-confirmation':''}`} id="newsletter" aria-labelledby="j-newsletter-title">
    <div className="j-newsletter-intro"><span className="j-newsletter-eyebrow">NEWSLETTER KAINORA</span><h2 id="j-newsletter-title" tabIndex={-1}>Artikel terbaru,<br/><span>langsung ke email.</span></h2><p>Terima artikel tentang fashion anak, panduan ukuran, dan perawatan pakaian dari Kainora Kids.</p></div>
    <div className="j-newsletter-content">
      <form onSubmit={submit} onFocus={()=>setEngaged(true)} aria-label="Berlangganan artikel Kainora">
        <label className="j-newsletter-label" htmlFor="j-newsletter-email">Alamat email</label>
        <div className="j-newsletter-input-row"><Mail size={19} aria-hidden="true"/><input id="j-newsletter-email" type="email" name="email" autoComplete="email" placeholder="nama@email.com" maxLength={254} required disabled={sending||config?.configured===false} value={email} onChange={event=>{setEmail(event.target.value);setState('idle');setMessage('');}} aria-describedby="j-newsletter-note j-newsletter-status"/><motion.button type="submit" disabled={waiting||config?.configured===false||sending||state==='confirmation'} whileHover={reduce?undefined:{y:-1}} whileTap={reduce?undefined:{scale:.97}}><span>{waiting?'Menyiapkan…':config?.configured===false?'Segera tersedia':sending?'Mengirim…':state==='confirmation'?'Periksa email':'Berlangganan'}</span><AnimatePresence mode="wait" initial={false}><motion.span className="j-subscribe-icon" key={state} initial={reduce?false:{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:12}}>{sending?<Loader2 size={19} className="j-newsletter-spinner"/>:state==='confirmation'?<Check size={19}/>:<ArrowUpRight size={19}/>}</motion.span></AnimatePresence></motion.button></div>
        <label className="j-newsletter-consent"><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)} required disabled={sending||config?.configured===false}/><span>Saya ingin menerima artikel Kainora Kids melalui email. <a href="/kebijakan-privasi/" onClick={event=>openGuide(event,'/kebijakan-privasi/')}>Kebijakan privasi</a></span></label>
        <div className="j-newsletter-honey" aria-hidden="true"><label>Website<input ref={honey} name="website" type="text" autoComplete="off" tabIndex={-1}/></label></div>
        {config?.configured&&engaged&&<div className="j-newsletter-challenge" ref={challenge}/>}
        <p id="j-newsletter-note" className="j-newsletter-note">{config?.configured===false?'Pendaftaran newsletter sedang disiapkan. Silakan kembali nanti.':'Konfirmasikan alamat email Anda untuk mulai berlangganan. Berhenti kapan saja lewat tautan di email.'}</p>
        <div id="j-newsletter-status" className={`j-newsletter-status ${state}`} role="status" aria-live="polite"><AnimatePresence mode="wait">{message&&<motion.p key={message} initial={reduce?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{state==='confirmation'&&<Check size={17} aria-hidden="true"/>}{message}</motion.p>}</AnimatePresence></div>
      </form>
    </div>
  </section>;
}
