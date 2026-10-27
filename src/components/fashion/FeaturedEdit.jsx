import { forwardRef, memo, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Heart, Images, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../constants/data';
import { useCompact } from './hooks';
import { productImages } from '../../utils/productMedia';
import { productImageProps } from '../../utils/productImages';
import { catalogHref, plainClick, productHref } from '../../utils/productRoutes';
import './featured-edit.css';

export function ProductPhoto({ src, alt, loading = 'lazy', className = '' }) {
  const [failed, setFailed] = useState(false);
  return <div className={`edit-photo ${src?.endsWith('-2.jpg') ? 'edit-photo--model' : 'edit-photo--studio'} ${className}`}>
    {!failed && src ? <img {...productImageProps(src)} width="1254" height="1254" alt={alt} loading={loading} decoding="async" draggable={false} onError={() => setFailed(true)} /> : <div className="edit-photo-fallback"><img src="/website-logo.png" alt="Kainora Kids" /><span>Foto belum dapat dimuat</span></div>}
  </div>;
}

const FeaturedCard = memo(forwardRef(function FeaturedCard({ product, index, onQuickView }, forwardedRef) {
  const { wishlist, toggleWishlist } = useStore();
  const reduce = useReducedMotion(), compact = useCompact();
  const [hovered, setHovered] = useState(false), [alternate, setAlternate] = useState(false);
  const photos = useMemo(() => productImages(product), [product]);
  const mediaRef = useRef(null), bounds = useRef(null);
  const px = useMotionValue(0), py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 240, damping: 28 });
  const y = useSpring(py, { stiffness: 240, damping: 28 });
  const showSecond = photos.length > 1 && (alternate || (!compact && !reduce && hovered));
  const saved = wishlist.includes(product.id);
  const priceKnown = product.price !== undefined && product.price !== null && Number.isFinite(Number(product.price));
  const reset = () => { setHovered(false); bounds.current = null; px.set(0); py.set(0); };
  return <motion.article ref={forwardedRef} className="edit-card" layout={!compact && !reduce ? 'position' : false} data-product-id={product.id}
    initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }}
    exit={{ opacity: 0, scale: reduce ? 1 : .97 }} transition={{ opacity: { duration: .22 }, y: { type: 'spring', stiffness: 180, damping: 25, delay: index % 4 * .035 }, layout: { type: 'spring', stiffness: 260, damping: 30 } }}>
    <div className="edit-card-media" ref={mediaRef}
      onPointerEnter={event => { if (reduce || compact || event.pointerType !== 'mouse') return; bounds.current = event.currentTarget.getBoundingClientRect(); setHovered(true); }}
      onPointerMove={event => { const box = bounds.current; if (!box || reduce || compact || event.pointerType !== 'mouse') return; px.set((event.clientX - box.left - box.width / 2) * .014); py.set((event.clientY - box.top - box.height / 2) * .014); }} onPointerLeave={reset}>
      <motion.button type="button" className="edit-card-open" onClick={() => onQuickView(product)} aria-label={`Lihat cepat ${product.name}`} whileTap={reduce ? {} : { scale: .985 }}>
        <motion.div className="edit-image-plane" style={reduce || compact ? {} : { x, y }} animate={{ scale: !reduce && hovered ? 1.025 : 1 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
          <ProductPhoto src={photos[0]} alt={product.alt || product.name} />
          {photos[1] && showSecond && <motion.div className="edit-alternate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : .24 }} aria-hidden="true"><ProductPhoto src={photos[1]} alt="" loading="eager" /></motion.div>}
        </motion.div>
      </motion.button>
      <span className="edit-card-number" aria-label={`Pilihan ${index + 1}`}>{String(index + 1).padStart(2, '0')}<span> / KAINORA</span></span>
      {!product.photoOnly && <motion.button type="button" className="edit-card-save" onClick={event => toggleWishlist(event, product.id)} aria-label={`${saved ? 'Hapus' : 'Simpan'} ${product.name} ${saved ? 'dari' : 'ke'} favorit`} aria-pressed={saved} whileTap={reduce ? {} : { scale: .86 }}><Heart size={19} fill={saved ? 'currentColor' : 'none'} /></motion.button>}
      {photos.length > 1 && <button type="button" className="edit-card-photo-toggle" aria-label={`Ganti foto ${product.name}`} aria-pressed={alternate} onClick={() => { setHovered(false); setAlternate(value => !value); }}><Images size={15} /><span>{alternate ? 'FOTO 2' : '2 FOTO'}</span></button>}
      <div className="edit-card-hover-label" aria-hidden="true">LIHAT LEBIH DEKAT <ArrowUpRight size={17} /></div>
    </div>
    <div className="edit-card-copy"><p className="edit-card-category">GRAPHIC TEE <span>{product.photoOnly ? 'FOTO MOTIF' : product.model || 'THE KAINORA EDIT'}</span></p>
      <h3><a href={productHref(product)} onClick={event => { if (plainClick(event)) { event.preventDefault(); onQuickView(product); } }}>{product.name.replace(/^Kaos\s+/i, '')}</a></h3>
      <div className="edit-card-details"><p className={priceKnown ? 'edit-card-price' : 'edit-card-price-pending'}>{priceKnown ? formatPrice(product.price) : 'Info harga menyusul'}</p><span>{product.sizes?.length ? `${product.sizes.length} ukuran` : 'Detail belum tersedia'}</span></div>
      {product.sizes?.length > 0 && <div className="edit-card-sizes" aria-label={`Ukuran ${product.name}`}>{product.sizes.map(size => <span key={size}>{size}</span>)}</div>}
      <motion.button type="button" className="edit-card-cta" onClick={() => onQuickView(product)} whileTap={reduce ? {} : { scale: .98 }}><span>{product.photoOnly ? 'LIHAT FOTO MOTIF' : 'PILIH UKURAN'}</span><ArrowUpRight size={19} /></motion.button>
    </div>
  </motion.article>;
}));

