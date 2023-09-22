import { ExtendedGroup, Scene3D } from "@enable3d/phaser-extension";
import HexTile from "@engine/objects/HexTile";
import Helpers from "@Helpers";

export default class HexGrid extends ExtendedGroup {
  private _tilemap = new Map<string, HexTile>();
  constructor(
    private _scene: Scene3D,
    private _size_x = 32,
    private _size_z = 32,
    private _size_y = 1
  ) {
    super();
  }

  async generateTilemap() {
    for (let x = 0; x < this._size_x; x++) {
      for (let y = 0; y < this._size_y; y++) {
        for (let z = 0; z < this._size_z; z++) {
          HexTile.create(this, this._scene).then((tile) => {
            tile.setCoordinates(x, y, z);
            this._tilemap.set(`${x}-${y}-${z}`, tile);
            // console.log(this._tilemap.get(`${x}-${y}-${z}`));
            const previousTileId = `${x - 1}-${y}-${z - 1}`;
            const previousTile = this._tilemap.get(previousTileId);
            if (previousTile) {
              previousTile.setCoordinates(
                x - 1,
                previousTile.position.y + Math.random() * 0.5,
                z - 1
              );
              this._tilemap.set(
                Helpers.Vector3.toTileIdString(previousTile.coordinates),
                previousTile
              );
              this._tilemap.delete(previousTileId);
            }
          });
        }
      }
    }
    this._scene.third.add.existing(this);
  }
  // getTileAt(x: number, y: number, z: number) {}
}
