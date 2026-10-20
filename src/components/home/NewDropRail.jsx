/**
 * KOLEKSI TERBARU — desktop: rail horizontal yang "dipin"; scroll vertikal menggeser kartu ke samping.
 * Mobile/tablet: grid biasa (tanpa scroll-jacking). Logika produk 7 hari terakhir ada di HomeView.
 */
import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { ProductCard } from '../neo/ProductCard';
import { SplitReveal, TextRoll } from '../motion/KineticText';
import { ScrambleText } from '../motion/ScrambleText';
import { DragSticker } from '../motion/DragSticker';
import { Burst, Flower } from '../neo/Stickers';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Head = () => (
  <div>
    <ScrambleText as="p" text="Ditambahkan 7 Hari Terakhir" className="neo-pill mb-4 bg-paper" />
    <h2 id="newdrop" className="display text-[clamp(2.2rem,5.6vw,5.6rem)]">
      <SplitReveal text="Koleksi" className="block" />
      <SplitReveal text="Terbaru" className="block text-brand-red" delay={0.2} />
    </h2>
  </div>
);

const Empty = () => (
  <div className="neo-panel bg-paper py-16 text-center shadow-solid-sm">
    <Search size={40} className="mx-auto mb-4" strokeWidth={2.5} />
    <p className="display text-2xl">Belum ada baju baru minggu ini.</p>
    <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-70">Cek katalog untuk koleksi lainnya Bunda!</p>
  </div>
);

const Rail = ({ products, wishlist, onToggleWishlist, onOpen, onAll }) => {
  const reduce = useReducedMotion();
  const wrap = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const barW = useTransform(scrollYProgress, [0, 1], ['6%', '100%']);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [products.length]);

  return (
    <div ref={wrap} style={{ height: `calc(100svh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[88px]">
        <motion.div ref={track} style={{ x: reduce ? 0 : x }} className="flex w-max items-stretch gap-6 px-10 will-change-transform">
          <div className="flex w-[min(34vw,520px)] shrink-0 flex-col justify-between gap-6 pr-6">
            <Head />
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[26ch] text-sm font-semibold leading-relaxed">Geser scroll untuk menjelajah koleksi paling baru — {products.length} model segar minggu ini.</p>
              <button onClick={onAll} className="neo-btn roll-host"><TextRoll>Lihat Semua Katalog</TextRoll> <ArrowUpRight size={16} strokeWidth={3} /></button>
            </div>
          </div>

          {products.map((p, idx) => (
            <div key={p.id} className="w-[300px] shrink-0 xl:w-[330px]">
              <ProductCard product={p} index={idx} onOpen={onOpen} wishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
            </div>
          ))}

          <button onClick={onAll} className="neo-panel press group relative flex w-[300px] shrink-0 flex-col items-center justify-center gap-4 overflow-hidden bg-brand-yellow p-8 text-center xl:w-[330px]">
            <Flower size={92} className="animate-bob" />
            <span className="display text-4xl">Masih<br />Banyak<br />Lagi!</span>
            <span className="neo-pill bg-paper">Buka katalog <ArrowUpRight size={14} strokeWidth={3} /></span>
          </button>
        </motion.div>

        <div className="mx-10 mt-8 h-5 overflow-hidden rounded-full border-[3px] border-ink bg-paper" aria-hidden="true">
          <motion.div className="h-full" style={{ width: barW, background: 'repeating-conic-gradient(var(--red) 0 25%, var(--paper) 0 50%) 0 0 / 14px 14px' }} />
        </div>
      </div>
    </div>
  );
};

export const NewDropRail = ({ products, wishlist, onToggleWishlist, onOpen, onAll }) => {
  const desktop = useMediaQuery('(min-width: 1024px) and (min-height: 620px)');

  if (!products.length) {
    return (
      <section className="mx-auto max-w-[1500px] px-3 py-16 sm:px-6 lg:px-10" aria-labelledby="newdrop">
        <div className="mb-8"><Head /></div>
        <Empty />
      </section>
    );
  }

  if (desktop) {
    return (
      <section className="relative" aria-labelledby="newdrop">
        <Rail products={products} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onOpen={onOpen} onAll={onAll} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1500px] px-3 py-16 sm:px-6 lg:px-10" aria-labelledby="newdrop">
      <div className="relative mb-8 flex items-end justify-between gap-4">
        <Head />
        <DragSticker tilt={14} className="hidden shrink-0 sm:block">
          <Burst fill="var(--pink)" className="h-24 w-24 rotate-12" textClass="text-[0.62rem]">NEW<br />DROP!</Burst>
        </DragSticker>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 md:gap-6">
        {products.map((p, idx) => (
          <ProductCard key={p.id} product={p} index={idx} onOpen={onOpen} wishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
        ))}
      </div>
      <div className="mt-8">
        <button onClick={onAll} className="neo-btn neo-btn--ink w-full sm:w-auto">Lihat Semua Katalog <ArrowUpRight size={16} strokeWidth={3} /></button>
      </div>
    </section>
  );
};
