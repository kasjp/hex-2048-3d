import HexGrid from "@engine/components/HexGrid";
import HexTile from "@engine/objects/HexTile";
import GameState from "@game/store";
import PrimitiveScene from "@engine/primitive/PrimitiveScene";
import Helpers from "@Helpers";
export default abstract class HexScene extends PrimitiveScene {
  tilemap!: HexGrid;
  // orbitControls: any;
  constructor(sceneName: string, public gridSize: number) {
    super(sceneName);
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    await super.create();

    this.tilemap = new HexGrid(this, this.gridSize);
    await this.tilemap.generateHexGrid("base");

    this.camera.calculateViewport(this.gridSize);
    window.addEventListener(
      "resize",
      this.camera.calculateViewport.bind(this.camera, this.gridSize)
    );
    this.camera.lockRotation = this.camera.rotation.clone();
    if (this.camera.orbitControls) {
      this.camera.orbitControls.enableZoom = false;
      this.camera.orbitControls.touches.ONE = 0;
      this.camera.orbitControls.mouseButtons.LEFT = 0;
      this.camera.orbitControls.mouseButtons.RIGHT = 0;
    }
  }

  onPointerDown(event: Phaser.Input.Pointer) {
    // this.camera.targetPosition = undefined;
  }
  onPointerUp(event: Phaser.Input.Pointer) {
    // if (event.downX === event.upX && event.downY === event.upY) {
    //   const tile = GameState.hoverTile;
    //   if (tile) {
    //     this.camera.targetPosition = tile.position;
    //   }
    // }
  }

  onPointerMove(event: Phaser.Input.Pointer) {
    this.pointerLocation.x = event.worldX;
    this.pointerLocation.y = event.worldY;
  }

  getTileAtPointer(): HexTile | undefined {
    return this.tilemap.getTileAtScreenXY(
      this.pointerLocation.x,
      this.pointerLocation.y
    );
  }

  setTileValue(q: number, r: number, value: number) {
    const tile = this.tilemap.getTileAt(q, r);
    if (tile) {
      tile.value = value;
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    GameState.hoverTile = this.getTileAtPointer();
    this.tilemap.update(delta);
  }
}
