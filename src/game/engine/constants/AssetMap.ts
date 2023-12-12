type TAsset = {
  url: string;
};
export const AssetMap: { [key: string]: TAsset } = {
  base: { url: "/assets/tiles/hex.glb" },
  tree: { url: "/assets/tiles/tree.glb" },
  house: { url: "/assets/tiles/house.glb" },
  character: { url: "/assets/tiles/character.glb" },
};

export type TAssetId = keyof typeof AssetMap;
