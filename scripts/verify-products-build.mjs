import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CATALOG_PAGE_SIZE, productHref, catalogHref, PRODUCT_SITE } from '../src/utils/productRoutes.js';
import { productAvailability } from '../src/utils/productAvailability.js';
import { productImageProps } from '../src/utils/productImages.js';

const { products } = JSON.parse(await readFile('src/content/store.json', 'utf8'));
const sitemap = await readFile('dist/sitemap-products.xml', 'utf8');
const totalPages = Math.max(1, Math.ceil(products.length / CATALOG_PAGE_SIZE));
const allPaths = [...products.map(productHref), ...Array.from({ length: totalPages }, (_, i) => catalogHref(i + 1))];
const descriptions = new Set();
for (const product of products) {
  const path = productHref(product), html = await readFile(`dist${path}index.html`, 'utf8');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${PRODUCT_SITE}${path}"`));
  const [schema, breadcrumbs] = JSON.parse(html.match(/<script id="commerce-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.name, product.name); if(product.sizePrices){assert.equal(schema.offers.lowPrice,89000);assert.equal(schema.offers.highPrice,94000);assert.deepEqual(schema.offers.offers.map(item=>item.price),product.sizes.map(size=>product.sizePrices[size]));}else assert.equal(schema.offers.price, product.price);
  assert.equal(schema.offers.availability, `https://schema.org/${productAvailability(product)}`);
  assert.equal(schema.offers.hasMerchantReturnPolicy.merchantReturnDays,2);
  assert.equal(breadcrumbs.itemListElement.at(-1).item, PRODUCT_SITE+path);
  assert.ok(new RegExp(`<h1[^>]*>${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`).test(html));
  assert.ok(html.includes(`src="${productImageProps(product.img).src}"`));
  descriptions.add(html.match(/<meta name="description" content="([^"]*)"/)[1]);
}
assert.equal(descriptions.size, products.length);
for (const path of allPaths) assert.ok(sitemap.includes(`<loc>${PRODUCT_SITE}${path}</loc>`));
for (let page = 1; page <= totalPages; page++) {
  const catalog = await readFile(`dist${catalogHref(page)}index.html`, 'utf8');
  const expected = products.slice((page - 1) * CATALOG_PAGE_SIZE, page * CATALOG_PAGE_SIZE);
  assert.equal((catalog.match(/class="ks-card"/g) || []).length, expected.length);
  const [schema] = JSON.parse(catalog.match(/<script id="commerce-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema.mainEntity.itemListElement.map(item => item.url), expected.map(product => PRODUCT_SITE + productHref(product)));
  assert.equal(schema.mainEntity.itemListElement[0].position, (page - 1) * CATALOG_PAGE_SIZE + 1);
}
const home=await readFile('dist/index.html','utf8');
assert.ok(home.includes('data-ssr="true"'));
assert.ok(home.includes(`href="${catalogHref()}"`));
const firstCatalog=await readFile(`dist${catalogHref()}index.html`,'utf8');
assert.ok(firstCatalog.includes(`href="${productHref(products[0])}"`));
const missing = await readFile('dist/404.html', 'utf8');
assert.ok(missing.includes('noindex, follow')); assert.ok(!missing.includes('type="module"'));
console.log(`Verified ${products.length} product HTML documents, unique descriptions, raw HTML prices/images, breadcrumbs, ${allPaths.length} sitemap URLs, catalogue pagination and static noindex 404.`);
