import { createPortal } from 'react-dom';
import {useEffect,useState} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Ruler, X } from 'lucide-react';
import { useDialog } from '../fashion/hooks';
import { useMotionPreference } from '../fashion/useMotionPreference';
import { SIZE_CHART } from '../../content/sizeChart';

export { SIZE_CHART } from '../../content/sizeChart';
export function ProductSizeGuide({ open, close, product, selected, onSelect }) {
  const dialog = useDialog(open, close), reduce = useMotionPreference();
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  if(!mounted)return null;
  return createPortal(<AnimatePresence>{open && <motion.div className="ks-size-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .2 }} onClick={close}>
    <motion.section ref={dialog} className="ks-size-dialog" role="dialog" aria-modal="true" aria-labelledby="ks-size-title" initial={reduce ? false : { y: 24, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 15, opacity: 0 }} transition={{ duration: reduce ? 0 : .25 }} onClick={event => event.stopPropagation()}>
      <button className="ks-dialog-close" type="button" onClick={close} aria-label="Tutup panduan ukuran"><X size={22}/></button>
      <span className="ks-eyebrow"><Ruler size={17}/> FIND THEIR FIT</span><h2 id="ks-size-title">Panduan ukuran.</h2>
      <p>Bandingkan dengan kaos favorit si kecil. Ukuran di bawah adalah ukuran kaos saat dibentangkan, bukan lingkar badan.</p>
      <table className="ks-size-table"><caption>Boxy oversize · ukuran dalam sentimeter</caption><thead><tr><th scope="col">Ukuran</th><th scope="col">Lebar</th><th scope="col">Panjang</th><th scope="col"><span className="sr-only">Pilih ukuran</span></th></tr></thead><tbody>{SIZE_CHART.map(([size, width, length]) => <tr key={size} data-selected={selected === size}><th scope="row">{size}</th><td>{width} cm</td><td>{length} cm</td><td>{product.sizes?.includes(size) ? <button type="button" aria-label={`Gunakan ukuran ${size}`} onClick={() => { onSelect(size); close(); }}>{selected === size ? <Check size={16}/> : 'Pilih'}</button> : <span aria-label="Tidak ditawarkan pada motif ini">—</span>}</td></tr>)}</tbody></table>
      <div className="ks-measure-guide"><div><b>01 / LEBAR</b><p>Ukur mendatar dari ketiak kiri ke ketiak kanan.</p></div><div><b>02 / PANJANG</b><p>Ukur dari bahu dekat leher hingga ujung bawah kaos.</p></div></div>
      <p className="ks-size-note">Pola boxy oversize dengan rasio lebar dan panjang 1:1. Toleransi jahitan 1–2 cm. Label usia adalah panduan; utamakan hasil pengukuran kaos.</p>
    </motion.section>
  </motion.div>}</AnimatePresence>, document.body);
}
