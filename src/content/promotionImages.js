export const PROMOTION_IMAGES = [
  { image: '/images/kainora-owned/hero-garden.webp', label: 'Koleksi taman bunga', alt: 'Dua anak memakai kaos grafis Kainora di taman bunga' },
  { image: '/images/kainora-owned/hero-blue.webp', label: 'Koleksi biru', alt: 'Anak memakai koleksi Kainora di depan bangku kuning dan latar biru' },
  { image: '/images/kainora-owned/hero-yellow.webp', label: 'Koleksi kuning', alt: 'Koleksi anak Kainora dengan latar kuning' },
  { image: '/images/kainora-owned/hero-camp.webp', label: 'Koleksi piknik', alt: 'Anak-anak memakai koleksi Kainora di area piknik' },
];
export const DEFAULT_PROMOTIONS = PROMOTION_IMAGES.slice(0, 2).map((item, index) => ({ id: index === 0 ? 'promotion-left' : 'promotion-right', image: item.image, alt: item.alt }));
