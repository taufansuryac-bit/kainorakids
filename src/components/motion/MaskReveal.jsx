/**
 * Reveal bermasker dengan bentuk berbeda-beda (dipilih sesuai konteks, bukan acak):
 *  - iris   : lingkaran membuka dari tengah
 *  - diag   : sapuan diagonal
 *  - blinds : kerai vertikal (strip-strip ink menyusut)
 *  - star   : poligon bintang melebar
 */
import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const pos = (c = '') => (/(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(c) ? '' : 'relative');

const star = (n, outer, inner) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`;
  }).join(', ');

const CLIP = {
  iris: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
  diag: { from: 'polygon(0 0, 0 0, 0 100%, 0 100%)', to: 'polygon(0 0, 130% 0, 100% 100%, 0 100%)' },
  star: { from: `polygon(${star(12, 4, 2)})`, to: `polygon(${star(12, 110, 78)})` },
};

export const MaskReveal = ({ children, shape = 'iris', delay = 0, amount = 0.2, once = true, stripes = 8, color = 'var(--ink)', className = '', style }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once, amount });
  const bars = useMemo(() => Array.from({ length: stripes }, (_, i) => i), [stripes]);

  if (reduce) return <div className={`${pos(className)} overflow-hidden ${className}`} style={style}>{children}</div>;

  if (shape === 'blinds') {
    return (
      <div ref={ref} className={`${pos(className)} overflow-hidden ${className}`} style={style}>
        {children}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex">
          {bars.map((i) => (
            <motion.span
              key={i}
              className="h-full flex-1"
              style={{ background: i % 2 ? 'var(--red)' : color, transformOrigin: i % 2 ? 'top' : 'bottom', marginInline: -0.5 }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: inView ? 0 : 1 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: delay + i * 0.045 }}
            />
          ))}
        </div>
      </div>
    );
  }

  const c = CLIP[shape] || CLIP.iris;
  return (
    <div ref={ref} className={`${pos(className)} ${className}`} style={style}>
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: c.from }}
        animate={{ clipPath: inView ? c.to : c.from }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};
