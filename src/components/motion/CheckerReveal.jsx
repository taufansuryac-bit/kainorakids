/**
 * Reveal gambar dengan "disolve" papan catur: sel-sel menyusut secara diagonal
 * saat elemen masuk viewport. Dipakai untuk foto produk, lookbook, dan hero.
 */
import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

// `relative` hanya bila pemanggil tidak menetapkan posisi sendiri (utilitas `relative` akan mengalahkan `absolute`)
const pos = (c = '') => (/(^|\s)(absolute|fixed|sticky|relative)(\s|$)/.test(c) ? '' : 'relative');

export const CheckerReveal = ({
  children,
  cols = 6,
  rows = 6,
  color = 'var(--ink)',
  color2 = 'var(--red)',
  delay = 0,
  once = true,
  amount = 0.25,
  className = '',
  style,
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once, amount });
  const cells = useMemo(
    () => Array.from({ length: cols * rows }, (_, i) => ({ x: i % cols, y: Math.floor(i / cols) })),
    [cols, rows]
  );

  return (
    <div ref={ref} className={`${pos(className)} overflow-hidden ${className}`} style={style}>
      {children}
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {cells.map(({ x, y }, i) => (
            <motion.span
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: inView ? 0 : 1 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: delay + (x + y) * 0.05 + ((x + y) % 2) * 0.04 }}
              style={{ background: (x + y) % 2 ? color2 : color, margin: -0.5, transformOrigin: 'center' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
