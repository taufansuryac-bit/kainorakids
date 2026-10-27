// Object tilt stays between -10° and +8°. Horizontal rotation is unrestricted.
// Camera stays at eye level so dragging cannot look deep underneath the shirt.
export const GARMENT_VIEW = Object.freeze({
  minPolarAngle: 80 * Math.PI / 180,
  maxPolarAngle: 98 * Math.PI / 180,
  minDistance: 2.25,
  maxDistance: 5.2,
  defaultDistance: 3.65,
  initialYaw: Math.PI - Math.PI / 18,
  autoTurnSeconds: 20,
  autoBackHoldMs: 2500,
  autoFrontHoldMs: 1000,
  autoResumeDelayMs: 3000,
  autoAcceleration: .5,
  // Mobile leaves more room for the previous/next shirts, without changing prints.
  mobileScale: .84,
  mobileRailGap: 1.2,
  defaultPolarAngle: Math.PI / 2 - .0164,
  rotateStep: Math.PI / 6,
});
