import { useRef, useSyncExternalStore } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCompact } from './hooks';
import './category-portals.css';

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const motionSnapshot = () => window.matchMedia(MOTION_QUERY).matches;
const subscribeMotion = callback => {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const CATEGORIES = [
  { key: 'boys', title: 'BOYS', gender: 'Laki-laki', image: '/images/kainora-categories/boys.webp', line: 'BIG DAYS. LITTLE EXPLORERS.', copy: 'Untuk langkah kecil dan petualangan besar.' },
  { key: 'girls', title: 'GIRLS', gender: 'Perempuan', image: '/images/kainora-categories/girls.webp', line: 'BIG IDEAS. LITTLE DREAMERS.', copy: 'Untuk imajinasi yang selalu punya cerita.' },
];

function CategoryPanel({ category, index, reduce, onSelect }) {
  const ref = useRef(null), bounds = useRef(null);
  const visible = useInView(ref, { amount: .15 });
  const compact = useCompact();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 95, damping: 24 });
  const y = useSpring(my, { stiffness: 95, damping: 24 });
  const reset = () => { mx.set(0); my.set(0); };
  const move = event => {
    if (reduce || compact || event.pointerType !== 'mouse' || !bounds.current) return;
    const b = bounds.current;
    mx.set(Math.max(-1, Math.min(1, (event.clientX - b.left) / b.width * 2 - 1)) * 4);
    my.set(Math.max(-1, Math.min(1, (event.clientY - b.top) / b.height * 2 - 1)) * -3);
  };
  return <motion.div ref={ref} className={`f-category-panel is-${category.key} ${visible && !reduce ? 'is-moving' : ''}`} initial={reduce ? false : { opacity: 0, y: 52 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ type: 'spring', stiffness: 100, damping: 23, delay: reduce ? 0 : index * .12 }}>
    <motion.button type="button" className="f-category-card" aria-label={`Belanja ${category.title === 'BOYS' ? 'Boys' : 'Girls'}`} onClick={() => onSelect(category.gender)} onPointerEnter={event => { bounds.current = event.currentTarget.getBoundingClientRect(); }} onPointerMove={move} onPointerLeave={reset} onBlur={reset} style={reduce || compact ? {} : { rotateY: x, rotateX: y, transformPerspective: 1100 }}>
      <div className="f-category-visual"><div className="f-category-float"><img src={category.image} alt={`Koleksi Kainora untuk anak ${category.gender.toLowerCase()}, ditampilkan dari belakang`} width="1280" height="1280" loading="lazy" /></div></div>
      <div className="f-category-top" aria-hidden="true"><span>KAINORA KIDS / 0{index + 1}</span><span className="f-category-symbol">+</span></div>
      <span className="f-category-orbit" aria-hidden="true" />
      <span className="f-category-bracket is-top" aria-hidden="true" /><span className="f-category-bracket is-bottom" aria-hidden="true" />
      <div className="f-category-bottom"><span className="f-category-kicker">{category.line}</span><div className="f-category-title"><h3>{category.title}</h3><span className="f-category-arrow" aria-hidden="true"><ArrowUpRight size={32} strokeWidth={1.5} /></span></div><p>{category.copy}</p><span className="f-category-link">JELAJAHI {category.title}<span aria-hidden="true">↗</span></span></div>
    </motion.button>
  </motion.div>;
}

export function CategoryPortals({ onSelect }) {
  const reduce = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true);
  return <section id="categories" className="f-category-portals f-inset" aria-labelledby="categories-title" data-reduced-motion={reduce}>
    <div className="f-category-heading"><div><p className="f-cap">KAINORA KIDS / SHOP BY CATEGORY</p><h2 id="categories-title">SMALL FITS.<br /><span>LIMITLESS WORLDS.</span></h2></div><p>Dua pilihan. Banyak kemungkinan.<br />Temukan gaya untuk cerita si kecil.</p></div>
    <div className="f-category-grid">{CATEGORIES.map((category, index) => <CategoryPanel key={category.key} category={category} index={index} reduce={reduce} onSelect={onSelect} />)}</div>
    <div className="f-category-signoff" aria-hidden="true"><span>MADE TO MOVE. FREE TO BE.</span><span>KAINORA / LITTLE FITS. BIG DAYS.</span></div>
  </section>;
}
