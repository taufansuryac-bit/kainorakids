import { GARMENT_VIEW } from '../../constants/garmentViewConfig.js';

const TAU = Math.PI * 2;

export function createAutoTurnState(side = 'back') {
  return { initialHold: true, resumeAt: 0, holdUntil: 0, holdSide: side, target: null, targetSide: null, velocity: 0, phase: `hold-${side}` };
}

// Call on release/cancel as well as press: a long drag must never consume the
// three-second reading pause. No timer can later reset the user's chosen angle.
export function postponeAutoTurn(state, now) {
  state.initialHold = false;
  state.resumeAt = now + GARMENT_VIEW.autoResumeDelayMs;
  state.holdUntil = 0;
  state.target = null;
  state.velocity = 0;
  state.phase = 'waiting';
}

export function advanceAutoTurn(state, yaw, delta, now, enabled, speedScale = 1) {
  if (!enabled) { state.velocity = 0; state.phase = 'paused'; return yaw; }
  if (now < state.resumeAt) { state.phase = 'waiting'; return yaw; }
  if (state.initialHold) {
    state.initialHold = false;
    state.holdUntil = now + (state.holdSide === 'back' ? GARMENT_VIEW.autoBackHoldMs : GARMENT_VIEW.autoFrontHoldMs);
  }
  if (now < state.holdUntil) { state.phase = `hold-${state.holdSide}`; return yaw; }
  if (state.target === null) {
    const cycle = Math.floor(yaw / TAU);
    const back = cycle * TAU + GARMENT_VIEW.initialYaw;
    state.targetSide = back > yaw + .0001 ? 'back' : 'front';
    state.target = state.targetSide === 'back' ? back : (cycle + 1) * TAU;
  }
  const remaining = Math.max(0, state.target - yaw);
  const dt = Math.min(Math.max(delta, 0), .05);
  const desired = Math.min(TAU / GARMENT_VIEW.autoTurnSeconds * speedScale, Math.sqrt(2 * GARMENT_VIEW.autoAcceleration * remaining));
  const change = GARMENT_VIEW.autoAcceleration * dt;
  state.velocity += Math.max(-change, Math.min(change, desired - state.velocity));
  const next = yaw + Math.min(remaining, state.velocity * dt);
  if (state.target - next < .0001) {
    const stopped = state.target;
    state.holdSide = state.targetSide;
    state.holdUntil = now + (state.holdSide === 'back' ? GARMENT_VIEW.autoBackHoldMs : GARMENT_VIEW.autoFrontHoldMs);
    state.target = null;
    state.velocity = 0;
    state.phase = `hold-${state.holdSide}`;
    return stopped;
  }
  state.phase = 'turning';
  return next;
}
