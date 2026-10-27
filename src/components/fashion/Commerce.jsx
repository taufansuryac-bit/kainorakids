import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Heart, Plus, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS, formatPrice } from '../../constants/data';
import { Overline, RevealLines } from './motion';
import { TIMING } from './design';
import { useDialog } from './hooks';
import { productAvailability } from '../../utils/productAvailability';
import { productImages } from '../../utils/productMedia';
import { ProductPhoto } from './FeaturedEdit';
import './garment-theater.css';

const GarmentCanvas = lazy(() => import('./GarmentCanvas'));

const isPreviewProduct = (p) => p.catalogPreview === true || INITIAL_PRODUCTS.includes(p);
const unavailable = (p) => productAvailability(p) === 'OutOfStock';
const openDetail = (p) => window.dispatchEvent(new CustomEvent('OPEN_PRODUCT', { detail: p }));

export function CatalogNotice({ products }) {
  return products.some(isPreviewProduct) ? <p className="f-catalog-notice">PRATINJAU KATALOG — Harga dan ukuran mengikuti data contoh lama. Konfirmasi ketersediaan melalui alur pemesanan toko.</p> : null;
}

function SizePicker({ product, size, onSize }) {
  return <fieldset className="f-size-picker"><legend>UKURAN <span>{size ? ` / ${size}` : ' / PILIH DAHULU'}</span></legend><div>{(product.sizes || []).map((s) => <button key={s} aria-pressed={size === s} onClick={() => onSize(s)} className={size === s ? 'selected' : ''}>{s}</button>)}</div>{!product.sizes?.length && <p>Ukuran belum tersedia.</p>}</fieldset>;
}

function ColorAvailability({ product }) {
  return <div className="f-color-availability"><span>WARNA / {product.warna || 'LIHAT FOTO PRODUK'}</span><div>{(product.colors || []).map((color, i) => <button key={color} className="f-color-dot" style={{ background: color }} disabled={i > 0} aria-label={`${i === 0 ? product.warna || color : color + ', foto varian belum tersedia'}`} aria-pressed={i === 0} title={i ? 'Foto varian belum tersedia' : product.warna || color} />)}</div></div>;
}

export function ProductTheater({ products }) {
  const { content } = useStore();
  const entries = content.garments;
  const [activeId, setActiveId] = useState(entries[0]?.id);
  const entry = entries.find(item => item.id === activeId) || entries[0];
  const selected = products.find(p => String(p.id) === entry?.productId);
  const select = useCallback(item => setActiveId(item.id), []);
  const theaterRef = useRef(null);
  const near = useInView(theaterRef, { margin: '350px 0px', once: true });
  const visible = useInView(theaterRef, { amount: .05 });
  if (!entry) return null;
  return <section ref={theaterRef} id="theater" data-section="04" className="f-theater f-garment-theater f-inset" aria-labelledby="theater-title"><div className="f-section-heading f-no-padding"><div><Overline>04 / MADE FOR LITTLE EXPLORERS</Overline><h2 id="theater-title" className="f-title">A CLOSER LOOK.</h2></div><p>Bentuk yang leluasa.<br />Cerita di setiap sisi.</p></div>
    <div className="f-theater-model-layout">
      <div>{near ? <Suspense fallback={<div className="garment-viewer"><div className="garment-canvas"><div className="garment-loading" role="status">MENYIAPKAN TAMPILAN 3D</div></div></div>}><GarmentCanvas key={entries.map(item => item.id).join(':')} entries={entries} onSelect={select} model="oversized" active={visible} /></Suspense> : <div className="garment-viewer"><div className="garment-canvas" /></div>}</div>
      <div className="f-form-copy"><Overline>OVERSIZE / GRAPHIC TEE</Overline><h3>{entry.name}</h3><p>{entry.description}</p>{selected && <button className="f-product-cta" onClick={() => openDetail(selected)}><span>LIHAT PRODUK</span><span className="f-product-cta-icon" aria-hidden="true"><ArrowUpRight size={23} /></span></button>}<p className="f-form-disclaimer">Pratinjau visual. Detail mengikuti informasi produk.</p></div>
    </div>
  </section>;
}

