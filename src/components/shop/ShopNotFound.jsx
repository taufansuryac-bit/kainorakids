import { ArrowUpRight } from 'lucide-react';
import { SEO } from '../../constants/data';
export function ShopNotFound() {
  return <main className="ks-shop ks-not-found"><SEO title="Produk tidak ditemukan | Kainora Kids" description="Motif yang dicari tidak tersedia. Jelajahi kembali koleksi kaos anak Kainora Kids." canonicalPath={window.location.pathname} robots="noindex, follow"/><span className="ks-eyebrow">KAINORA / 404</span><h1>MOTIF INI<br/>BELUM KETEMU.</h1><p>Tautan mungkin berubah atau produk sudah tidak ada di katalog.</p><a href="/products/" className="ks-button">KEMBALI KE KOLEKSI <ArrowUpRight size={20}/></a></main>;
}
