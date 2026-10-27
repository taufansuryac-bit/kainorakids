import { productHref } from './productRoutes.js';
import { productThumbnail } from './productImages.js';

// Contextual links from each Journal article to the shop: the buyer guide that fits
// the article's topic plus three motifs. Motifs rotate by article id so the 72
// articles spread their links across the whole catalogue instead of the first few.
const TOPIC_GUIDES = {
  FASHION: [['/panduan/ukuran-kaos-anak/', 'Cara memilih ukuran kaos anak']],
  BELANJA: [['/panduan/ukuran-kaos-anak/', 'Cara memilih ukuran kaos anak'], ['/pengiriman/', 'Pengiriman dari Bandung']],
  PERAWATAN: [['/panduan/perawatan-sablon/', 'Cara merawat kaos katun & sablon']],
  KESEHATAN: [['/panduan/perawatan-sablon/', 'Cara mencuci dan merawat kaos katun']],
};
const DEFAULT_GUIDES = [['/panduan-ukuran-anak/', 'Studio ukuran fashion anak']];

const hash = value => [...String(value)].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

export function journalShopLinks(post, products, count = 3) {
  const orderable = products.filter(product => !product.photoOnly);
  const start = orderable.length ? hash(post.id) % orderable.length : 0;
  const picks = Array.from({ length: Math.min(count, orderable.length) }, (_, i) => orderable[(start + i * 11) % orderable.length]);
  return {
    guides: (TOPIC_GUIDES[post.category] || DEFAULT_GUIDES).map(([href, label]) => ({ href, label })),
    products: picks.map(product => ({ product, href: productHref(product), name: product.name, image: productThumbnail(product.img), alt: product.alt || product.name })),
  };
}
