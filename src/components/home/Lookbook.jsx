import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';

const LOOKS = [
  { key: 'Laki-laki', word: 'THE BOYS', sub: 'Koleksi anak laki-laki', img: '/shop-boys.jpg', bg: 'var(--orange)', position: '50% 47%' },
  { key: 'Perempuan', word: 'THE GIRLS', sub: 'Koleksi anak perempuan', img: '/shop-girl.jpg', bg: 'var(--pink)', position: '50% 47%' },
];

export const Lookbook = ({ onPick }) => (
  <section className="editorial-wrap category-section" aria-labelledby="lookbook-title">
    <div className="section-heading"><div><p className="eyebrow">PILIH KATEGORI</p><h2 id="lookbook-title" className="section-title"><SplitReveal text="KOLEKSI FASHION ANAK" /></h2></div><button onClick={() => onPick('Semua')} className="outline-link">Semua Koleksi <ArrowUpRight size={18} /></button></div>
    <div className="category-grid">
      {LOOKS.map((l, i) => <button key={l.key} onClick={() => onPick(l.key)} className="category-card group" style={{ background: l.bg }} aria-label={`Lihat koleksi ${l.word}`}>

        <span className="category-doodle" aria-hidden="true">{i % 2 ? '↗' : '✳'}</span>
        <div className="category-photo"><img src={l.img} alt={l.sub} loading="lazy" style={{ objectPosition: l.position }} /></div>
        <span className="category-label"><span><b>{l.word}</b><small>{l.sub}</small></span><span className="category-arrow"><ArrowRight size={20} /></span></span>
      </button>)}
    </div>
  </section>
);
