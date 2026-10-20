/**
 * Kartu produk neo-brutalist yang dipakai di beranda & katalog:
 * panel warna bergantian, foto muncul lewat disolve papan catur, label sticker,
 * tombol wishlist bulat, dan efek tekan fisik.
 */
import { Heart } from 'lucide-react';
import { formatPrice } from '../../constants/data';
import { CheckerReveal } from '../motion/CheckerReveal';

const TONES = ['var(--pink)', 'var(--teal)', 'var(--yellow)', 'var(--blue)', 'var(--orange)'];

const labelStyle = (label) =>
  label === 'Terbaru' ? { background: 'var(--yellow)', color: 'var(--ink)' }
  : label === 'Terlaris' ? { background: 'var(--red)', color: 'var(--paper)' }
  : { background: 'var(--pink)', color: 'var(--ink)' };

export const ProductCard = ({ product: p, index = 0, onOpen, wishlisted, onToggleWishlist, headingLevel = 'h3' }) => {
  const Heading = headingLevel;
  const first = p.img || (p.images && p.images[0]);
  const second = p.images && p.images.length > 1 ? p.images[1] : null;
  const open = () => onOpen?.(p);

  return (
    <article
      className="neo-panel press group relative flex h-full cursor-pointer flex-col overflow-hidden text-left"
      style={{ background: TONES[index % TONES.length] }}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
      role="link"
      tabIndex={0}
      aria-label={p.name}
    >
      <div className="relative aspect-square border-b-[3px] border-ink bg-paper">
        <CheckerReveal cols={4} rows={4} delay={(index % 4) * 0.07} className="absolute inset-0">
          <img
            src={first}
            alt={p.alt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${second ? 'group-hover:opacity-0' : ''}`}
          />
          {second && (
            <img
              src={second}
              alt={p.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-100 object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </CheckerReveal>

        {p.label && (
          <span
            className="font-arcade absolute left-2 top-2 z-30 -rotate-6 rounded-md border-[3px] border-ink px-2 py-1 text-[0.55rem] uppercase leading-none tracking-wider shadow-solid-sm transition-transform group-hover:rotate-3 sm:text-[0.62rem]"
            style={labelStyle(p.label)}
          >
            {p.label}
          </span>
        )}

        <button
          className="absolute right-2 top-2 z-30 grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-paper transition-transform hover:scale-110 active:scale-90"
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
          <Heading className="line-clamp-2 text-[0.8rem] font-extrabold uppercase leading-[1.1] sm:text-sm">{p.name}</Heading>
        </div>
        <p className="font-arcade inline-block w-fit rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 text-[0.7rem] leading-none sm:text-xs">
          {formatPrice(p.price)}
        </p>
      </div>
    </article>
  );
};
