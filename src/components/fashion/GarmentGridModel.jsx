import { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, CanvasTexture, SRGBColorSpace, TextureLoader } from 'three';
import { garmentPrintLayout } from '../../constants/garmentPrintLayout';
import { createWindGarment } from './garmentWind';
import { garmentSeed } from './garmentRail';
import { garmentFrame } from './garmentFraming';

const sides = ['front', 'back'];
// Repeated temporary motifs share their fitted GPU textures, not just downloads.
const fittedArtwork = new WeakMap();
function acquireArtwork(source, layout) {
  let sizes = fittedArtwork.get(source);
  if (!sizes) { sizes = new Map(); fittedArtwork.set(source, sizes); }
  const key = layout.size.slice(0, 2).join(':');
  let shared = sizes.get(key);
  if (!shared) {
    const canvas = document.createElement('canvas');
    canvas.width = layout.size[0] < .5 ? 256 : 768;
    canvas.height = Math.round(canvas.width * layout.size[1] / layout.size[0]);
    const image = source.image;
    const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale, height = image.height * scale;
    canvas.getContext('2d').drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 2;
    shared = { texture, references: 0 };
    sizes.set(key, shared);
  }
  shared.references++;
  return { texture: shared.texture, release() {
    if (--shared.references === 0) { shared.texture.dispose(); sizes.delete(key); }
  } };
}

export default function GarmentGridModel({ entry, register, onReady }) {
  const group = useRef(null);
  const { scene } = useLoader(GLTFLoader, '/models/kainora/oversized.glb');
  const urls = sides.map(side => entry[side]).filter(Boolean);
  const sources = useLoader(TextureLoader, urls);
  useEffect(() => {
    const acquired = [], prints = {};
    for (const side of sides) {
      if (!entry[side]) continue;
      const layout = garmentPrintLayout(entry, side);
      const artwork = acquireArtwork(sources[urls.indexOf(entry[side])], layout);
      acquired.push(artwork);
      prints[side] = { layout, texture: artwork.texture };
    }
    const wind = createWindGarment(scene, garmentSeed(entry.id), entry.color, prints);
    const frame = garmentFrame(new Box3().setFromObject(wind.object));
    const host = group.current;
    host.add(wind.object);
    register(entry.id, { group: host, wind, frame });
    onReady(entry.id);
    return () => {
      register(entry.id, null);
      host.remove(wind.object);
      wind.dispose();
      acquired.forEach(artwork => artwork.release());
    };
  // Immutable editor snapshots; loader caches source textures and geometry.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, entry, sources, onReady, register]);
  return <group ref={group} name={`garment-grid-${entry.id}`} visible={false} />;
}
