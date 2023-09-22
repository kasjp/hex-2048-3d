import { Vector2Like, Vector3Like } from "@shared/interfaces";

namespace Vector2 {
  export function toVector3(
    vector: Vector2Like | Vector3Like,
    y = 0
  ): Vector3Like {
    return "z" in vector ? vector : { x: vector.x, y, z: vector.y };
  }
}

export default Vector2;
