import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useInView, useMotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight, Maximize2, ScanSearch, X } from 'lucide-react';
import { useDialog } from '../fashion/hooks';
import { useMotionPreference } from '../fashion/useMotionPreference';
import { galleryZoom, GALLERY_ZOOM } from '../../utils/galleryZoom';
import { productImageProps, productThumbnail } from '../../utils/productImages';

const GarmentCanvas = lazy(() => import('../fashion/GarmentCanvas'));
export function ProductGallery({ product, garment }) {
  const images = [...new Set([product.img, ...(product.images || [])].filter(Boolean))];
  const [index, setIndex] = useState(0), [open, setOpen] = useState(false);
  const [threeD, setThreeD] = useState(false), [magnify, setMagnify] = useState(false);
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const viewer = useRef(null), swipe = useRef(null), suppressClick = useRef(false);
  const viewerVisible = useInView(viewer, { margin: '80px' });
  const reduce = useMotionPreference();
  const lensX = useMotionValue(0), lensY = useMotionValue(0);
  const backgroundSize = useMotionValue(''), backgroundPosition = useMotionValue('');
  const dialog = useDialog(open, () => setOpen(false));
  const move = direction => {setMagnify(false);setIndex(previous => (previous + direction + images.length) % images.length);};
  useEffect(() => {
    if (!open) return;
    const key = event => {
      if (event.key === 'ArrowRight') {event.preventDefault();setIndex(i => (i + 1) % images.length);}
      if (event.key === 'ArrowLeft') {event.preventDefault();setIndex(i => (i - 1 + images.length) % images.length);}
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open, images.length]);
  const down = event => {suppressClick.current = false;if (event.pointerType !== 'mouse') swipe.current = {x: event.clientX, y: event.clientY};};
  const up = event => {
    if (!swipe.current) return;
    const dx = event.clientX - swipe.current.x, dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {suppressClick.current = true;move(dx < 0 ? 1 : -1);}
  };
  const track = event => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const zoom = galleryZoom(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);
    lensX.set(zoom.x);lensY.set(zoom.y);backgroundSize.set(zoom.backgroundSize);backgroundPosition.set(zoom.backgroundPosition);
    setMagnify(true);
  };
  const picture = (fullscreen = false) => <AnimatePresence initial={false} mode="wait"><motion.img key={images[index]} {...(fullscreen ? {src:images[index]} : productImageProps(images[index], '(max-width: 767px) calc(100vw - 44px), 52vw'))} alt={`${product.name} — ${index === 0 ? 'foto studio produk' : `foto detail ${index + 1}`}`} width="1254" height="1254" loading="eager" decoding="async" fetchpriority={fullscreen ? 'auto' : 'high'} initial={false} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} transition={{duration: reduce ? 0 : .24, ease: [.22, 1, .36, 1]}}/></AnimatePresence>;
  return <div className="ks-gallery">
    {garment && <div className="ks-gallery-mode" aria-label="Mode tampilan produk"><button type="button" aria-pressed={!threeD} onClick={() => setThreeD(false)}>FOTO PRODUK</button><button type="button" aria-pressed={threeD} onClick={() => setThreeD(true)}>LIHAT DALAM 3D ↗</button></div>}
    <div ref={viewer} className="ks-gallery-main" onPointerDown={threeD ? undefined : down} onPointerUp={threeD ? undefined : up} onPointerCancel={() => {swipe.current = null;}}>
      {threeD && garment ? <div className="ks-gallery-3d"><Suspense fallback={<p className="ks-3d-loading" role="status">Menyiapkan sudut pandang 3D…</p>}><GarmentCanvas entries={[garment]} active={viewerVisible} autoRotate={!reduce}/></Suspense></div> : <>
        <button className="ks-gallery-open" type="button" aria-label={`Perbesar foto ${product.name}`} onPointerMove={track} onPointerLeave={() => setMagnify(false)} onClick={() => {if (suppressClick.current) {suppressClick.current = false;return;}setMagnify(false);setOpen(true);}}>{picture()}
          <AnimatePresence>{magnify && <motion.span aria-hidden="true" className="ks-magnifier" style={{x: lensX, y: lensY, backgroundImage: `url("${images[index]}")`, backgroundSize, backgroundPosition}} initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: .9}} transition={{duration: reduce ? 0 : .16}}><span>{GALLERY_ZOOM}×</span></motion.span>}</AnimatePresence>
        </button><span className="ks-gallery-enlarge" aria-hidden="true"><Maximize2 size={18}/></span>
      </>}
    </div>
    {!threeD && <div className="ks-gallery-controls"><span>FOTO {String(index + 1).padStart(2, '0')}<small> / {String(images.length).padStart(2, '0')}</small></span><p><ScanSearch size={16}/><span>Arahkan untuk zoom · Klik untuk perbesar</span></p>{images.length > 1 && <div><button type="button" aria-label="Foto sebelumnya" onClick={() => move(-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Foto berikutnya" onClick={() => move(1)}><ArrowRight size={18}/></button></div>}</div>}
    <div className="ks-gallery-bottom"><div className="ks-thumbnails" aria-label="Pilih foto produk">{images.map((image, i) => <button type="button" key={image} aria-label={`Lihat foto ${i + 1}`} aria-pressed={!threeD && index === i} onClick={() => {setIndex(i);setThreeD(false);setMagnify(false);}}><img src={productThumbnail(image)} alt="" width="80" height="80" loading="lazy"/><span>{product.colorVariants?.find(variant=>variant.image===image)?.name || (i===0?'Produk':'Pemakaian')}</span></button>)}</div></div>
    {threeD && <p className="ks-gallery-3d-note">Pratinjau bentuk dan sablon. Gunakan foto produk sebagai acuan detail.</p>}
    {mounted && createPortal(<AnimatePresence>{open && <motion.div className="ks-lightbox" ref={dialog} role="dialog" aria-modal="true" aria-label={`Galeri ${product.name}`} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: reduce ? 0 : .22}} onClick={() => setOpen(false)}>
      <motion.div className="ks-lightbox-panel" initial={reduce ? false : {opacity: 0, y: 36, scale: .92}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 18, scale: .97}} transition={reduce ? {duration: 0} : {type: 'spring', stiffness: 240, damping: 28}} onClick={event => event.stopPropagation()}>
        <div className="ks-lightbox-heading"><div><small>KAINORA / DETAIL VIEW</small><strong>{product.name}</strong></div><button type="button" className="ks-lightbox-close" aria-label="Tutup galeri" onClick={() => setOpen(false)}><X size={23}/></button></div>
        <div className="ks-lightbox-image" onPointerDown={down} onPointerUp={up} onPointerCancel={() => {swipe.current = null;}}>{picture(true)}</div>
        <div className="ks-lightbox-caption"><span>{index === 0 ? 'Foto studio' : 'Referensi pemakaian'} <small>{index + 1} / {images.length}</small></span><div>{images.length > 1 && <><button type="button" aria-label="Foto sebelumnya di galeri" onClick={() => move(-1)}><ArrowLeft size={20}/></button><button type="button" aria-label="Foto berikutnya di galeri" onClick={() => move(1)}><ArrowRight size={20}/></button></>}</div></div>
      </motion.div>
    </motion.div>}</AnimatePresence>, document.body)}
  </div>;
}
