import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent, validateUploads, removeProduct, selectHighlights } from '../shared/contentSchema.js';

const fixture = () => ({ version: 1, products: [{ id: 4, name: 'Kainora Park', img: '/kainorapark-1.jpg', images: ['/kainorapark-1.jpg'], sizes: [], photoOnly: true }], highlights: ['4'], garments: [{ id: 'park', name: 'Kainora Park', color: 'white', initialView: 'back', frontLayout: 'chest', front: '', back: '/models/kainora/kainora-park-back.webp', productId: '4' }] });
test('keeps empty collections empty and selects only explicit highlights in order', () => {
  assert.deepEqual(validateContent({ version: 1, products: [], highlights: [], garments: [] }).products, []);
  const data = validateContent(fixture());
  assert.equal(data.products[0].price, undefined);
  assert.equal(selectHighlights(data.products, []).length, 0);
  assert.equal(selectHighlights(data.products, ['4'])[0].name, 'Kainora Park');
});
test('rejects dangling references, duplicate IDs, excessive highlights and unsafe media', () => {
  for (const change of [d => d.highlights.push('missing'), d => d.highlights.push('4'), d => d.products.push(d.products[0]), d => d.garments[0].productId = 'missing', d => d.garments[0].back = 'javascript:alert(1)', d => d.garments[0].color = 'blue', d => d.garments[0].back = '', d => d.products[0].img = '/%2e%2e/secret']) {
    const data = fixture(); change(data); assert.throws(() => validateContent(data));
  }
  const data = fixture(); data.highlights = Array(13).fill('4'); assert.throws(() => validateContent(data));
});
test('delete cleans highlights and linked CTA without deleting the separate garment', () => {
  const result = removeProduct(fixture(), 4);
  assert.equal(result.products.length, 0); assert.equal(result.highlights.length, 0);
  assert.equal(result.garments.length, 1); assert.equal(result.garments[0].productId, '');
  assert.doesNotThrow(() => validateContent(result));
});
test('upload is restricted to hashed media paths and real supported image signatures', async () => {
  const content = fixture();
  await assert.rejects(() => validateUploads([{ path: '../../src/App.jsx', base64: 'aGVsbG8=' }], content));
  await assert.rejects(() => validateUploads([{ path: `/images/uploads/${'a'.repeat(64)}.png`, base64: 'aGVsbG8=' }], content));
  const empty = await validateUploads([], content); assert.deepEqual(empty, []);
});