export function QuickShopModal({ product, onClose }) {
  const { addToCart, setView } = useStore();
  const [size, setSize] = useState(''), [photo, setPhoto] = useState(0);
  const ref = useDialog(!!product, onClose);
  const reduce = useReducedMotion();
  if (!product) return null;
  const images = productImages(product);
  const priceKnown = product.price !== undefined && product.price !== null && Number.isFinite(Number(product.price));
  const canOrder = !product.photoOnly && priceKnown && product.sizes?.length > 0;
  return <motion.div className="f-modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="f-quick-dialog edit-quick-dialog" role="dialog" aria-modal="true" aria-labelledby="quick-shop-title" initial={reduce ? false : { y: 25, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { y: 10, opacity: 0 }} transition={TIMING.spring}>
      <button className="f-modal-close f-round" onClick={onClose} aria-label="Tutup detail cepat"><X size={20} /></button>
      <div className="f-quick-visual"><AnimatePresence mode="wait" initial={false}><motion.div key={images[photo]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .16 }}><ProductPhoto key={images[photo]} src={images[photo]} alt={`${product.alt || product.name}, foto ${photo + 1}`} loading="eager" /></motion.div></AnimatePresence><div>{images.map((image, index) => <button key={image} aria-pressed={photo === index} onClick={() => setPhoto(index)}>{image.endsWith('-1.jpg') ? 'FOTO PRODUK' : 'FOTO MODEL'}</button>)}</div></div>
      <div className="f-quick-copy"><Overline>{product.photoOnly ? 'THE MOTIF / KAINORA KIDS' : 'THE KAINORA EDIT'}</Overline><h2 id="quick-shop-title">{product.name}</h2>
        {priceKnown && <p className="f-price">{formatPrice(product.price)}</p>}
        {isPreviewProduct(product) && <p className="f-small-note">Harga dan ukuran dari data pratinjau; konfirmasi ketersediaan saat pemesanan.</p>}
        {product.photoOnly ? <><p className="edit-photo-only-note">Foto motif tersedia untuk dilihat. Harga, ukuran, dan stok motif ini belum tercantum dalam katalog.</p><button className="f-button" onClick={() => { onClose(); setView('products'); }}>JELAJAHI KATALOG <ArrowUpRight size={18} /></button></> : <><ColorAvailability product={product} /><SizePicker product={product} size={size} onSize={setSize} /><button className="f-button" disabled={!canOrder || !size || unavailable(product)} onClick={() => { if (!canOrder || !product.sizes.includes(size)) return; addToCart(product, size, 1); onClose(); }}>{unavailable(product) ? 'BELUM TERSEDIA' : !canOrder ? 'DETAIL BELUM TERSEDIA' : size ? 'TAMBAH KE KERANJANG' : 'PILIH UKURAN'}<Plus size={18} /></button><button className="f-text-link" onClick={() => { onClose(); openDetail(product); }}>SPESIFIKASI LENGKAP <ArrowUpRight size={18} /></button></>}
      </div>
    </motion.div>
  </motion.div>;
}

export function ShopGrid({ products, onQuickView, onShop }) {
  const { wishlist, toggleWishlist } = useStore();
  const [filter, setFilter] = useState('Semua'), [search, setSearch] = useState('');
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: .05 });
  const reduce = useReducedMotion();
  const filtered = useMemo(() => products.filter(p => (filter === 'Semua' || p.gender === filter || p.gender === 'Unisex') && p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8), [products, filter, search]);
  return <section id="products" className="f-shop f-inset" data-section="08" aria-labelledby="shop-title"><div className="f-section-heading f-no-padding"><div><Overline>08 / SHOP THE GRAPHIC EDIT</Overline><RevealLines id="shop-title" lines={['NEW DROPS.', 'NEW STORIES.']} /></div><button className="f-text-link" onClick={onShop}>SELURUH KATALOG <ArrowUpRight size={19} /></button></div><CatalogNotice products={products} /><div className="f-shop-toolbar"><div className="f-filters" aria-label="Filter koleksi">{['Semua', 'Laki-laki', 'Perempuan'].map(f => <button key={f} className={filter === f ? 'selected' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'Semua' ? 'SEMUA' : f === 'Laki-laki' ? 'BOYS' : 'GIRLS'}</button>)}</div><label className="f-shop-search"><Search size={16} /><input placeholder="Cari motif..." aria-label="Cari motif di koleksi beranda" value={search} onChange={e => setSearch(e.target.value)} /></label><span className="f-cap" aria-live="polite">{filtered.length} PRODUK</span></div>
    <motion.div ref={gridRef} className="f-shop-grid" layout><AnimatePresence mode="popLayout" initial={false}>{filtered.map((p, i) => { const photos = productImages(p); return <motion.article layout key={p.id} className="f-shop-card" initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={gridInView || reduce ? { opacity: 1, clipPath: 'inset(0 0 0% 0)' } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: reduce ? 0 : .55, delay: i % 4 * .055, layout: TIMING.spring }}><div className={`f-shop-image ${productImages(p)[0]?.endsWith('-2.jpg') ? 'f-model-crop' : ''}`}><button className="f-shop-open" onClick={() => onQuickView(p)} aria-label={`Lihat cepat ${p.name}`}><img src={photos[0]} alt={p.alt || p.name} loading="lazy" />{photos[1] && <img className="f-shop-secondary" src={photos[1]} alt={`Foto koleksi tambahan ${p.name}`} loading="lazy" />}</button><button className="f-shop-wishlist" aria-label={wishlist.includes(p.id) ? `Hapus ${p.name} dari favorit` : `Simpan ${p.name} ke favorit`} aria-pressed={wishlist.includes(p.id)} onClick={e => toggleWishlist(e, p.id)}><Heart size={18} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} /></button><span className="f-shop-tag f-cap">{isPreviewProduct(p) ? 'PREVIEW' : p.type || 'KAINORA'}</span><button className="f-shop-add" onClick={() => onQuickView(p)} aria-label={`Pilih ukuran ${p.name}`}><Plus size={19} /></button></div><div className="f-shop-meta"><h3><button onClick={() => onQuickView(p)}>{p.name}</button></h3><p>{formatPrice(p.price)}</p><span>{(p.sizes || []).join(' / ')}</span></div></motion.article>; })}</AnimatePresence></motion.div>{!filtered.length && <p className="f-empty-results" role="status">Belum ada motif yang cocok. Coba kata kunci lain.</p>}
  </section>;
}

export function CommerceScenes({ children }) {
  const [quick, setQuick] = useState(null);
  const close = useCallback(() => setQuick(null), []);
  return <>{children(setQuick)}<AnimatePresence>{quick && <QuickShopModal key={quick.id} product={quick} onClose={close} />}</AnimatePresence></>;
}
