import test from 'node:test';
import assert from 'node:assert/strict';
import {canOrder,formatPrice,priceForSize,cartProduct,refreshCartItems} from '../src/utils/pricing.js';
test('unknown price is not presented as free and incomplete products cannot be ordered',()=>{
  assert.equal(formatPrice(undefined),'Info harga menyusul');assert.equal(formatPrice(null),'Info harga menyusul');assert.equal(formatPrice(''),'Info harga menyusul');
  assert.match(formatPrice(0),/Rp.*0/);
  assert.equal(canOrder({price:100000,sizes:[]},''),false);
  assert.equal(canOrder({price:100000,sizes:['S'],photoOnly:true},'S'),false);
  assert.equal(canOrder({price:100000,sizes:['S']},'M'),false);
  assert.equal(canOrder({price:100000,sizes:['S'],stock:0},'S'),false);
  assert.equal(canOrder({price:100000,sizes:['S']},'S'),true);
});
const tee={id:'new-tee',name:'TEE',price:89000,sizePrices:{S:89000,M:89000,L:89000,XL:94000,XXL:94000},sizes:['S','M','L','XL','XXL'],colors:['#111111','#FFFFFF'],colorVariants:[{name:'Hitam',hex:'#111111',image:'/black.webp'},{name:'Putih',hex:'#FFFFFF',image:'/white.webp'}]};
test('size and colour selections survive cart creation and catalogue refresh without stale prices',()=>{
  assert.equal(priceForSize(tee,'S'),89000);assert.equal(priceForSize(tee,'XXL'),94000);
  assert.equal(priceForSize(tee,'invalid'),undefined);
  const xl=cartProduct(tee,'XL','Putih');
  assert.equal(xl.price,94000);assert.equal(xl.color,'Putih');assert.equal(xl.img,'/white.webp');
  assert.equal(canOrder(tee,'XL','Merah'),false);
  assert.throws(()=>cartProduct(tee,'XL','Merah'));
  const refreshed=refreshCartItems([{...xl,price:1,qty:2,cartId:44},{id:'removed-old',size:'S',qty:1}],[tee]);
  assert.equal(refreshed.length,1);assert.equal(refreshed[0].price,94000);assert.equal(refreshed[0].qty,2);assert.equal(refreshed[0].cartId,44);
  assert.equal(priceForSize({price:69000,sizes:['S']},'S'),69000);
});
