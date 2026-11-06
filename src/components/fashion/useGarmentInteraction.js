import { useRef } from 'react';
import { pauseGridMotion, resumeGridMotion } from './garmentGridMotion';
import { garmentYaw } from './garmentRail';

export function useGarmentInteraction({ motion, entry, wake, enabled, onActivate }) {
  const drag = useRef(null), gesture = useRef({ moved: false, cancelled: false });
  const finish = event => {
    const start = drag.current;
    if (!start || event.pointerId !== start.id) return;
    gesture.current.cancelled = event.type !== 'pointerup';
    drag.current = null;
    resumeGridMotion(motion, performance.now());
    event.currentTarget.removeAttribute('data-dragging');
    if (event.currentTarget.hasPointerCapture(start.id)) event.currentTarget.releasePointerCapture(start.id);
    wake.current();
  };
  return {
    onPointerDown(event) {
      if (event.button !== 0 || event.target.closest('button,a') || !enabled || drag.current) return;
      gesture.current = { moved: false, cancelled: false };
      pauseGridMotion(motion);
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: motion.yaw, width: event.currentTarget.clientWidth };
      event.currentTarget.dataset.dragging = 'true';
      event.currentTarget.setPointerCapture(event.pointerId);
      wake.current();
    },
    onPointerMove(event) {
      const start = drag.current;
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) > 6) gesture.current.moved = true;
      if (Math.abs(dx) < 5 || event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) return;
      motion.yaw = start.yaw + dx / start.width * Math.PI * 2;
      wake.current();
    },
    onPointerUp: finish, onPointerCancel: finish, onLostPointerCapture: finish,
    onClick(event) {
      if (enabled && !gesture.current.moved && !gesture.current.cancelled && !event.target.closest('button,a')) onActivate?.(event.currentTarget);
    },
    onKeyDown(event) {
      if (!enabled || event.target !== event.currentTarget || drag.current) return;
      if ((event.key === 'Enter' || event.key === ' ') && onActivate) { event.preventDefault(); onActivate(event.currentTarget); return; }
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
      event.preventDefault();
      motion.yaw = event.key === 'Home' ? garmentYaw(entry) : motion.yaw + (event.key === 'ArrowLeft' ? -1 : 1) * Math.PI / 6;
      resumeGridMotion(motion, performance.now());
      wake.current();
    },
  };
}
