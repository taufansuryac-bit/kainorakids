// Match the square source to the square stage; centre its cursor point in the lens.
export const GALLERY_ZOOM = 1.6;
export function galleryZoom(x, y, width, height, diameter = 180, zoom = GALLERY_ZOOM) {
  const clamp = (value, max) => Math.min(Math.max(value, 0), max);
  const px = clamp(x, width), py = clamp(y, height);
  return { x: px - diameter / 2, y: py - diameter / 2,
    backgroundSize: `${width * zoom}px ${height * zoom}px`,
    backgroundPosition: `${diameter / 2 - px * zoom}px ${diameter / 2 - py * zoom}px` };
}
