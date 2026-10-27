import { useState } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WA_NUMBER } from '../../config/shop';
import { HalftoneWordmark } from '../neo/HalftoneWordmark';
import { Overline } from './motion';
import { openGuide } from '../../utils/guideLinks';
import { plainClick, viewHref } from '../../utils/productRoutes';
import { track } from '../../utils/analytics';

export function HalftoneFooter({ openPopup }) {
  const { setView, setGlobalGenderFilter } = useStore();
  const [message, setMessage] = useState('');
  const nav = (view) => { if (view === 'products') setGlobalGenderFilter('Semua'); setView(view); };
  return <footer data-section="11" className="f-footer f-inset" aria-label="Footer Kainora Kids"><div className="f-footer-top"><div className="f-footer-intro"><Overline>11 / THE NEXT CHAPTER</Overline><h2>GOOD THINGS.<br />STILL COMING.</h2><a href="https://www.instagram.com/kainorakids/" target="_blank" rel="noreferrer" className="f-text-link">FOLLOW THE MOVEMENT <ArrowUpRight size={18} /></a></div><nav className="f-footer-links" aria-label="Navigasi footer"><Overline>EXPLORE</Overline>{[['Koleksi', 'products'], ['Beranda', 'home'], ['Journal', 'blog'], ['Affiliate', 'affiliate']].map(([label, view]) => <a key={view} href={viewHref(view)} onClick={event => { if (!plainClick(event)) return; event.preventDefault(); nav(view); }}>{label}</a>)}</nav><nav className="f-footer-links" aria-label="Bantuan toko"><Overline>HERE TO HELP</Overline>{[['Cara belanja', 'cara'], ['FAQ', 'faq']].map(([label, key]) => <button key={key} onClick={() => openPopup?.(key)}>{label}</button>)}{[['/panduan-ukuran-anak/','Studio ukuran anak'],['/panduan/ukuran-kaos-anak/','Size chart Kainora'],['/panduan/perawatan-sablon/','Perawatan sablon'],['/pengiriman/','Pengiriman'],['/retur/','Retur & penukaran'],['/kebijakan-privasi/','Kebijakan privasi']].map(([path,label])=><a key={path} href={path} onClick={e=>openGuide(e,path)}>{label}</a>)}<a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" onClick={() => track('contact_whatsapp_click', { location: 'footer' })}>Hubungi kami ↗</a></nav><div className="f-newsletter"><Overline>STAY IN THE LOOP</Overline><p>Kabar kecil. Hal-hal baru.</p><form onSubmit={e => { e.preventDefault(); setMessage('Email valid. Newsletter belum dibuka; email Anda tidak dikirim.'); }}><label className="sr-only" htmlFor="f-news-email">Alamat email newsletter</label><input id="f-news-email" type="email" required autoComplete="email" placeholder="Alamat email Anda" /><button aria-label="Periksa email newsletter" type="submit"><ArrowUpRight size={21} /></button></form><p className="f-newsletter-note">Pratinjau formulir. Pendaftaran belum dibuka.</p><p className="f-newsletter-message" role="status">{message}</p></div></div>
    <div className="f-footer-wordmark"><HalftoneWordmark text="KAINORA" /><span className="f-halftone-fallback" aria-hidden="true">KAINORA</span><svg className="f-footer-mobile-wordmark" viewBox="0 0 1000 180" aria-hidden="true" focusable="false"><text x="0" y="150" textLength="1000" lengthAdjust="spacingAndGlyphs">KAINORA</text></svg></div>
    <div className="f-footer-bottom"><span>© {new Date().getFullYear()} KAINORA KIDS</span><span>INDEPENDENT KIDSWEAR / INDONESIA</span><button onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>BACK TO TOP <ArrowUp size={15} /></button></div>
  </footer>;
}
