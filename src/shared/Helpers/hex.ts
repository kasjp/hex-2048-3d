namespace Hex {
  export const DIRECTION_STRING = {
    NW: "NW",
    NE: "NE",
    W: "W",
    E: "E",
    SW: "SW",
    SE: "SE",
  } as const;
  export type DIRECTION_STRING = keyof typeof DIRECTION_STRING;
  export const ENABLED_KEYS = ["Q", "W", "A", "S", "Z", "X"] as const;
  export const DIRECTION_KEYS = {
    Q: "NW",
    W: "NE",
    A: "W",
    S: "E",
    Z: "SW",
    X: "SE",
  } as const;
}

export default Hex;
