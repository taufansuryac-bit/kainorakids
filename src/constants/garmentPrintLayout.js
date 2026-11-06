// Fixed print areas on the normalized oversized mesh (maximum dimension = 2).
// Artwork is fitted without stretching; the large front preset can be scaled
// around its existing centre by each garment's saved percentage.
export const GARMENT_PRINT_LAYOUT = Object.freeze({
  front: Object.freeze({
    side: 1,
    position: Object.freeze([.30, .43, .28]),
    size: Object.freeze([.26, .198, .55]),
  }),
  // Portrait/circular chest badges from the black-shirt sample photographs.
  frontBadge: Object.freeze({
    side: 1,
    position: Object.freeze([.30, .43, .28]),
    size: Object.freeze([.26, .32, .55]),
  }),
  back: Object.freeze({
    side: -1,
    position: Object.freeze([0, 0, -.43]),
    size: Object.freeze([1.06, 1.30, .55]),
  }),
  frontLarge: Object.freeze({
    side: 1,
    position: Object.freeze([0, .02, .43]),
    size: Object.freeze([1.02, 1.24, .55]),
  }),
});

export function garmentPrintLayout(entry, side) {
  const preset = side === 'front' ? entry.frontLayout === 'large' ? 'frontLarge' : entry.frontLayout === 'badge' ? 'frontBadge' : 'front' : side;
  const layout = GARMENT_PRINT_LAYOUT[preset];
  if (preset !== 'frontLarge') return layout;
  const percent = Number.isFinite(entry.frontPrintScale) ? Math.min(100, Math.max(20, entry.frontPrintScale)) : 100;
  if (percent === 100) return layout;
  return { ...layout, size: [layout.size[0] * percent / 100, layout.size[1] * percent / 100, layout.size[2]] };
}

export const GARMENT_ARTWORK = Object.freeze({
  front: '/models/kainora/kainora-park-front.webp',
  back: '/models/kainora/kainora-park-back.webp',
});
