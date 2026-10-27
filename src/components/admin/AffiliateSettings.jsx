import { formatPrice } from '../../utils/pricing';
import { affiliateEstimate } from '../../utils/affiliate';

export function AffiliateSettings({ products, onChange, resolveMedia }) {
  return <section className="ca-affiliate-settings" aria-label="Pengaturan komisi affiliate">
    <p className="ca-note">Atur komisi simulasi untuk setiap produk. Kosongkan untuk mengeluarkan produk dari simulator. Harga dan persentase harus tersedia; 0% berarti komisi nol. Perubahan mengikuti tombol Simpan ke project / Terbitkan di atas.</p>
    <div className="ca-commission-head" aria-hidden="true"><span>PRODUK KATALOG</span><span>KOMISI (%)</span><span>ESTIMASI / PENJUALAN</span></div>
    {products.map(product => {
      const estimate = affiliateEstimate(product);
      return <div className="ca-commission-row" key={product.id}>
        <div className="ca-commission-product"><img src={resolveMedia(product.img)} alt="" loading="lazy"/><div><strong>{product.name}</strong><small>{formatPrice(product.price)}{product.catalogPreview ? ' · Pratinjau' : ''}</small></div></div>
        <label><span className="sr-only">Komisi affiliate {product.name} (%)</span><input type="number" inputMode="decimal" min="0" max="100" step="0.01" placeholder="Belum diatur" value={product.affiliateCommissionPercent ?? ''} onChange={event => onChange(product.id, event.target.value === '' ? undefined : Number(event.target.value))}/><span aria-hidden="true">%</span></label>
        <span className="ca-commission-result">{estimate ? formatPrice(estimate.perSale) : typeof product.price === 'number' && product.price > 0 ? 'Komisi belum diatur' : 'Harga belum tersedia'}</span>
      </div>;
    })}
    {!products.length && <p className="ca-empty">Tambahkan produk katalog sebelum mengatur komisi.</p>}
  </section>;
}
