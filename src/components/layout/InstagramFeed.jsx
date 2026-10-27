import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { SplitReveal } from '../motion/KineticText';

// Static feed option to keep site fast and prevent API token expiration
const IG_POSTS = [
  { id: 1, image: '/images/banners/banner-hero-1.jpg', likes: '1.2K', comments: 45 },
  { id: 2, image: '/images/banners/banner-hero-2.jpg', likes: '856', comments: 23 },
  { id: 3, image: '/images/collections/kainorapark-1.jpg', likes: '2.4K', comments: 120 },
  { id: 4, image: '/images/collections/kidsclub-1.jpg', likes: '945', comments: 34 },
  { id: 5, image: '/images/banners/banner-hero-slider-1.jpg', likes: '1.5K', comments: 67 },
  { id: 6, image: '/images/shop/shop-boys.jpg', likes: '3.1K', comments: 210 },
];

export default function InstagramFeed() {
  return (
    <section className="instagram-editorial editorial-wrap pb-6 pt-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="neo-pill mb-4 bg-brand-pink"><Instagram size={14} strokeWidth={3} /> Instagram</p>
            <h2 className="display text-[clamp(2.1rem,6vw,5.2rem)]">
              <SplitReveal text="@kainorakids" />
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-relaxed">
            Ikuti kami di Instagram untuk inspirasi OOTD anak kekinian, info diskon kilat, dan tips parenting seru setiap hari!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {IG_POSTS.map((post, i) => (
            <a
              key={post.id}
              href="https://instagram.com/kainorakids"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-panel press group relative block aspect-square overflow-hidden"
              aria-label={`Postingan Instagram Kainora Kids ${i + 1}`}
            >
              <div className="h-full w-full">
                <img src={post.image} alt="Instagram Feed Kainora Kids" className="print h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="instagram-photo-link">
                <span>Lihat di Instagram</span><ArrowUpRight size={18} />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="https://instagram.com/kainorakids" target="_blank" rel="noopener noreferrer" className="neo-btn neo-btn--pink inline-flex">
            <Instagram className="h-5 w-5" strokeWidth={3} /> Follow Instagram Kami
          </a>
        </div>
      </div>
    </section>
  );
}
