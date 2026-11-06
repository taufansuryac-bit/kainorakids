import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CanvasTexture, MathUtils, NeutralToneMapping, SRGBColorSpace, TextureLoader, Vector2 } from 'three';
import { garmentPrintLayout } from '../../constants/garmentPrintLayout';
import { GARMENT_VIEW } from '../../constants/garmentViewConfig';
import { createWindGarment } from './garmentWind';
import { advanceAutoTurn, createAutoTurnState, postponeAutoTurn } from './garmentAutoTurn';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { garmentSeed, garmentYaw, railCameraYaw, railOffset, visibleGarments, wrapIndex } from './garmentRail';

const PRINT_SIDES = ['front', 'back'];

const reducedQuery = '(prefers-reduced-motion: reduce)';
const reducedSnapshot = () => window.matchMedia(reducedQuery).matches;
function subscribeReduced(callback) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function fitArtwork(source, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width < .5 ? 512 : 1280;
  canvas.height = Math.round(canvas.width * height / width);
  const context = canvas.getContext('2d');
  const image = source.image;
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
  const w = image.width * scale, h = image.height * scale;
  context.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

class ViewerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? <div className="garment-feedback"><p>Tampilan 3D belum dapat dibuka.</p><span>Foto dan detail produk tersedia pada katalog di bawah.</span><button onClick={this.props.onRetry}>COBA LAGI</button></div> : this.props.children; }
}

