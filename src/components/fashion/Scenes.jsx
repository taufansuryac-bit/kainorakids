import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Overline, RevealLines } from './motion';
import { TIMING } from './design';
import { HeroSlideshow } from './HeroSlideshow';
import { useCompact } from './hooks';

export function HeroScene() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const compact = useCompact();
  const firstPaint = typeof document === 'undefined' || document.getElementById('root')?.dataset.prerender === 'home';
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, TIMING.spring), py = useSpring(my, TIMING.spring);
  return <section ref={ref} className="f-hero" data-section="01" aria-labelledby="fashion-hero-title">
    <div className="f-hero-image" onPointerMove={(e) => { if (reduce || compact || e.pointerType === 'touch') return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left - r.width / 2) * .012); my.set((e.clientY - r.top - r.height / 2) * .012); }} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div className="f-hero-photo-motion" style={reduce || compact ? {} : { y, scale }}><motion.div className="f-hero-photo-reveal" style={reduce ? {} : { x, y: py }} initial={reduce || firstPaint ? false : { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }} animate={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }} transition={{ duration: TIMING.chapter, ease: TIMING.ease, delay: .3 }}><HeroSlideshow reduce={!!reduce}/></motion.div></motion.div>
      <span className="f-photo-credit">KAINORA KIDS / LITTLE ADVENTURES</span>
    </div>
    <Overline className="f-hero-overline">KAINORA KIDS / INDEPENDENT STREETWEAR</Overline>
    <RevealLines as="h1" id="fashion-hero-title" label="Kaos anak oversize Kainora Kids: small fits, big energy." lines={['SMALL FITS.', 'BIG ENERGY.']} className="f-hero-title" delay={.15} immediate={firstPaint} />
    <div className="f-hero-bottom"><div><Overline>LESS ORDINARY. MORE YOU.</Overline><p>Kaos anak oversize untuk imajinasi besar.<br />Katun, motif grafis, dan ruang untuk bergerak.</p><motion.a href="#products" className="f-button" whileHover={reduce ? {} : { y: -3 }} whileTap={{ scale: .97 }}>BELANJA PILIHAN <ArrowUpRight size={19} /></motion.a></div><a href="#manifesto" className="f-scroll-cue"><span>SCROLL TO DISCOVER</span><motion.span animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}><ArrowDown size={18} /></motion.span></a></div>
    <span className="f-hero-edition f-cap">01 / THE FIRST MOVEMENT</span>
  </section>;
}
