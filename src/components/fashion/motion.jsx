import { useRef } from 'react';
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

