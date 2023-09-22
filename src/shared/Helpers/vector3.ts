import { Vector3Like } from "@shared/interfaces";

namespace Vector3 {
  export function create(x: number, y: number, z: number): Vector3Like {
    return { x, y, z };
  }
  export function toTileIdString(vector3: Vector3Like) {
    return `${vector3.x}-${vector3.y}-${vector3.z}`;
  }
}

export default Vector3;
