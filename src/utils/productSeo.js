import { PRODUCT_SITE, productHref, catalogHref } from './productRoutes.js';
import { productAvailability } from './productAvailability.js';
import { merchantReturnPolicy } from '../content/commercePolicies.js';

export const schemaJSON = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const productDescription = product => product.desc || `Kenali ${product.name} Kainora Kids. Lihat foto motif, bahan, potongan, dan pilihan ukuran sebelum memesan.`;
export const productMetaDescription = product => {
  const text = productDescription(product).replace(/\s+/g, ' ').trim();
  if (text.length <= 158) return text;
  const cut = text.slice(0, 158), sentence = cut.lastIndexOf('. ');
  return sentence > 75 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:]$/, '')}…`;
};
// First variant that fits Google's ~60-character title display.
const fitTitle = variants => variants.find(title => title.length <= 60) || variants.at(-1);
export const productTitle = product => fitTitle([
  `${product.name} — Kaos Anak Oversize${product.warna ? ` ${product.warna}` : ''} | Kainora Kids`,
  `${product.name} — Kaos Anak Oversize | Kainora Kids`,
  `${product.name} — Kaos Anak Oversize | Kainora`,
  `${product.name} | Kainora Kids`,
]);
export const catalogTitle = page => `Koleksi Kaos Anak Oversize${page > 1 ? ` — Halaman ${page}` : ''} | Kainora Kids`;
// Page 1 keeps the collection pitch; later pages name their own motifs so each
// paginated URL has a distinct description.
export const catalogDescription = (products, page = 1, perPage = 12) => {
  if (page <= 1) return `Jelajahi ${products.length} motif kaos anak Kainora Kids. Lihat foto studio, detail motif, harga, dan referensi pemakaian sebelum memilih gaya si kecil.`;
  const names = products.slice((page - 1) * perPage, page * perPage).slice(0, 3).map(product => product.name);
  return `Halaman ${page} dari ${Math.ceil(products.length / perPage)} koleksi kaos anak Kainora Kids: ${names.join(', ')}, dan motif lain. Semua kaos putih Rp69.000.`;
};
const absolute = path => new URL(path, PRODUCT_SITE).href;
export function productSchema(product, reviews = []) {
  if (!product) return null;
  const ratings = reviews.filter(r => !r.isDummy && typeof r.text === 'string' && Number(r.rating) >= 1 && Number(r.rating) <= 5);
  const images = [...new Set([product.img, ...(product.images || [])].filter(Boolean))];
  return {
    '@context': 'https://schema.org', '@type': 'Product', '@id': `${PRODUCT_SITE}${productHref(product)}#product`,
    name: product.name, url: `${PRODUCT_SITE}${productHref(product)}`, image: images.map(absolute), description: productDescription(product),
    brand: { '@type': 'Brand', name: 'Kainora Kids' },
    sku: String(product.id), ...(product.sizes?.length ? {size: product.sizes} : {}),
    ...(product.bahan ? { material: product.bahan } : {}), ...(product.warna ? { color: product.warna } : {}),
    ...(product.catalogPreview !== true && typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0 ? { offers: {
      '@type': 'Offer', url: `${PRODUCT_SITE}${productHref(product)}`, price: product.price, priceCurrency: 'IDR',
      itemCondition: 'https://schema.org/NewCondition', hasMerchantReturnPolicy: merchantReturnPolicy(PRODUCT_SITE),
      ...(productAvailability(product) ? { availability: `https://schema.org/${productAvailability(product)}` } : {}),
    } } : {}),
    ...(ratings.length ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: Number((ratings.reduce((sum, r) => sum + Number(r.rating), 0) / ratings.length).toFixed(2)), reviewCount: ratings.length } } : {}),
  };
}
export function productListSchema(products, page = 1, perPage = 12) {
  return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Koleksi Kaos Anak Kainora Kids', url: `${PRODUCT_SITE}${catalogHref(page)}`,
    mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: (page - 1) * perPage + index + 1, name: product.name, url: `${PRODUCT_SITE}${productHref(product)}` })) },
  };
}
export function productBreadcrumb(product = null, page = 1) {
  const items = [{ name: 'Beranda', item: `${PRODUCT_SITE}/` }, { name: 'Katalog kaos anak', item: `${PRODUCT_SITE}${catalogHref()}` }];
  if (product) items.push({ name: product.name, item: `${PRODUCT_SITE}${productHref(product)}` });
  else if (page > 1) items.push({ name: `Halaman ${page}`, item: `${PRODUCT_SITE}${catalogHref(page)}` });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })) };
}
