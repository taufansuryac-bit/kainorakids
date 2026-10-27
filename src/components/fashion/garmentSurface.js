import { Vector4 } from 'three';

// Artwork is mixed into the cloth's albedo before lighting, on the same mesh.
// Local coordinates keep the ink attached to every fold and wind displacement.
export function printUniforms(prints) {
  const uniform = side => {
    const print = prints?.[side];
    return {
      map: { value: print?.texture || null },
      rect: { value: new Vector4(...(print ? [...print.layout.position.slice(0, 2), ...print.layout.size.slice(0, 2)] : [0, 0, 1, 1])) },
      enabled: { value: print ? 1 : 0 },
    };
  };
  const front = uniform('front'), back = uniform('back');
  return { uKainoraFront: front.map, uKainoraBack: back.map,
    uKainoraFrontRect: front.rect, uKainoraBackRect: back.rect,
    uKainoraFrontEnabled: front.enabled, uKainoraBackEnabled: back.enabled };
}

export function applyPrintSurface(shader, uniforms) {
  Object.assign(shader.uniforms, uniforms);
  const varyings = 'varying vec3 vKainoraSurfacePosition;';
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\n${varyings}`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>
      vKainoraSurfacePosition = position;`);
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>
      ${varyings}
      uniform sampler2D uKainoraFront;
      uniform sampler2D uKainoraBack;
      uniform vec4 uKainoraFrontRect;
      uniform vec4 uKainoraBackRect;
      uniform float uKainoraFrontEnabled;
      uniform float uKainoraBackEnabled;
      vec4 kainoraInk(sampler2D image, vec4 rect, float enabled, float side) {
        vec3 p = vKainoraSurfacePosition;
        vec2 uv = (p.xy - rect.xy) / rect.zw + 0.5;
        if (side < 0.0) uv.x = 1.0 - uv.x;
        // The normalized torso's front/back lie on opposite sides of Z=0.
        // Do not depth-clip steep folds: that would punch holes through the ink.
        if (enabled < 0.5 || p.z * side < 0.02 ||
            any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec4(0.0);
        return texture2D(image, uv);
      }`)
    .replace('#include <color_fragment>', `#include <color_fragment>
      vec4 kainoraFrontInk = kainoraInk(uKainoraFront, uKainoraFrontRect, uKainoraFrontEnabled, 1.0);
      vec4 kainoraBackInk = kainoraInk(uKainoraBack, uKainoraBackRect, uKainoraBackEnabled, -1.0);
      diffuseColor.rgb = mix(diffuseColor.rgb, kainoraFrontInk.rgb, kainoraFrontInk.a);
      diffuseColor.rgb = mix(diffuseColor.rgb, kainoraBackInk.rgb, kainoraBackInk.a);`);
}
