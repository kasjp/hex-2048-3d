import {
  ExtendedGroup,
  ExtendedObject3D,
  Scene3D,
  THREE,
} from "@enable3d/phaser-extension";

import { TAssetId, AssetMap } from "@engine/constants/AssetMap";
import AssetManager from "@engine/managers/AssetManager";
import HexTile from "@engine/objects/HexTile";

export default class PrimitiveObject extends ExtendedObject3D {
  mesh = new THREE.Mesh();
  size = new THREE.Vector3();
  constructor(
    protected _scene: Scene3D,
    protected obj: any,
    protected _parent?: THREE.Object3D
  ) {
    super();
    const objScene = obj.scene ? obj.scene : obj;
    this.add(objScene);
    this.mesh = (objScene.children[0] as THREE.Mesh).clone();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.geometry.boundingBox?.getSize(this.size);
    this.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
        child.material = (child.material as any)?.clone();
      }
    });
    if (_parent) {
      _parent.add(this);
    } else {
      _scene.third.add.existing(this);
    }
  }
  static async loadAndCreate(
    parent: ExtendedGroup,
    scene: Scene3D,
    assetId: TAssetId = "base"
  ): Promise<HexTile> {
    return new HexTile(
      scene,
      (await AssetManager.getAssetById(assetId)).scene.clone(),
      parent
    );
  }
}
