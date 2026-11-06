import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateContent, referencedMedia, removeProduct, MAX_ARRIVALS } from '../shared/contentSchema.js';
import { createLocalAdmin } from '../tools/admin-local.js';

const source = JSON.parse(await readFile(new URL('../src/content/store.json', import.meta.url), 'utf8'));
test('catalogue links persist for arrivals, reject dangling IDs and clear on product removal', () => {
  const data = structuredClone(source); data.arrivals[0].productId = '4';
  const saved = validateContent(data);
  assert.equal(saved.arrivals[0].productId, '4');
  assert.equal(removeProduct(saved, 4).arrivals[0].productId, '');
  assert.doesNotThrow(() => validateContent(removeProduct(saved, 4)));
  data.arrivals[0].productId = 'missing-product';
  assert.throws(() => validateContent(data), /Tautan produk New Arrival/);
});
test('New Arrival accepts its three local views and preserves every image reference', () => {
  const saved = validateContent(source);
  assert.equal(MAX_ARRIVALS, 10);
  assert.equal(saved.arrivals.length, 6);
  assert.equal(saved.arrivals.filter(item => item.color === 'black').length, 3);
  assert.equal(saved.arrivals.filter(item => item.color === 'white').length, 3);
  const refs = referencedMedia(saved);
  for (const item of saved.arrivals) for (const side of ['front','back','side']) assert.ok(refs.has(item[side]));
  assert.deepEqual(saved.arrivals, source.arrivals);
  const legacy = { ...source }; delete legacy.arrivals;
  assert.equal('arrivals' in validateContent(legacy), false);
});
test('New Arrival rejects missing views, unsafe paths, duplicate IDs and excessive slots', () => {
  for (const change of [data => data.arrivals[0].side = '', data => data.arrivals[0].front = '//evil.test/shirt.png', data => data.arrivals[0].color = 'red', data => data.arrivals.push(data.arrivals[0])]) {
    const data = structuredClone(source); change(data); assert.throws(() => validateContent(data));
  }
  assert.throws(() => validateContent({ ...source, arrivals: Array.from({ length: 11 }, (_, index) => ({ ...source.arrivals[0], id: `slot-${index}` })) }));
  assert.equal(validateContent({ ...source, arrivals: [] }).arrivals.length, 0);
});
test('all six PNG templates retain the matched full 1024 x 1536 RGBA canvas', async () => {
  for (const color of ['black','white']) for (const side of ['front','back','side']) {
    const bytes = await readFile(new URL(`../public/images/new-arrival/templates/${color}-${side}.png`, import.meta.url));
    assert.equal(bytes.readUInt32BE(16), 1024);
    assert.equal(bytes.readUInt32BE(20), 1536);
    assert.equal(bytes[25], 6, 'RGBA, including alpha');
  }
});
test('independent arrival edits and reorder persist through the real local adapter', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kainora-arrival-'));
  try {
    await mkdir(path.join(root, 'src/content'), { recursive: true });
    await writeFile(path.join(root, 'src/content/store.json'), JSON.stringify(source));
    const adapter = createLocalAdmin(root);
    const request = (route, options) => adapter(new Request(`http://127.0.0.1:5174/api/admin/${route}`, options), '127.0.0.1');
    const session = await (await request('session')).json(), baseline = await (await request('content')).json();
    const content = structuredClone(baseline.content); content.arrivals.reverse(); content.arrivals[0].name = 'Hasil Photoshop';
    content.arrivals[0].front = source.arrivals[0].front;
    const saved = await request('content', { method: 'POST', headers: { origin: 'http://127.0.0.1:5174', 'content-type': 'application/json', 'x-csrf-token': session.csrf }, body: JSON.stringify({ content, revision: baseline.revision, uploads: [] }) });
    assert.equal(saved.status, 200);
    const reopened = createLocalAdmin(root);
    const restored = await (await reopened(new Request('http://127.0.0.1:5174/api/admin/content'), '127.0.0.1')).json();
    assert.deepEqual(restored.content.arrivals, content.arrivals);
    assert.deepEqual(restored.content.garments, baseline.content.garments);
  } finally { await rm(root, { recursive: true, force: true }); }
});
