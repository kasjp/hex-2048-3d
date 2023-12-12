import CameraController from "@engine/controllers/CameraController";
import AssetManager from "@engine/managers/AssetManager";
import { THREE, Scene3D } from "@enable3d/phaser-extension";
import Helpers from "@Helpers";

export default abstract class PrimitiveScene extends Scene3D {
  raycaster = new THREE.Raycaster();
  pointerLocation = new THREE.Vector2(0, 0);
  camera: CameraController;

  constructor(public readonly SceneName: string) {
    super({
      key: SceneName,
    });

    this.camera = new CameraController(this);
    this.camera.calculateViewport();
  }
  async init() {
    // const renderer = new THREE.WebGLRenderer();
    // renderer.shadowMap.enabled = true;
    // renderer.setSize(w, h);
    this.accessThirdDimension({
      camera: this.camera,
    });
    AssetManager.loaders = this.third.load;
    this.input.on("pointermove", this.onPointerMove.bind(this));
    this.input.on("pointerdown", this.onPointerDown.bind(this));
    this.input.on("pointerup", this.onPointerUp.bind(this));
  }
  async create() {
    const { orbitControls } = await this.third.warpSpeed(
      "-grid",
      "-light",
      "-ground"
    );
    this.camera.setOffset(0, 10, 0);
    this.camera.lookAt(0, 1, 0);
    if (orbitControls) {
      this.camera.orbitControls = orbitControls;
      orbitControls.enableRotate = false;
      orbitControls.autoRotate = false;
      orbitControls.enableZoom = true;
      orbitControls.enablePan = true;
      orbitControls.panSpeed = 2;
      orbitControls.enableDamping = true;
      orbitControls.screenSpacePanning = false;
      orbitControls.touches.ONE = THREE.TOUCH.DOLLY_PAN;
      orbitControls.mouseButtons.LEFT = THREE.MOUSE.PAN;
      orbitControls.mouseButtons.RIGHT = 0;

      orbitControls.saveState();
    }
    // this.camera.zoom = 25;
    this.raycaster = new THREE.Raycaster();

    this.addDefaultLights();
  }
  abstract onPointerDown(event: Phaser.Input.Pointer): void;
  abstract onPointerUp(event: Phaser.Input.Pointer): void;
  abstract onPointerMove(event: Phaser.Input.Pointer): void;
  addDefaultLights() {
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(1, 2, 3);
    this.third.add.existing(light);
  }

  normalizePointerXY(pointer: Phaser.Input.Pointer): THREE.Vector2 {
    return Helpers.Vector.normalizeScreenXY(pointer.worldX, pointer.worldY);
  }

  raycastFromScreenXY(x: number, y: number, target: THREE.Object3D) {
    this.raycaster.setFromCamera(
      Helpers.Vector.normalizeScreenXY(x, y),
      this.third.camera
    );
    return this.raycaster.intersectObject(target);
  }
  update(time: number, delta: number) {
    this.camera.update();
  }
}
