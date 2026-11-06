import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { useMotionPreference } from '../fashion/useMotionPreference';
import { productHref, plainClick } from '../../utils/productRoutes';
import { productPriceLabel } from '../../utils/pricing';
import { schemaJSON } from '../../utils/productSeo';
import { productImageProps } from '../../utils/productImages';

export function ShopReveal({ children, className, delay = 0, priority = false }) {
  const reduce = useMotionPreference();
  return <motion.div className={className} initial={reduce || priority ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .65, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

export function useShopSchema(schema) {
  const json = schemaJSON(schema);
  useEffect(() => {
    let script = document.getElementById('commerce-jsonld');
    if (!script) { script = document.createElement('script'); script.id = 'commerce-jsonld'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = json;
    return () => script.remove();
  }, [json]);
}

export function ShopProductCard({ product, index = 0, onOpen, wishlisted, onToggleWishlist, headingLevel = 'h2', defer = false }) {
  const Heading = headingLevel;
  const [preview, setPreview] = useState(false);
  const images = [...new Set([product.img, ...(product.images || [])].filter(Boolean))];
  return <article className="ks-card">
    <div className="ks-card-visual" onPointerEnter={event => { if (event.pointerType === 'mouse') setPreview(true); }}><a href={productHref(product)} onClick={event => { if (plainClick(event)) { event.preventDefault(); onOpen(product); } }} className="ks-card-link" aria-label={`Lihat ${product.name}`}><img className="ks-card-cover" {...productImageProps(images[0])} alt={product.alt || product.name} width="1254" height="1254" loading={!defer && index < 2 ? 'eager' : 'lazy'} fetchpriority={!defer && index < 2 ? 'high' : 'auto'} decoding="async"/>{images[1] && preview && <img className="ks-card-alternate" {...productImageProps(images[1])} alt={`${product.name}, foto pemakaian`} width="1254" height="1254" decoding="async"/>}<span className="ks-card-reveal">LIHAT DETAIL <ArrowUpRight size={18}/></span></a><button type="button" className="ks-card-wish" onClick={event => onToggleWishlist(event, product.id)} aria-label={`${wishlisted ? 'Hapus' : 'Simpan'} ${product.name} ${wishlisted ? 'dari' : 'ke'} favorit`} aria-pressed={wishlisted}><Heart size={17} fill={wishlisted ? 'currentColor' : 'none'}/></button></div>
    <div className="ks-card-copy"><span className="ks-eyebrow">{product.model || product.type || 'GRAPHIC TEE'}</span><a href={productHref(product)} onClick={event => { if (plainClick(event)) { event.preventDefault(); onOpen(product); } }}><Heading>{product.name}</Heading><ArrowUpRight size={19}/></a><div className="ks-card-price"><strong>{productPriceLabel(product)}</strong><span><i style={{ background: product.colors?.[0] || '#f8f7ef' }}/>{product.warna || 'Lihat detail'}</span></div></div>
  </article>;
}
