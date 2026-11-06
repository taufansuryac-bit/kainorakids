export const priceKnown = price => price !== undefined && price !== null && price !== '' && Number.isFinite(Number(price));
export const formatPrice = price => priceKnown(price) ? new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',minimumFractionDigits:0}).format(Number(price)) : 'Info harga menyusul';
export const priceForSize = (product, size) => {
  if (size && !product.sizes?.includes(size)) return undefined;
  return product.sizePrices ? (size ? product.sizePrices[size] : Math.min(...Object.values(product.sizePrices))) : product.price;
};
export const canOrder = (product, size, color) => !product.photoOnly && priceKnown(priceForSize(product,size)) && priceForSize(product,size) >= 0 && product.sizes?.includes(size) === true && productAvailability(product) !== 'OutOfStock' && (!product.colorVariants?.length || product.colorVariants.some(variant=>variant.name===(color||product.colorVariants[0].name)));
export function cartProduct(product,size,color) {
  if(!canOrder(product,size,color))throw new Error('Pilihan produk tidak tersedia.');
  const variant=product.colorVariants?.find(item=>item.name===(color||product.colorVariants[0].name));
  return {...product,price:priceForSize(product,size),size,...(variant?{color:variant.name,warna:variant.name,img:variant.image}:{})};
}
export function refreshCartItems(items,products) {
  if(!Array.isArray(items))return [];
  return items.flatMap(item=>{
    const product=products.find(entry=>String(entry.id)===String(item?.id));
    if(!product||!canOrder(product,item.size,item.color)||!Number.isInteger(item.qty)||item.qty<1)return [];
    return [{...cartProduct(product,item.size,item.color),qty:Math.min(99,item.qty),cartId:item.cartId||`${product.id}-${item.size}-${item.color||''}`}];
  });
}
export function productPriceLabel(product) {
  const prices=Object.values(product.sizePrices||{});
  return `${new Set(prices).size>1?'Mulai ':''}${formatPrice(priceForSize(product))}`;
}
export function sizePriceSummary(product) {
  const groups=new Map();
  for(const size of product.sizes||[]){const price=priceForSize(product,size);if(!groups.has(price))groups.set(price,[]);groups.get(price).push(size);}
  return [...groups].map(([price,sizes])=>`${sizes.join(', ')} ${formatPrice(price)}`).join(' · ');
}
export function catalogPriceLabel(products) {
  const prices=products.flatMap(product=>Object.values(product.sizePrices||{default:product.price})).filter(priceKnown);
  if(!prices.length)return 'Lihat detail harga pada produk.';
  const min=Math.min(...prices),max=Math.max(...prices);
  return min===max?`Harga ${formatPrice(min)}`:`${formatPrice(min)}–${formatPrice(max)}, sesuai ukuran`;
}
import { productAvailability } from './productAvailability.js';
