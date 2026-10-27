export function productAvailability(product) {
  if (typeof product.stock === 'number') return product.stock > 0 ? 'InStock' : 'OutOfStock';
  return ['InStock', 'OutOfStock'].includes(product.availability) ? product.availability : undefined;
}
export function availabilityLabel(product) {
  const status = productAvailability(product);
  return status === 'InStock' ? 'Tersedia' : status === 'OutOfStock' ? 'Stok sedang habis' : 'Ketersediaan dikonfirmasi saat pemesanan';
}
