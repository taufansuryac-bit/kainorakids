export const priceKnown = price => price !== undefined && price !== null && price !== '' && Number.isFinite(Number(price));
export const formatPrice = price => priceKnown(price) ? new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',minimumFractionDigits:0}).format(Number(price)) : 'Info harga menyusul';
export const canOrder = (product, size) => !product.photoOnly && priceKnown(product.price) && product.price >= 0 && product.sizes?.includes(size) === true && productAvailability(product) !== 'OutOfStock';
import { productAvailability } from './productAvailability.js';
