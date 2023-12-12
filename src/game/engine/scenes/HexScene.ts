import HexGrid from "@engine/components/HexGrid";
import HexTile from "@engine/objects/HexTile";
import GameState from "@game/store";
import PrimitiveScene from "@engine/primitive/PrimitiveScene";
import Helpers from "@Helpers";
export default abstract class HexScene extends PrimitiveScene {
  tilemap!: HexGrid;
  // orbitControls: any;
  constructor(sceneName: string) {
    super(sceneName);
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    await super.create();

    this.tilemap = new HexGrid(this);
    const mapSize = 4;
    await this.tilemap.generateHexGrid("base", mapSize);

    this.camera.calculateViewport(mapSize);
    window.addEventListener(
      "resize",
      this.camera.calculateViewport.bind(this.camera, mapSize)
    );
    this.camera.lockRotation = this.camera.rotation.clone();
    if (this.camera.orbitControls) {
      this.camera.orbitControls.enableZoom = false;
      this.camera.orbitControls.touches.ONE = 0;
      this.camera.orbitControls.mouseButtons.LEFT = 0;
      this.camera.orbitControls.mouseButtons.RIGHT = 0;
    }
    if (this.input.keyboard) {
      this.input.keyboard.addKeys(Helpers.Hex.ENABLED_KEYS);
      this.input.keyboard.on("keydown", (key: Phaser.Input.Keyboard.Key) =>
        this.tilemap.shiftTiles(key.keyCode)
      );
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
    const allTiles = this.tilemap.getTiles();
    if (allTiles.length) {
      // allTiles[Math.floor(Math.random() * allTiles.length)].value *= 2;
    }

    this.tilemap.update(delta);
  }
}
