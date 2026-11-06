// A fixed fit for every yaw avoids zooming in/out as a garment rotates.
export function garmentFrame(bounds) {
  const x = Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x));
  const z = Math.max(Math.abs(bounds.min.z), Math.abs(bounds.max.z));
  return { radius: Math.hypot(x, z) + .06, halfHeight: Math.max(Math.abs(bounds.min.y), Math.abs(bounds.max.y)) + .06 };
}

export function garmentCameraDistance(frame, aspect, fov = 38) {
  const vertical = fov * Math.PI / 360;
  const horizontal = Math.atan(Math.tan(vertical) * aspect);
  return Math.max(frame.halfHeight / Math.tan(vertical) + frame.radius, frame.radius / Math.sin(horizontal));
}
