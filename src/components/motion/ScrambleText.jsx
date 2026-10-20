/**
 * Teks "scramble": huruf diacak lalu menetap dari kiri ke kanan saat masuk viewport,
 * dan diacak ulang saat di-hover. Teks aksesibel tetap satu (sr-only).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+?!/<>';

export const ScrambleText = ({ text, className = '', duration = 900, as: Tag = 'span' }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (reduce) { setOut(text); return; }
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const letters = Array.from(text);
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const settled = Math.floor(t * letters.length);
      setOut(
        letters
          .map((ch, i) => (ch === ' ' || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration, reduce]);

  useEffect(() => { if (inView) run(); return () => cancelAnimationFrame(raf.current); }, [inView, run]);

  return (
    <Tag ref={ref} className={className} onMouseEnter={run}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="tabular-nums">{out}</span>
    </Tag>
  );
};
