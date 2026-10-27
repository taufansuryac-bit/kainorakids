/**
 * Kartu produk neo-brutalist yang dipakai di beranda & katalog:
 * panel warna bergantian, foto langsung terlihat, label sticker,
 * tombol wishlist bulat, dan efek tekan fisik.
 */
import { ArrowUpRight, Heart } from 'lucide-react';
import { formatPrice } from '../../constants/data';
import { productImages } from '../../utils/productMedia';

const TONES = ['var(--pink)', 'var(--teal)', 'var(--yellow)', 'var(--blue)', 'var(--orange)'];

const labelStyle = (label) =>
  label === 'Terbaru' ? { background: 'var(--yellow)', color: 'var(--ink)' }
  : label === 'Terlaris' ? { background: 'var(--red)', color: 'var(--paper)' }
  : { background: 'var(--pink)', color: 'var(--ink)' };

export const ProductCard = ({ product: p, index = 0, onOpen, wishlisted, onToggleWishlist, headingLevel = 'h3' }) => {
  const Heading = headingLevel;
  const [first, second] = productImages(p);
  const open = () => onOpen?.(p);

  return (
    <article
      className="product-card neo-panel press group relative flex h-full cursor-pointer flex-col overflow-hidden text-left"
      style={{ background: TONES[index % TONES.length], '--card-accent': TONES[index % TONES.length] }}
    >
      <div className="product-image relative aspect-square border-b-[3px] border-ink bg-paper">
        <div className="absolute inset-0">
          <img
            src={first}
            alt={p.alt}
            loading="lazy"
            className={`product-photo absolute inset-0 h-full w-full object-cover transition-all duration-500 ${first?.endsWith('-2.jpg') ? 'product-photo-model' : ''} ${second ? 'group-hover:opacity-0' : ''}`}
          />
          {second && (
            <img
              src={second}
              alt={p.alt}
              loading="lazy"
              className={`absolute inset-0 h-full w-full scale-100 object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 ${second?.endsWith('-2.jpg') ? 'product-photo-model' : ''}`}
            />
          )}
        </div>

        {p.label && (
          <span
            className="font-arcade absolute left-2 top-2 z-30 -rotate-6 rounded-md border-[3px] border-ink px-2 py-1 text-[0.55rem] uppercase leading-none tracking-wider shadow-solid-sm transition-transform group-hover:rotate-3 sm:text-[0.62rem]"
            style={labelStyle(p.label)}
          >
            {p.label}
          </span>
        )}

        <button
          className="absolute right-2 top-2 z-30 grid h-11 w-11 place-items-center rounded-full border-[2px] border-ink bg-paper transition-transform hover:scale-110 active:scale-90"
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(e, p.id); }}
          aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
          aria-pressed={wishlisted}
        >
          <Heart size={16} strokeWidth={2.75} fill={wishlisted ? 'var(--red)' : 'none'} className={wishlisted ? 'text-brand-red' : 'text-ink'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
        <div>
          {p.type && <p className="mb-1 text-[0.62rem] font-black uppercase tracking-[0.2em] opacity-70">{p.type}</p>}
          <Heading className="product-title text-[0.8rem] font-extrabold uppercase leading-[1.25] sm:text-sm"><button onClick={open} className="product-open">{p.name}<span className="sr-only"> — Lihat produk</span></button></Heading>
        </div>
        <div className="product-price-row"><p>{formatPrice(p.price)}</p><span aria-hidden="true"><ArrowUpRight size={19} /></span></div>
      </div>
    </article>
  );
};
