/**
 * KUALITAS — kartu bertumpuk (sticky stacking): tiap babak menempel lalu ditimpa babak
 * berikutnya sementara kartu di bawahnya menyusut. Setiap kartu utuh (foto + angka raksasa +
 * judul + deskripsi + chip spesifikasi), foto muncul dengan bentuk mask berbeda per babak.
 */
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Check, Ruler, Scissors, Shirt } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';
import { ScrambleText } from '../motion/ScrambleText';
import { MaskReveal } from '../motion/MaskReveal';
import { DragSticker } from '../motion/DragSticker';
import { CheckerStrip } from '../neo/Checker';
import { Burst } from '../neo/Stickers';

export const QUALITY_STEPS = [
  {
    n: '01', title: 'Pemotongan Presisi', Icon: Scissors, bg: 'var(--pink)', shape: 'iris',
    body: 'Kain dipotong mengikuti arah serat bahan untuk menjaga bentuk pakaian anak tetap rapi dan tidak mudah melar.',
    img: '/images/craft/potong-bahan.jpg',
    chips: ['Searah serat', 'Anti melar', 'Bentuk rapi'],
  },
  {
    n: '02', title: 'Jahitan Ekstra Kuat', Icon: Ruler, bg: 'var(--yellow)', shape: 'blinds',
    body: 'Dikerjakan dengan standar international pakaian anak menggunakan jahit rantai untuk menahan pergerakan aktif si kecil & Dilengkapi jahitan overdeck 3 jarum yang berfungsi membuat lebih kuat, elastis & tahan lama.',
    img: '/images/craft/detail-jahitan.jpg',
    chips: ['Jahit rantai', 'Overdeck 3 jarum', 'Elastis'],
  },
  {
    n: '03', title: 'Heavyweight Cotton', Icon: Shirt, bg: 'var(--orange)', shape: 'diag',
    body: 'Setiap produk Kainora dibuat dari bahan pilihan berkualitas tinggi yang dirancang khusus untuk kenyamanan anak. Menggunakan Heavyweight Cotton 100% anti alergi.',
    img: '/images/craft/penjahit-workshop.jpg',
    chips: ['100% cotton', '16s–24s', 'Anti alergi'],
  },
];

const TOP = 92;

const Card = ({ step, i, n, progress }) => {
  const reduce = useReducedMotion();
  const to = 1 - (n - 1 - i) * 0.05;
  const scale = useTransform(progress, [i / n, 1], [1, reduce ? 1 : to]);

  return (
    <div className="sticky flex items-start" style={{ top: TOP + i * 14, height: `max(560px, calc(100svh - ${TOP + 24}px))` }}>
      <motion.article style={{ scale, transformOrigin: '50% 0%' }} className="neo-panel grid w-full overflow-hidden bg-paper shadow-solid-lg md:h-[min(68vh,600px)] md:grid-cols-12">
        <div className="relative border-b-[3px] border-ink md:col-span-6 md:border-b-0 md:border-r-[3px]" style={{ background: step.bg }}>
          <div className="h-full p-3 sm:p-4">
            <MaskReveal shape={step.shape} amount={0.25} className="h-full overflow-hidden rounded-xl border-[3px] border-ink">
              <img src={step.img} alt={step.title} loading="lazy" className="print aspect-[16/10] h-full w-full object-cover md:aspect-auto" />
            </MaskReveal>
          </div>
          <DragSticker className="absolute -right-2 top-2 z-10 sm:right-1 sm:top-3" tilt={18}>
            <Burst fill="var(--paper)" className="h-20 w-20 rotate-12 sm:h-24 sm:w-24" textClass="text-[0.6rem]">STEP<br />{step.n}</Burst>
          </DragSticker>
        </div>

        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7 md:col-span-6 lg:p-9">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-arcade text-[clamp(3.4rem,7vw,6rem)] leading-none text-brand-red [-webkit-text-stroke:2.5px_var(--ink)]">{step.n}</span>
              <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink" style={{ background: step.bg }}>
                <step.Icon size={26} strokeWidth={2.75} />
              </span>
            </div>
            <SplitReveal as="h3" text={step.title} className="display mb-4 block text-[clamp(1.9rem,3.6vw,3.2rem)]" stagger={0.02} amount={0.4} />
            <p className="max-w-[46ch] text-[0.92rem] font-semibold leading-relaxed">{step.body}</p>
          </div>
          <div>
            <ul className="mb-5 overflow-hidden rounded-xl border-[3px] border-ink bg-paper">
              {step.chips.map((c, k) => (
                <li key={c} className="flex items-center gap-3 border-ink px-3 py-2.5 sm:px-4 [&:not(:last-child)]:border-b-[3px]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border-[3px] border-ink" style={{ background: step.bg }}><Check size={15} strokeWidth={4} /></span>
                  <span className="display-narrow flex-1 text-[1.05rem] sm:text-[1.2rem]">{c}</span>
                  <span className="font-arcade text-xs opacity-60">{String(k + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
            <CheckerStrip size={9} tone="ink" />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export const QualityStory = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = QUALITY_STEPS.length;

  return (
    <section className="relative border-y-[3px] border-ink bg-brand-teal" aria-labelledby="quality-title">
      <CheckerStrip size={14} tone="ink" />
      <div className="mx-auto max-w-[1500px] px-3 pt-14 sm:px-6 sm:pt-20 lg:px-10">
        <div className="relative mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-end">
          <div>
            <ScrambleText as="p" text="Kualitas Standard International" className="neo-pill mb-4 bg-brand-yellow" />
            <h2 id="quality-title" className="display text-[clamp(2.2rem,5.6vw,5.6rem)]">
              <SplitReveal text="Kualitas Premium" className="block" />
              <SplitReveal text="Setiap Sentuhan." className="block text-paper [-webkit-text-stroke:0.02em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]" delay={0.25} />
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="max-w-xs text-sm font-semibold leading-relaxed">Tiga langkah yang kami jaga di setiap potong: dari memotong kain, menjahit, sampai memilih bahan.</p>
            <DragSticker tilt={14} className="hidden shrink-0 sm:block">
              <Burst fill="var(--yellow)" className="h-24 w-24 rotate-12" textClass="text-[0.62rem]">3<br />LANGKAH</Burst>
            </DragSticker>
          </div>
        </div>
      </div>

      <div ref={ref} className="mx-auto max-w-[1500px] px-3 pb-20 sm:px-6 lg:px-10">
        {QUALITY_STEPS.map((s, i) => (
          <Card key={s.n} step={s} i={i} n={n} progress={scrollYProgress} />
        ))}
      </div>
      <CheckerStrip size={14} tone="ink" />
    </section>
  );
};
