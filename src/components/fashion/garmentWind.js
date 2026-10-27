import { Vector4 } from 'three';
import { applyPrintSurface, printUniforms } from './garmentSurface.js';

// Independent, reproducible pseudo-random profiles. Never randomize per frame:
// that creates jitter instead of continuous cloth movement.
export function createWindProfile(index) {
  let seed = (0x6b61696e + Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  const random = () => {
    seed += 0x6d2b79f5;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const direction = random() > .5 ? 1 : -1;
  return Object.freeze({ speed: .68 + random() * .5, phase: random() * Math.PI * 2, amplitude: .033 + random() * .014, direction });
}

// The normalized garment carries both ink and cloth in the same material.
// Displace that surface once; its lighting normal follows the same Jacobian.
const WIND_GLSL = /* glsl */ `
uniform float uKainoraWindTime;
uniform float uKainoraWindGain;
uniform vec4 uKainoraWindProfile;

vec2 kainoraSmooth(float low, float high, float value) {
  float t = clamp((value - low) / (high - low), 0.0, 1.0);
  return vec2(t * t * (3.0 - 2.0 * t), 6.0 * t * (1.0 - t) / (high - low));
}

void kainoraCloth(vec3 p, out vec3 shift, out vec3 slope) {
  float t = uKainoraWindTime * uKainoraWindProfile.x;
  float phase = uKainoraWindProfile.y;
  float amplitude = uKainoraWindProfile.z * uKainoraWindGain;
  float direction = uKainoraWindProfile.w;
  vec2 anchor = kainoraSmooth(0.35, 0.78, p.y);
  vec2 hem = kainoraSmooth(-0.82, 0.20, p.y);
  vec2 sleeveX = kainoraSmooth(0.48, 0.92, abs(p.x));
  vec2 sleeveY = kainoraSmooth(0.58, 0.85, p.y);
  float free = 1.0 - anchor.x;
  float lower = 1.0 - hem.x;
  float sleeve = sleeveX.x * (1.0 - sleeveY.x);
  float weight = 0.18 + 1.15 * lower + 0.72 * sleeve;
  float envelope = free * weight;
  float envelopeX = free * 0.72 * sleeveX.y * sign(p.x) * (1.0 - sleeveY.x);
  float envelopeY = -anchor.y * weight + free * (-1.15 * hem.y - 0.72 * sleeveX.x * sleeveY.y);
  float gust = 0.74 + 0.24 * sin(t * 0.37 + phase * 1.3) + 0.16 * sin(t * 0.73 + phase * 0.6);
  float a = p.x * 3.7 - p.y * 1.8 - t * 0.9 * direction + phase;
  float b = p.x * 8.4 + p.y * 2.5 + t * 1.35 + phase * 0.7;
  float wave = 0.70 * sin(a) + 0.25 * sin(b);
  float waveX = 2.59 * cos(a) + 2.10 * cos(b);
  float waveY = -1.26 * cos(a) + 0.625 * cos(b);
  float flutter = sin(t * 0.66 + phase * 1.1);
  float lateral = amplitude * direction * flutter;
  float lateralWeight = 0.20 + 0.75 * lower;
  shift = vec3(lateral * lateralWeight * free, 0.0, amplitude * gust * envelope * wave);
  slope = vec3(lateral * (-0.75 * hem.y * free - lateralWeight * anchor.y), amplitude * gust * (envelopeX * wave + envelope * waveX), amplitude * gust * (envelopeY * wave + envelope * waveY));
}
`;

export function createWindGarment(source, index, color = 'white', prints) {
  const object = source.clone(true);
  const profile = createWindProfile(index);
  const uniforms = {
    uKainoraWindTime: { value: 0 },
    uKainoraWindGain: { value: 0 },
    uKainoraWindProfile: { value: new Vector4(profile.speed, profile.phase, profile.amplitude, profile.direction) },
  };
  const materials = new Map();
  const ink = prints ? printUniforms(prints) : null;
  object.traverse(mesh => {
    if (!mesh.isMesh) return;
    const patch = original => {
      if (materials.has(original)) return materials.get(original);
      const material = original.clone();
      if (color === 'black' && !mesh.userData.kainoraPrint) material.color.set('#121212');
      material.name = `kainora-wind-${index}-${original.name || 'surface'}`;
      material.userData.kainoraWind = { profile, uniforms };
      if (ink) material.userData.kainoraPrints = ink;
      material.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', `#include <common>\n${WIND_GLSL}`)
          .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
            vec3 kainoraShift;
            vec3 kainoraSlope;
            kainoraCloth(position, kainoraShift, kainoraSlope);
            // Inverse transpose of the cloth deformation's Jacobian.
            objectNormal = vec3(objectNormal.x - kainoraSlope.y * objectNormal.z,
              objectNormal.y - kainoraSlope.x * objectNormal.x + (kainoraSlope.x * kainoraSlope.y - kainoraSlope.z) * objectNormal.z,
              objectNormal.z);
          `)
          .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += kainoraShift;');
        if (ink) applyPrintSurface(shader, ink);
      };
      // Parameter values are uniforms; all shirts reuse compiled shader programs.
      material.customProgramCacheKey = () => ink ? 'kainora-cloth-ink-v3' : 'kainora-cloth-wind-v2';
      materials.set(original, material);
      return material;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(patch) : patch(mesh.material);
  });
  return { object, profile, uniforms, dispose: () => materials.forEach(material => material.dispose()) };
}
