import { CatmullRomCurve3, Group, Mesh, MeshStandardMaterial, TubeGeometry, Vector3 } from 'three';

// A physical wire hanger inside the normalized garment, sharing its camera,
// depth buffer, lighting and rotation. The cloth naturally occludes the arms.
export function createGarmentHanger() {
  const object = new Group();
  object.name = 'kainora-wire-hanger';
  const material = new MeshStandardMaterial({ color: '#a6a8a1', metalness: .72, roughness: .28 });
  const geometries = [];
  const tube = (points, radius, segments = 48, tension = .15) => {
    const curve = new CatmullRomCurve3(points.map(point => new Vector3(...point)), false, 'catmullrom', tension);
    const geometry = new TubeGeometry(curve, segments, radius, 8, false);
    geometries.push(geometry);
    object.add(new Mesh(geometry, material));
  };
  tube([[0,.87,0],[0,1.07,0],[-.015,1.12,0],[.01,1.16,0],[.055,1.17,0],[.09,1.145,0],[.085,1.11,0]], .009, 48, .25);
  tube([[0,.88,0],[-.30,.77,0],[-.59,.62,0],[-.62,.57,0],[-.54,.55,0],[0,.55,0],[.54,.55,0],[.62,.57,0],[.59,.62,0],[.30,.77,0],[0,.88,0]], .011, 100);
  return { object, dispose() { geometries.forEach(geometry => geometry.dispose()); material.dispose(); } };
}
