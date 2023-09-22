import Helpers from "@Helpers";
import { Scene3D, THREE } from "@enable3d/phaser-extension";
import Vector3 from "@shared/Helpers/vector3";
import { Vector2Like, Vector3Like } from "@shared/interfaces";

export default class CameraController extends THREE.PerspectiveCamera {
  // private _scene!: Scene3D;
  viewOffset = new THREE.Vector3(-5, 10, -5);
  constructor(private _scene: Scene3D) {
    super();
  }
  // attachScene(scene: Scene3D) {
  //   this._scene = scene;
  // }
  translateXY(velocity: Vector2Like) {
    this.translateX(velocity.x);
    this.translateY(velocity.y);
    // this.translateZ(_velocity.z);
  }
  setOffset(x: number, y: number, z: number) {
    this.viewOffset = new THREE.Vector3(x, y, z);
    this.position.set(x, y, z);
    // const offsetPosition = this._viewOffset.add(this.position);
    // this.position.set();
  }
  smoothToTarget(target: Vector3Like) {
    const pos = this.position.clone();
    const _target = this.viewOffset.clone().add(target as THREE.Vector3);
    // console.log(pos, _target, target);
    this._scene.tweens.add({
      targets: pos,
      duration: 1000,
      delay: 0,
      x: _target.x,
      y: _target.y,
      z: _target.z,
      onUpdate: () => {
        // if()
        this.position.set(pos.x, pos.y, pos.z);
      },
      ease: Phaser.Math.Easing.Expo.Out,
    });
  }
}
