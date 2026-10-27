import { ArrowUpRight, Search } from 'lucide-react';
import { ProductCard } from '../neo/ProductCard';
import { SplitReveal, TextRoll } from '../motion/KineticText';

export const NewDropRail = ({ products, wishlist, onToggleWishlist, onOpen, onAll }) => (
  <section className="editorial-wrap new-drop-section" aria-labelledby="newdrop">
    <div className="section-heading">
      <div><p className="eyebrow">BARU MASUK / 7 HARI TERAKHIR</p><h2 id="newdrop" className="section-title"><SplitReveal text="PILIH FAVORITNYA." /></h2></div>
      <button onClick={onAll} className="outline-link roll-host"><TextRoll>Semua Produk</TextRoll><ArrowUpRight size={18} /></button>
    </div>
    {products.length ? <div className="new-drop-layout">
      <div className="new-drop-grid">
        {products.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} onOpen={onOpen} wishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />)}
      </div>
    </div> : <div className="neo-panel empty-drop"><Search size={32} /><p>Belum ada koleksi baru minggu ini.</p><button onClick={onAll} className="neo-btn">Jelajahi Katalog <ArrowUpRight size={18} /></button></div>}
  </section>
);
