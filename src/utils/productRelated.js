// "Cerita lainnya" picks motifs that share a theme, then the nearest neighbour in
// catalogue order. Neighbour order spreads internal links so every product page is
// linked from several others (a fixed top-4 left 36 products with one inbound link).
// Shared by the React view and the static build so hydrated HTML stays identical.
const THEMES = {
  buah: ['buah', 'ceri', 'cherry', 'lemon', 'alpukat', 'avocado', 'stroberi', 'strawberry', 'raspberry', 'naga', 'jeruk', 'semangka', 'tomat', 'fruit'],
  makan: ['sarapan', 'breakfast', 'cereal', 'pancake', 'pagi', 'dinner', 'makan', 'lunch', 'mangkok', 'burger', 'kudapan', 'es krim', 'tart', 'hotdog'],
  pasar: ['pasar', 'market', 'marché', 'piknik', 'picnic', 'kebun', 'panen'],
  main: ['bermain', 'play', 'arcade', 'balap', 'speed', 'stadion', 'baseball', 'club'],
  cerah: ['matahari', 'sunshine', 'soleil', 'summer', 'balloon', 'pita', 'manis', 'candy'],
};

const themesOf = product => {
  const text = `${product.name} ${product.desc || ''}`.toLocaleLowerCase('id-ID');
  return new Set(Object.entries(THEMES).filter(([, words]) => words.some(word => text.includes(word))).map(([theme]) => theme));
};

export function relatedProducts(product, products, count = 4) {
  const index = products.findIndex(p => String(p.id) === String(product.id));
  const own = themesOf(product);
  const byDistance = products
    .map((candidate, position) => {
      const raw = Math.abs(position - index);
      // Successors win ties so neighbouring pages link forward as well as back.
      return { candidate, themed: [...themesOf(candidate)].some(theme => own.has(theme)), distance: Math.min(raw, products.length - raw), after: position > index ? 0 : 1 };
    })
    .filter(entry => String(entry.candidate.id) !== String(product.id))
    .sort((a, b) => a.distance - b.distance || a.after - b.after);
  // Up to count-1 themed matches, then the nearest motifs regardless of theme, so
  // motifs without a recognised theme are still linked from their neighbours.
  const themed = byDistance.filter(entry => entry.themed).slice(0, count - 1);
  const nearest = byDistance.filter(entry => !themed.includes(entry)).slice(0, count - themed.length);
  return [...themed, ...nearest].map(entry => entry.candidate);
}
