import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Group, Mesh, MeshStandardMaterial, PlaneGeometry, Texture } from 'three';
import { validateContent } from '../shared/contentSchema.js';
import { GARMENT_PRINT_LAYOUT, garmentPrintLayout } from '../src/constants/garmentPrintLayout.js';
import { createWindGarment } from '../src/components/fashion/garmentWind.js';
import { createLocalAdmin } from '../tools/admin-local.js';

const fixture = () => ({ version: 1, products: [], highlights: [], garments: [
  { id: 'candy', name: 'Candy', description: '', color: 'black', initialView: 'front', frontLayout: 'large', front: '/candy.png', back: '', productId: '' },
] });

test('100/80/60 percent scale only the large front print around its fixed centre', () => {
  const entry = fixture().garments[0], base = GARMENT_PRINT_LAYOUT.frontLarge;
  assert.equal(garmentPrintLayout(entry, 'front'), base);
  for (const percent of [100, 80, 60, 20]) {
    const layout = garmentPrintLayout({ ...entry, frontPrintScale: percent }, 'front');
    assert.deepEqual(layout.position, base.position);
    assert.equal(layout.size[0], base.size[0] * percent / 100);
    assert.equal(layout.size[1], base.size[1] * percent / 100);
    assert.equal(layout.size[2], base.size[2]);
    assert.equal(garmentPrintLayout({ ...entry, frontPrintScale: percent }, 'back'), GARMENT_PRINT_LAYOUT.back);
    for (const frontLayout of ['chest', 'badge']) assert.equal(garmentPrintLayout({ ...entry, frontLayout, frontPrintScale: percent }, 'front'), frontLayout === 'chest' ? GARMENT_PRINT_LAYOUT.front : GARMENT_PRINT_LAYOUT.frontBadge);
  }
  assert.deepEqual(base.size, [1.02, 1.24, .55]);
});

test('saved scale reaches the cloth shader without scaling the garment geometry', () => {
  const source = new Group(), geometry = new PlaneGeometry(1, 1), material = new MeshStandardMaterial(), texture = new Texture();
  source.add(new Mesh(geometry, material));
  const layout = garmentPrintLayout({ ...fixture().garments[0], frontPrintScale: 60 }, 'front');
  const wind = createWindGarment(source, 1, 'black', { front: { layout, texture } });
  try {
    const mesh = wind.object.children[0], ink = mesh.material.userData.kainoraPrints;
    assert.equal(mesh.geometry, geometry);
    assert.deepEqual(mesh.scale.toArray(), [1, 1, 1]);
    const rect = ink.uKainoraFrontRect.value.toArray(), expected = [0, .02, 1.02 * .6, 1.24 * .6];
    rect.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 1e-12));
    assert.equal(ink.uKainoraBackEnabled.value, 0);
  } finally { wind.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); }
});

test('admin accepts integer percentages and preserves legacy entries without the field', () => {
  assert.equal('frontPrintScale' in validateContent(fixture()).garments[0], false);
  for (const value of [20, 60, 80, 100]) {
    const data = fixture(); data.garments[0].frontPrintScale = value;
    assert.equal(validateContent(data).garments[0].frontPrintScale, value);
  }
  for (const value of [0, 19, 101, -60, 80.5, '80', null, NaN, Infinity]) {
    const data = fixture(); data.garments[0].frontPrintScale = value;
    assert.throws(() => validateContent(data), /20–100/);
  }
});

test('scale persists through the real local save adapter and reopening content', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kainora-print-scale-'));
  try {
    await mkdir(path.join(root, 'src/content'), { recursive: true });
    await writeFile(path.join(root, 'src/content/store.json'), JSON.stringify(fixture()));
    const adapter = createLocalAdmin(root);
    const request = (route, options) => adapter(new Request(`http://127.0.0.1:5174/api/admin/${route}`, options), '127.0.0.1');
    const session = await (await request('session')).json(), snapshot = await (await request('content')).json();
    snapshot.content.garments[0].frontPrintScale = 80;
    const saved = await request('content', { method: 'POST', headers: { origin: 'http://127.0.0.1:5174', 'content-type': 'application/json', 'x-csrf-token': session.csrf }, body: JSON.stringify({ content: snapshot.content, revision: snapshot.revision, uploads: [] }) });
    assert.equal(saved.status, 200);
    assert.equal(JSON.parse(await readFile(path.join(root, 'src/content/store.json'), 'utf8')).garments[0].frontPrintScale, 80);
    const reopened = createLocalAdmin(root);
    const restored = await (await reopened(new Request('http://127.0.0.1:5174/api/admin/content'), '127.0.0.1')).json();
    assert.equal(restored.content.garments[0].frontPrintScale, 80);
    assert.deepEqual(garmentPrintLayout(restored.content.garments[0], 'front').position, GARMENT_PRINT_LAYOUT.frontLarge.position);
  } finally {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(tmpdir()));
    assert.match(path.basename(root), /^kainora-print-scale-/);
    await rm(root, { recursive: true, force: true });
  }
});
