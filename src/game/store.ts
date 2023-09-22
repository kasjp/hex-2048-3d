import { Ref, WatchStopHandle, ref, watch } from "vue";
import HexTile from "@engine/objects/HexTile";

type THoverTile = HexTile | undefined;

export default class GameState {
  private static _hoverTile: Ref<THoverTile> = ref();
  private static _watchStop: WatchStopHandle | undefined;
  public static get hoverTile(): THoverTile {
    return this._hoverTile.value || undefined;
  }
  public static set hoverTile(tile: THoverTile) {
    this._hoverTile.value = tile;
  }
  public static onHoverTileChange(
    callback?: (value: THoverTile, oldValue: THoverTile) => void
  ) {
    if (this._watchStop) {
      this._watchStop();
      this._watchStop = undefined;
    }
    watch(
      () => this._hoverTile.value,
      (value, oldValue) => {
        if (oldValue instanceof HexTile) {
          oldValue.onPointerOut();
        }
        if (value instanceof HexTile) {
          value.onPointerOver();
        }
        if (callback) {
          callback(value, oldValue);
        }
      }
    );
  }
}
// export default GameState;
