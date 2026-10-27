import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { catalogPage, commerceView, filterCatalog, productFromLocation, productHref } from '../src/utils/productRoutes.js';
import { productSchema, productListSchema, schemaJSON } from '../src/utils/productSeo.js';
import { galleryZoom } from '../src/utils/galleryZoom.js';
import { canOrder } from '../src/utils/pricing.js';
import { validateContent } from '../shared/contentSchema.js';

const product = { id: 'photo-park', name: 'Kaos Le Marché', img: '/PRODUCT/lemarche-1.jpg', price: 69000, order: 1, gender: 'Unisex' };
test('product URLs resolve numeric/string IDs, legacy aliases, accents and invalid paths', () => {
  assert.equal(productHref(product), '/products/kaos-le-marche--photo-park/');
  for (const url of [productHref(product), '/?view=productDetail&id=photo-park']) assert.equal(productFromLocation([product], new URL(url, 'https://kainorakids.com')).id, product.id);
  assert.equal(productFromLocation([product], new URL('/products/missing--nope/', 'https://kainorakids.com')), null);
  assert.equal(productFromLocation([product], new URL('/products/invalid--%FF/', 'https://kainorakids.com')), null);
  assert.equal(commerceView(new URL('https://kainorakids.com/products/page/2/')), 'products');
  assert.equal(catalogPage(new URL('https://kainorakids.com/products/page/2/')), 2);
  const doubleDash = { ...product, id: 'motif--special' };
  assert.equal(productFromLocation([doubleDash], new URL(productHref(doubleDash), 'https://kainorakids.com')).id, doubleDash.id);
});
test('filtering composes terms/gender/sizes and unknown price stays last in both directions', () => {
  const list = [product, { ...product, id: 'new', price: undefined, sizes: ['5-6Y'], name: 'Kaos Sunshine', order: 2 }];
  assert.equal(filterCatalog(list, { search: 'kaos marche', gender: 'Laki-laki' }).length, 1);
  assert.equal(filterCatalog(list, { size: '5-6Y' })[0].id, 'new');
  for (const sort of ['price-asc', 'price-desc']) assert.equal(filterCatalog(list, { sort }).at(-1).id, 'new');
  assert.deepEqual(filterCatalog(list, { search: 'tidak-ada' }), []);
  assert.equal(list[0].id, product.id);
});
test('structured data never fabricates availability, zero prices, reviews or unsafe script text', () => {
  assert.equal(productSchema(product).offers.price, 69000);
  assert.equal(productSchema(product).offers.availability, undefined);
  assert.equal(productSchema({ ...product, price: undefined }).offers, undefined);
  assert.equal(productSchema({ ...product, catalogPreview: true }).offers, undefined);
  assert.equal(productSchema(product, [{ isDummy: true, rating: 5, text: 'contoh' }]).aggregateRating, undefined);
  assert.equal(productSchema({ ...product, stock: 0 }).offers.availability, 'https://schema.org/OutOfStock');
  assert.equal(productListSchema([product]).mainEntity.itemListElement[0].url, 'https://kainorakids.com'+productHref(product));
  assert.ok(!schemaJSON({ text: '</script><script>alert(1)</script>' }).includes('</script>'));
});
test('entire imported catalogue uses real yellow covers, paired assets and the approved white price', async () => {
  const content = JSON.parse(await readFile('src/content/store.json', 'utf8'));
  assert.equal(validateContent(content).products.length, 42);
  assert.deepEqual(content.products.find(p => p.id === 1).sizes, ['S','M','L','XL','XXL']);
  assert.deepEqual(content.products.find(p => p.id === 4).sizes, ['S','M','L','XL','XXL']);
  assert.equal(content.products.length, 42);
  assert.equal(new Set(content.products.map(p => p.img)).size, 42);
  for (const p of content.products) {
    assert.equal(p.price, 69000); assert.match(p.img, /^\/PRODUCT\/.+-1\.jpg$/);
    assert.equal(p.availability,'InStock');
    assert.ok(p.sizes.length > 0, `${p.name} must retain size choices`);
    assert.equal(canOrder(p, p.sizes[0]), true);
    assert.equal(canOrder(p, 'invalid-size'), false);
    for (const image of p.images) await stat('public'+image);
  }
  assert.equal(content.highlights.length, 12);
});

test('magnifier keeps the cursor source point centred and clamps outside coordinates', () => {
  const middle = galleryZoom(200, 200, 400, 400);
  assert.equal(middle.backgroundSize, '640px 640px');
  assert.equal(middle.backgroundPosition, '-230px -230px');
  assert.equal(middle.x, 110);
  const edge = galleryZoom(-5, 500, 400, 400);
  assert.equal(edge.backgroundPosition, '90px -550px');
  assert.equal(edge.x, -90);
  assert.equal(edge.y, 310);
});
