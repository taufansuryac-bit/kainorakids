import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, useInView } from 'motion/react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MAX_GARMENTS } from '../../../shared/contentSchema';
import { useMotionPreference } from './useMotionPreference';
import { createGridMotion } from './garmentGridMotion';
import { useGarmentInteraction } from './useGarmentInteraction';
import GarmentFocus from './GarmentFocus';
import './garment-grid.css';

const GarmentGridCanvas = lazy(() => import('./GarmentGridCanvas'));

function GarmentCard({ entry, motion, slots, wake, ready, failed, onRetry, onFocus }) {
  const slotRef = useCallback(element => {
    if (element) slots.current.set(entry.id, element); else slots.current.delete(entry.id);
  }, [entry.id, slots]);
  const interaction = useGarmentInteraction({ motion, entry, wake, enabled: ready && !failed, onActivate: element => onFocus(entry, element) });
  return <article className="garment-grid-card" data-garment-id={entry.id}>
    <div className="garment-grid-stage" ref={slotRef} tabIndex={0} role="button" aria-haspopup="dialog" aria-label={`Perbesar kaos ${entry.name}. Seret untuk memutar.`} {...interaction}>
      {!ready && !failed && <span className="garment-grid-loading" role="status">MENYIAPKAN KAOS 3D<span className="garment-grid-loading-dot" /></span>}
      {failed && <div className="garment-grid-fallback"><p>Tampilan 3D belum dapat dimuat.</p><button type="button" onClick={onRetry}><RotateCcw size={15} />COBA LAGI</button></div>}
      {ready && !failed && <span className="garment-grid-hint" aria-hidden="true">KETUK UNTUK PERBESAR</span>}
    </div>
    <div className="garment-grid-meta"><div><span className="garment-grid-color">{entry.color === 'black' ? 'HITAM' : 'OFF WHITE'} / GRAPHIC TEE</span><h3>{entry.name}</h3></div></div>
  </article>;
}

export function GarmentCollection({ onShop }) {
  const { content, products } = useStore();
  const entries = useMemo(() => content.garments.slice(0, MAX_GARMENTS), [content.garments]);
  const motions = useMemo(() => new Map(entries.map(entry => [entry.id, createGridMotion(entry.id, entry.initialView, typeof performance === 'undefined' ? 0 : performance.now())])), [entries]);
  const slots = useRef(new Map()), wake = useRef(() => {}), section = useRef(null);
  const near = useInView(section, { margin: '250px 0px', once: true });
  const reduced = useMotionPreference();
  const [readyIds, setReadyIds] = useState(new Set()), [failedIds, setFailedIds] = useState(new Set()), [generation, setGeneration] = useState(0);
  const ready = useCallback(id => setReadyIds(previous => new Set(previous).add(id)), []);
  const fail = useCallback(id => setFailedIds(previous => new Set(previous).add(id)), []);
  const retry = () => { setReadyIds(new Set()); setFailedIds(new Set()); setGeneration(value => value + 1); };
  const [focus, setFocus] = useState(null), [closing, setClosing] = useState(false);
  const openFocus = (entry, element) => { element.focus({ preventScroll: true }); const rect = element.getBoundingClientRect(); setClosing(false); setFocus({ entry, origin: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } }); };
  if (!entries.length) return null;
  return <section id="products" className="f-inset garment-collection" ref={section} aria-label="Koleksi kaos 3D">
    <div className="garment-collection-toolbar"><span>{entries.length} KAOS / 360°</span><p>{reduced ? 'SERET KIRI–KANAN UNTUK MELIHAT SETIAP SISI' : 'SERET KIRI–KANAN UNTUK MEMUTAR KAOS'}</p><button type="button" onClick={onShop}>SEMUA PRODUK <ArrowUpRight size={16} /></button></div>
    <div className="garment-grid">{entries.map(entry => <GarmentCard key={entry.id} entry={entry} motion={motions.get(entry.id)} slots={slots} wake={wake} ready={readyIds.has(entry.id)} failed={failedIds.has('all') || failedIds.has(entry.id)} onRetry={retry} onFocus={openFocus} />)}</div>
    {near && <Suspense fallback={null}><GarmentGridCanvas key={generation} generation={generation} entries={entries} slots={slots} motions={motions} wake={wake} reduced={reduced} active={!focus} hiddenId={focus?.entry.id} onReady={ready} onError={fail} scrollHost={section} /></Suspense>}
    {focus && createPortal(<AnimatePresence onExitComplete={() => { setFocus(null); setClosing(false); }}>{!closing && <GarmentFocus key={focus.entry.id} entry={focus.entry} product={products.find(product => String(product.id) === focus.entry.productId)} origin={focus.origin} motionState={motions.get(focus.entry.id)} reduced={reduced} onClose={() => setClosing(true)} />}</AnimatePresence>, document.body)}
    <div className="garment-collection-footer"><p>Lihat motif dari sisi depan dan belakang.</p><button type="button" className="f-button" onClick={onShop}>LIHAT SEMUA PRODUK <ArrowUpRight size={18} /></button></div>
  </section>;
}
