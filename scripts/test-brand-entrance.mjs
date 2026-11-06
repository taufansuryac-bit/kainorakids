import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPlayBrandIntro, brandLogoFlight } from '../src/components/fashion/brandEntrance.js';

test('intro only plays at the first homepage top, not on catalogue/admin/hash/repeat/reduced visits', () => {
  const options = { url: new URL('https://kainorakids.com/'), seen: false, reduced: false, scrollY: 0 };
  assert.equal(shouldPlayBrandIntro(options), true);
  assert.equal(shouldPlayBrandIntro({ ...options, url: new URL('https://kainorakids.com/?utm_source=test') }), true);
  assert.equal(shouldPlayBrandIntro({ ...options, url: new URL('https://kainorakids.com/?view=home') }), true);
  for (const url of ['/products/', '/blog/', '/?view=admin', '/?view=products', '/#clothing-rail']) assert.equal(shouldPlayBrandIntro({ ...options, url: new URL(url, options.url) }), false);
  for (const override of [{ seen: true }, { reduced: true }, { scrollY: 200 }]) assert.equal(shouldPlayBrandIntro({ ...options, ...override }), false);
});

test('logo flight lands on real desktop/mobile crop centres with uniform scale', () => {
  for (const width of [320, 390, 768, 1440]) {
    const size = Math.min(560, width * .82);
    const from = { left: (width - size) / 2, top: 350, width: size, height: size * 76 / 400 };
    const to = { left: 22, top: 20, width: width < 768 ? 134 : 145, height: (width < 768 ? 134 : 145) * 76 / 400 };
    const flight = brandLogoFlight(from, to);
    assert.ok(Math.abs((from.left + from.width / 2 + flight.x) - (to.left + to.width / 2)) < 1e-9);
    assert.ok(Math.abs((from.top + from.height / 2 + flight.y) - (to.top + to.height / 2)) < 1e-9);
    assert.ok(Math.abs(from.width * flight.scale - to.width) < 1e-9);
    assert.ok(Math.abs(from.height * flight.scale - to.height) < 1e-9);
  }
  assert.equal(brandLogoFlight({ width: 0 }, { width: 145 }), null);
});
