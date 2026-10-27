import { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function Model({ url, id, back }) {
  const { scene } = useLoader(GLTFLoader, url);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { document.getElementById(id).dataset.ready = 'true'; invalidate(); }, [id, invalidate]);
  return <group rotation={[0, back ? Math.PI : 0, 0]}><primitive object={scene} dispose={null} /></group>;
}

export default function Comparison() {
  const back = new URLSearchParams(location.search).get('side') === 'back';
  return <main><header><div><p style={{ textAlign: 'left', marginBottom: 10 }}>KAINORA KIDS / ASSET REVIEW</p><h1>DUA MODEL. SATU PENCAHAYAAN.</h1></div><p>{back ? 'TAMPAK BELAKANG' : 'TAMPAK DEPAN'}<br />Skala tampilan dinormalisasi, bukan ukuran produksi.</p></header><div className="grid">{[{ id: 'model-1', title: 'MODEL 01 — FOLDER 1', file: 'oversized', note: 'Model yang saat ini dipakai di A Closer Look.' }, { id: 'model-2', title: 'MODEL 02 — FOLDER 2', file: 'compare-source-2', note: 'Versi Hi_T-shirt; Low_T-shirt memakai bentuk dasar yang sama.' }].map(item => <article key={item.id}><h2>{item.title}</h2><p>{item.note}</p><div className="scene" id={item.id}><Canvas frameloop="demand" dpr={1.5} camera={{ position: [0, .06, 3.65], fov: 38, near: .1, far: 20 }} gl={{ antialias: true, alpha: true }}><hemisphereLight args={['#ffffff', '#a19b8c', 2.2]} /><directionalLight position={[3, 4, 5]} intensity={3.4} /><directionalLight position={[-3, 1, -2]} intensity={2} /><Suspense fallback={null}><Model url={`/models/kainora/${item.file}.glb`} id={item.id} back={back} /></Suspense></Canvas></div><div className="label">{item.file === 'oversized' ? 'Potongan lebih panjang · Lengan jatuh · Kerah crew neck' : 'Potongan lebih lebar · Lipatan lebih dinamis · Detail kerah berbeda'}</div></article>)}</div><footer><span>Render langsung dari geometri asli yang disediakan.</span><span>Material, sudut kamera dan pencahayaan disamakan.</span></footer></main>;
}

createRoot(document.getElementById('comparison-root')).render(<Comparison />);
