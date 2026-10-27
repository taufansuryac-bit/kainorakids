export const validCommission = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 && Math.abs(value * 100 - Math.round(value * 100)) < 1e-7;

export function affiliateEstimate(product, quantity = 1) {
  if (!product || typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0 || !validCommission(product.affiliateCommissionPercent) || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) return null;
  const perSale = Math.round(product.price * product.affiliateCommissionPercent / 100);
  return { perSale, total: perSale * quantity, quantity, rate: product.affiliateCommissionPercent };
}

export const affiliateProducts = products => products.filter(product => affiliateEstimate(product) !== null);
