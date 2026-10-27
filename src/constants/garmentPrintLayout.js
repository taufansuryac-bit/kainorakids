// Fixed print areas on the normalized oversized mesh (maximum dimension = 2).
// Change artwork URLs to swap a motif. Keep these positions/sizes unchanged to
// reuse the approved placement; artwork is fitted without stretching.
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

export const GARMENT_ARTWORK = Object.freeze({
  front: '/models/kainora/kainora-park-front.webp',
  back: '/models/kainora/kainora-park-back.webp',
});
