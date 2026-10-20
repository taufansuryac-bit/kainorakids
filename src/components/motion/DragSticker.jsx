/**
 * Stiker yang bisa diseret dengan pegas (kembali ke posisi awal saat dilepas).
 * Drag dimatikan di layar sentuh agar scroll tidak terganggu.
 */
import { motion, useReducedMotion } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const DragSticker = ({ children, className = '', style, tilt = 10 }) => {
  const reduce = useReducedMotion();
  const fine = useMediaQuery('(pointer: fine)');
  const canDrag = fine && !reduce;
  return (
    <motion.div
      className={`${canDrag ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      style={style}
      drag={canDrag}
      dragSnapToOrigin
      dragElastic={0.55}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 12 }}
      whileHover={canDrag ? { scale: 1.08, rotate: tilt / 2 } : undefined}
      whileDrag={{ scale: 1.14, rotate: tilt }}
    >
      {children}
    </motion.div>
  );
};
