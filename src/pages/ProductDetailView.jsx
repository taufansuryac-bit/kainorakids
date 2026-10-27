import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, Copy, Heart, Minus, Plus, Ruler, ShoppingBag, Star } from 'lucide-react';
import { SEO } from '../constants/data';
import { useStore } from '../context/StoreContext';
import { ProductSizeGuide } from '../components/shop/ProductSizeGuide';
import { useMotionPreference } from '../components/fashion/useMotionPreference';
import { ProductGallery } from '../components/shop/ProductGallery';
import { ShopProductCard, ShopReveal, useShopSchema } from '../components/shop/ShopShared';
import { ShopNotFound } from '../components/shop/ShopNotFound';
import { canOrder, formatPrice, priceKnown } from '../utils/pricing';
import { catalogHref, plainClick, productHref } from '../utils/productRoutes';
import { productBreadcrumb, productDescription, productMetaDescription, productSchema, productTitle } from '../utils/productSeo';
import './shop.css';
import { BuyerGuideLinks } from '../components/shop/BuyerGuideLinks';
import { availabilityLabel, productAvailability } from '../utils/productAvailability';
import { COMMERCE_POLICY } from '../content/commercePolicies';
import { productImageProps } from '../utils/productImages';
import { analyticsItem, track } from '../utils/analytics';
import { relatedProducts } from '../utils/productRelated';

const CONTACT = 'https://www.instagram.com/kainorakids/';

export const ProductDetailView = props => props.activeProduct ? <ProductDetail key={props.activeProduct.id} {...props}/> : <ShopNotFound/>;

