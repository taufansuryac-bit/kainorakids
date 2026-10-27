import test from 'node:test';
import assert from 'node:assert/strict';
import {buyerIdentity,buildOrderRequest,mergeBuyerCart} from '../src/services/buyerCommerce.js';
import {buyerCartSummary,buyerProfileFields,buyerAuthError} from '../src/utils/buyerUi.js';
test('cart totals track quantity and block incomplete, out-of-stock or oversized baskets',()=>{
  const item={price:69000,sizes:['1-2Y'],size:'1-2Y',qty:2,stock:3};
  assert.deepEqual(buyerCartSummary([item]),{count:2,subtotal:138000,ready:true});
  for(const invalid of [{price:undefined},{size:'XL'},{stock:1},{qty:100},{qty:1.5},{catalogPreview:true},{photoOnly:true}]) assert.equal(buyerCartSummary([{...item,...invalid}]).ready,false);
  assert.equal(buyerCartSummary([]).ready,false);
});
test('profile form preserves postal leading zero, trims fields, and strips identity/role fields',()=>{
  const form={name:' Bunda Kainora ',phone:'081234567890',address:' Jalan Contoh ',kodepos:'01234',gender:'bunda',uid:'forged',email:'forged@example.test',admin:true};
  assert.deepEqual(buyerProfileFields(form),{name:'Bunda Kainora',phone:'081234567890',address:'Jalan Contoh',kodepos:'01234',gender:'bunda'});
  for(const invalid of [{name:'X'},{name:'x'.repeat(201)},{phone:'abcd1234'},{kodepos:'123'},{gender:'admin'},{address:'x'.repeat(2001)}])assert.throws(()=>buyerProfileFields({...form,...invalid}));
});
test('login errors do not distinguish an unknown user from a wrong password',()=>{
  assert.equal(buyerAuthError('auth/user-not-found'),buyerAuthError('auth/wrong-password'));
  assert.equal(buyerAuthError('auth/invalid-credential'),buyerAuthError('auth/wrong-password'));
  assert.ok(buyerAuthError('auth/network-request-failed').includes('internet'));
});
test('profile cannot override authenticated UID/email or grant admin privileges',()=>{
  const result=buyerIdentity({uid:'real-uid',email:'buyer@example.test',displayName:'Buyer',isAnonymous:false},{uid:'forged',email:'admin@example.test',admin:true,name:'Bunda'});
  assert.equal(result.uid,'real-uid');assert.equal(result.email,'buyer@example.test');assert.equal(result.admin,undefined);assert.equal(result.name,'Bunda');
  assert.equal(buyerIdentity({uid:'guest',isAnonymous:true,email:null}),null);
});
test('checkout requires a real signed-in buyer and complete non-preview cart; creates pending quotation',()=>{
  const cart=[{id:'p-1',name:'Park',price:120000,sizes:['S'],size:'S',qty:2}],user={uid:'buyer-a',email:'buyer@example.test'},form={name:'Buyer',wa:'08123456789',address:'Alamat contoh',kodepos:'12345',notes:''};
  assert.throws(()=>buildOrderRequest({cart,user:null,form}));
  assert.throws(()=>buildOrderRequest({cart:[{...cart[0],catalogPreview:true}],user,form}));
  assert.throws(()=>buildOrderRequest({cart:[{...cart[0],price:undefined}],user,form}));
  const result=buildOrderRequest({cart,user,form});assert.equal(result.userId,'buyer-a');assert.equal(result.subTotal,240000);assert.equal(result.status,'pending');assert.equal(result.totalAmount,240000);assert.equal(result.paymentStatus,undefined);
});
test('a guest basket survives first buyer login and merges saved sizes without discarding items',()=>{
  const guest=[{id:4,size:'S',qty:2},{id:5,size:'M',qty:1}],saved=[{id:4,size:'S',qty:1},{id:4,size:'L',qty:1}];
  const result=mergeBuyerCart(guest,saved);assert.equal(result.length,3);assert.equal(result.find(p=>p.id===4&&p.size==='S').qty,3);assert.deepEqual(mergeBuyerCart(guest,[]),guest);assert.equal(saved[0].qty,1);
});
test('promo limits are honoured only when the admin sets them',async()=>{
  const {promoProblem}=await import('../src/services/buyerCommerce.js');
  const now=Date.parse('2026-10-27T00:00:00Z');
  assert.equal(promoProblem({code:'A',type:'percent',value:10},50000,now),'');
  assert.match(promoProblem({code:'A',type:'percent',value:10,active:false},50000,now),/tidak berlaku/);
  assert.match(promoProblem({code:'A',type:'fixed',value:5000,validUntil:'2026-10-01'},50000,now),/kedaluwarsa/);
  assert.equal(promoProblem({code:'A',type:'fixed',value:5000,validUntil:'2026-12-01'},50000,now),'');
  assert.match(promoProblem({code:'A',type:'fixed',value:5000,minSubtotal:100000},69000,now),/minimal/);
  assert.match(promoProblem({code:'A',type:'fixed'},50000,now),/tidak valid/);
});
