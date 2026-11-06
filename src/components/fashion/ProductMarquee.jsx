import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Droplets, Layers, Leaf, Scissors, ShieldCheck, Shirt } from 'lucide-react';
import './product-marquee.css';

const FEATURES = [
  { text: 'Graphic Tee Anak', Icon: Shirt, kind: 'shirt' },
  { text: 'Potongan Oversize', Icon: Layers, kind: 'layers' },
  { text: 'Bahan Katun', Icon: Leaf, kind: 'cotton' },
  { text: 'Panduan Perawatan', Icon: Droplets, kind: 'droplets' },
  { text: 'Ukuran S–XXL', Icon: ShieldCheck, kind: 'durable' },
  { text: 'Potongan Boxy', Icon: Scissors, kind: 'stitch' },
];

export function ProductMarquee() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [pageVisible, setPageVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const playState = visible && pageVisible && !paused ? 'running' : 'paused';
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return <section id="product-marquee" ref={ref} className="f-product-marquee" aria-label="Pilihan baju anak Kainora">
    <button type="button" className="f-product-marquee-viewport" style={{ '--marquee-play-state': playState }} aria-pressed={paused} aria-label={`${paused ? 'Jalankan' : 'Jeda'} teks berjalan. ${FEATURES.map(feature => feature.text).join('. ')}.`} title={paused ? 'Klik untuk menjalankan teks' : 'Klik untuk menjeda teks'} onClick={() => setPaused(value => !value)}>
      <span className="f-product-marquee-track">
        {[0, 1].map(copy => <span className="f-product-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{FEATURES.map(({ text, Icon, kind }, index) => <span className="f-product-marquee-item" key={text}><span className="f-product-marquee-feature"><Icon size={26} strokeWidth={1.7} className={`f-product-marquee-icon f-product-marquee-icon--${kind}`} style={{ '--icon-delay': `${index * -.47}s` }} aria-hidden="true" /><span>{text}</span></span><span className="f-product-marquee-separator" aria-hidden="true">/</span></span>)}</span>)}
      </span>
    </button>
  </section>;
}
