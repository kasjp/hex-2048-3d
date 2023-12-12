import { THREE } from "@enable3d/phaser-extension";

namespace Vector {
  export function toVector3(
    vector: THREE.Vector2 | THREE.Vector3,
    y = 0
  ): THREE.Vector3 {
    return "z" in vector ? vector : new THREE.Vector3(vector.x, y, vector.y);
  }
  export function normalizeScreenXY(x: number, y: number): THREE.Vector2 {
    return new THREE.Vector2(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );
  }
  export function toTileIdString(vector: { x: number; y: number }) {
    return `${vector.x}::${vector.y}`;
  }
}

export default Vector;
