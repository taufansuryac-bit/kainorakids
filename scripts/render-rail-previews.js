// Run from the local Vite browser to export consistent transparent garment views.
// Shared by the static-asset generation workflow; original artwork is untouched.
import { WebGLRenderer, OrthographicCamera, Scene, HemisphereLight, DirectionalLight, TextureLoader, CanvasTexture, SRGBColorSpace, NeutralToneMapping } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWindGarment } from '../src/components/fashion/garmentWind.js';
import { GARMENT_PRINT_LAYOUT } from '../src/constants/garmentPrintLayout.js';
import { createGarmentHanger } from '../src/components/fashion/garmentHanger.js';

export async function renderRailPreviews(entries) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(600, 930);
  renderer.setClearColor('#ffffff', 0);
  renderer.toneMapping = NeutralToneMapping;
  const scene = new Scene();
  scene.add(new HemisphereLight('#ffffff', '#a19b8c', 2.2));
  const key = new DirectionalLight('#ffffff', 3.4); key.position.set(3, 4, 5); scene.add(key);
  const fill = new DirectionalLight('#ffffff', 2); fill.position.set(-3, 1, -2); scene.add(fill);
  const camera = new OrthographicCamera(-1.3, 1.3, 1.22, 1.22 - 2.6 * 930 / 600, .1, 20);
  camera.position.set(0, 0, 5);
  const { scene: source } = await new GLTFLoader().loadAsync('/models/kainora/oversized.glb');
  const loader = new TextureLoader(), output = [];
  try {
    for (const entry of entries) {
      const textures = [], originals = [], prints = {};
      for (const side of ['front', 'back']) {
        if (!entry[side]) continue;
        const original = await loader.loadAsync(entry[side]); originals.push(original);
        const preset = side === 'back' ? 'back' : entry.frontLayout === 'large' ? 'frontLarge' : entry.frontLayout === 'badge' ? 'frontBadge' : 'front';
        const layout = GARMENT_PRINT_LAYOUT[preset];
        const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = Math.round(1024 * layout.size[1] / layout.size[0]);
        const scale = Math.min(canvas.width / original.image.width, canvas.height / original.image.height);
        const w = original.image.width * scale, h = original.image.height * scale;
        canvas.getContext('2d').drawImage(original.image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4; textures.push(texture);
        prints[side] = { texture, layout };
      }
      const garment = createWindGarment(source, 0, entry.color, prints); garment.uniforms.uKainoraWindGain.value = 0;
      const hanger = createGarmentHanger();
      garment.object.add(hanger.object);
      scene.add(garment.object);
      const images = {};
      for (const [side, angle] of [['front', 0], ['back', Math.PI], ['side', -Math.PI / 2]]) {
        garment.object.rotation.y = angle;
        renderer.render(scene, camera);
        images[side] = renderer.domElement.toDataURL('image/png');
      }
      output.push({ id: entry.id, signature: [entry.front, entry.back, entry.color, entry.frontLayout].join('|'), images });
      scene.remove(garment.object); garment.dispose(); hanger.dispose(); textures.forEach(texture => texture.dispose()); originals.forEach(texture => texture.dispose());
    }
  } finally {
    renderer.dispose(); renderer.forceContextLoss();
    source.traverse(object => { if (object.isMesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
  }
  return output;
}
