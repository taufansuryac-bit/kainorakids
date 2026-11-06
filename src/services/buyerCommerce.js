import {canOrder,priceForSize} from '../utils/pricing.js';
export function mergeBuyerCart(guest,saved) {
  const result=saved.map(item=>({...item}));
  for(const item of guest){const found=result.find(p=>String(p.id)===String(item.id)&&p.size===item.size&&(p.color||'')===(item.color||''));if(found)found.qty=Math.min(99,(Number(found.qty)||0)+(Number(item.qty)||0));else result.push({...item});}
  return result;
}
// Optional promo limits (active, validUntil, minSubtotal) are honoured when the admin
// sets them; a promo without them stays valid, as before. Returns '' when usable.
export function promoProblem(promo,subTotal,now=Date.now()) {
  if(!promo||!(Number(promo.value)>=0))return 'Kode promo tidak valid.';
  if(promo.active===false)return 'Kode promo sudah tidak berlaku.';
  const until=promo.validUntil?.toMillis?.() ?? (promo.validUntil?Date.parse(promo.validUntil):NaN);
  if(Number.isFinite(until)&&until<now)return 'Kode promo sudah kedaluwarsa.';
  if(Number(promo.minSubtotal)>0&&subTotal<Number(promo.minSubtotal))return `Kode promo berlaku untuk belanja minimal Rp${Number(promo.minSubtotal).toLocaleString('id-ID')}.`;
  return '';
}
export function buyerIdentity(authUser,profile={}) {
  if(!authUser?.uid||authUser.isAnonymous||!authUser.email)return null;
  const fields={};
  for(const key of ['name','phone','address','kodepos','gender','nickname','photoURL'])if(typeof profile[key]==='string')fields[key]=profile[key];
  return {name:authUser.displayName||'',photoURL:authUser.photoURL||'',...fields,uid:authUser.uid,email:authUser.email,emailVerified:authUser.emailVerified===true,isAnonymous:false};
}
export function buildOrderRequest({cart,user,form,promo=null}) {
  if(!user?.uid||!user.email||user.isAnonymous)throw new Error('Silakan masuk sebelum checkout.');
  if(!Array.isArray(cart)||!cart.length||cart.length>30||cart.some(item=>item.catalogPreview||!canOrder(item,item.size,item.color)||!Number.isInteger(item.qty)||item.qty<1||item.qty>99))throw new Error('Keranjang berisi produk pratinjau atau detail yang belum tersedia.');
  const subTotal=cart.reduce((sum,item)=>sum+Number(priceForSize(item,item.size))*item.qty,0);
  // A submitted order is a quotation for manual confirmation by the store,
  // never proof of payment or an authority for a payment gateway charge.
  const discount=promo?Math.min(subTotal,Math.max(0,promo.type==='percent'?subTotal*Number(promo.value)/100:Number(promo.value))):0;
  if(!Number.isFinite(subTotal)||!Number.isFinite(discount))throw new Error('Nilai pesanan tidak valid.');
  return {orderId:`ORD-${crypto.randomUUID().slice(0,8).toUpperCase()}`,userId:user.uid,userEmail:user.email,customerName:String(form.name||'').trim(),whatsapp:String(form.wa||'').trim(),address:String(form.address||'').trim(),kodepos:String(form.kodepos||'').trim(),notes:String(form.notes||''),items:cart.map(item=>({id:String(item.id),name:item.name,size:item.size,qty:item.qty,price:priceForSize(item,item.size),...(item.color?{color:item.color}:{}),...(item.img?{img:item.img}:{})})),subTotal,discount,promoCode:promo?.code||null,totalAmount:subTotal-discount,status:'pending'};
}
