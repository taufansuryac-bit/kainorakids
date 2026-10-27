export const PRODUCT_SITE = 'https://kainorakids.com';
const slug = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const productHref = product => `/products/${slug(product.name)}--${encodeURIComponent(product.id)}/`;
// Crawlable URL for each storefront view; views without a static page fall back to ?view=.
const VIEW_PATHS = { home: '/', products: '/products/', blog: '/blog/', sizeGuide: '/panduan-ukuran-anak/' };
export const viewHref = view => VIEW_PATHS[view] || `/?view=${view}`;
export const catalogHref = (page = 1) => page > 1 ? `/products/page/${page}/` : '/products/';
export function catalogPage(location) {
  const page = Number(location.pathname.match(/^\/products\/page\/(\d+)\/?$/)?.[1] || 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}
export function commerceView(location) {
  if (/^\/panduan-ukuran-anak\/?$/.test(location.pathname)) return 'sizeGuide';
  if (/^\/(?:panduan\/(?:ukuran-kaos-anak|perawatan-sablon)|pengiriman|retur|kebijakan-privasi)\/?$/.test(location.pathname)) return 'guide';
  if (/^\/products(?:\/page\/\d+)?\/?$/.test(location.pathname)) return 'products';
  if (/^\/products\//.test(location.pathname)) return 'productDetail';
  return null;
}
export const storefrontView = location => commerceView(location) || new URLSearchParams(location.search).get('view') || (/^\/blog(?:\/|$)/.test(location.pathname) ? 'blog' : 'home');
export function productFromLocation(products, location) {
  const params = new URLSearchParams(location.search);
  if (params.get('view') === 'productDetail' && params.has('id')) return products.find(p => String(p.id) === params.get('id')) || null;
  const encoded = location.pathname.match(/^\/products\/[^/]*?--([^/]+)\/?$/)?.[1];
  if (!encoded) return null;
  try { const id = decodeURIComponent(encoded); return products.find(p => String(p.id) === id) || null; }
  catch { return null; }
}
export const plainClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export function filterCatalog(products, { search = '', gender = 'Semua', size = 'Semua', sort = 'curated' } = {}) {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id-ID');
  const words = normalize(search).trim().split(/\s+/).filter(Boolean);
  const result = products.filter(product => {
    const haystack = normalize([product.name, product.type, product.warna, product.model].join(' '));
    return words.every(word => haystack.includes(word)) && (gender === 'Semua' || product.gender === gender || (gender !== 'Unisex' && product.gender === 'Unisex')) && (size === 'Semua' || product.sizes?.includes(size));
  });
  const known = p => typeof p.price === 'number' && Number.isFinite(p.price);
  return result.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'id');
    if (sort === 'price-asc' || sort === 'price-desc') {
      if (known(a) !== known(b)) return known(a) ? -1 : 1;
      if (known(a) && a.price !== b.price) return sort === 'price-asc' ? a.price - b.price : b.price - a.price;
    }
    return (a.order ?? 1e6) - (b.order ?? 1e6) || String(a.id).localeCompare(String(b.id), 'id', { numeric: true });
  });
}
