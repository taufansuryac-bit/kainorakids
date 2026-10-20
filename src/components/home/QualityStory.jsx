/**
 * STICKY STORYTELLING — kualitas Kainora dalam 3 babak.
 * Desktop: panel foto menempel (sticky) dan "dicetak" bergantian mengikuti scroll,
 * teks di kanan berganti dengan huruf yang meluncur. Mobile: kartu bertumpuk ringan.
 */
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Ruler, Scissors, Shirt } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';
import { CheckerReveal } from '../motion/CheckerReveal';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Burst } from '../neo/Stickers';

export const QUALITY_STEPS = [
  {
    n: '01', title: 'Pemotongan Presisi', Icon: Scissors, bg: 'var(--pink)',
    body: 'Kain dipotong mengikuti arah serat bahan untuk menjaga bentuk pakaian anak tetap rapi dan tidak mudah melar.',
    img: '/images/craft/potong-bahan.jpg',
  },
  {
    n: '02', title: 'Jahitan Ekstra Kuat', Icon: Ruler, bg: 'var(--teal)',
    body: 'Dikerjakan dengan standar international pakaian anak menggunakan jahit rantai untuk menahan pergerakan aktif si kecil & Dilengkapi jahitan overdeck 3 jarum yang berfungsi membuat lebih kuat, elastis & tahan lama.',
    img: '/images/craft/detail-jahitan.jpg',
  },
  {
    n: '03', title: 'Heavyweight Cotton', Icon: Shirt, bg: 'var(--orange)',
    body: 'Setiap produk Kainora dibuat dari bahan pilihan berkualitas tinggi yang dirancang khusus untuk kenyamanan anak. Menggunakan Heavyweight Cotton 100% anti alergi.',
    img: '/images/craft/penjahit-workshop.jpg',
  },
];

const Heading = () => (
  <div>
    <p className="neo-pill mb-4 bg-brand-yellow">Kualitas Standard International</p>
    <h2 className="display text-[clamp(2.1rem,5.2vw,4.8rem)]">
      <SplitReveal text="Kualitas Premium" as="span" className="block" />
      <SplitReveal text="Setiap Sentuhan." as="span" className="block text-brand-red" delay={0.25} />
    </h2>
  </div>
);

const Desktop = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const s = Math.min(QUALITY_STEPS.length - 1, Math.max(0, Math.floor(v * QUALITY_STEPS.length * 0.999)));
    setStep((cur) => (cur === s ? cur : s));
  });
  const cur = QUALITY_STEPS[step];

  return (
    <section ref={ref} className="relative" style={{ height: `${QUALITY_STEPS.length * 100 + 40}vh` }} aria-label="Kualitas Kainora">
      <div className="sticky top-[88px] mx-auto flex h-[calc(100vh-104px)] min-h-[560px] max-w-[1500px] flex-col gap-5 px-6 py-3 xl:px-10">
        <Heading />
        <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
          {/* Foto dicetak berurutan */}
          <div className="neo-panel relative col-span-7 overflow-hidden shadow-solid-lg" style={{ background: cur.bg, transition: 'background 0.5s' }}>
            <div className="absolute inset-4 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink">
              {QUALITY_STEPS.map((s, i) => (
                <motion.img
                  key={s.img}
                  src={s.img}
                  alt={s.title}
                  className="print absolute inset-0 h-full w-full object-cover"
                  style={{ zIndex: i }}
                  initial={false}
                  animate={{ clipPath: i <= step ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                  transition={reduce ? { duration: 0 } : { duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                />
              ))}
            </div>
            <Burst fill="var(--yellow)" className="absolute -right-3 -top-3 z-10 h-24 w-24 rotate-12" textClass="text-[0.62rem]">
              {cur.n}<br />/ 03
            </Burst>
          </div>

          {/* Teks babak */}
          <div className="neo-panel col-span-5 flex min-h-0 flex-col justify-between bg-paper p-8 shadow-solid">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-arcade text-6xl leading-none text-brand-red [-webkit-text-stroke:2px_var(--ink)]">{cur.n}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink" style={{ background: cur.bg }}>
                    <cur.Icon size={26} strokeWidth={2.75} />
                  </span>
                </div>
                <SplitReveal as="h3" text={cur.title} className="display mb-4 block text-[clamp(1.8rem,3.2vw,3rem)]" stagger={0.02} amount={0} />
                <p className="text-[0.95rem] font-semibold leading-relaxed">{cur.body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-2" role="presentation">
              {QUALITY_STEPS.map((s, i) => (
                <span
                  key={s.n}
                  className="h-5 flex-1 rounded-full border-[3px] border-ink transition-colors"
                  style={{ background: i <= step ? 'repeating-conic-gradient(var(--red) 0 25%, var(--paper) 0 50%) 0 0 / 14px 14px' : 'var(--paper)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Mobile = () => (
  <section className="px-3 py-12 sm:px-6" aria-label="Kualitas Kainora">
    <div className="mx-auto max-w-2xl">
      <Heading />
      <div className="mt-8 space-y-6">
        {QUALITY_STEPS.map((s, i) => (
          <article key={s.n} className="neo-panel press overflow-hidden" style={{ background: s.bg, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
            <CheckerReveal cols={5} rows={4} className="border-b-[3px] border-ink">
              <img src={s.img} alt={s.title} loading="lazy" className="print aspect-[4/3] w-full object-cover" />
            </CheckerReveal>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-3">
                <span className="font-arcade text-3xl leading-none text-paper [-webkit-text-stroke:2px_var(--ink)]">{s.n}</span>
                <s.Icon size={22} strokeWidth={2.75} />
              </div>
              <h3 className="display mb-2 text-[1.7rem]">{s.title}</h3>
              <p className="text-[0.84rem] font-semibold leading-relaxed">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const QualityStory = () => {
  const desktop = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  return desktop ? <Desktop /> : <Mobile />;
};
