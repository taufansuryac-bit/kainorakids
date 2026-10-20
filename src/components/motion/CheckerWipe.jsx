/**
 * Tirai papan catur layar penuh. `covering` true → sel membesar menutup layar,
 * false → menyusut membuka. Dipakai untuk transisi halaman dan keluar dari preloader.
 */
import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

export const CheckerWipe = memo(({ covering, cols = 8, rows = 5, onCovered, duration = 0.22, stagger = 0.024, zIndex = 7000 }) => {
  const cells = useMemo(
    () => Array.from({ length: cols * rows }, (_, i) => ({ x: i % cols, y: Math.floor(i / cols) })),
    [cols, rows]
  );
  const last = cols + rows - 2;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 grid"
      style={{
        zIndex,
        pointerEvents: covering ? 'auto' : 'none',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells.map(({ x, y }, i) => {
        const d = x + y;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: covering ? 1.04 : 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: (covering ? d : last - d) * stagger }}
            onAnimationComplete={i === cells.length - 1 && covering ? onCovered : undefined}
            style={{ background: (x + y) % 2 ? 'var(--red)' : 'var(--ink)', transformOrigin: 'center' }}
          />
        );
      })}
    </div>
  );
});
CheckerWipe.displayName = 'CheckerWipe';
