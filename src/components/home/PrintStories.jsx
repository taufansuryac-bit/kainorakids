import { ArrowUpRight } from 'lucide-react';

const PRINTS = [
  { name: 'SUNSHINE CLUB', sub: 'Sedikit matahari untuk hari yang ramai.', img: '/PRODUCT/sunshine-2.jpg', color: 'var(--yellow)' },
  { name: 'BREAKFAST CREW', sub: 'Petualangan seru dimulai sejak pagi.', img: '/PRODUCT/breakfastmorning-2.jpg', color: 'var(--pink)' },
  { name: 'KIDS CLUB', sub: 'Banyak ide. Banyak cerita. Banyak main.', img: '/PRODUCT/kidsclub-1.jpg', color: 'var(--teal)' },
];

export const PrintStories = ({ onShop }) => (
  <section className="print-stories editorial-wrap" aria-labelledby="prints-title">
    <div className="section-heading"><div><p className="eyebrow">PRINTS WITH PERSONALITY</p><h2 id="prints-title" className="section-title">KAOSNYA PUNYA CERITA.</h2></div><button className="outline-link" onClick={onShop}>Jelajahi Katalog <ArrowUpRight size={18} /></button></div>
    <div className="print-story-grid">{PRINTS.map((print, index) => <button key={print.name} className="print-story" onClick={onShop} style={{ '--print-color': print.color }} aria-label={`Inspirasi motif ${print.name}, jelajahi katalog`}><div className={`print-story-photo ${index === 2 ? 'print-story-photo--flatlay' : ''}`}><img src={print.img} alt={`Detail motif kaos Kainora Kids ${print.name}`} loading="lazy" /><span>0{index + 1} / THE GRAPHIC EDIT</span></div><div className="print-story-copy"><h3>{print.name}</h3><p>{print.sub}</p><ArrowUpRight size={23} /></div></button>)}</div>
    <p className="print-story-note">Inspirasi motif Kainora. Pilihan produk, ukuran, dan harga tersedia di katalog.</p>
  </section>
);
