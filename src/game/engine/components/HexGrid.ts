import Helpers from "@Helpers";
import { ExtendedGroup, Scene3D, THREE } from "@enable3d/phaser-extension";
import { AssetMap, TAssetId } from "@engine/constants/AssetMap";
import AssetManager from "@engine/managers/AssetManager";
import HexTile from "@engine/objects/HexTile";
import HexScene from "@engine/scenes/HexScene";

export default class HexGrid extends ExtendedGroup {
  private _tilemap = new Map<string, HexTile>();
  private _tileSize = new THREE.Vector3(1, 1, 1);
  constructor(
    private _scene: HexScene,
    private _size_x = 32,
    private _size_z = 32,
    private _size_y = 1
  ) {
    super();
    this._scene.third.add.existing(this);
  }
  async createTileAt(q: number, r: number, tileAssetId: TAssetId = "base") {
    const asset = await AssetManager.getAssetById(tileAssetId);
    const tile = new HexTile(this._scene, asset.scene.clone(), this);
    tile.setCoordinates(q, r);
    this._tilemap.set(tile.tileIdString, tile);
  }

  generateHexGrid(tileAssetId: TAssetId = "base", size = 2) {
    size = size - 1;
    for (let q = -size; q < size + 1; q++) {
      for (let r = -size; r < size + 1; r++) {
        const s = -q - r;
        if (Math.abs(q) <= size && Math.abs(r) <= size && Math.abs(s) <= size) {
          this.createTileAt(q, r, tileAssetId);
        }
      }
    }
  }
  // async generateFrom2DArray(
  //   tileIdArray: Array<Array<TAssetId | undefined>>,
  //   y = 0
  // ) {
  //   const promises = [];
  //   for (let x = 0; x < tileIdArray.length - 1; x++) {
  //     for (let z = 0; z < tileIdArray[x].length - 1; z++) {
  //       if (tileIdArray[x][z])
  //         promises.push(
  //           HexTile.loadAndCreate(this, this._scene, tileIdArray[x][z]).then(
  //             (tile) => {
  //               tile.size = this._tileSize;
  //               tile.setCoordinates(x, y, z);
  //               this._tilemap.set(`${x}-${y}-${z}`, tile);
  //             }
  //           )
  //         );
  //     }
  //   }
  //   await Promise.all(promises);
  // }
  getTiles() {
    return [...this._tilemap.values()];
  }
  getTileAt(q: number, r: number) {
    return this._tilemap.get(Helpers.Vector.toTileIdString({ x: q, y: r }));
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
  shiftTiles(keyCode: number) {
    /** */
  }
  update(delta: number) {
    this._tilemap.forEach((tile) => tile.update(delta));
  }
}
