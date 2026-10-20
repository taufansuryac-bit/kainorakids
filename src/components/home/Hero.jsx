/**
 * HERO — poster neo-brutalist di atas panggung kuning dengan lantai papan catur berperspektif
 * yang terus berlari. Judul KAINORA muncul per huruf, KIDS bereaksi pada kursor, kata di
 * bawahnya berubah bentuk (gooey morph), stiker bisa diseret, dan "jendela" foto berdiri
 * utuh di atas lantai (slide hero asli, dengan kontrol & progres autoplay).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { HERO_SLIDES } from '../../constants/data';
import { SplitReveal, GooeyMorph, WeightHover, TextRoll } from '../motion/KineticText';
import { MaskReveal } from '../motion/MaskReveal';
import { DragSticker } from '../motion/DragSticker';
import { ScrambleText } from '../motion/ScrambleText';
import { CheckerFloor } from '../neo/Checker';
import { Burst, Bubble, Cloud, RotatingBadge } from '../neo/Stickers';

const SIZE = 'text-[clamp(2.7rem,15.4vw,15.2rem)]';
const DURATION = 5200;

export const Hero = ({ onShop }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const n = HERO_SLIDES.length;
  const go = useCallback((to, d = 1) => { setDir(d); setSlide(((to % n) + n) % n); }, [n]);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setTimeout(() => go(slide + 1, 1), DURATION);
    return () => clearTimeout(t);
  }, [slide, go, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const windowY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 50]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-brand-yellow">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(var(--ink) 1.2px, transparent 1.7px)', backgroundSize: '14px 14px' }} />

      <CheckerFloor height="62%" tilt={72} speed={1.9} pointer />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[5] h-3 bg-brand-green sm:h-4" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-3 pb-24 pt-6 sm:px-6 sm:pb-32 lg:px-10 lg:pt-10">
        <motion.div style={{ y: titleY }} className="relative">
          <div aria-hidden="true">
            <SplitReveal as="p" text="KAINORA" className={`display block ${SIZE}`} delay={0.2} stagger={0.045} />
          </div>
          <div className="relative grid items-end gap-5 lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <div aria-hidden="true">
                <WeightHover
                  text="KIDS"
                  className={`display block text-brand-pink ${SIZE} [-webkit-text-stroke:0.022em_var(--ink)] [text-shadow:0.04em_0.04em_0_var(--ink)]`}
                />
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <ScrambleText as="span" text="Baju Anak" className="neo-pill !text-[0.6rem] sm:!text-xs" />
                <GooeyMorph
                  texts={['KAOS KEREN', 'DRESS LUCU', 'SETELAN SERU', 'KATUN ADEM']}
                  morphTime={1.1}
                  cooldown={1.5}
                  className="display-narrow min-w-[12ch] text-[clamp(1.5rem,3.8vw,3rem)] text-brand-red"
                />
              </p>
            </div>

            <aside className="neo-panel relative bg-paper p-4 shadow-solid sm:p-5 lg:col-span-5 lg:mb-3">
              <p className="display text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[0.92]">
                Premium.<br />Adem.<br />Anti Gatal.
              </p>
              <div className="my-3 h-[3px] bg-ink" />
              <p className="text-[0.82rem] font-semibold leading-relaxed sm:text-sm">
                Baju anak 100% katun heavyweight, potongan boxy oversize ala Korea — nyaman untuk kulit sensitif dan tahan seharian bermain.
              </p>
              <button onClick={onShop} className="neo-btn roll-host mt-4 w-full sm:w-auto">
                <TextRoll>Belanja Koleksi</TextRoll> <ArrowUpRight size={16} strokeWidth={3} />
              </button>
            </aside>
          </div>
        </motion.div>

        {/* Stiker yang bisa diseret */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <DragSticker className="pointer-events-auto absolute right-[2%] top-[1%] hidden sm:block lg:right-auto lg:left-[47%] lg:top-[24%]" tilt={16}>
            <RotatingBadge text="GRATIS ONGKIR SE-JAWA" size={130} className="rotate-6" />
          </DragSticker>
          <DragSticker className="pointer-events-auto absolute right-1.5 top-[56px] sm:hidden" tilt={14}>
            <RotatingBadge text="GRATIS ONGKIR SE-JAWA" size={74} className="rotate-6" />
          </DragSticker>
        </div>

        {/* Jendela foto — utuh di atas lantai */}
        <motion.div style={{ y: windowY }} className="relative mx-auto mt-10 w-full max-w-[960px] sm:mt-14">
          <Bubble className="absolute -left-1 -top-10 z-20 h-16 w-28 -rotate-6 sm:-left-8 sm:-top-12 sm:h-20 sm:w-36" textClass="text-lg sm:text-2xl">WOW!</Bubble>
          <DragSticker className="absolute -bottom-6 -right-2 z-20 sm:-bottom-8 sm:-right-10" tilt={16}>
            <Burst fill="var(--teal)" className="h-24 w-24 rotate-12 sm:h-32 sm:w-32" textClass="text-[0.6rem] sm:text-[0.75rem]">100%<br />KATUN</Burst>
          </DragSticker>
          <DragSticker className="absolute -bottom-10 -left-4 z-20 hidden sm:block lg:-left-24" tilt={-12}>
            <Cloud width={130} className="animate-bob" />
          </DragSticker>

          <MaskReveal shape="iris" amount={0.05} delay={0.4} className="rounded-[18px] shadow-solid-lg">
            <div className="neo-panel overflow-hidden bg-paper">
              <div className="flex items-center gap-2 border-b-[3px] border-ink bg-brand-pink px-3 py-2">
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-red" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-yellow" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-green" />
                <span className="font-arcade ml-2 truncate text-[0.58rem] uppercase tracking-wider sm:text-[0.66rem]">kainorakids.com / new-drop</span>
                <span className="font-arcade ml-auto rounded-full border-[2.5px] border-ink bg-paper px-2.5 py-0.5 text-[0.6rem]">{String(slide + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}</span>
              </div>

              <div className="relative aspect-[4/3] bg-ink sm:aspect-[16/9]">
                <AnimatePresence initial={false} custom={dir}>
                  <motion.div
                    key={slide}
                    className="absolute inset-0"
                    initial={reduce ? false : { clipPath: 'circle(0% at 50% 50%)' }}
                    animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                    exit={{ opacity: 1, transition: { delay: 1 } }}
                    transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src={HERO_SLIDES[slide].media}
                      alt="Model baju anak premium terbaru"
                      className="print h-full w-full object-cover"
                      fetchPriority={slide === 0 ? 'high' : undefined}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 border-t-[3px] border-ink bg-paper p-2.5 sm:p-3">
                <button onClick={() => go(slide - 1, -1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-brand-yellow transition-transform hover:-translate-x-0.5 active:scale-90" aria-label="Slide sebelumnya">
                  <ArrowLeft size={18} strokeWidth={3} />
                </button>
                <div className="flex flex-1 gap-2" role="tablist" aria-label="Pilih slide">
                  {HERO_SLIDES.map((s, i) => (
                    <button key={s.id} onClick={() => go(i, i > slide ? 1 : -1)} role="tab" aria-selected={i === slide} aria-label={`Slide ${i + 1}`} className="relative h-4 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-paper">
                      {i === slide && (
                        <motion.span
                          key={`p-${slide}`}
                          className="absolute inset-y-0 left-0"
                          style={{ background: 'repeating-conic-gradient(var(--red) 0 25%, var(--paper) 0 50%) 0 0 / 12px 12px' }}
                          initial={{ width: reduce ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: reduce ? 0 : DURATION / 1000, ease: 'linear' }}
                        />
                      )}
                      {i < slide && <span className="absolute inset-0 bg-ink" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(slide + 1, 1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-brand-yellow transition-transform hover:translate-x-0.5 active:scale-90" aria-label="Slide berikutnya">
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </MaskReveal>
        </motion.div>
      </div>
    </section>
  );
};
