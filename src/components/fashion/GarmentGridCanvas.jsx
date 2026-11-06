import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { NeutralToneMapping, PerspectiveCamera, TextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GarmentGridModel from './GarmentGridModel';
import { advanceGridMotion } from './garmentGridMotion';
import { garmentCameraDistance } from './garmentFraming';

class SlotBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(this.props.id); }
  render() { return this.state.failed ? null : this.props.children; }
}

function GridScene({ entries, slots, motions, reduced, running, hiddenId, onReady, onError, renderHost, scrollHost }) {
  const resources = useRef(new Map());
  const invalidate = useThree(state => state.invalidate);
  const camera = useMemo(() => new PerspectiveCamera(38, 1, .1, 20), []);
  const register = useCallback((id, resource) => {
    if (resource) resources.current.set(id, resource); else resources.current.delete(id);
    invalidate();
  }, [invalidate]);
  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener('scroll', wake, { passive: true, capture: true });
    window.addEventListener('resize', wake);
    invalidate();
    return () => { window.removeEventListener('scroll', wake, true); window.removeEventListener('resize', wake); };
  }, [invalidate, reduced, running, hiddenId]);
  // Take over rendering once: each DOM stage gets a scissored viewport on one
  // shared context. Never allocate a WebGLRenderer per product card.
  useFrame(({ gl, scene, size }, delta) => {
    // A fixed canvas lags behind native compositor scrolling until its next GL
    // frame. Anchor the grid canvas in the document so even its previous frame
    // scrolls with the cards. Recenter its overscan band only when drawing again.
    const element = renderHost.current, container = scrollHost?.current;
    if (element && container) {
      const section = container.getBoundingClientRect();
      const offset = Math.max(0, Math.min(-section.top - 160, section.height - element.offsetHeight));
      const transform = `translate3d(0,${offset.toFixed(3)}px,0)`;
      if (element.style.transform !== transform) element.style.transform = transform;
    }
    const canvas = gl.domElement.getBoundingClientRect();
    const canvasInView = canvas.bottom > 0 && canvas.top < window.innerHeight;
    gl.autoClear = false;
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
    gl.setClearColor('#f5f4ef', 0);
    gl.clear(true, true);
    const now = performance.now();
    let visible = 0;
    for (const [id, resource] of resources.current) {
      if (id === hiddenId) continue;
      const slot = slots.current.get(id), motion = motions.get(id);
      if (!slot || !motion) continue;
      const rect = slot.getBoundingClientRect();
      const inView = canvasInView && rect.width > 0 && rect.bottom > canvas.top && rect.top < canvas.bottom && rect.right > canvas.left && rect.left < canvas.right;
      if (!inView) continue;
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      if (onScreen) visible++;
      advanceGridMotion(motion, delta, now, running && !reduced && onScreen);
      const { group, wind, frame } = resource;
      group.rotation.set(0, motion.yaw, reduced ? 0 : Math.sin(motion.time * .17 + motion.phase) * .018);
      group.position.y = reduced ? 0 : Math.sin(motion.time * .43 + motion.phase) * .018;
      wind.uniforms.uKainoraWindTime.value = motion.time;
      wind.uniforms.uKainoraWindGain.value = reduced ? 0 : .65;
      camera.aspect = rect.width / rect.height;
      camera.position.set(0, 0, garmentCameraDistance(frame, camera.aspect, camera.fov));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      const left = rect.left - canvas.left, bottom = canvas.bottom - rect.bottom;
      gl.setViewport(left, bottom, rect.width, rect.height);
      gl.setScissor(left, bottom, rect.width, rect.height);
      gl.setScissorTest(true);
      group.visible = true;
      gl.render(scene, camera);
      group.visible = false;
      // Lightweight evidence for interaction checks, no React updates per frame.
      slot.dataset.yaw = motion.yaw.toFixed(4);
      slot.dataset.viewportTop = (rect.top - canvas.top).toFixed(3);
    }
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
    gl.autoClear = true;
    gl.domElement.dataset.visibleGarments = String(visible);
    if (running && !reduced && visible) invalidate();
  }, 1);
  return <>
    <hemisphereLight args={['#ffffff', '#a19b8c', 2.2]} />
    <directionalLight position={[3, 4, 5]} intensity={3.4} />
    <directionalLight position={[-3, 1, -2]} intensity={2} />
    {entries.map(entry => <SlotBoundary key={entry.id} id={entry.id} onError={onError}><Suspense fallback={null}><GarmentGridModel entry={entry} register={register} onReady={onReady} /></Suspense></SlotBoundary>)}
  </>;
}

export default function GarmentGridCanvas({ entries, slots, motions, wake, reduced, onReady, onError, generation, active = true, hiddenId, scrollHost }) {
  const host = useRef(null), sceneState = useRef(null);
  const [contextLost, setContextLost] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => {
    if (generation) {
      useLoader.clear(GLTFLoader, '/models/kainora/oversized.glb');
      entries.forEach(entry => ['front', 'back'].forEach(side => { if (entry[side]) useLoader.clear(TextureLoader, entry[side]); }));
    }
    return !document.hidden;
  });
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const element = host.current;
    const lost = event => { event.preventDefault(); setContextLost(true); onError('all'); };
    element.addEventListener('webglcontextlost', lost, true);
    return () => element.removeEventListener('webglcontextlost', lost, true);
  }, [onError]);
  useEffect(() => () => { wake.current = () => {}; }, [wake]);
  return <div className={`garment-grid-renderer${scrollHost ? ' garment-grid-renderer--anchored' : ''}`} ref={host} aria-hidden="true">
    <SlotBoundary key={generation} id="all" onError={onError}>
      <Canvas resize={{ scroll: false }} dpr={[1, 1.5]} frameloop={pageVisible && !contextLost ? 'demand' : 'never'} events={() => ({ enabled: false, priority: 1 })} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback="Browser ini belum mendukung tampilan 3D." onCreated={state => { sceneState.current = state; wake.current = state.invalidate; state.gl.toneMapping = NeutralToneMapping; }}>
        <GridScene entries={entries} slots={slots} motions={motions} reduced={reduced} running={active && pageVisible && !contextLost} hiddenId={hiddenId} onReady={onReady} onError={onError} renderHost={host} scrollHost={scrollHost} />
      </Canvas>
    </SlotBoundary>
  </div>;
}
