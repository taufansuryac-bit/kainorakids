import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { validateContent } from '../shared/contentSchema.js';
import { productSchema } from '../src/utils/productSeo.js';
import { productAvailability } from '../src/utils/productAvailability.js';
import { canOrder } from '../src/utils/pricing.js';
import { productImageProps } from '../src/utils/productImages.js';
import { merchantReturnPolicy, storeOrganization } from '../src/content/commercePolicies.js';
import { BUYER_GUIDES } from '../src/content/buyerGuides.js';
import { SIZE_CHART } from '../src/content/sizeChart.js';
import { storefrontView, viewHref } from '../src/utils/productRoutes.js';
import { WA_NUMBER, WA_PHONE_E164 } from '../src/config/shop.js';

test('confirmed availability survives admin validation; numeric zero overrides a stale available label',async()=>{
  const content=JSON.parse(await readFile('src/content/store.json','utf8'));
  assert.equal(validateContent(content).products[0].availability,'InStock');
  assert.ok(content.products.every(product=>JSON.stringify(product.sizes)===JSON.stringify(SIZE_CHART.map(row=>row[0]))));
  assert.throws(()=>validateContent({...content,products:[{...content.products[0],availability:'Anything'}]}));
  const product={...content.products[0],stock:0};
  assert.equal(productAvailability(product),'OutOfStock');assert.equal(canOrder(product,'S'),false);
  assert.equal(productSchema(product).offers.availability,'https://schema.org/OutOfStock');
  assert.equal(productAvailability({}),undefined);
});
test('legacy account links cannot hydrate the unrelated static homepage',()=>{
  for(const view of ['affiliate','checkout','profile','wishlist','cart','products'])assert.equal(storefrontView(new URL('https://kainorakids.com/?view='+view)),view);
  assert.equal(storefrontView(new URL('https://kainorakids.com/?utm_source=test')),'home');
  assert.equal(storefrontView(new URL('https://kainorakids.com/products/kaos-sunshine--1/')),'productDetail');
});
test('return policy preserves the owner-confirmed 48-hour window and fee responsibility without inventing rates',()=>{
  const policy=merchantReturnPolicy();
  assert.equal(policy.merchantReturnDays,2);
  assert.equal(policy.customerRemorseReturnFees,'https://schema.org/ReturnFeesCustomerResponsibility');
  assert.equal(policy.itemDefectReturnFees,'https://schema.org/FreeReturn');
  assert.equal(policy.returnShippingFeesAmount,undefined);
  const service=storeOrganization().hasShippingService;
  assert.equal(service.shippingConditions.shippingDestination.addressCountry,'ID');
  assert.equal(service.shippingConditions.shippingRate,undefined);
});
test('responsive local photos retain original fallback for new admin uploads',async()=>{
  const props=productImageProps('/PRODUCT/sunshine-1.jpg');
  assert.ok(props.srcSet.includes('320w'));assert.ok(props.srcSet.includes('1000w'));
  assert.ok((await stat('public'+props.src)).size < (await stat('public/PRODUCT/sunshine-1.jpg')).size);
  assert.deepEqual(productImageProps('/images/uploads/new-photo.webp'),{src:'/images/uploads/new-photo.webp'});
});
test('buyer guides provide unique indexable routes and links back to real catalogue pages',()=>{
  assert.equal(new Set(BUYER_GUIDES.map(guide=>guide.path)).size,5);
  assert.ok(BUYER_GUIDES.every(guide=>guide.sections.length>=3));
  assert.ok(BUYER_GUIDES.find(guide=>guide.path==='/retur/').sections.some(section=>section.paragraphs?.some(text=>text.includes('ditanggung Kainora'))));
});
test('crawlable navigation: storefront views map to static paths and the privacy page routes as a guide',()=>{
  assert.equal(viewHref('home'),'/');assert.equal(viewHref('blog'),'/blog/');assert.equal(viewHref('products'),'/products/');
  assert.equal(viewHref('affiliate'),'/?view=affiliate');
  assert.equal(storefrontView(new URL('https://kainorakids.com/kebijakan-privasi/')),'guide');
});
test('checkout and contact links use the official Kainora WhatsApp number',async()=>{
  assert.equal(WA_NUMBER,'628159977430');assert.equal(WA_PHONE_E164,'+'+WA_NUMBER);
  for(const file of ['src/config/shop.js','src/firebase.js'])assert.ok(!(await readFile(file,'utf8')).includes('6281234567890'));
});
test('related motifs and journal shop links reach every product page',async()=>{
  const {relatedProducts}=await import('../src/utils/productRelated.js');
  const {journalShopLinks}=await import('../src/utils/journalShop.js');
  const {BLOG_POSTS}=await import('../src/constants/blogPosts.js');
  const {products}=JSON.parse(await readFile('src/content/store.json','utf8'));
  const linked=new Set();
  for(const product of products){
    const related=relatedProducts(product,products);
    assert.equal(related.length,4);assert.ok(related.every(item=>item.id!==product.id));
    related.forEach(item=>linked.add(item.id));
  }
  assert.equal(linked.size,products.length);
  const fromJournal=new Set(BLOG_POSTS.flatMap(post=>journalShopLinks(post,products).products.map(item=>item.href)));
  assert.equal(fromJournal.size,products.filter(product=>!product.photoOnly).length);
});
test('product, catalogue and journal titles fit the ~60 character search display',async()=>{
  const {productTitle,catalogTitle,catalogDescription,productMetaDescription}=await import('../src/utils/productSeo.js');
  const {journalTitle}=await import('../src/utils/journalRoutes.js');
  const {BLOG_POSTS}=await import('../src/constants/blogPosts.js');
  const {products}=JSON.parse(await readFile('src/content/store.json','utf8'));
  for(const product of products){assert.ok(productTitle(product).length<=60,productTitle(product));assert.ok(productMetaDescription(product).length<=160);}
  const long=BLOG_POSTS.filter(post=>journalTitle(post).length>60);
  assert.ok(long.every(post=>journalTitle(post)===post.seoTitle),'long journal titles drop the suffix rather than truncate');
  const pages=[1,2,3,4].map(page=>catalogDescription(products,page));
  assert.equal(new Set(pages).size,4);assert.equal(catalogTitle(2),'Koleksi Kaos Anak Oversize — Halaman 2 | Kainora Kids');
});
