import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createGridMotion, advanceGridMotion, pauseGridMotion, resumeGridMotion } from '../src/components/fashion/garmentGridMotion.js';
import { MAX_GARMENTS, validateContent } from '../shared/contentSchema.js';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLocalAdmin } from '../tools/admin-local.js';
import { garmentCameraDistance, garmentFrame } from '../src/components/fashion/garmentFraming.js';

test('the actual garment stays inside the frustum at every yaw and portrait/wide aspect', async () => {
  const bytes = await readFile(new URL('../public/models/kainora/oversized.glb', import.meta.url));
  const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const geometry = gltf.accessors[gltf.meshes[0].primitives[0].attributes.POSITION];
  const bounds = { min: Object.fromEntries(['x','y','z'].map((key,i)=>[key,geometry.min[i]])), max: Object.fromEntries(['x','y','z'].map((key,i)=>[key,geometry.max[i]])) };
  const frame = garmentFrame(bounds), tan = Math.tan(19 * Math.PI / 180);
  for (const aspect of [.35, .78, 1, 1.1, 1.8, 2.6]) {
    const distance = garmentCameraDistance(frame, aspect);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 24) for (const x of geometry.min.slice(0,1).concat(geometry.max.slice(0,1))) for (const y of [geometry.min[1],geometry.max[1]]) for (const z of [geometry.min[2],geometry.max[2]]) {
      const projectedX = x * Math.cos(angle) + z * Math.sin(angle), depth = -x * Math.sin(angle) + z * Math.cos(angle);
      assert.ok(Math.abs(projectedX) / (distance-depth) / tan / aspect < .99, 'sleeve fits');
      assert.ok((Math.abs(y)+.025) / (distance-depth) / tan < .99, 'hem plus float margin fits');
    }
  }
});

test('slot profiles are stable but have different speeds, directions and phases', () => {
  const states = Array.from({ length: 16 }, (_, index) => createGridMotion(`slot-${index}`, 'back', 0));
  assert.deepEqual(states[0], createGridMotion('slot-0', 'back', 0));
  assert.equal(new Set(states.map(state => state.speed)).size, 16);
  assert.equal(new Set(states.map(state => state.resumeAt)).size, 16);
  assert.deepEqual(new Set(states.map(state => state.direction)), new Set([-1, 1]));
  assert.ok(states.every(state => Number.isFinite(state.yaw)));
});

test('long drag and cancellation wait a full three seconds after release, independently', () => {
  const a = createGridMotion('slot-0', 'front', 0), b = createGridMotion('slot-1', 'front', 0);
  pauseGridMotion(a);
  const yaw = a.yaw;
  for (let i = 0; i < 60; i++) {
    advanceGridMotion(a, 1 / 60, 10000 + i * 17, true);
    advanceGridMotion(b, 1 / 60, 10000 + i * 17, true);
  }
  assert.equal(a.yaw, yaw);
  assert.notEqual(b.yaw, createGridMotion('slot-1', 'front', 0).yaw);
  resumeGridMotion(a, 20000);
  advanceGridMotion(a, 1 / 60, 22999, true);
  assert.equal(a.yaw, yaw);
  advanceGridMotion(a, 1 / 60, 23001, true);
  assert.notEqual(a.yaw, yaw);
});

test('offscreen and reduced-motion states stop both rotation and cloth time', () => {
  const state = createGridMotion('slot-3', 'back', 0);
  const initial = structuredClone(state);
  for (let i = 0; i < 120; i++) advanceGridMotion(state, 1 / 60, 10000 + i * 17, false);
  assert.equal(state.yaw, initial.yaw);
  assert.equal(state.time, initial.time);
});

test('rotation is consistent across frame rates and clamps long suspended frames', () => {
  const run = rate => {
    const state = createGridMotion('slot-2', 'back', 0);
    state.resumeAt = 0;
    for (let i = 0; i < rate * 10; i++) advanceGridMotion(state, 1 / rate, i * 1000 / rate, true);
    return state;
  };
  assert.ok(Math.abs(run(30).yaw - run(120).yaw) < .015);
  const state = run(60), before = state.yaw;
  advanceGridMotion(state, 3600, 100000, true);
  assert.ok(Math.abs(state.yaw - before) < .03);
});

test('sixteen independent editable slots round-trip; seventeen and duplicate IDs fail', async () => {
  const source = JSON.parse(await readFile(new URL('../src/content/store.json', import.meta.url), 'utf8'));
  assert.equal(MAX_GARMENTS, 16);
  assert.equal(source.garments.length, 16);
  const saved = validateContent(source);
  saved.garments.reverse();
  saved.garments[0].name = 'Motif pilihan admin';
  assert.deepEqual(validateContent(JSON.parse(JSON.stringify(saved))).garments, saved.garments);
  assert.throws(() => validateContent({ ...source, garments: [...source.garments, { ...source.garments[0], id: 'seventeenth' }] }));
  assert.throws(() => validateContent({ ...source, garments: [source.garments[0], source.garments[0]] }));
  assert.equal(validateContent({ ...source, garments: [] }).garments.length, 0);
});

test('admin saves edited motifs and order of all sixteen slots to an isolated folder', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kainora-grid-'));
  try {
    const raw = await readFile(new URL('../src/content/store.json', import.meta.url), 'utf8');
    await mkdir(path.join(root, 'src/content'), { recursive: true });
    await writeFile(path.join(root, 'src/content/store.json'), raw);
    const admin = createLocalAdmin(root);
    const request = (route, init) => admin(new Request(`http://127.0.0.1:5174/api/admin/${route}`, init), '127.0.0.1');
    const session = await (await request('session')).json();
    const baseline = await (await request('content')).json();
    const content = structuredClone(baseline.content);
    const first = content.garments[0], motif = content.garments.find(item => item.front !== first.front);
    Object.assign(first, { name: 'Pilihan admin', front: motif.front, back: motif.back, color: motif.color, frontLayout: motif.frontLayout, productId: motif.productId });
    content.garments.reverse();
    const saved = await request('content', { method: 'POST', headers: { origin: 'http://127.0.0.1:5174', 'content-type': 'application/json', 'x-csrf-token': session.csrf }, body: JSON.stringify({ content, revision: baseline.revision, uploads: [] }) });
    assert.equal(saved.status, 200, JSON.stringify(await saved.clone().json()));
    const reopened = createLocalAdmin(root);
    const restored = await (await reopened(new Request('http://127.0.0.1:5174/api/admin/content'), '127.0.0.1')).json();
    assert.deepEqual(restored.content.garments, content.garments);
  } finally { await rm(root, { recursive: true, force: true }); }
});
