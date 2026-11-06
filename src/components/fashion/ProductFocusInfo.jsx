import { productPriceLabel } from '../../utils/pricing';
import { ArrowUpRight } from 'lucide-react';
import { plainClick, productHref } from '../../utils/productRoutes';
import './garment-grid.css';

export function ProductFocusInfo({ titleId, name, description, colorName, product }) {
  return <>
    <span className="garment-focus-overline">OVERSIZE KIDS TEE</span>
    <h2 id={titleId}>{name}</h2>
    {(description || product?.desc) && <p className="garment-focus-description">{description || product?.desc}</p>}
    <dl className="garment-focus-facts"><div><dt>WARNA</dt><dd>{colorName}</dd></div><div><dt>MODEL</dt><dd>{product?.model || 'Oversize Boxy'}</dd></div></dl>
    {typeof product?.price === 'number' && Number.isFinite(product.price) && <p className="garment-focus-price">{productPriceLabel(product)}</p>}
    {product?.sizes?.length > 0 && <p className="garment-focus-sizes">Ukuran {product.sizes.join(' · ')}</p>}
    {product ? <a className="garment-focus-detail-link" href={productHref(product)} onClick={event => { if (!plainClick(event)) return; event.preventDefault(); window.dispatchEvent(new CustomEvent('OPEN_PRODUCT', { detail: product })); }}>LIHAT DETAIL PRODUK <ArrowUpRight size={18} /></a> : <p className="garment-focus-unavailable">Detail produk ini belum tersedia di katalog.</p>}
  </>;
}
