import PrimitiveObject from "@engine/primitive/PrimitiveObject";
import { THREE, Scene3D } from "@enable3d/phaser-extension";
import Helpers from "@Helpers";

export default class HexTile extends PrimitiveObject {
  private _highlightMagnitude = -200;
  highlightColor = 0xf3ffff;
  coordinates = new Phaser.Math.Vector2();
  text: Phaser.GameObjects.Text;
  value = 0;
  public static directions: {
    [key in keyof typeof Helpers.Hex.DIRECTION_STRING]: Phaser.Math.Vector2;
  } = {
    NW: new Phaser.Math.Vector2(0, -1),
    NE: new Phaser.Math.Vector2(1, -1),
    W: new Phaser.Math.Vector2(-1, 0),
    E: new Phaser.Math.Vector2(1, 0),
    SW: new Phaser.Math.Vector2(-1, 1),
    SE: new Phaser.Math.Vector2(0, 1),
  };
  public static direction(
    direction: keyof typeof Helpers.Hex.DIRECTION_STRING
  ): Phaser.Math.Vector2 {
    return this.directions[direction];
  }

  public neighborCoords(
    direction: keyof typeof Helpers.Hex.DIRECTION_STRING
  ): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      this.coordinates.x + HexTile.direction(direction).x,
      this.coordinates.y + HexTile.direction(direction).y
    );
  }
  public neighborCoordsByKey(
    keyboardKey: keyof typeof Helpers.Hex.DIRECTION_KEYS
  ) {
    return this.neighborCoords(
      Helpers.Hex.DIRECTION_STRING[Helpers.Hex.DIRECTION_KEYS[keyboardKey]]
    );
  }
  get tileIdString() {
    return Helpers.Vector.toTileIdString(this.coordinates);
  }
  constructor(_scene: Scene3D, obj: any, _parent?: THREE.Object3D) {
    super(_scene, obj, _parent);
    this.text = this._scene.third.scene3D.make.text({
      x: 0,
      y: 0,
      text: "0",
      style: {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#ffffff",
        align: "center",
      },
    });
    // this(text);
  }
  setEmissive(color: number, save = true) {
    if (save) {
      this.highlightColor = color;
    }
    this.traverse((child) => {
      if (child.material && child.material) {
        (child.material as any).emissive.set(color);
        return;
      }
    });
  }

  setCoordinates(q: number, r: number) {
    this.coordinates = new Phaser.Math.Vector2(q, r);
    this.position.set(
      Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r,
      0,
      (3 / 2) * r
    );
    this.name = "tile-" + this.tileIdString;
  }

  onPointerOver() {
    this._scene.tweens.addCounter({
      from: -255,
      to: this._highlightMagnitude,
      duration: 300,
      delay: 0,
      ease: "ease",
      onUpdate: (tween, target, key, current) => {
        this.setEmissive(
          Helpers.Color.shade(this.highlightColor, current),
          false
        );
      },
    });
  }
  onPointerOut() {
    this._scene.tweens.addCounter({
      from: this._highlightMagnitude,
      to: -255,
      duration: 300,
      delay: 0,
      ease: "ease",
      onUpdate: (tween, target, key, current) => {
        this.setEmissive(
          Helpers.Color.shade(this.highlightColor, current),
          false
        );
      },
    });
  }
  update(delta: number) {
    const textPos = this._scene.third.transform.from3dto2d(this.position);
    this.text.text = this.value ? this.value.toString() : "";
    const textBounds = this.text.getBounds();
    this.text.setPosition(
      textPos.x - textBounds.width / 2,
      textPos.y - textBounds.height / 2
    );
  }
}
