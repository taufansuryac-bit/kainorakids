/**
 * LOOKBOOK — dua panel editorial (Boys / Girls) dengan komposisi asimetris.
 * Klik membuka katalog dengan filter gender (perilaku asli dipertahankan).
 */
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal, WeightHover } from '../motion/KineticText';
import { CheckerReveal } from '../motion/CheckerReveal';
import { Burst } from '../neo/Stickers';

const LOOKS = [
  { key: 'Laki-laki', word: 'BOYS', sub: 'Anak Laki-laki', alt: 'Baju anak laki-laki premium', img: '/images/shop/shop-for-boys.jpg', bg: 'var(--blue)', rot: -1.2, offset: '', burst: 'var(--yellow)' },
  { key: 'Perempuan', word: 'GIRLS', sub: 'Anak Perempuan', alt: 'Baju dress anak perempuan', img: '/images/shop/shop-for-girl.jpg', bg: 'var(--pink)', rot: 1.2, offset: 'md:mt-20', burst: 'var(--teal)' },
];

export const Lookbook = ({ onPick }) => (
  <section className="mx-auto max-w-[1500px] px-3 py-16 sm:px-6 lg:px-10" aria-labelledby="lookbook-title">
    <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <h2 id="lookbook-title" className="display text-[clamp(2.3rem,7vw,6.2rem)]">
        <SplitReveal text="Shop The" className="block" />
        <SplitReveal text="Lookbook" className="block text-brand-red" delay={0.2} />
      </h2>
      <p className="neo-pill max-w-xs !whitespace-normal bg-paper !text-[0.68rem] leading-snug">Pilih gaya si kecil — dari kaos boxy sampai dress ruffle.</p>
    </div>

    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {LOOKS.map((l, i) => (
        <button
          key={l.key}
          onClick={() => onPick(l.key)}
          className={`neo-panel press group relative block w-full overflow-visible text-left ${l.offset}`}
          style={{ background: l.bg, rotate: `${l.rot}deg` }}
          aria-label={`Lihat koleksi ${l.sub}`}
        >
          <div className="p-3 sm:p-4">
            <CheckerReveal cols={6} rows={5} delay={i * 0.15} className="rounded-2xl border-[3px] border-ink">
              <img src={l.img} alt={l.alt} loading="lazy" className="print aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-[5/4]" />
            </CheckerReveal>
          </div>

          <div className="pointer-events-none absolute -bottom-6 left-3 right-3 flex items-end justify-between sm:-bottom-10 sm:left-5">
            <WeightHover
              text={l.word}
              className="display block text-[clamp(4.4rem,13vw,11rem)] text-paper [-webkit-text-stroke:0.02em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]"
            />
          </div>

          <Burst
            fill={l.burst}
            className="absolute -right-3 -top-5 z-10 h-24 w-24 rotate-12 transition-transform duration-300 group-hover:rotate-[24deg] group-hover:scale-110 sm:-right-6 sm:h-32 sm:w-32"
            textClass="text-[0.6rem] sm:text-[0.72rem]"
          >
            LIHAT<br />KOLEKSI
          </Burst>

          <span className="absolute bottom-3 right-3 z-10 grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink bg-paper transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:bottom-5 sm:right-5">
            <ArrowUpRight size={24} strokeWidth={3} />
          </span>
          <div className="h-10 sm:h-14" />
        </button>
      ))}
    </div>
  </section>
);
