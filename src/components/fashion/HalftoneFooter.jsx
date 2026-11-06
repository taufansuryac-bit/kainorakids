import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WA_NUMBER } from '../../config/shop';
import { HalftoneWordmark } from '../neo/HalftoneWordmark';
import { Overline } from './motion';
import { openGuide } from '../../utils/guideLinks';
import { plainClick, viewHref } from '../../utils/productRoutes';
import { track } from '../../utils/analytics';
import './footer-compact.css';

export function HalftoneFooter({ openPopup }) {
  const { setView, setGlobalGenderFilter } = useStore();
  const nav = (view) => { if (view === 'products') setGlobalGenderFilter('Semua'); setView(view); };
  return <footer data-section="11" className="f-footer f-inset" aria-label="Footer Kainora Kids"><div className="f-footer-top"><div className="f-footer-intro"><Overline>KAINORA KIDS</Overline><h2>GRAPHIC TEE.<br />FASHION ANAK.</h2><a href="https://www.instagram.com/kainorakids/" target="_blank" rel="noreferrer" className="f-text-link">IKUTI INSTAGRAM KAINORA <ArrowUpRight size={18} /></a></div><nav className="f-footer-links f-footer-desktop-nav" aria-label="Navigasi footer"><Overline>KOLEKSI & INFORMASI</Overline>{[['Koleksi', 'products'], ['Beranda', 'home'], ['Artikel', 'blog'], ['Affiliate', 'affiliate']].map(([label, view]) => <a key={view} href={viewHref(view)} onClick={event => { if (!plainClick(event)) return; event.preventDefault(); nav(view); }}>{label}</a>)}</nav><nav className="f-footer-links f-footer-desktop-nav f-footer-help" aria-label="Bantuan toko"><Overline>BANTUAN</Overline>{[['Cara belanja', 'cara'], ['FAQ', 'faq']].map(([label, key]) => <button key={key} onClick={() => openPopup?.(key)}>{label}</button>)}{[['/panduan-ukuran-anak/','Panduan ukuran anak'],['/panduan/ukuran-kaos-anak/','Tabel ukuran kaos'],['/panduan/perawatan-sablon/','Perawatan sablon'],['/pengiriman/','Pengiriman'],['/retur/','Retur & penukaran'],['/kebijakan-privasi/','Kebijakan privasi']].map(([path,label])=><a key={path} href={path} onClick={e=>openGuide(e,path)}>{label}</a>)}<a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" onClick={() => track('contact_whatsapp_click', { location: 'footer' })}>Hubungi kami ↗</a></nav><nav className="f-footer-mobile-nav" aria-label="Navigasi dan bantuan footer">
      {[['Koleksi','products'],['Beranda','home'],['Artikel','blog'],['Affiliate','affiliate']].map(([label,view])=><a key={view} href={viewHref(view)} onClick={event=>{if(!plainClick(event))return;event.preventDefault();nav(view);}}>{label}</a>)}
      {[['Cara belanja','cara'],['FAQ','faq']].map(([label,key])=><button key={key} onClick={()=>openPopup?.(key)}>{label}</button>)}
      {[['/panduan-ukuran-anak/','Panduan ukuran anak'],['/panduan/ukuran-kaos-anak/','Tabel ukuran kaos'],['/panduan/perawatan-sablon/','Perawatan sablon'],['/pengiriman/','Pengiriman'],['/retur/','Retur & penukaran'],['/kebijakan-privasi/','Kebijakan privasi']].map(([path,label])=><a key={path} href={path} onClick={event=>openGuide(event,path)}>{label}</a>)}
      <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" onClick={()=>track('contact_whatsapp_click',{location:'footer'})}>Hubungi kami ↗</a>
    </nav><div className="f-newsletter"><Overline>NEWSLETTER KAINORA</Overline><p>Tips fashion anak dan artikel terbaru melalui email.</p><a className="f-text-link" href="/blog/#newsletter">BERLANGGANAN ARTIKEL <ArrowUpRight size={21} /></a></div></div>
    <div className="f-footer-wordmark"><HalftoneWordmark text="KAINORA" /><span className="f-halftone-fallback" aria-hidden="true">KAINORA</span><svg className="f-footer-mobile-wordmark" viewBox="0 0 1000 180" aria-hidden="true" focusable="false"><text x="0" y="150" textLength="1000" lengthAdjust="spacingAndGlyphs">KAINORA</text></svg></div>
    <div className="f-footer-bottom"><span>© {new Date().getFullYear()} KAINORA KIDS</span><span>GRAPHIC TEE & FASHION ANAK / INDONESIA</span><button onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>KEMBALI KE ATAS <ArrowUp size={15} /></button></div>
  </footer>;
}
