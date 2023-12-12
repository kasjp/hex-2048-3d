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

    const mapSize = 3;
    this.tilemap = new HexGrid(this, mapSize);
    await this.tilemap.generateHexGrid("base");

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
      this.input.keyboard.on("keydown", (key: any) => {
        if (Helpers.Hex.ENABLED_KEYS.includes(key.key.toUpperCase())) {
          this.shiftTiles(key.key);
          const emptyTiles = this.tilemap
            .getTiles()
            .filter((tile) => tile.value === 0);
          if (emptyTiles.length) {
            emptyTiles[Math.floor(Math.random() * emptyTiles.length)].value = 2;
          }
        }
      });
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
  tryMergeTile(
    tile: HexTile,
    directionKey: keyof typeof Helpers.Hex.DIRECTION_KEYS
  ) {
    if (tile.value === 0) return;
    const neighborTile = this.tilemap.getNeighborTile(tile, directionKey);
    if (neighborTile) {
      if (neighborTile.value == 0) {
        neighborTile.value = tile.value;
        tile.value = 0;
        this.tryMergeTile(neighborTile, directionKey);
      } else if (neighborTile.value == tile.value) {
        neighborTile.value += tile.value;
        tile.value = 0;
      } else {
        const nextNeighbor = this.tilemap.getNeighborTile(
          neighborTile,
          directionKey
        );
        if (nextNeighbor) {
          this.tryMergeTile(neighborTile, directionKey);
        }
      }
    }
  }
  shiftTiles(keyboardKey: string) {
    const directionKey =
      keyboardKey.toUpperCase() as keyof typeof Helpers.Hex.DIRECTION_KEYS;
    const filledTiles = this.tilemap
      .getTiles()
      .filter((tile) => tile.value != 0);
    filledTiles.forEach((tile) => this.tryMergeTile(tile, directionKey));
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
