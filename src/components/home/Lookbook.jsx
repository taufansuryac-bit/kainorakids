/**
 * LOOKBOOK — dua panel editorial sejajar (Boys / Girls) di atas blok warna pink.
 * Klik membuka katalog dengan filter gender (perilaku asli dipertahankan).
 */
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal, WeightHover } from '../motion/KineticText';
import { ScrambleText } from '../motion/ScrambleText';
import { MaskReveal } from '../motion/MaskReveal';
import { DragSticker } from '../motion/DragSticker';
import { CheckerStrip } from '../neo/Checker';
import { Burst } from '../neo/Stickers';

const LOOKS = [
  { key: 'Laki-laki', word: 'BOYS', sub: 'Anak Laki-laki', alt: 'Baju anak laki-laki premium', img: '/images/shop/shop-for-boys.jpg', bg: 'var(--blue)', burst: 'var(--yellow)', shape: 'iris' },
  { key: 'Perempuan', word: 'GIRLS', sub: 'Anak Perempuan', alt: 'Baju dress anak perempuan', img: '/images/shop/shop-for-girl.jpg', bg: 'var(--yellow)', burst: 'var(--teal)', shape: 'star' },
];

export const Lookbook = ({ onPick }) => (
  <section className="border-y-[3px] border-ink bg-brand-pink" aria-labelledby="lookbook-title">
    <CheckerStrip size={14} tone="ink" />
    <div className="mx-auto max-w-[1500px] px-3 py-14 sm:px-6 sm:py-20 lg:px-10">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <ScrambleText as="p" text="Pilih gaya si kecil" className="neo-pill mb-4 bg-paper" />
          <h2 id="lookbook-title" className="display text-[clamp(2.2rem,5.6vw,5.6rem)]">
            <SplitReveal text="Shop The" className="block" />
            <SplitReveal text="Lookbook" className="block text-paper [-webkit-text-stroke:0.02em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]" delay={0.2} />
          </h2>
        </div>
        <p className="max-w-xs text-sm font-semibold leading-relaxed">Dari kaos boxy sampai dress ruffle — koleksi yang nyaman dipakai seharian bermain.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {LOOKS.map((l) => (
          <button
            key={l.key}
            onClick={() => onPick(l.key)}
            className="neo-panel press group relative block w-full text-left"
            style={{ background: l.bg }}
            aria-label={`Lihat koleksi ${l.sub}`}
          >
            <div className="p-3 sm:p-4">
              <MaskReveal shape={l.shape} amount={0.2} className="overflow-hidden rounded-xl border-[3px] border-ink">
                <img src={l.img} alt={l.alt} loading="lazy" className="print aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </MaskReveal>
            </div>

            <div className="flex items-end justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="pointer-events-none">
                <p className="font-arcade mb-1 text-[0.68rem] uppercase tracking-[0.16em]">{l.sub}</p>
                <WeightHover text={l.word} className="display block text-[clamp(3.6rem,10vw,8.4rem)] text-paper [-webkit-text-stroke:0.02em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]" />
              </div>
              <span className="mb-1 grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                <ArrowUpRight size={26} strokeWidth={3} />
              </span>
            </div>

            <DragSticker className="absolute -right-2 -top-4 z-10 sm:-right-5" tilt={20}>
              <Burst fill={l.burst} className="h-24 w-24 rotate-12 sm:h-28 sm:w-28" textClass="text-[0.6rem] sm:text-[0.7rem]">LIHAT<br />KOLEKSI</Burst>
            </DragSticker>
          </button>
        ))}
      </div>
    </div>
    <CheckerStrip size={14} tone="ink" />
  </section>
);
