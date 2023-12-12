import Helpers from "@Helpers";
import { Scene3D, THREE } from "@enable3d/phaser-extension";
export default class CameraController extends THREE.OrthographicCamera {
  // private _scene!: Scene3D;
  viewOffset = new THREE.Vector3(-5, 10, -5);
  private _targetPosition: THREE.Vector3 | undefined;

  private _lockedRotation: THREE.Euler | null = null;
  orbitControls!: Awaited<
    ReturnType<typeof Scene3D.prototype.third.warpSpeed>
  >["orbitControls"];

  set targetPosition(pos: THREE.Vector3 | undefined) {
    if (pos) {
      this._targetPosition = this.viewOffset.clone().add(pos as THREE.Vector3);
    } else {
      this._targetPosition = pos;
    }
  }
  set lockRotation(rotation: THREE.Euler | null) {
    this._lockedRotation = rotation;
  }
  constructor(
    private _scene: Scene3D,
    left?: number,
    right?: number,
    top?: number,
    bottom?: number,
    near?: number,
    far?: number
  ) {
    super(left, right, top, bottom, near, far);
  }
  calculateViewport(minSize = 0) {
    const container = document.querySelector("canvas") as HTMLCanvasElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const viewSize = h;
    const aspectRatio = w / h;
    const sizeMultiplier = minSize * 3.5;
    const dim = Math.max((h / w) * sizeMultiplier, sizeMultiplier);
    const _viewport = {
      viewSize: viewSize,
      aspectRatio: aspectRatio,
      left: (-aspectRatio * dim) / 2,
      right: (aspectRatio * dim) / 2,
      top: dim / 2,
      bottom: -dim / 2,
      near: -100,
      far: 100,
    };
    this.left = _viewport.left;
    this.right = _viewport.right;
    this.near = _viewport.near;
    this.far = _viewport.far;
    //dirty
    try {
      this.top = _viewport.top;
      this.bottom = _viewport.bottom;
    } catch (_) {
      /* empty */
    }
  }
  translateXY(velocity: THREE.Vec2) {
    this.translateX(velocity.x);
    this.translateY(velocity.y);
  }
  setOffset(x: number, y: number, z: number) {
    this.viewOffset = new THREE.Vector3(x, y, z);
    this.position.set(x, y, z);
  }
  update() {
    if (this._targetPosition) {
      if (
        this.position.distanceTo(this._targetPosition as THREE.Vector3) > 0.01
      ) {
        this.position.lerp(this._targetPosition as THREE.Vector3, 0.1);
      } else {
        this.position.lerp(this._targetPosition as THREE.Vector3, 1);
        this._targetPosition = undefined;
      }
    }
    if (this.orbitControls) {
      this.orbitControls.update();
    }
    if (this._lockedRotation !== null) {
      this.setRotationFromEuler(this._lockedRotation);
    }
    this.updateProjectionMatrix();
  }
}
