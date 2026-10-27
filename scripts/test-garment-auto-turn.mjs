import assert from 'node:assert/strict';
import { createAutoTurnState, postponeAutoTurn, advanceAutoTurn } from '../src/components/fashion/garmentAutoTurn.js';
import { GARMENT_VIEW } from '../src/constants/garmentViewConfig.js';

const state = createAutoTurnState();
let yaw = GARMENT_VIEW.initialYaw;
assert.ok(Math.abs(yaw - Math.PI) < .2, 'Initial view must show the back');
yaw = advanceAutoTurn(state, yaw, .016, 100, true);
assert.equal(state.phase, 'hold-back');
assert.equal(advanceAutoTurn(state, yaw, .016, 2599, true), yaw);
assert.ok(advanceAutoTurn(state, yaw, .016, 2600, true) > yaw);

// Long drags and repeated touches restart the full delay from their release.
for (const angle of [-9.7, -.2, 1.4, 4.9, 30.1]) {
  const resumed = createAutoTurnState();
  postponeAutoTurn(resumed, 1000);
  assert.equal(advanceAutoTurn(resumed, angle, .016, 9000, false), angle);
  postponeAutoTurn(resumed, 9000);
  assert.equal(advanceAutoTurn(resumed, angle, .016, 11999, true), angle);
  const next = advanceAutoTurn(resumed, angle, .016, 12000, true);
  assert.ok(next > angle && next - angle < .001, 'Resume must accelerate from the current angle');
  postponeAutoTurn(resumed, 12500);
  assert.equal(advanceAutoTurn(resumed, next, .016, 15499, true), next);
}

// Simulate a complete lap; both faces must stop and the back must hold longer.
const lap = createAutoTurnState();
const holds = [];
let previous = '', current = GARMENT_VIEW.initialYaw;
for (let ms = 0; ms <= 35000; ms += 1000 / 60) {
  const next = advanceAutoTurn(lap, current, 1 / 60, ms, true);
  assert.ok(next >= current && next - current <= Math.PI * 2 / GARMENT_VIEW.autoTurnSeconds / 60 + .0001);
  if (lap.phase !== previous && lap.phase.startsWith('hold-')) holds.push({ side: lap.holdSide, duration: lap.holdUntil - ms, yaw: next });
  previous = lap.phase;
  current = next;
}
assert.deepEqual(holds.slice(0, 3).map(h => h.side), ['back', 'front', 'back']);
assert.equal(holds[1].duration, GARMENT_VIEW.autoFrontHoldMs);
assert.equal(holds[2].duration, GARMENT_VIEW.autoBackHoldMs);
assert.ok(holds[2].duration > holds[1].duration);
assert.ok(Math.abs(holds[1].yaw - Math.PI * 2) < .0001);
assert.ok(Math.abs(holds[2].yaw - (Math.PI * 2 + GARMENT_VIEW.initialYaw)) < .0001);
assert.equal(advanceAutoTurn(lap, current, .05, 80000, false), current, 'Offscreen/reduced-motion must not turn');
console.log('PASS: back-first view, full release delay, repeated input, smooth arbitrary-angle resume, front/back holds, disabled motion.');
