// Photo-backed additions have no invented price, size or inventory.
const PHOTO_PICKS = [
  { key: 'avocado', name: 'Kaos Avocado' },
  { key: 'cherryharvest', name: 'Kaos Cherry Harvest' },
  { key: 'goodlife', name: 'Kaos Good Life' },
  { key: 'candy', name: 'Kaos Candy' },
].map(({ key, name }) => ({
  id: `photo-${key}`, name, img: `/PRODUCT/${key}-1.jpg`,
  images: [`/PRODUCT/${key}-1.jpg`, `/PRODUCT/${key}-2.jpg`],
  alt: `Foto motif ${name.replace('Kaos ', '')} dari koleksi Kainora`,
  photoOnly: true, type: 'Kaos', sizes: [],
}));

export function selectFeaturedProducts(products) {
  const unique = products.filter((product, index, all) => all.findIndex(item => String(item.id) === String(product.id)) === index);
  const knownImages = new Set(unique.flatMap(product => [product.img, ...(product.images || [])]));
  const additions = PHOTO_PICKS.filter(product => !product.images.some(image => knownImages.has(image)));
  return [...unique, ...additions].slice(0, 12);
}
