export const CONTENT_PATH = 'src/content/store.json';
export const MAX_GARMENTS = 16;
export const MAX_ARRIVALS = 10;
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_PUBLISH_BYTES = 12 * 1024 * 1024;
const fail = message => { throw new Error(message); };
const text = (value, max = 200, required = false) => {
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail('Teks kosong atau terlalu panjang.');
  return value.trim();
};
const id = value => {
  const result = String(value ?? '');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(result)) fail('ID tidak valid.');
  return result;
};
const list = (value, max) => {
  if (!Array.isArray(value) || value.length > max) fail(`Daftar melebihi batas ${max}.`);
  return value;
};
const unique = values => { if (new Set(values).size !== values.length) fail('ID dalam daftar tidak boleh berulang.'); };
export function mediaPath(value, required = false) {
  const path = text(value, 300, required);
  if (!path && !required) return '';
  let decoded;
  try { decoded = decodeURIComponent(path); } catch { fail('Path gambar tidak valid.'); }
  if (!path.startsWith('/') || path.startsWith('//') || /[\\?#]/.test(decoded) || [...decoded].some(char => char.charCodeAt(0) < 32) || decoded.includes('..') || !/\.(png|webp|jpe?g)$/i.test(decoded)) fail('Gunakan gambar lokal PNG, WebP atau JPG.');
  return path;
}
export function validateContent(input) {
  if (!input || input.version !== 1) fail('Versi konten tidak didukung.');
  const products = list(input.products, 500).map(p => {
    if (!p || typeof p !== 'object') fail('Produk tidak valid.');
    const result = { id: typeof p.id === 'number' && Number.isSafeInteger(p.id) ? p.id : id(p.id), name: text(p.name, 120, true) };
    id(result.id);
    for (const key of ['type', 'gender', 'label', 'warna', 'model', 'bahan', 'jahitan', 'alt']) result[key] = text(p[key], 200);
    result.desc = text(p.desc, 5000);
    if (p.availability) {
      if (!['InStock', 'OutOfStock'].includes(p.availability)) fail('Status ketersediaan produk tidak valid.');
      result.availability = p.availability;
    }
    result.img = mediaPath(p.img, true);
    result.images = list(p.images || [result.img], 8).map(url => mediaPath(url, true));
    if (!result.images.includes(result.img)) result.images.unshift(result.img);
    result.sizes = list(p.sizes || [], 20).map(s => text(s, 40, true));
    result.ages = list(p.ages || [], 30).map(age => { if (!Number.isInteger(age) || age < 0 || age > 20) fail('Usia tidak valid.'); return age; });
    result.colors = list(p.colors || [], 10).map(color => { if (!/^#[0-9a-f]{6}$/i.test(color)) fail('Warna tidak valid.'); return color; });
    if (p.sizePrices !== undefined) {
      if(!p.sizePrices || typeof p.sizePrices!=='object' || Array.isArray(p.sizePrices) || Object.keys(p.sizePrices).some(size=>!result.sizes.includes(size))) fail('Harga ukuran tidak valid.');
      result.sizePrices=Object.fromEntries(result.sizes.map(size=>{const price=p.sizePrices[size];if(typeof price!=='number'||!Number.isFinite(price)||price<0||price>1e12)fail('Lengkapi harga setiap ukuran.');return [size,price];}));
    }
    if (p.colorVariants !== undefined) {
      result.colorVariants=list(p.colorVariants,10).map(variant=>({name:text(variant.name,40,true),hex:variant.hex,image:mediaPath(variant.image,true)}));
      if(result.colorVariants.some(variant=>!result.colors.includes(variant.hex)))fail('Warna varian harus terdaftar pada produk.');
      unique(result.colorVariants.map(variant=>variant.name));
    }
    for (const key of ['price', 'stock', 'sold', 'order']) if (p[key] !== undefined && p[key] !== null && p[key] !== '') {
      if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key] < 0 || p[key] > 1e12) fail(`Nilai ${key} tidak valid.`);
      result[key] = p[key];
    }
    result.photoOnly = p.photoOnly === true || result.price === undefined || !result.sizes.length;
    result.catalogPreview = p.catalogPreview === true;
    if (p.affiliateCommissionPercent !== undefined && p.affiliateCommissionPercent !== null && p.affiliateCommissionPercent !== '') {
      const rate = p.affiliateCommissionPercent;
      if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 100 || Math.abs(rate * 100 - Math.round(rate * 100)) > 1e-7) fail('Persentase komisi harus 0–100 dengan maksimal dua angka desimal.');
      result.affiliateCommissionPercent = rate;
    }
    return result;
  });
  const productIds = products.map(p => String(p.id)); unique(productIds);
  const highlights = list(input.highlights, 12).map(id); unique(highlights);
  if (highlights.some(key => !productIds.includes(key))) fail('Highlight harus memilih produk dalam katalog.');
  const garments = list(input.garments, MAX_GARMENTS).map(g => {
    if (!g || !['white', 'black'].includes(g.color) || !['front', 'back'].includes(g.initialView) || !['chest', 'badge', 'large'].includes(g.frontLayout)) fail('Warna, tampak awal atau posisi sablon tidak valid.');
    const entry = { id: id(g.id), name: text(g.name, 120, true), description: text(g.description, 500), color: g.color, initialView: g.initialView, frontLayout: g.frontLayout, front: mediaPath(g.front), back: mediaPath(g.back), productId: g.productId ? id(g.productId) : '' };
    if (g.frontPrintScale !== undefined) {
      if (!Number.isInteger(g.frontPrintScale) || g.frontPrintScale < 20 || g.frontPrintScale > 100) fail('Ukuran sablon tengah harus berupa angka bulat 20–100 persen.');
      entry.frontPrintScale = g.frontPrintScale;
    }
    if (!entry.front && !entry.back) fail('Upload minimal satu desain untuk kaos 3D.');
    if (entry.productId && !productIds.includes(entry.productId)) fail('Tautan produk 3D tidak ditemukan.');
    return entry;
  });
  unique(garments.map(g => g.id));
  const result = { version: 1, products, highlights, garments };
  if (input.promotions !== undefined) {
    result.promotions = list(input.promotions, 2).map(item => {
      if (!item || typeof item !== 'object') fail('Banner promosi tidak valid.');
      return { id: id(item.id), image: mediaPath(item.image, true), alt: text(item.alt, 180, true) };
    });
    if (result.promotions.length === 1) fail('Banner promosi harus berisi dua gambar kiri dan kanan.');
    unique(result.promotions.map(item => item.id));
  }
  if (input.arrivals !== undefined) {
    result.arrivals = list(input.arrivals, MAX_ARRIVALS).map(item => {
      if (!item || !['black', 'white'].includes(item.color)) fail('Warna New Arrival tidak valid.');
      const entry = { id: id(item.id), name: text(item.name, 120, true), description: text(item.description, 500), color: item.color,
        front: mediaPath(item.front, true), back: mediaPath(item.back, true), side: mediaPath(item.side, true) };
      if (item.productId !== undefined) {
        entry.productId = item.productId ? id(item.productId) : '';
        if (entry.productId && !productIds.includes(entry.productId)) fail('Tautan produk New Arrival tidak ditemukan.');
      }
      return entry;
    });
    unique(result.arrivals.map(item => item.id));
  }
  return result;
}
export function selectHighlights(products, ids) {
  const byId = new Map(products.map(product => [String(product.id), product]));
  return ids.map(key => byId.get(String(key))).filter(Boolean).slice(0, 12);
}
export function removeProduct(content, productId) {
  const key = String(productId);
  return { ...content, products: content.products.filter(p => String(p.id) !== key), highlights: content.highlights.filter(value => String(value) !== key), garments: content.garments.map(g => String(g.productId) === key ? { ...g, productId: '' } : g), ...(content.arrivals ? { arrivals: content.arrivals.map(item => String(item.productId) === key ? { ...item, productId: '' } : item) } : {}) };
}
export function referencedMedia(content) {
  return new Set([...content.products.flatMap(p => [p.img, ...p.images]), ...content.garments.flatMap(g => [g.front, g.back]), ...(content.arrivals || []).flatMap(item => [item.front, item.back, item.side]), ...(content.promotions || []).map(item => item.image)].filter(Boolean));
}
export async function validateUploads(uploads, content) {
  const references = referencedMedia(content), paths = new Set();
  let total = 0;
  const result = [];
  for (const upload of list(uploads, 20)) {
    if (!upload || !/^\/images\/uploads\/[a-f0-9]{64}\.(png|webp|jpg)$/.test(upload.path) || paths.has(upload.path) || !references.has(upload.path)) fail('Upload harus dipakai dalam konten dan menggunakan nama hash yang valid.');
    if (typeof upload.base64 !== 'string' || upload.base64.length > MAX_UPLOAD_BYTES * 1.34 || !/^[A-Za-z0-9+/]*={0,2}$/.test(upload.base64)) fail('Data upload tidak valid.');
    let bytes;
    try { bytes = Uint8Array.from(atob(upload.base64), char => char.charCodeAt(0)); } catch { fail('Data upload tidak valid.'); }
    if (!bytes.length || bytes.length > MAX_UPLOAD_BYTES || (total += bytes.length) > 8 * 1024 * 1024) fail('Upload terlalu besar. Terbitkan beberapa gambar dahulu.');
    const ext = upload.path.split('.').at(-1);
    const matches = ext === 'png' ? [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n) && bytes.length >= 33 && new DataView(bytes.buffer).getUint32(16) <= 4096 && new DataView(bytes.buffer).getUint32(20) <= 4096 : ext === 'jpg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 : String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
    if (!matches) fail('Isi file tidak sesuai format gambar.');
    const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
    if (!upload.path.includes(digest)) fail('Hash upload tidak cocok.');
    const isArtwork = content.garments.some(g => [g.front, g.back].includes(upload.path)) || (content.arrivals || []).some(item => [item.front, item.back, item.side].includes(upload.path));
    if (isArtwork && ext !== 'png') fail('Sablon dan gambar New Arrival baru harus berupa PNG.');
    paths.add(upload.path); result.push({ path: upload.path, base64: upload.base64, bytes });
  }
  return result;
}
