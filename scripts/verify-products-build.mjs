import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { productHref, catalogHref, PRODUCT_SITE } from '../src/utils/productRoutes.js';
import { productAvailability } from '../src/utils/productAvailability.js';
import { productImageProps } from '../src/utils/productImages.js';

const { products } = JSON.parse(await readFile('src/content/store.json', 'utf8'));
const sitemap = await readFile('dist/sitemap-products.xml', 'utf8');
const allPaths = [...products.map(productHref), ...Array.from({ length: Math.max(1, Math.ceil(products.length / 12)) }, (_, i) => catalogHref(i + 1))];
const descriptions = new Set();
for (const product of products) {
  const path = productHref(product), html = await readFile(`dist${path}index.html`, 'utf8');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${PRODUCT_SITE}${path}"`));
  const [schema, breadcrumbs] = JSON.parse(html.match(/<script id="commerce-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.name, product.name); assert.equal(schema.offers.price, product.price);
  assert.equal(schema.offers.availability, `https://schema.org/${productAvailability(product)}`);
  assert.equal(schema.offers.hasMerchantReturnPolicy.merchantReturnDays,2);
  assert.equal(breadcrumbs.itemListElement.at(-1).item, PRODUCT_SITE+path);
  assert.ok(new RegExp(`<h1[^>]*>${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`).test(html));
  assert.ok(html.includes(`src="${productImageProps(product.img).src}"`));
  descriptions.add(html.match(/<meta name="description" content="([^"]*)"/)[1]);
}
assert.equal(descriptions.size, products.length);
for (const path of allPaths) assert.ok(sitemap.includes(`<loc>${PRODUCT_SITE}${path}</loc>`));
const catalog = await readFile('dist/products/page/2/index.html', 'utf8');
assert.equal((catalog.match(/class="ks-card"/g) || []).length, 12);
const home=await readFile('dist/index.html','utf8');
assert.ok(home.includes('data-ssr="true"'));
assert.ok(home.includes(`href="${catalogHref()}"`));
assert.ok(home.includes(`href="${productHref(products[0])}"`));
const missing = await readFile('dist/404.html', 'utf8');
assert.ok(missing.includes('noindex, follow')); assert.ok(!missing.includes('type="module"'));
console.log(`Verified ${products.length} product HTML documents, unique descriptions, raw HTML prices/images, breadcrumbs, ${allPaths.length} sitemap URLs, catalogue pagination and static noindex 404.`);
