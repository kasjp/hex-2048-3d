import {
  Scene3D,
  ExtendedObject3D,
  THREE,
  ExtendedGroup,
} from "@enable3d/phaser-extension";
import Helpers from "@Helpers";
export default class HexTile extends ExtendedObject3D {
  private _highlightMagnitude = 50;
  mesh = new THREE.Mesh();
  size = new THREE.Vector3();
  coordinates = new Phaser.Math.Vector3();
  color = 0x33aa22;
  constructor(
    _parent: THREE.Object3D,
    private _scene: Scene3D,
    private obj: any
  ) {
    super();
    this.add(obj.scene);
    this.mesh = obj.scene.children[0];
    // console.log(obj.scene.children[0].geometry);
    this.castShadow = this.receiveShadow = true;
    this.changeColor(this.color);
    this.mesh.geometry.computeBoundingBox();
    this.mesh.geometry.boundingBox?.getSize(this.size);
    _parent.add(this);
  }
  static create(
    _parent: ExtendedGroup,
    _scene: Scene3D,
    assetUrl = "/assets/tiles/hex.glb"
  ): Promise<HexTile> {
    return new Promise((resolve, reject) => {
      _scene.third.load
        .gltf(assetUrl)
        .then((obj) => {
          resolve(new HexTile(_parent, _scene, obj));
        })
        .catch(reject);
    });
  }
  changeColor(color: number, save = true) {
    if (save) {
      this.color = color;
    }
    this.traverse((child) => {
      child.material = this._scene.third.add.material({
        standard: {
          color: color,
          emissive: color,
          roughness: 0.4,
          metalness: 0.3,
        },
      });
    });
  }

  setCoordinates(x: number, y: number, z: number) {
    this.coordinates = new Phaser.Math.Vector3(x, y, z);
    this.position.set(
      (z % 2 == 0 ? this.size.x / 2 : 0) + x * this.size.x,
      y,
      (3 / 4) * this.size.z * z
    );
    this.name = "tile-" + Helpers.Vector3.toTileIdString(this.coordinates);
  }

  onPointerOver() {
    this._scene.tweens.addCounter({
      from: 0,
      to: this._highlightMagnitude,
      duration: 300,
      delay: 0,
      ease: "ease",
      onUpdate: (tween, target, key, current) => {
        this.changeColor(Helpers.Color.shade(this.color, current), false);
      },
    });
  }
  onPointerOut() {
    this._scene.tweens.addCounter({
      from: this._highlightMagnitude,
      to: 0,
      duration: 300,
      delay: 0,
      ease: "ease",
      onUpdate: (tween, target, key, current) => {
        this.changeColor(Helpers.Color.shade(this.color, current), false);
      },
    });
  }
}
