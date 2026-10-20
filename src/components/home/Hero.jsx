/**
 * HERO — poster neo-brutalist di atas panggung kuning dengan lantai papan catur
 * berperspektif. Judul raksasa bergerak per huruf, kata morf cair, awan bermata,
 * lencana berputar, dan "jendela" slider (slide hero asli) berdiri di atas lantai.
 */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { HERO_SLIDES } from '../../constants/data';
import { SplitReveal, GooeyMorph, WeightHover } from '../motion/KineticText';
import { CheckerReveal } from '../motion/CheckerReveal';
import { CheckerFloor } from '../neo/Checker';
import { Burst, Bubble, Cloud, RotatingBadge } from '../neo/Stickers';

const SIZE = 'text-[clamp(2.7rem,15.4vw,15.2rem)]';

export const Hero = ({ onShop }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const windowY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-brand-yellow">
      {/* cetak halftone tipis di kanvas kuning */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'radial-gradient(var(--ink) 1.2px, transparent 1.7px)', backgroundSize: '14px 14px' }} />

      <CheckerFloor height="58%" tilt={72} speed={1.9} pointer />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[5] h-3 bg-brand-green sm:h-4" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-3 pb-20 pt-6 sm:px-6 sm:pb-28 lg:px-10 lg:pt-10">
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
              <p className="display-narrow mt-2 flex flex-wrap items-center gap-x-3 text-[clamp(1.25rem,3.6vw,2.7rem)]">
                <span className="neo-pill !text-[0.6rem] sm:!text-xs">Baju Anak</span>
                <GooeyMorph texts={['KAOS KEREN', 'DRESS LUCU', 'SETELAN SERU', 'KATUN ADEM']} className="min-w-[11ch] text-brand-red" />
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
                Belanja Koleksi <ArrowUpRight size={16} strokeWidth={3} />
              </button>
            </aside>
          </div>
        </motion.div>

        {/* Stiker melayang */}
        <motion.div style={{ y: cloudY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
          <RotatingBadge text="GRATIS ONGKIR SE-JAWA" size={132} className="absolute right-[2%] top-[2%] hidden rotate-6 sm:block lg:right-auto lg:left-[47%] lg:top-[30%] lg:!h-[150px] lg:!w-[150px]" />
          <RotatingBadge text="GRATIS ONGKIR SE-JAWA" size={74} className="absolute right-1.5 top-[56px] rotate-6 sm:hidden" />
          <Cloud width={150} className="absolute left-[2%] top-[46%] hidden animate-bob lg:block" />
          <Cloud width={96} fill="var(--pink)" className="absolute right-[4%] top-[52%] animate-bob [animation-delay:-2s] max-sm:hidden" />
        </motion.div>

        {/* Jendela slider berdiri di atas lantai */}
        <motion.div style={{ y: windowY }} className="relative mx-auto mt-10 w-full max-w-[940px] sm:mt-14">
          <Bubble className="absolute -left-1 -top-10 z-20 h-16 w-28 -rotate-6 sm:-left-8 sm:-top-12 sm:h-20 sm:w-36" textClass="text-lg sm:text-2xl">WOW!</Bubble>
          <Burst fill="var(--teal)" className="absolute -bottom-6 -right-2 z-20 h-24 w-24 rotate-12 sm:-bottom-8 sm:-right-10 sm:h-32 sm:w-32" textClass="text-[0.6rem] sm:text-[0.75rem]">100%<br />KATUN</Burst>

          <CheckerReveal cols={8} rows={4} delay={0.9} amount={0.08} color="var(--ink)" color2="var(--red)" className="rounded-[22px] shadow-solid-lg">
            <div className="neo-panel overflow-hidden bg-paper">
              <div className="flex items-center gap-2 border-b-[3px] border-ink bg-brand-pink px-3 py-2">
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-red" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-yellow" />
                <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-ink bg-brand-green" />
                <span className="font-arcade ml-2 truncate text-[0.58rem] uppercase tracking-wider sm:text-[0.66rem]">kainorakids.com / new-drop</span>
              </div>
              <div className="relative aspect-[4/3] bg-ink sm:aspect-[16/9]">
                <AnimatePresence initial={false}>
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
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {HERO_SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      aria-current={i === slide}
                      className={`h-3.5 rounded-full border-[2.5px] border-ink transition-all ${i === slide ? 'w-9 bg-brand-yellow' : 'w-3.5 bg-paper'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CheckerReveal>
        </motion.div>
      </div>
    </section>
  );
};
