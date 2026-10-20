/**
 * KAINORA KIDS — KINETIC TYPOGRAPHY PRIMITIVES
 *  - SplitReveal : huruf naik dari balik mask, pegas + rotasi kecil
 *  - TextRoll    : huruf berguling 3D saat di-hover (kelas `roll-host` / hover pada elemen sendiri)
 *  - GooeyMorph  : morf antar kata dengan blur + threshold SVG (efek "cairan")
 *  - TypeRemix   : satu kata disusun ulang lewat beberapa gaya huruf sebelum menetap
 *  - WeightHover : huruf menebal/melebar mengikuti jarak kursor (sumbu wdth/wght Archivo)
 * Semua mengikuti prefers-reduced-motion.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const chars = (s) => Array.from(String(s));

/* ------------------------------------------------------------------ */
/* SplitReveal                                                         */
/* ------------------------------------------------------------------ */
export const SplitReveal = ({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.03,
  mode = 'up', // 'up' | 'flip' | 'drop'
  amount = 0.5,
  once = true,
  style,
}) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });
  const words = String(text).split(' ');
  let n = 0;

  const from =
    mode === 'drop' ? { y: '-120%', rotate: -10, opacity: 0 }
    : mode === 'flip' ? { y: '110%', rotate: 16, opacity: 0 }
    : { y: '118%', rotate: 5, opacity: 0 };

  return (
    <Tag ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {chars(w).map((ch, ci) => {
                const i = n++;
                return (
                  <span key={ci} className="k-mask">
                    <motion.span
                      className="k-char"
                      initial={reduce ? false : from}
                      animate={inView || reduce ? { y: 0, rotate: 0, opacity: 1 } : from}
                      transition={{ type: 'spring', stiffness: 240, damping: 19, mass: 0.8, delay: delay + i * stagger }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
};

/* ------------------------------------------------------------------ */
/* TextRoll — gaya CSS ada di bawah (diinjeksi sekali)                 */
/* ------------------------------------------------------------------ */
export const TextRoll = ({ children, className = '' }) => {
  const text = String(children);
  return (
    <span className={`roll ${className}`}>
      {/* teks aksesibel sekali; huruf animasi disembunyikan dari AT, salinannya dibuat via ::after (data-c) */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="roll__row">
        {chars(text).map((c, i) => {
          const ch = c === ' ' ? ' ' : c;
          return (
            <span key={i} className="roll__c" style={{ '--i': i }}>
              <span className="roll__a" data-c={ch}>{ch}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* GooeyMorph                                                          */
/* ------------------------------------------------------------------ */
export const GooeyMorph = ({ texts, morphTime = 1.1, cooldown = 1.5, className = '' }) => {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const a = useRef(null);
  const b = useRef(null);
  const wrap = useRef(null);
  const [staticIdx, setStaticIdx] = useState(0);

  useEffect(() => {
    if (reduce) {
      const t = setInterval(() => setStaticIdx((i) => (i + 1) % texts.length), 2600);
      return () => clearInterval(t);
    }
    let idx = texts.length - 1;
    let morph = 0;
    let cool = cooldown;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);

    const setMorph = (f) => {
      if (!a.current || !b.current) return;
      b.current.style.filter = `blur(${Math.min(8 / Math.max(f, 0.001) - 8, 100)}px)`;
      b.current.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      const g = 1 - f;
      a.current.style.filter = `blur(${Math.min(8 / Math.max(g, 0.001) - 8, 100)}px)`;
      a.current.style.opacity = `${Math.pow(g, 0.4) * 100}%`;
    };
    const settle = () => {
      if (!a.current || !b.current) return;
      b.current.style.filter = 'none';
      b.current.style.opacity = '100%';
      a.current.style.filter = 'none';
      a.current.style.opacity = '0%';
    };
    const advance = () => {
      idx = (idx + 1) % texts.length;
      a.current.textContent = texts[idx % texts.length];
      b.current.textContent = texts[(idx + 1) % texts.length];
    };
    advance();

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = (now - last) / 1000;
      last = now;
      if (!visible) return;
      if (cool > 0) {
        cool -= dt;
        if (cool <= 0) { morph = 0; }
        else { settle(); return; }
      }
      morph += dt;
      const f = Math.min(morph / morphTime, 1);
      setMorph(f);
      if (f >= 1) { cool = cooldown; advance(); settle(); }
    };
    settle();
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [texts, morphTime, cooldown, reduce]);

  if (reduce) {
    return <span className={className}>{texts[staticIdx]}</span>;
  }

  return (
    <span ref={wrap} className={`inline-grid ${className}`}>
      <span className="sr-only">{texts.join(', ')}</span>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id={`gooey-${id}`}>
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
      <span aria-hidden="true" className="inline-grid" style={{ filter: `url(#gooey-${id})` }}>
        <span ref={a} className="col-start-1 row-start-1 text-center" />
        <span ref={b} className="col-start-1 row-start-1 text-center" />
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* TypeRemix — satu kata, banyak perawatan huruf                       */
/* ------------------------------------------------------------------ */
const REMIX = [
  { fontFamily: 'Archivo', fontWeight: 900, fontStretch: '125%', color: 'var(--ink)' },
  { fontFamily: 'Bungee', fontWeight: 400, color: 'var(--red)' },
  { fontFamily: '"Pixelify Sans"', fontWeight: 700, color: 'var(--sky)' },
  { fontFamily: 'Archivo', fontWeight: 900, fontStretch: '125%', color: 'var(--ink)', background: 'var(--pink)', rotate: -4, padding: '0 0.06em', border: '3px solid var(--ink)' },
  { fontFamily: 'Archivo', fontWeight: 200, fontStretch: '62%', color: 'var(--ink)' },
  { fontFamily: 'Archivo', fontWeight: 900, fontStretch: '125%', color: 'var(--paper)', background: 'var(--ink)', rotate: 3, padding: '0 0.06em' },
  { fontFamily: 'Bungee', fontWeight: 400, color: 'var(--ink)', background: 'var(--yellow)', rotate: -2, padding: '0 0.05em', border: '3px solid var(--ink)' },
  { fontFamily: '"Pixelify Sans"', fontWeight: 700, color: 'var(--paper)', background: 'var(--teal)', rotate: 2, padding: '0 0.06em', border: '3px solid var(--ink)' },
];

export const TypeRemix = ({ text, progress = 0, className = '', final = REMIX[0], tickMs = 95 }) => {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const letters = useMemo(() => chars(text), [text]);

  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setTick((v) => v + 1), tickMs);
    return () => clearInterval(t);
  }, [reduce, tickMs]);

  // huruf ke-i menetap saat progress melewati ambangnya
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap justify-center">
        {letters.map((ch, i) => {
          const threshold = (i + 1) / (letters.length + 1);
          const settled = reduce || progress >= 0.35 + threshold * 0.65;
          const s = settled ? final : REMIX[(tick + i * 3) % REMIX.length];
          return (
            <span
              key={i}
              className="inline-block leading-[0.9]"
              style={{
                fontFamily: s.fontFamily,
                fontWeight: s.fontWeight,
                fontStretch: s.fontStretch,
                color: s.color,
                background: s.background,
                border: s.border,
                padding: s.padding,
                transform: s.rotate ? `rotate(${s.rotate}deg)` : undefined,
                borderRadius: s.border ? '0.12em' : undefined,
                transition: settled ? 'all 0.25s var(--ease-pop)' : 'none',
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* WeightHover — huruf bereaksi pada jarak kursor (wdth/wght variabel)  */
/* ------------------------------------------------------------------ */
export const WeightHover = ({ text, className = '', radius = 170 }) => {
  const reduce = useReducedMotion();
  const wrap = useRef(null);

  useEffect(() => {
    if (reduce || !wrap.current) return undefined;
    const el = wrap.current;
    const spans = Array.from(el.querySelectorAll('[data-c]'));
    let raf = 0;
    let pt = null;
    const paint = () => {
      raf = 0;
      spans.forEach((s) => {
        const r = s.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = pt ? Math.hypot(pt.x - cx, pt.y - cy) : radius * 3;
        const k = Math.max(0, 1 - d / radius);
        s.style.fontStretch = `${125 - k * 58}%`;
        s.style.transform = `translateY(${-k * 8}px) rotate(${k * -5}deg) scale(${1 + k * 0.06})`;
      });
    };
    const move = (e) => { pt = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(paint); };
    const leave = () => { pt = null; if (!raf) raf = requestAnimationFrame(paint); };
    window.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, [reduce, radius]);

  return (
    <span ref={wrap} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars(text).map((c, i) => (
          <span key={i} data-c className="inline-block transition-[font-stretch,transform] duration-150 ease-out">
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </span>
    </span>
  );
};
