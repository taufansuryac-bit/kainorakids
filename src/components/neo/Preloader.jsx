/**
 * Preloader tipografi eksperimental: kata KAINORA disusun ulang lewat berbagai
 * perawatan huruf (cetak tebal, arcade, piksel, stiker, ransom-note) sambil
 * penghitung naik ke 100, lalu tirai papan catur membuka situs.
 * Tampil sekali per sesi; dilewati bila pengguna memilih reduced-motion.
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { TypeRemix } from '../motion/KineticText';
import { CheckerWipe } from '../motion/CheckerWipe';
import { CheckerFloor, CheckerStrip } from './Checker';
import { Burst, Cloud } from './Stickers';

const KEY = 'kk_preloader_seen';
const MIN_MS = 2300;
const MAX_MS = 5000;

export const shouldShowPreloader = () => {
  try {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

export const Preloader = ({ onDone }) => {
  const reduce = useReducedMotion();
  const [p, setP] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading → covering → revealing
  const fontsReady = useRef(false);
  const start = useRef(performance.now());

  useEffect(() => {
    if (reduce) { onDone(); return undefined; }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (document.fonts?.ready || Promise.resolve()).then(() => { fontsReady.current = true; });

    let raf = 0;
    const loop = (now) => {
      const t = now - start.current;
      const ramp = Math.min(t / MIN_MS, 1);
      // tahan di 92% sampai font siap (atau batas waktu), supaya hitungan jujur
      const gate = fontsReady.current || t > MAX_MS ? 1 : 0.92;
      const eased = 1 - Math.pow(1 - ramp, 2.2);
      const target = Math.min(eased, gate);
      setP((cur) => (target > cur ? target : cur));
      if (target >= 1) { setPhase((ph) => (ph === 'loading' ? 'covering' : ph)); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = prevOverflow; };
  }, [reduce, onDone]);

  const finish = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* sessionStorage bisa diblokir */ }
    document.body.style.overflow = '';
    onDone();
  };

  const pct = Math.round(p * 100);
  const hidden = phase === 'revealing';

  return (
    <>
      {!hidden && (
        <div className="fixed inset-0 z-[7500] flex flex-col overflow-hidden bg-brand-yellow" role="status" aria-live="polite" aria-label={`Memuat Kainora Kids ${pct}%`}>
          <CheckerStrip size={14} />
          <div className="relative grid flex-1 place-items-center px-4">
            <Cloud width={150} className="absolute left-[6%] top-[14%] animate-bob max-sm:w-24" />
            <Cloud width={110} className="absolute right-[8%] top-[24%] animate-bob [animation-delay:-2s] max-sm:w-20" />
            <Burst fill="var(--pink)" className="absolute right-[10%] bottom-[34%] h-28 w-28 rotate-12 max-sm:h-20 max-sm:w-20" textClass="text-[0.7rem] max-sm:text-[0.55rem]">NEW<br />DROP!</Burst>

            <div className="relative z-10 text-center">
              <p className="neo-pill mb-5 bg-paper">Baju Anak Premium</p>
              <TypeRemix
                text="KAINORA"
                progress={p}
                className="block text-[clamp(3.4rem,17vw,13rem)] leading-[0.86] tracking-[-0.03em]"
              />
              <div className="mx-auto mt-6 flex w-[min(88vw,560px)] items-center gap-4">
                <div className="neo-panel relative h-7 flex-1 overflow-hidden rounded-full bg-paper">
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-150"
                    style={{
                      width: `${pct}%`,
                      background: 'repeating-conic-gradient(var(--red) 0 25%, var(--paper) 0 50%) 0 0 / 20px 20px',
                    }}
                  />
                </div>
                <span className="font-arcade text-3xl tabular-nums sm:text-5xl">{String(pct).padStart(3, '0')}</span>
              </div>
            </div>
          </div>
          <div className="relative h-[28vh] shrink-0">
            <CheckerFloor height="100%" cell={64} tilt={66} speed={1.2} />
          </div>
          <div className="h-3 bg-brand-green" />
        </div>
      )}
      <CheckerWipe
        covering={phase === 'covering'}
        zIndex={7600}
        onCovered={() => { setPhase('revealing'); setTimeout(finish, 650); }}
      />
    </>
  );
};