export function FeaturedEdit({ products, onQuickView, onShop }) {
  const [filter, setFilter] = useState('Semua'), [search, setSearch] = useState('');
  const reduce = useReducedMotion();
  const compact = useCompact();
  const indicator = useId();
  const filtered = useMemo(() => products.filter(product => (filter === 'Semua' || filter === 'Foto lengkap' && product.images?.length > 1 || filter === 'Siap pilih ukuran' && product.sizes?.length > 0) && (product.name || '').toLocaleLowerCase('id').includes(search.trim().toLocaleLowerCase('id'))), [products, filter, search]);
  const reset = () => { setFilter('Semua'); setSearch(''); };
  return <section id="products" className="f-featured-edit f-inset" data-section="02B" aria-labelledby="featured-edit-title">
    <h2 id="featured-edit-title" className="sr-only">Produk pilihan Kainora Kids</h2>
    <div className="edit-toolbar"><div className="edit-filters" role="group" aria-label="Saring produk pilihan">{['Semua', 'Foto lengkap', 'Siap pilih ukuran'].map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{filter === item && <motion.span className="edit-filter-indicator" layoutId={compact || reduce ? undefined : indicator} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }} />}<span>{filter === item && <Check size={13} />}{item}</span></button>)}</div><label className="edit-search"><Search size={18} /><span className="sr-only">Cari produk pilihan</span><input type="search" placeholder="Cari motif favorit" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Hapus pencarian produk pilihan" onClick={() => setSearch('')}><X size={15} /></button>}</label></div>
    <p className="edit-results" role="status">{filtered.length} dari {products.length} pilihan{search ? ` untuk “${search}”` : ''}</p>
    <motion.div className="edit-grid" layout={!compact && !reduce ? 'position' : false}><AnimatePresence mode={compact ? 'sync' : 'popLayout'}>{filtered.map((product, index) => <FeaturedCard key={product.id} product={product} index={index} onQuickView={onQuickView} />)}</AnimatePresence></motion.div>
    {!filtered.length && <div className="edit-empty"><h3>Motifnya belum ketemu.</h3><p>Coba kata lain atau tampilkan semua pilihan.</p><button className="f-text-link" onClick={reset}>RESET PILIHAN <ArrowRight size={17} /></button></div>}
    <div className="edit-end"><span>GOOD CLOTHES. GREAT LITTLE DAYS.</span><a href={catalogHref()} className="f-text-link" onClick={event => { if (plainClick(event)) { event.preventDefault(); onShop(); } }}>JELAJAHI SEMUA PRODUK <ArrowRight size={18} /></a></div>
  </section>;
}
