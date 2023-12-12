import HexTile from "@engine/objects/HexTile";
import Helpers from "@Helpers";
import HexScene from "@engine/scenes/HexScene";
export default class PlayScene extends HexScene {
  constructor(gridSize: number) {
    super("PlayScene", gridSize);
  }
  async create() {
    await super.create();
    this.generateTile();
    if (this.input.keyboard) {
      this.input.keyboard.addKeys(Helpers.Hex.ENABLED_KEYS);
      this.input.keyboard.on("keydown", (key: any) => {
        if (Helpers.Hex.ENABLED_KEYS.includes(key.key.toUpperCase())) {
          this.shiftTiles(key.key);
          this.generateTile();
        }
      });
    }
    this.tilemap
      .getTiles()
      .forEach((tile) =>
        tile.setEmissive(Helpers.Color.shade(0x111111, -255), true)
      );
  }
  generateTile(q?: number, r?: number, value?: number) {
    if (
      typeof q == "number" &&
      typeof r == "number" &&
      typeof value == "number"
    ) {
      this.setTileValue(q, r, value);
    } else {
      const emptyTiles = this.tilemap
        .getTiles()
        .filter((tile) => tile.value === 0);
      if (emptyTiles.length) {
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)].value = 2;
      }
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
      }

      this.tryMergeTile(neighborTile, directionKey);
      if (neighborTile.value == 0) {
        this.tryMergeTile(tile, directionKey);
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
}
