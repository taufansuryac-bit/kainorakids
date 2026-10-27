import test from 'node:test';
import assert from 'node:assert/strict';
import {canOrder,formatPrice} from '../src/utils/pricing.js';
test('unknown price is not presented as free and incomplete products cannot be ordered',()=>{
  assert.equal(formatPrice(undefined),'Info harga menyusul');assert.equal(formatPrice(null),'Info harga menyusul');assert.equal(formatPrice(''),'Info harga menyusul');
  assert.match(formatPrice(0),/Rp.*0/);
  assert.equal(canOrder({price:100000,sizes:[]},''),false);
  assert.equal(canOrder({price:100000,sizes:['S'],photoOnly:true},'S'),false);
  assert.equal(canOrder({price:100000,sizes:['S']},'M'),false);
  assert.equal(canOrder({price:100000,sizes:['S'],stock:0},'S'),false);
  assert.equal(canOrder({price:100000,sizes:['S']},'S'),true);
});
