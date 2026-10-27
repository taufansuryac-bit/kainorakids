import test from 'node:test';
import assert from 'node:assert/strict';
import { affiliateEstimate, affiliateProducts } from '../src/utils/affiliate.js';
import { validateContent } from '../shared/contentSchema.js';

const product = { id: 'p-1', name: 'Kaos', img: '/kaos.png', price: 159000, affiliateCommissionPercent: 12 };
const content = p => ({ version: 1, products: [p], highlights: [], garments: [] });

test('commission survives content validation and rejects invalid percentages', () => {
  for (const rate of [0, 12, 7.25, 100]) {
    assert.equal(validateContent(content({ ...product, affiliateCommissionPercent: rate })).products[0].affiliateCommissionPercent, rate);
  }
  for (const rate of [-1, 100.01, '12', NaN, Infinity, 1.234]) {
    assert.throws(() => validateContent(content({ ...product, affiliateCommissionPercent: rate })), /komisi/i);
  }
  assert.equal(validateContent(content({ ...product, affiliateCommissionPercent: null })).products[0].affiliateCommissionPercent, undefined);
});

test('estimate uses the selected product rate and handles rounding and zero explicitly', () => {
  assert.deepEqual(affiliateEstimate(product, 10), { perSale: 19080, total: 190800, quantity: 10, rate: 12 });
  assert.equal(affiliateEstimate({ ...product, price: 99999, affiliateCommissionPercent: 7.25 }, 3).total, 21750);
  assert.equal(affiliateEstimate({ ...product, affiliateCommissionPercent: 0 }, 3).total, 0);
  for (const quantity of [0, 101, 1.5, NaN]) assert.equal(affiliateEstimate(product, quantity), null);
});

test('missing prices or commissions cannot become misleading zero estimates; IDs remain strings', () => {
  const missingPrice = { ...product, id: 'photo-motif', price: undefined };
  const missingRate = { ...product, id: 3, affiliateCommissionPercent: undefined };
  assert.equal(affiliateEstimate(missingPrice, 1), null);
  assert.equal(affiliateEstimate(missingRate, 1), null);
  assert.equal(affiliateEstimate({ ...product, price: 0 }, 1), null);
  assert.deepEqual(affiliateProducts([product, missingPrice, missingRate]).map(p => p.id), ['p-1']);
  assert.deepEqual(affiliateProducts([]), []);
});
