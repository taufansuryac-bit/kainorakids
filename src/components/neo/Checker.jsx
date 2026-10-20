/**
 * Dekorasi papan catur: strip 2 baris, tepi bergerigi, frame, dan lantai perspektif.
 * Pola dan skala meniru gambar referensi (strip merah-krem, tepi merah bergerigi, lantai biru-krem).
 */
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

export const CheckerStrip = ({ size = 16, tone = 'red', className = '' }) => (
  <div
    aria-hidden="true"
    className={`checker-strip ${tone === 'ink' ? 'checker-strip--ink' : tone === 'blue' ? 'checker-strip--blue' : ''} ${className}`}
    style={{ '--cs': `${size}px` }}
  />
);

export const CheckerEdge = ({ size = 18, color = 'var(--red)', className = '', children }) => (
  <div className={`checker-edge ${className}`} style={{ '--cs': `${size}px`, '--c1': color }}>
    {children}
  </div>
);

export const CheckerFrame = ({ size = 10, c1 = 'var(--red)', c2 = 'var(--paper)', className = '', innerClassName = '', children }) => (
  <div className={`checker-frame ${className}`} style={{ '--cs': `${size}px`, '--c1': c1, '--c2': c2 }}>
    <div className={`checker-frame__inner ${innerClassName}`}>{children}</div>
  </div>
);

/**
 * Lantai papan catur dengan perspektif 3D sungguhan: bidang diputar rotateX, ubin
 * berlari menuju penonton, garis-garis menyatu ke titik hilang, dan sedikit rebah
 * mengikuti pointer.
 */
export const CheckerFloor = ({ height = '48%', cell, c1 = 'var(--sky)', c2 = 'var(--paper)', tilt = 70, speed = 1.6, className = '', pointer }) => {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const roll = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (!pointer || reduce) return undefined;
    const move = (e) => px.set(e.clientX / window.innerWidth - 0.5);
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [pointer, reduce, px]);

  return (
    <div
      aria-hidden="true"
      className={`floor ${className}`}
      style={{ '--floor-h': height, '--f1': c1, '--f2': c2, ...(cell ? { '--cell': `${cell}px` } : {}) }}
    >
      <motion.div className="floor__plane" style={{ rotateX: tilt, rotateZ: reduce ? 0 : roll, transformOrigin: '50% 0' }}>
        <div className="floor__tiles" style={{ animationDuration: `${speed}s` }} />
      </motion.div>
    </div>
  );
};
