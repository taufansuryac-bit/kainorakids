/**
 * Elemen "magnetik": mengikuti pointer di dekatnya dengan pegas, kembali saat pointer pergi.
 * Hanya aktif pada perangkat pointer halus (mouse/trackpad) dan tanpa reduced-motion.
 */
import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

export const Magnetic = ({ children, strength = 0.35, className = '' }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.6 });

  const move = (e) => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
};
