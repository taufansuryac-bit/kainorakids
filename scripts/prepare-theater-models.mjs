import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Box3, Vector3, MeshStandardMaterial, DoubleSide, BufferAttribute } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { MeshoptSimplifier } from 'meshoptimizer';

// GLTFExporter only needs FileReader for geometry buffers in this Node conversion.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
};

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/models/kainora');
await mkdir(output, { recursive: true });
await MeshoptSimplifier.ready;
const manifest = [];
const models = process.argv.includes('--compare-only')
  ? [['compare-source-2', '2/Hi_T-shirt.obj', 24000]]
  : [['oversized', '1/obj.obj', 40000]];
for (const [key, relative, target] of models) {
  const source = resolve(root, '../ASSET3D', relative);
  const obj = new OBJLoader().parse(await readFile(source, 'utf8'));
  const box = new Box3().setFromObject(obj);
  const size = box.getSize(new Vector3()), center = box.getCenter(new Vector3());
  const factor = 2 / Math.max(size.x, size.y, size.z);
  let before = 0, after = 0;
  const meshes = [];
  obj.traverse(node => { if (node.isMesh) meshes.push(node); });
  const totalTriangles = meshes.reduce((n, m) => n + m.geometry.attributes.position.count / 3, 0);
  for (const mesh of meshes) {
    const original = mesh.geometry;
    before += original.attributes.position.count / 3;
    original.translate(-center.x, -center.y, -center.z);
    original.scale(factor, factor, factor);
    // These assets are plain form studies; no official motif is synthesized.
    original.deleteAttribute('uv');
    let geometry = mergeVertices(original, 0.000001);
    const indices = Uint32Array.from(geometry.index.array);
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    const count = Math.max(300, Math.floor(target * (indices.length / 3) / totalTriangles)) * 3;
    const [simplified] = MeshoptSimplifier.simplifyWithAttributes(indices, positions, 3, normals, 3, [.5, .5, .5], null, count, .003);
    const [remap, vertexCount] = MeshoptSimplifier.compactMesh(simplified);
    for (const name of ['position', 'normal']) {
      const sourceAttribute = geometry.attributes[name];
      const data = new Float32Array(vertexCount * 3);
      for (let i = 0; i < remap.length; i++) {
        if (remap[i] !== 0xffffffff) data.set(sourceAttribute.array.subarray(i * 3, i * 3 + 3), remap[i] * 3);
      }
      geometry.setAttribute(name, new BufferAttribute(data, 3));
    }
    geometry.clearGroups();
    geometry.setIndex(new BufferAttribute(vertexCount < 65536 ? Uint16Array.from(simplified) : simplified, 1));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    mesh.geometry = geometry;
    mesh.material = new MeshStandardMaterial({ color: '#e8e3d7', roughness: .88, metalness: 0, side: DoubleSide });
    mesh.name = `${key}-garment`;
    original.dispose();
    after += geometry.index.count / 3;
  }
  obj.name = `Kainora form study - ${key}`;
  obj.userData = { source: `ASSET3D/${relative}`, purpose: 'Unprinted garment form study; not a product SKU or size simulation.' };
  const binary = await new GLTFExporter().parseAsync(obj, { binary: true });
  const destination = resolve(output, `${key}.glb`);
  await writeFile(destination, Buffer.from(binary));
  manifest.push({ key, source: `ASSET3D/${relative}`, url: `/models/kainora/${key}.glb`, sourceTriangles: before, triangles: after, bytes: binary.byteLength, normalizedMaxDimension: 2 });
  console.log(JSON.stringify(manifest.at(-1)));
}
await writeFile(resolve(root, process.argv.includes('--compare-only') ? 'docs/kainora-v2/3d-comparison-assets.json' : 'docs/kainora-v2/3d-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
