import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Shirt, Truck } from 'lucide-react';
import { SplitReveal, TextRoll } from '../motion/KineticText';
import { Flower, RotatingBadge } from '../neo/Stickers';
import { HERO_SLIDES } from '../../constants/data';

const EDITORIAL = [
  { media: '/shop-boys.jpg', alt: 'Kaos Breakfast Morning Club Kainora Kids dipakai anak dengan celana motif' },
  { media: '/shop-girl.jpg', alt: 'Kaos grafis Kainora Kids dengan motif camilan dan gaya anak perempuan' },
  ...HERO_SLIDES.map((slide) => ({ media: slide.media, alt: 'Inspirasi gaya pakaian anak Kainora Kids' })),
];

export const Hero = ({ onShop }) => {
  const [slide, setSlide] = useState(0);
  const go = (direction) => setSlide((current) => (current + direction + EDITORIAL.length) % EDITORIAL.length);

  return (
    <section className="poster-hero editorial-wrap" aria-labelledby="hero-title">
      <div className="poster-masthead">
        <div className="poster-wordmark">
          <p className="eyebrow">BIG PERSONALITY. LITTLE CLOTHES.</p>
          <h1 id="hero-title" aria-label="Kainora Kids Club. Baju anak untuk setiap petualangan.">
            <SplitReveal text="KAINORA" mode="flip" stagger={0.025} />
            <SplitReveal text="KIDS CLUB." delay={0.12} stagger={0.02} />
          </h1>
        </div>
        <aside className="poster-manifesto">
          <RotatingBadge text="SMALL FITS • BIG DAYS" size={95} fill="var(--teal)" className="poster-badge" />
          <h2>BAJU SERU.<br />BUAT MAIN<br />TERUS.</h2>
          <p>Graphic tee oversize anak dengan pilihan motif grafis. Lihat ukuran dan detail bahan pada setiap produk.</p>
          <button onClick={onShop} className="poster-shop-link roll-host"><TextRoll>Jelajahi koleksi</TextRoll><ArrowUpRight size={16} /></button>
        </aside>
      </div>

      <div className="poster-panels">
        <div className="poster-editorial">
          <div className="poster-panel-label"><span>THE EVERYDAY PLAY CLUB</span><span>NO BORING DAYS ↗</span></div>
          <div className="poster-editorial-photo"><img src={EDITORIAL[slide].media} alt={EDITORIAL[slide].alt} /><span className="poster-photo-sticker">GO OUT.<br />MAKE STORIES.</span></div>
          <div className="poster-photo-caption"><span>GRAPHIC TEE OVERSIZE ANAK</span><div><span>{String(slide + 1).padStart(2, '0')} / {String(EDITORIAL.length).padStart(2, '0')}</span><button onClick={() => go(-1)} aria-label="Foto editorial sebelumnya"><ArrowLeft size={17} /></button><button onClick={() => go(1)} aria-label="Foto editorial berikutnya"><ArrowRight size={17} /></button></div></div>
        </div>
        <div className="poster-side">
          <div className="poster-happy"><span>GOOD DAYS<br />START HERE.</span><Flower size={57} /></div>
          <button className="poster-sunshine" onClick={onShop} aria-label="Jelajahi koleksi kaos grafis Kainora Kids"><img src="/PRODUCT/sunshine-2.jpg" alt="Detail depan dan belakang kaos You're My Sunshine Kainora Kids" /><span className="sunshine-label"><span>WEAR A LITTLE<br /><b>SUNSHINE.</b></span><ArrowUpRight size={27} /></span></button>
        </div>
      </div>

      <div className="poster-perks" aria-label="Keunggulan Kainora Kids">
        <div><Shirt size={21} /><span>100% KATUN<br /><small>Nyaman dipakai</small></span></div>
        <div><Heart size={21} /><span>BOXY & OVERSIZE<br /><small>Bebas bergerak</small></span></div>
        <div><Flower size={27} /><span>PILIHAN MOTIF GRAFIS<br /><small>Lihat detail motif</small></span></div>
        <div><Truck size={23} /><span>GRATIS ONGKIR<br /><small>Se-Jawa</small></span></div>
      </div>
    </section>
  );
};
