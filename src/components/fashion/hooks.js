import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion, useScroll } from 'motion/react';

export function useCompact() {
  return useSyncExternalStore(subscribeCompact,compactSnapshot,()=>false);
}
const compactSnapshot=()=>window.matchMedia('(max-width: 767px)').matches;
const subscribeCompact=callback=>{const query=window.matchMedia('(max-width: 767px)');query.addEventListener('change',callback);return()=>query.removeEventListener('change',callback);};

export function useChapter() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return [ref, scrollYProgress];
}

export function useRail() {
  const ref = useRef(null);
  const drag = useRef(null);
  const [index, setIndex] = useState(0);
  const [last, setLast] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const card = el.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).gap || '0') : 1;
      setIndex(Math.round(el.scrollLeft / step));
      setLast(Math.max(0, Math.ceil((el.scrollWidth - el.clientWidth) / step)));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, []);
  const move = (direction) => {
    const el = ref.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).gap || '0')), behavior: reduce ? 'instant' : 'smooth' });
  };
  return { ref, index, last, move,
    onKeyDown: (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } },
    onPointerDown: (e) => { if (e.pointerType !== 'mouse' || e.target.closest('button,a')) return; drag.current = { x: e.clientX, scroll: ref.current.scrollLeft }; },
    onPointerMove: (e) => { if (!drag.current) return; if (Math.abs(e.clientX - drag.current.x) > 5) { ref.current.style.scrollSnapType = 'none'; ref.current.setPointerCapture(e.pointerId); ref.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.x); } },
    onPointerUp: () => { drag.current = null; if (ref.current) ref.current.style.scrollSnapType = ''; },
  };
}

export function useDialog(open, close) {
  const ref = useRef(null);
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; }, [close]);
  useEffect(() => {
    if (!open) return undefined;
    const before = document.activeElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector('button')?.focus();
    const key = (e) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key !== 'Tab') return;
      const items = [...(ref.current?.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]') || [])].filter(item => item.getClientRects().length > 0);
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1).focus(); }
      if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0].focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = priorOverflow; document.removeEventListener('keydown', key); before?.focus?.(); };
  }, [open]);
  return ref;
}
