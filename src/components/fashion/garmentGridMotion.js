import { garmentSeed, garmentYaw } from './garmentRail.js';

// Randomize the profile once per slot, never per frame (which would jitter).
export function createGridMotion(id, initialView, now = 0) {
  let seed = garmentSeed(id);
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return {
    yaw: garmentYaw({ initialView }), direction: random() < .5 ? -1 : 1,
    speed: .16 + random() * .15, phase: random() * Math.PI * 2,
    resumeAt: now + 500 + random() * 4500, time: random() * 30,
    velocity: 0, interacting: false,
  };
}

export function pauseGridMotion(state) {
  state.interacting = true;
  state.velocity = 0;
}

export function resumeGridMotion(state, now) {
  state.interacting = false;
  state.velocity = 0;
  state.resumeAt = now + 3000;
}

export function advanceGridMotion(state, delta, now, enabled) {
  if (!enabled || state.interacting || now < state.resumeAt) {
    state.velocity = 0;
    return;
  }
  const dt = Math.max(0, Math.min(delta, .05));
  state.time += dt;
  const target = state.direction * state.speed * (1 + .18 * Math.sin(state.time * .31 + state.phase));
  state.velocity += (target - state.velocity) * (1 - Math.exp(-dt * 2.5));
  state.yaw += state.velocity * dt;
}
