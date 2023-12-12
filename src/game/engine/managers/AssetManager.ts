import { Scene3D } from "@enable3d/phaser-extension";
import { AssetMap, TAssetId } from "@engine/constants/AssetMap";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class AssetManager {
  private static _assets: Map<TAssetId, GLTF> = new Map();
  private static _loadAsset: (url: string) => Promise<GLTF>;
  private static _loaders: typeof Scene3D.prototype.third.load;

  static async preload() {
    for (const assetId in AssetMap) {
      this._assets.set(
        assetId as TAssetId,
        await this._loadAsset(AssetMap[assetId].url)
      );
    }
  }
  static get loader() {
    return this._loadAsset;
  }
  static set loader(value: (url: string) => Promise<GLTF>) {
    this._loadAsset = value;
  }
  static set loaders(value: typeof this._loaders) {
    this._loaders = value;
  }
  static async getAssetById(assetId: TAssetId): Promise<GLTF> {
    if (this._assets.has(assetId)) {
      return this._assets.get(assetId) as GLTF;
    }
    const asset = await this._loaders.gltf(AssetMap[assetId].url);
    this._assets.set(assetId, asset);
    return asset;
  }
}