function ProductDetail({ activeProduct: product, setActiveProduct }) {
  const { setView, addToCart, toggleWishlist, wishlist, user, showToast, setIsAuthModalOpen, products, content } = useStore();
  const reduce = useMotionPreference();
  const [size, setSize] = useState(''), [quantity, setQuantity] = useState(1), [sizeOpen, setSizeOpen] = useState(false), [sizeError, setSizeError] = useState('');
  const [reviews, setReviews] = useState([]), [reviewError, setReviewError] = useState(false);
  const buyBox = useRef(null), sizeGroup = useRef(null);
  const buyVisible = useInView(buyBox, { margin: '-80px 0px -20px 0px' });
  const ready = priceKnown(product.price) && !product.photoOnly && !product.catalogPreview && product.sizes?.length > 0;
  const soldOut = productAvailability(product) === 'OutOfStock';
  const maxQuantity = Math.max(1, Math.min(99, typeof product.stock === 'number' ? Math.floor(product.stock) : 99));
  useEffect(() => {
    setReviews([]);setReviewError(false);
    if (!user?.uid || !user?.email) return;
    let cancelled=false,unsubscribe;
    Promise.all([import('firebase/firestore'),import('../firebase')]).then(([{collection,limit,onSnapshot,query,where},{db,appId}])=>{
      if(cancelled)return;
      unsubscribe=onSnapshot(query(collection(db,'artifacts',appId,'public','data','reviews'),where('productId','==',product.id),limit(12)),snapshot=>setReviews(snapshot.docs.map(doc=>({...doc.data(),id:doc.id})).filter(review=>!review.isDummy&&typeof review.text==='string'&&review.rating>=1&&review.rating<=5)),()=>setReviewError(true));
    }).catch(()=>{if(!cancelled)setReviewError(true);});
    return()=>{cancelled=true;unsubscribe?.();};
  }, [product.id, user?.uid, user?.email]);
  useShopSchema([productSchema(product, reviews), productBreadcrumb(product)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- one view_item per product shown
  useEffect(() => { track('view_item', { currency: 'IDR', value: Number(product.price) || 0, items: [analyticsItem(product)] }); }, [product.id]);
  const openProduct = item => {setActiveProduct(item);setView('productDetail');};
  const add = () => {
    if (!size) {setSizeError('Pilih ukuran yang ingin dimasukkan ke keranjang.');sizeGroup.current?.querySelector('button')?.focus();return;}
    if (!ready || !canOrder(product, size) || soldOut) return;
    addToCart(product, size, quantity);
  };
  const copy = async () => {try {await navigator.clipboard.writeText(`${window.location.origin}${productHref(product)}`);showToast('Tautan produk disalin.');} catch {showToast('Salin tautan produk dari kolom alamat browser.');}};
  const cta = (compact = false) => soldOut ? <button className="ks-button" disabled type="button">STOK SEDANG HABIS</button> : ready ? <button type="button" className="ks-button ks-button-acid" onClick={add}><ShoppingBag size={18}/><span>{compact ? size ? `TAMBAH · ${size}` : 'PILIH UKURAN' : 'TAMBAH KE KERANJANG'}</span><ArrowUpRight size={19}/></button> : <a className="ks-button ks-button-acid" href={CONTACT} target="_blank" rel="noopener noreferrer"><span>{priceKnown(product.price) ? 'TANYAKAN DETAIL' : 'TANYAKAN PRODUK'}</span><ArrowUpRight size={19}/></a>;
  const related = relatedProducts(product, products);
  const garment = content.garments.find(item => String(item.productId) === String(product.id));
  const motifLead = product.desc?.match(/^[^.!?]+[.!?]?/)?.[0] || 'Grafis yang punya karakter, untuk cerita si kecil.';
  return <main className="ks-shop ks-detail">
    <SEO title={productTitle(product)} description={productMetaDescription(product)} keywords={`${product.name}, kaos anak, Kainora Kids, ${product.model || product.type}`} image={product.img} imageAlt={product.alt || product.name} canonicalPath={productHref(product)} robots="index, follow, max-image-preview:large"/>
    <nav className="ks-breadcrumb ks-section" aria-label="Breadcrumb"><a href="/" onClick={event => {if (plainClick(event)) {event.preventDefault();setView('home');}}}>Beranda</a><span>/</span><a href={catalogHref()} onClick={event => {if (plainClick(event)) {event.preventDefault();setView('products');}}}>Koleksi kaos</a><span>/</span><span aria-current="page">{product.name}</span></nav>
    <section className="ks-detail-grid ks-section" aria-labelledby="ks-product-title"><ShopReveal priority className="ks-detail-gallery"><ProductGallery product={product} garment={garment}/></ShopReveal><div className="ks-product-info"><div className="ks-product-topline"><span className="ks-eyebrow">KAINORA KIDS / THE GRAPHIC EDIT</span><button type="button" onClick={copy} aria-label="Salin tautan produk"><Copy size={16}/></button></div><motion.h1 id="ks-product-title" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: [.22, 1, .36, 1] }}>{product.name}</motion.h1><div className="ks-product-price"><strong>{formatPrice(product.price)}</strong><span><i style={{ background: product.colors?.[0] || '#f8f7ef' }}/>{product.warna || 'Lihat foto'}</span></div><p className="ks-product-lead">{motifLead}</p><p className="ks-availability" data-status={productAvailability(product)}>{availabilityLabel(product)}{productAvailability(product) === 'InStock' && ` · Ukuran ${product.sizes.join(', ')}`}</p>
      <div className="ks-product-facts">{[[product.bahan || 'Lihat detail produk', 'MATERIAL'], [product.model || product.type || 'Kainora Kids', 'POTONGAN']].map(([value, label]) => <div key={label}><span className="ks-eyebrow">{label}</span><strong>{value}</strong></div>)}</div>
      <div className="ks-buy-box" ref={buyBox}><div className="ks-size-heading"><span className="ks-eyebrow">PILIH UKURAN</span><button type="button" onClick={() => setSizeOpen(true)}><Ruler size={15}/>Size chart & panduan</button></div>{product.sizes?.length ? <div className="ks-sizes" ref={sizeGroup} role="group" aria-label="Ukuran kaos">{product.sizes.map(item => <button type="button" key={item} disabled={soldOut} aria-pressed={size === item} onClick={() => {setSize(item);setSizeError('');}}>{item}{size === item && <Check size={12}/>}</button>)}</div> : <p className="ks-size-pending">Pilihan ukuran sedang dilengkapi. Tanyakan ukuran yang sesuai sebelum memesan.</p>}{sizeError && <p className="ks-size-error" role="alert">{sizeError}</p>}{ready && <div className="ks-quantity-row"><span>Jumlah</span><div><button type="button" aria-label="Kurangi jumlah" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={15}/></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Tambah jumlah" disabled={quantity >= maxQuantity} onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}><Plus size={15}/></button></div></div>}<div className="ks-purchase-actions">{cta()}<button type="button" className="ks-save-product" aria-label={`${wishlist.includes(product.id) ? 'Hapus dari' : 'Simpan ke'} favorit`} aria-pressed={wishlist.includes(product.id)} onClick={event => toggleWishlist(event, product.id)}><Heart size={20} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}/></button></div><p className="ks-buy-note">{soldOut ? 'Simpan motif ini ke favorit dan tanyakan ketersediaan berikutnya.' : ready ? 'Ongkir dan ketersediaan akhir dikonfirmasi saat pemesanan.' : 'Tim Kainora membantu konfirmasi ukuran dan ketersediaan melalui Instagram.'}</p>{product.catalogPreview && <p className="ks-size-pending">Data produk ini masih berupa pratinjau. Konfirmasikan detail sebelum memesan.</p>}</div>
      <div className="ks-detail-accordions"><details open><summary>Tentang motif ini <Plus size={16}/></summary><p>{product.desc || productDescription(product)}</p></details><details><summary>Detail bahan & potongan <Plus size={16}/></summary><dl>{[['Bahan', product.bahan], ['Potongan', product.model], ['Warna', product.warna], ['Jahitan', product.jahitan]].filter(([,value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details><details><summary>Pemesanan & pengiriman <Plus size={16}/></summary><p>{COMMERCE_POLICY.shippingSummary}</p><BuyerGuideLinks/></details></div>
    </div></section>
    <section className="ks-detail-story ks-section"><div className="ks-meta"><span>01 / A CLOSER FEEL</span><span>SEE THE DETAILS. FEEL THE PERSONALITY.</span></div><div className="ks-story-grid"><ShopReveal><span className="ks-eyebrow">IT’S ALL IN THE DETAILS.</span><h2>BUKAN CUMA<br/><span>SEBUAH KAOS.</span></h2><p>Sebuah motif bisa jadi awal cerita. Lihat komposisi grafis dari dekat, bandingkan tampilan saat dikenakan, dan pilih karakter yang paling terasa seperti si kecil.</p><div className="ks-story-specs"><div><b>01</b><span>{product.model || 'Lihat potongan pada foto'}<small>POTONGAN</small></span></div><div><b>02</b><span>{product.bahan || 'Konfirmasikan komposisi bahan'}<small>MATERIAL</small></span></div><div><b>03</b><span>{product.images?.length > 1 ? 'Studio & referensi pemakaian' : 'Detail foto studio'}<small>KENALI SEBELUM MEMILIH</small></span></div></div><button type="button" className="ks-inline-link" onClick={() => {document.getElementById('ks-product-title')?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });}}>KEMBALI KE PILIHANMU <ArrowUpRight size={18}/></button></ShopReveal><ShopReveal className="ks-story-photo"><img {...productImageProps(product.images?.[1] || product.img, '(max-width:767px) calc(100vw - 58px), 45vw')} alt={`${product.name}, ${product.images?.length > 1 ? 'referensi pemakaian' : 'foto studio'}`} width="1254" height="1254" loading="lazy" decoding="async"/><span>YOUR LITTLE ONE. THEIR OWN STYLE. <ArrowUpRight size={18}/></span></ShopReveal></div></section>
    <section className="ks-reviews ks-section" aria-labelledby="ks-reviews-title"><div className="ks-review-heading"><div><span className="ks-eyebrow">02 / REAL VOICES</span><h2 id="ks-reviews-title">CERITA PEMBELI.</h2></div><span>{reviews.length ? `${reviews.length} ULASAN DITAMPILKAN` : 'SETIAP CERITA BERARTI'}</span></div>{reviews.length ? <div className="ks-review-grid">{reviews.map(review => <article key={review.id}><div className="ks-rating" aria-label={`${review.rating} dari 5 bintang`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < review.rating ? 'currentColor' : 'none'}/>)}</div><p>“{review.text}”</p><strong>{review.name || 'Pembeli Kainora'}</strong></article>)}</div> : <div className="ks-review-empty"><p>{reviewError ? 'Ulasan belum dapat dimuat. Silakan coba lagi nanti.' : user?.uid ? 'Belum ada ulasan untuk motif ini yang dapat ditampilkan.' : 'Masuk ke akunmu untuk melihat ulasan pembeli yang tersedia.'}</p>{!user?.uid && <button type="button" onClick={() => setIsAuthModalOpen(true)} className="ks-inline-link">MASUK KE AKUN <ArrowUpRight size={16}/></button>}</div>}</section>
    {related.length > 0 && <section className="ks-related ks-section" aria-labelledby="ks-related-title"><div className="ks-related-heading"><div><span className="ks-eyebrow">03 / KEEP EXPLORING</span><h2 id="ks-related-title">CERITA LAINNYA.</h2></div><a href={catalogHref()} className="ks-inline-link" onClick={event => {if (plainClick(event)) {event.preventDefault();setView('products');}}}>SEMUA MOTIF <ArrowUpRight size={17}/></a></div><div className="ks-product-grid">{related.map((item, index) => <ShopReveal key={item.id} delay={index * .05}><ShopProductCard defer product={item} headingLevel="h3" index={index} onOpen={openProduct} wishlisted={wishlist.includes(item.id)} onToggleWishlist={toggleWishlist}/></ShopReveal>)}</div></section>}
    <AnimatePresence>{!buyVisible && !sizeOpen && <motion.div className="ks-mobile-buy" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: .25 }}><div><small>{product.name}</small><strong>{formatPrice(product.price)}</strong></div>{cta(true)}</motion.div>}</AnimatePresence><ProductSizeGuide open={sizeOpen} close={() => setSizeOpen(false)} product={product} selected={size} onSelect={value => {setSize(value);setSizeError('');}}/>
  </main>;
}
