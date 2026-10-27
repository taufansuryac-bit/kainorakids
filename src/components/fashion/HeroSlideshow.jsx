import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import './hero-slideshow.css';

const SLIDES = [
  { src: '/images/kainora-owned/hero-camp.webp', alt: 'Dua anak memakai kaos grafis Kainora Kids di area piknik' },
  { src: '/images/kainora-owned/hero-blue.webp', alt: 'Gaya anak Kainora dengan hoodie di depan bangku kuning' },
  { src: '/images/kainora-owned/hero-yellow.webp', alt: 'Kaos grafis Kainora Kids untuk petualangan si kecil' },
  { src: '/images/kainora-owned/hero-garden.webp', alt: 'Dua anak memakai kaos grafis Kainora di taman bunga berwarna-warni' },
];

export function HeroSlideshow({ reduce = false }) {
  const host = useRef(null), visible = useInView(host, { amount: .1 });
  const [ready, setReady] = useState([0]), [active, setActive] = useState(0);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  useEffect(() => {
    const next = (active + 1) % SLIDES.length;
    if (!visible || ready.includes(next)) return;
    let cancelled = false;
    // Prepare only the next photo, after the first frame has had time to paint.
    const timer = setTimeout(() => {
      const photo = new Image();
      photo.onload = async () => {
        try { await photo.decode(); } catch { /* onload already confirms a usable photo. */ }
        if (!cancelled) setReady(previous => previous.includes(next) ? previous : [...previous,next]);
      };
      photo.sizes = '(max-width:767px) 100vw, 54vw';
      photo.srcset = portraitSrcSet(SLIDES[next].src);
      photo.src = portrait(SLIDES[next].src, 800);
    }, active === 0 ? 900 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [active, visible, ready]);
  useEffect(() => {
    if (!visible) return;
    let timer;
    const schedule = () => {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(() => setActive(current => readyRef.current.includes((current + 1) % SLIDES.length) ? (current + 1) % SLIDES.length : current), 2500);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', schedule); };
  }, [visible]);
  return <div ref={host} className="f-hero-slideshow" aria-label="Cerita visual Kainora Kids">
    {SLIDES.map((slide, index) => ready.includes(index) && <motion.img key={slide.src} src={portrait(slide.src,800)} srcSet={portraitSrcSet(slide.src)} sizes="(max-width:767px) 100vw, 54vw" alt={slide.alt} aria-hidden={active !== index} width="800" height="1000" fetchpriority={index === 0 ? 'high' : 'low'} decoding="async" initial={false} animate={{ opacity: active === index ? 1 : 0 }} transition={{ duration: reduce ? 0 : .7, ease: 'easeInOut' }} />)}
  </div>;
}

const portrait = (source, width) => source.replace('.webp', `-portrait-${width}.webp`);
const portraitSrcSet = source => `${portrait(source,480)} 480w, ${portrait(source,800)} 800w`;
