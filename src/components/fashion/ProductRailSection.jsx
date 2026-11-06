import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import arrivalImageFrames from '../../content/arrivalImageFrames.json';
import HeroText from '../ui/hero-shutter-text';
import { arrivalViews } from '../../../shared/contentSchema';
import './product-rail.css';

const ClothingRailHero = lazy(() => import('../ui/product-rail-gallery'));
const labels = { front: 'Depan', back: 'Belakang', close: 'Tutup', show: 'Tampilkan' };

export function ProductRailSection() {
  const { content, products } = useStore();
  const section = useRef(null);
  const near = useInView(section, { margin: '350px 0px', once: true });
  const visible = useInView(section, { amount: .08 });
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => { const update = () => setPageVisible(!document.hidden); update(); document.addEventListener('visibilitychange', update); return () => document.removeEventListener('visibilitychange', update); }, []);
  const items = useMemo(() => (content.arrivals || []).map(entry => ({
    id: entry.id, name: entry.name, kind: 'tee', color: entry.color === 'black' ? '#191919' : '#fff',
    image: entry.front, backImage: entry.back, sideImage: entry.side, initialView: arrivalViews(entry).initialView, imageHem: .86, hookOffset: .13, railHook: true,
    imageFrames: Object.fromEntries(['front','back','side'].map(view => [view, arrivalImageFrames[`${entry.color}-${view}`]])),
    description: entry.description,
    colorLabel: entry.color === 'black' ? 'Hitam' : 'Putih', product: products.find(product => String(product.id) === entry.productId),
  })), [content.arrivals, products]);
  if (!items.length) return null;
  return <div ref={section} id="clothing-rail" className="kainora-rail-section">
    {near ? <Suspense fallback={<div className="kainora-rail-placeholder" role="status">MENYIAPKAN KOLEKSI KAINORA</div>}><ClothingRailHero className="kainora-rail" items={items} hanger="none" labels={labels} eyebrow="GRAPHIC TEE OVERSIZE ANAK" heading="KOLEKSI TERBARU" headingContent={<HeroText text="KOLEKSI TERBARU" />} caption="Geser untuk melihat pilihan kaos anak." autoplay={visible && pageVisible} interval={3200} /></Suspense> : <div className="kainora-rail-placeholder" aria-hidden="true" />}
  </div>;
}
