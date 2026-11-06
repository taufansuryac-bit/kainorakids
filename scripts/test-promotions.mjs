import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateContent, referencedMedia } from '../shared/contentSchema.js';
import { createLocalAdmin } from '../tools/admin-local.js';

const source = JSON.parse(await readFile(new URL('../src/content/store.json', import.meta.url), 'utf8'));

test('two promotion slots survive validation and remain registered media; legacy content stays compatible', () => {
  const content = validateContent(source);
  assert.equal(content.promotions.length, 2);
  assert.deepEqual(content.promotions, source.promotions);
  for (const item of content.promotions) assert.ok(referencedMedia(content).has(item.image));
  const legacy = structuredClone(source);delete legacy.promotions;
  assert.equal('promotions' in validateContent(legacy), false);
  assert.deepEqual(validateContent({ ...source, promotions: [] }).promotions, []);
});

test('promotion slots reject incomplete pairs, unsafe media and missing descriptions', () => {
  for (const update of [
    content => content.promotions.pop(),
    content => content.promotions.push({ ...content.promotions[0], id: 'third' }),
    content => content.promotions[1].id = content.promotions[0].id,
    content => content.promotions[0].image = '//evil.test/promo.webp',
    content => content.promotions[0].image = '/images/%2e%2e/private.webp',
    content => content.promotions[0].image = '',
    content => content.promotions[0].alt = '',
  ]) {
    const content = structuredClone(source);update(content);assert.throws(() => validateContent(content));
  }
});

test('uploaded promotion persists through the real local adapter without changing the other slot or catalogue', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kainora-promo-'));
  try {
    await mkdir(path.join(root, 'src/content'), { recursive: true });
    await writeFile(path.join(root, 'src/content/store.json'), JSON.stringify(source));
    const admin = createLocalAdmin(root);
    const request = (route, options) => admin(new Request(`http://127.0.0.1:5179/api/admin/${route}`, options), '127.0.0.1');
    const session = await (await request('session')).json();
    const baseline = await (await request('content')).json();
    const content = structuredClone(baseline.content);
    const bytes = await readFile(new URL('../public/images/kainora-owned/hero-yellow.webp', import.meta.url));
    const hash = createHash('sha256').update(bytes).digest('hex');
    const image = `/images/uploads/${hash}.webp`;
    content.promotions[0] = { ...content.promotions[0], image, alt: 'Promosi yang sudah diperbarui' };
    const headers = { origin: 'http://127.0.0.1:5179', 'content-type': 'application/json', 'x-csrf-token': session.csrf };
    const withoutUpload = await request('content', { method: 'POST', headers, body: JSON.stringify({ content, revision: baseline.revision, uploads: [] }) });
    assert.equal(withoutUpload.status, 400);
    const response = await request('content', { method: 'POST', headers, body: JSON.stringify({ content, revision: baseline.revision, uploads: [{ path: image, base64: bytes.toString('base64') }] }) });
    assert.equal(response.status, 200);
    const reopened = createLocalAdmin(root);
    const restored = await (await reopened(new Request('http://127.0.0.1:5179/api/admin/content'), '127.0.0.1')).json();
    assert.deepEqual(restored.content.promotions[0], content.promotions[0]);
    assert.deepEqual(restored.content.promotions[1], baseline.content.promotions[1]);
    for (const key of ['products', 'arrivals', 'garments']) assert.deepEqual(restored.content[key], baseline.content[key]);
    assert.deepEqual(await readFile(path.join(root, 'public', image.slice(1))), bytes);
  } finally {
    assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep));
    assert.ok(path.basename(root).startsWith('kainora-promo-'));
    await rm(root, { recursive: true, force: true });
  }
});
