export function productImages(product) {
  const images = [...new Set([product.img, ...(product.images || [])].filter(Boolean))];
  return images.sort((a, b) => Number(b.endsWith('-1.jpg')) - Number(a.endsWith('-1.jpg')));
}