function GarmentItem({ scene, entry, onReady, register }) {
  const urls = PRINT_SIDES.map(side => entry[side]).filter(Boolean);
  const textures = useLoader(TextureLoader, urls);
  const resource = useMemo(() => {
    const prints = {};
    PRINT_SIDES.forEach(key => {
      if (!entry[key]) return;
      const layout = garmentPrintLayout(entry, key);
      prints[key] = { layout, texture: fitArtwork(textures[urls.indexOf(entry[key])], layout.size[0], layout.size[1]) };
    });
    const wind = createWindGarment(scene, garmentSeed(entry.id), entry.color, prints);
    return { wind, prints };
  // Entries are immutable editor snapshots. Texture-loader owns cached sources.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, entry, textures]);
  useEffect(() => {
    register(entry.id, resource.wind);
    onReady();
    return () => {
      register(entry.id, null);
      resource.wind.dispose();
      Object.values(resource.prints).forEach(print => print.texture.dispose());
    };
  }, [entry.id, onReady, register, resource]);
  return <primitive object={resource.wind.object} dispose={null} />;
}

function ModelRail({ model, entries, onReady, cursor, dragOffset, motionStates, reduce, active, interacting, autoRotate }) {
  const { scene } = useLoader(GLTFLoader, `/models/kainora/${model}.glb`);
  const groups = useRef(new Map()), copies = useRef(new Map()), progress = useRef(cursor);
  const entrance = useRef(0), time = useRef(0);
  const shown = visibleGarments(entries, cursor);
  const invalidate = useThree(state => state.invalidate);
  const ready = useCallback(() => onReady(model), [model, onReady]);
  const register = useCallback((id, wind) => { if (wind) copies.current.set(id, wind); else copies.current.delete(id); invalidate(); }, [invalidate]);
  const width = useThree(state => state.viewport.width);
  const compact = useThree(state => state.size.width < 768);
  const camera = useThree(state => state.camera);
  const gap = compact ? GARMENT_VIEW.mobileRailGap : Math.max(1.30, Math.min(2.2, width * .35));
  useEffect(() => { invalidate(); }, [cursor, width, active, reduce, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    entrance.current = reduce ? 1 : MathUtils.damp(entrance.current, active ? 1 : 0, 4, dt);
    if (active && !reduce && !interacting.current) time.current += dt;
    const target = cursor + dragOffset.current;
    progress.current = reduce ? target : MathUtils.damp(progress.current, target, 8, dt);
    const unsettled = Math.abs(target - progress.current) > .001;
    if (!unsettled) progress.current = target;
    const now = performance.now();
    for (const {entry, index} of shown) {
      const group = groups.current.get(entry.id), wind = copies.current.get(entry.id);
      if (!group || !wind) continue;
      const offset = railOffset(index, progress.current, entries.length), distance = Math.abs(offset);
      group.userData.railItem = true;
      group.userData.offset = offset;
      group.userData.garmentId = entry.id;
      const motion = motionStates.current.get(entry.id);
      motion.pose.y = advanceAutoTurn(motion.autoTurn, motion.pose.y, dt, now, autoRotate && active && !reduce && !interacting.current && !unsettled && distance < .001);
      if (active && !reduce && !interacting.current) wind.uniforms.uKainoraWindTime.value += dt;
      wind.uniforms.uKainoraWindGain.value = reduce ? 0 : entrance.current;
      const idle = reduce ? 0 : Math.sin(time.current * wind.profile.speed + wind.profile.phase) * .012;
      group.position.set(offset * gap, -Math.min(distance, 2) * .04 - (1 - entrance.current) * .65 + idle, -Math.min(distance, 2) * .8);
      group.scale.setScalar((compact ? GARMENT_VIEW.mobileScale : 1) * (1 - Math.min(distance, 2) * .17) * (.88 + entrance.current * .12));
      const influence = Math.max(0, 1 - distance * 2);
      const defaultYaw = garmentYaw(entry);
      const previewYaw = motion.pose.y + Math.atan2(Math.sin(defaultYaw - motion.pose.y), Math.cos(defaultYaw - motion.pose.y));
      const facing = railCameraYaw(group.position.x, group.position.z, camera.position.z) * (1 - influence);
      group.rotation.set(motion.pose.x * influence, facing + MathUtils.lerp(previewYaw, motion.pose.y, influence), -offset * .045 + (1 - entrance.current) * .08);
    }
    if (unsettled || (active && !reduce)) invalidate();
  });
  return <group name="kainora-product-rail">{shown.map(({entry}) => <group key={entry.id} ref={element => { if(element)groups.current.set(entry.id, element);else groups.current.delete(entry.id); }}><Suspense fallback={null}><GarmentItem scene={scene} entry={entry} onReady={ready} register={register} /></Suspense></group>)}</group>;
}

function Unsupported({ onError }) {
  useEffect(() => { onError(); }, [onError]);
  return <div className="garment-feedback"><p>Browser ini belum mendukung tampilan 3D.</p><span>Foto dan detail produk tersedia pada katalog di bawah.</span></div>;
}

export default function GarmentCanvas({ model = 'oversized', active, entries, onSelect, autoRotate = true }) {
  const count = entries.length;
  const reduce = useSyncExternalStore(subscribeReduced, reducedSnapshot, () => true);
  const [loaded, setLoaded] = useState('');
  const [contextLost, setContextLost] = useState(false);
  const [failed, setFailed] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [cursor, setCursor] = useState(0);
  const dragStart = useRef(null), dragOffset = useRef(0), cursorRef = useRef(0);
  const motionStates = useRef(new Map());
  for (const entry of entries) if (!motionStates.current.has(entry.id)) motionStates.current.set(entry.id, {pose: {x: 0, y: garmentYaw(entry)}, autoTurn: createAutoTurnState(entry.initialView)});
  const selectedEntry = () => entries[wrapIndex(cursorRef.current, count)];
  const selectedMotion = () => motionStates.current.get(selectedEntry().id);
  const selectedPose = () => selectedMotion().pose;
  const postponeTurns = () => { const now = performance.now(); motionStates.current.forEach(motion => postponeAutoTurn(motion.autoTurn, now)); };
  const interacting = useRef(false);
  const sceneState = useRef(null), host = useRef(null);
  const pointer = useMemo(() => new Vector2(), []);
  const onReady = useCallback(key => setLoaded(key), []);
  const onError = useCallback(() => setFailed(true), []);
  const invalidate = () => sceneState.current?.().invalidate();
  // Apply input immediately so multiple key presses in one React render are
  // accumulated instead of collapsing into the last command.
  const run = action => {
    postponeTurns();
    const pose = selectedPose();
    const state = sceneState.current?.();
    let distance = state?.camera.position.z ?? GARMENT_VIEW.defaultDistance;
    if (action === 'front' || action === 'reset') { pose.x = 0; pose.y = action === 'front' ? 0 : garmentYaw(selectedEntry()); distance = GARMENT_VIEW.defaultDistance; }
    if (action === 'left') pose.y -= GARMENT_VIEW.rotateStep;
    if (action === 'right') pose.y += GARMENT_VIEW.rotateStep;
    if (action === 'up') pose.x -= Math.PI / 90;
    if (action === 'down') pose.x += Math.PI / 90;
    if (action === 'in') distance = Math.max(GARMENT_VIEW.minDistance, distance * .84);
    if (action === 'out') distance = Math.min(GARMENT_VIEW.maxDistance, distance * 1.18);
    pose.x = MathUtils.clamp(pose.x, GARMENT_VIEW.minPolarAngle - Math.PI / 2, GARMENT_VIEW.maxPolarAngle - Math.PI / 2);
    if (state) { state.camera.position.set(0, .06, distance); state.camera.lookAt(0, 0, 0); state.invalidate(); }
  };
  const go = direction => {
    if (count < 2) return;
    dragOffset.current = 0;
    postponeTurns();
    cursorRef.current += direction;
    const incoming = selectedPose();
    incoming.x = 0;
    incoming.y = garmentYaw(selectedEntry());
    onSelect?.(selectedEntry());
    setCursor(cursorRef.current);
    const state = sceneState.current?.();
    if (state) { state.camera.position.set(0, .06, GARMENT_VIEW.defaultDistance); state.camera.lookAt(0, 0, 0); state.invalidate(); }
  };
  const retry = () => {
    if (failed) { useLoader.clear(GLTFLoader, `/models/kainora/${model}.glb`); for (const entry of entries) for (const side of PRINT_SIDES) if (entry[side]) useLoader.clear(TextureLoader, entry[side]); }
    setLoaded(''); setFailed(false); setContextLost(false); setGeneration(value => value + 1);
  };
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const element = host.current;
    const lost = event => { event.preventDefault(); setContextLost(true); };
    const restored = () => setContextLost(false);
    element.addEventListener('webglcontextlost', lost, true);
    element.addEventListener('webglcontextrestored', restored, true);
    return () => { element.removeEventListener('webglcontextlost', lost, true); element.removeEventListener('webglcontextrestored', restored, true); };
  }, []);
  const cancel = () => { dragStart.current = null; interacting.current = false; dragOffset.current = 0; postponeTurns(); invalidate(); };
  return <div className="garment-viewer" ref={host} data-model={model} data-ready={loaded === model} data-slide={wrapIndex(cursor, count) + 1}>
    <div className="garment-canvas" tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Kaos 3D berputar otomatis. Seret kaos tengah untuk memutar; putaran dilanjutkan 3 detik setelah interaksi. Geser latar atau pilih kaos samping untuk berganti. Panah kiri kanan ganti kaos; Shift dan panah memutar. Home mengembalikan tampilan awal." onPointerDown={event => {
      if (event.button !== 0 || event.target.closest('button')) return;
      event.currentTarget.focus({ preventScroll: true });
      const state = sceneState.current?.();
      if (!state) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
      state.raycaster.setFromCamera(pointer, state.camera);
      const rail = state.scene.getObjectByName('kainora-product-rail');
      let hit = rail && state.raycaster.intersectObject(rail, true)[0]?.object;
      while (hit && !hit.userData.railItem) hit = hit.parent;
      const onShirt = !!hit && Math.abs(hit.userData.offset) < .25;
      interacting.current = true;
      postponeTurns();
      const pose = selectedPose();
      dragStart.current = { x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height, neighbor: hit ? Math.round(hit.userData.offset) : 0, onShirt, pose, angle: pose.y, tilt: pose.x };
      event.currentTarget.setPointerCapture(event.pointerId);
    }} onPointerMove={event => {
      const start = dragStart.current;
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (start.onShirt) {
        start.pose.y = start.angle + dx / start.width * Math.PI * 2.5;
        start.pose.x = Math.max(GARMENT_VIEW.minPolarAngle - Math.PI / 2, Math.min(GARMENT_VIEW.maxPolarAngle - Math.PI / 2, start.tilt + dy / start.height * .7));
      } else dragOffset.current = Math.max(-.8, Math.min(.8, -dx / start.width * 2));
      invalidate();
    }} onPointerUp={event => {
      const start = dragStart.current;
      if (!start) return;
      dragStart.current = null; interacting.current = false; dragOffset.current = 0;
      postponeTurns();
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (!start.onShirt && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
      else if (!start.onShirt && start.neighbor && Math.hypot(dx, dy) < 10) go(start.neighbor);
      else invalidate();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }} onPointerCancel={cancel} onLostPointerCapture={() => { if (dragStart.current) cancel(); }} onDoubleClick={() => run('reset')} onKeyDown={event => {
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !event.shiftKey) { event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1); return; }
      const actions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' };
      if (actions[event.key]) { event.preventDefault(); run(actions[event.key]); }
    }} onKeyUp={event => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) { postponeTurns(); invalidate(); }
    }}>
      <ViewerBoundary key={generation} onRetry={retry} onError={onError}>
        <Canvas onCreated={state => { sceneState.current = state.get; state.gl.toneMapping = NeutralToneMapping; state.camera.lookAt(0, 0, 0); }} dpr={[1, 1.5]} frameloop={active && pageVisible && !contextLost ? 'demand' : 'never'} camera={{ position: [0, .06, 3.65], fov: 38, near: .1, far: 20 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<Unsupported onError={onError} />}>
          <hemisphereLight args={['#ffffff', '#a19b8c', 2.2]} />
          <directionalLight position={[3, 4, 5]} intensity={3.4} />
          <directionalLight position={[-3, 1, -2]} intensity={2} />
          <Suspense fallback={null}><ModelRail model={model} entries={entries} onReady={onReady} cursor={cursor} dragOffset={dragOffset} motionStates={motionStates} reduce={reduce} active={active && pageVisible} interacting={interacting} autoRotate={autoRotate} /></Suspense>
        </Canvas>
      </ViewerBoundary>
      <div className="garment-touch-zone" aria-hidden="true" />
      {loaded !== model && !failed && <div className="garment-loading" role="status">MEMUAT BENTUK 3D<span>Menyiapkan sudut pandang Anda...</span></div>}
      {contextLost && <div className="garment-feedback"><p>Tampilan 3D terjeda.</p><button onClick={retry}>MUAT ULANG 3D</button></div>}
      <p className="garment-drag-hint">SERET KAOS UNTUK PUTAR 360° <span>GESER LATAR UNTUK GANTI &#8596;</span></p>
      {count > 1 && <><button className="garment-slide-arrow is-prev" onClick={() => go(-1)} aria-label="Kaos 3D sebelumnya"><ArrowLeft size={21} /></button><button className="garment-slide-arrow is-next" onClick={() => go(1)} aria-label="Kaos 3D berikutnya"><ArrowRight size={21} /></button></>}
      <p className="sr-only" role="status">Pratinjau {entries[wrapIndex(cursor, count)]?.name}, {wrapIndex(cursor, count) + 1} dari {count}.</p>
    </div>
  </div>;
}
