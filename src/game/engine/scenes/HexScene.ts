import { Scene3D, THREE } from "@enable3d/phaser-extension";
import HexGrid from "@engine/components/HexGrid";
import HexTile from "@engine/objects/HexTile";
import CameraController from "@engine/controllers/CameraController";
import GameState from "@game/store";
import Helpers from "@Helpers";

export default abstract class Scene extends Scene3D {
  tilemap!: HexGrid;
  text!: Phaser.GameObjects.Text;
  raycaster = new THREE.Raycaster();
  pointerLocation = new THREE.Vector2(0, 0);
  camera!: CameraController;
  constructor(sceneName: string) {
    super(sceneName);
  }

  async init() {
    // const frustumSize = 15;
    // const aspect = this.cameras.main.width / this.cameras.main.height;
    // this.accessThirdDimension({
    //   camera: new THREE.OrthographicCamera(
    //     (frustumSize * aspect) / -2,
    //     (frustumSize * aspect) / 2,
    //     frustumSize / 2,
    //     frustumSize / -2
    //   ),
    // });

    this.accessThirdDimension({
      camera: new CameraController(this),
    });
    this.camera = this.third.camera as CameraController;
    // const test = new MapContr();
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    this.third.warpSpeed("-grid", "-light", "-ground", "-orbitControls");
    this.camera.setOffset(-10, 15, -10);
    this.camera.lookAt(0, 1, 0);
    // this.input.ca
    console.log(this);
    // this.camera.enableRotate=false;
    this.addDefaultLights();

    this.text = this.add.text(32, 32, "x", { color: "#000" });
    this.tilemap = new HexGrid(this);
    this.tilemap.generateTilemap();
    this.raycaster = new THREE.Raycaster();

    this.input.on("pointermove", this.onPointerMove.bind(this));
    // this.input.on("pointerdown", this.onPointerDown.bind(this));
    this.input.on("pointerup", this.onPointerUp.bind(this));
  }
  addDefaultLights() {
    this.third.add.existing(new THREE.AmbientLight(0x0c0c0c));
    const spotLight = new THREE.SpotLight(0xffeeccaa);
    spotLight.position.set(-60, 100, -30);
    this.third.add.existing(spotLight);
  }
  // onPointerDown(event: Phaser.Input.Pointer) {
  //   // this.isPointerDown = true;
  //   // this.previousPointerLocation = new THREE.Vector2(
  //   //   event.worldX,
  //   //   event.worldY
  //   // );
  //   // console.log(event);
  //   const tile = GameState.hoverTile;
  //   if (tile) {
  //     // this.camera.smoothToTarget(tile.position);
  //   }
  // }
  onPointerUp(event: Phaser.Input.Pointer) {
    if (event.downX === event.upX && event.downY === event.upY) {
      const tile = GameState.hoverTile;
      if (tile) {
        this.camera.smoothToTarget(tile.position);
      }
    }
  }
  //   this.isPointerDown = false;
  //   // this.text.setText(`${this.previousPointerLocation.x}::${event.worldX}`);
  //   // if (
  //   //   Math.abs(this.previousPointerLocation.x - event.worldX) < 1 ||
  //   //   Math.abs(this.previousPointerLocation.y - event.worldY) < 1
  //   // ) {
  //   //   const tile = this.getTileAtPointer();
  //   //   if (tile) {
  //   //     this.smoothCameraToTarget(
  //   //       new Phaser.Math.Vector2(tile.position.x - 5, tile.position.z - 5)
  //   //     );
  //   //   }
  //   // }
  // }
  onPointerMove(event: Phaser.Input.Pointer) {
    if (event.isDown) {
      this.pointerDragCamera(event);
    }
    this.pointerLocation.x = event.worldX;
    this.pointerLocation.y = event.worldY;
    GameState.hoverTile = this.getTileAtPointer();
  }
  pointerDragCamera(pointer: Phaser.Input.Pointer) {
    const dragDistance = new Phaser.Math.Vector2(
      pointer.position.x - pointer.prevPosition.x,
      pointer.position.y - pointer.prevPosition.y
    );
    dragDistance.x *= -0.03;
    dragDistance.y *= 0.03;

    this.camera.translateX(dragDistance.x);
    this.camera.position.setY(this.camera.position.y + dragDistance.y);
  }
  normalizeCameraHeight() {
    const tileAtCenter = this.getTileAtCameraCenter();
    if (tileAtCenter) {
      const hoverPosWithOffset = {
        x: this.camera.position.x,
        y: tileAtCenter.position.y + this.camera.viewOffset.y,
        z: this.camera.position.z,
      } as THREE.Vector3;
      if (this.camera.position.distanceTo(hoverPosWithOffset) > 1) {
        // this.camera.position.lerp(hoverPosWithOffset as THREE.Vector3, 0.1);
      }
    }
  }
  getTileAtScreenXY(x: number, y: number): HexTile | undefined {
    let result: HexTile | undefined;
    this.raycaster.setFromCamera(
      {
        x: (x / window.innerWidth) * 2 - 1,
        y: -(y / window.innerHeight) * 2 + 1,
      },
      this.third.camera
    );
    this.raycaster
      .intersectObject(this.tilemap)
      .shift()
      ?.object.traverseAncestors((obj) => {
        if (obj instanceof HexTile) {
          result = obj as HexTile;
        }
      });
    return result;
  }
  getTileAtPointer(): HexTile | undefined {
    return this.getTileAtScreenXY(
      this.pointerLocation.x,
      this.pointerLocation.y
    );
  }
  getTileAtCameraCenter(): HexTile | undefined {
    return this.getTileAtScreenXY(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
  }
  update() {
    this.normalizeCameraHeight();
  }
}
