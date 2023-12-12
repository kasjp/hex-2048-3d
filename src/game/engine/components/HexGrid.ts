import Helpers from "@Helpers";
import { ExtendedGroup, THREE } from "@enable3d/phaser-extension";
import { TAssetId } from "@engine/constants/AssetMap";
import AssetManager from "@engine/managers/AssetManager";
import HexTile from "@engine/objects/HexTile";
import HexScene from "@engine/scenes/HexScene";

export default class HexGrid extends ExtendedGroup {
  private _tilemap = new Map<string, HexTile>();
  private _tileSize = new THREE.Vector3(1, 1, 1);
  constructor(private _scene: HexScene, private _gridSize: number) {
    super();
    this._scene.third.add.existing(this);
  }
  async createTileAt(q: number, r: number, tileAssetId: TAssetId = "base") {
    const asset = await AssetManager.getAssetById(tileAssetId);
    const tile = new HexTile(this._scene, asset.scene.clone(), this);
    tile.setCoordinates(q, r);
    this._tilemap.set(tile.tileIdString, tile);
  }

  async generateHexGrid(tileAssetId: TAssetId = "base") {
    for (let q = -this._gridSize + 1; q < this._gridSize; q++) {
      for (let r = -this._gridSize + 1; r < this._gridSize; r++) {
        const s = -q - r;
        if (
          Math.abs(q) <= this._gridSize - 1 &&
          Math.abs(r) <= this._gridSize - 1 &&
          Math.abs(s) <= this._gridSize - 1
        ) {
          await this.createTileAt(q, r, tileAssetId);
        }
      }
    }
  }

  getTiles() {
    return [...this._tilemap.values()];
  }
  getTileAt(q: number, r: number) {
    return this._tilemap.get(Helpers.Vector.toTileIdString({ x: q, y: r }));
  }
  getNeighborTile(
    tile: HexTile,
    directionKey: keyof typeof Helpers.Hex.DIRECTION_KEYS
  ) {
    const neighborCoords = tile.neighborCoordsByKey(directionKey);
    return this.getTileAt(neighborCoords.x, neighborCoords.y);
  }
  getTileAtScreenXY(x: number, y: number): HexTile | undefined {
    let result: HexTile | undefined;

    this._scene
      .raycastFromScreenXY(x, y, this)
      .shift()
      ?.object.traverseAncestors((obj) => {
        if (obj instanceof HexTile) {
          result = obj as HexTile;
        }
      });
    return result;
  }

  update(delta: number) {
    this._tilemap.forEach((tile) => tile.update(delta));
  }
}
