import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { TIMING } from './design';

export const Overline = ({ children, className = '' }) => <p className={`f-cap ${className}`}>{children}</p>;

// `label` replaces the screen-reader/search text when the visual lines are a slogan.
export function RevealLines({ lines, as: Tag = 'h2', className = '', delay = 0, id, immediate = false, label }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: .15 });
  return <Tag ref={ref} id={id} className={`f-title ${className}`}>
    <span className="sr-only">{label || lines.join(' ')}</span>
    <span aria-hidden="true">{lines.map((line, i) => <span className="f-line-mask" key={line}><motion.span initial={reduce || immediate ? false : { y: '110%', rotate: 2 }} animate={inView || reduce || immediate ? { y: 0, rotate: 0 } : { y: '110%', rotate: 2 }} transition={{ duration: TIMING.reveal, ease: TIMING.ease, delay: delay + i * .1 }}>{line}</motion.span></span>)}</span>
  </Tag>;
}

export function TypeRemixPreloader({ enabled }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (!enabled || reduce || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { started.current = false; setShow(false); return undefined; }
    try { if (!started.current && sessionStorage.getItem('kainora-v2-intro')) return undefined; sessionStorage.setItem('kainora-v2-intro', 'seen'); } catch { /* Storage is optional. */ }
    started.current = true;
    setShow(true);
    const timer = setTimeout(() => { started.current = false; setShow(false); }, 850);
    return () => { clearTimeout(timer); };
  }, [enabled, reduce]);
  return show && <div data-section="00" className="f-preloader" aria-hidden="true">
    <div className="f-preloader-logo">{Array.from({ length: 6 }, (_, i) => <div className="f-logo-slice" style={{ left: `${i * 100 / 6}%` }} key={i}><motion.img src="/website-logo.png" alt="" style={{ left: `${-i * 100}%` }} initial={{ y: '120%', rotate: i % 2 ? 7 : -7 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: .4, delay: i * .025, ease: TIMING.ease }} /></div>)}</div>
    <div className="f-preloader-meta f-cap"><span>INDEPENDENT KIDSWEAR</span><span>MADE TO MOVE.</span></div><motion.div className="f-preloader-meter" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .6 }} />
  </div>;
}

