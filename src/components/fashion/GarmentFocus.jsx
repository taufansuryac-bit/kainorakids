import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useDialog } from './hooks';
import { useGarmentInteraction } from './useGarmentInteraction';
import { ProductFocusInfo } from './ProductFocusInfo';

const GarmentGridCanvas = lazy(() => import('./GarmentGridCanvas'));
function targetRect() {
  if (window.innerWidth >= 900) {
    const total = Math.min(window.innerWidth - 80, 1200), height = Math.min(window.innerHeight * .78, 780);
    return { left: (window.innerWidth - total) / 2, top: Math.max(55, (window.innerHeight - height) / 2), width: total - 368, height };
  }
  const width = Math.min(window.innerWidth - 24, 780);
  const height = Math.min(window.innerHeight * .49, 450);
  return { left: (window.innerWidth - width) / 2, top: 48, width, height };
}

export default function GarmentFocus({ entry, product, origin, motionState, reduced, onClose }) {
  const dialog = useDialog(true, onClose), slots = useRef(new Map()), wake = useRef(() => {});
  const [target, setTarget] = useState(targetRect), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [generation, setGeneration] = useState(0);
  const entries = useMemo(() => [entry], [entry]);
  const motions = useMemo(() => new Map([[entry.id, motionState]]), [entry.id, motionState]);
  const slotRef = useCallback(element => { if (element) slots.current.set(entry.id, element); else slots.current.delete(entry.id); }, [entry.id]);
  const onReady = useCallback(() => setReady(true), []), onError = useCallback(() => setFailed(true), []);
  const interaction = useGarmentInteraction({ motion: motionState, entry, wake, enabled: ready && !failed });
  useEffect(() => { const resize = () => setTarget(targetRect()); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
  const transition = { duration: reduced ? 0 : .7, ease: [.22, 1, .36, 1] };
  const wide = window.innerWidth >= 900;
  const info = wide ? { left: target.left + target.width + 48, top: 76, width: 320, height: 'calc(100% - 152px)' } : { left: 24, top: target.top + target.height + 12, width: 'calc(100% - 48px)' };
  return <motion.div className="garment-focus" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="garment-focus-title" initial="enter" animate="open" exit="exit">
    <motion.div className="garment-focus-backdrop" aria-hidden="true" variants={{ enter: { opacity: 0 }, open: { opacity: 1 }, exit: { opacity: 0 } }} transition={{ duration: reduced ? 0 : .45 }} onClick={onClose} />
    <button type="button" className="garment-focus-close" onClick={onClose} aria-label="Tutup tampilan kaos"><span>TUTUP</span><X size={20} /></button>
    <motion.div className="garment-focus-stage" ref={slotRef} tabIndex={0} role="group" aria-label={`${entry.name} diperbesar. Seret untuk memutar atau gunakan panah keyboard.`} {...interaction}
      variants={{ enter: origin, open: target, exit: origin }} transition={transition} onUpdate={() => wake.current()}>
      {!ready && !failed && <span className="garment-grid-loading" role="status">MENYIAPKAN KAOS 3D</span>}
      {failed && <div className="garment-grid-fallback"><p>Tampilan 3D belum dapat dimuat.</p><button type="button" onClick={() => { setFailed(false); setReady(false); setGeneration(value => value + 1); }}>COBA LAGI</button></div>}
      <span className="garment-focus-gesture">SERET KIRI–KANAN UNTUK MEMUTAR</span>
    </motion.div>
    <Suspense fallback={null}><GarmentGridCanvas key={generation} generation={generation} entries={entries} slots={slots} motions={motions} wake={wake} reduced={reduced} onReady={onReady} onError={onError} scrollHost={dialog} /></Suspense>
    <div className="garment-focus-info-anchor" style={info}><motion.aside className="garment-focus-details" aria-label="Informasi produk" variants={{ enter: { opacity: 0, y: 12 }, open: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 } }} transition={{ duration: reduced ? 0 : .35 }}>
      <ProductFocusInfo titleId="garment-focus-title" name={entry.name} description={entry.description} colorName={entry.color === 'black' ? 'Hitam' : 'Off white'} product={product} />
    </motion.aside></div>
  </motion.div>;
}
