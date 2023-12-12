import { enable3d, Canvas } from "@enable3d/phaser-extension";
import PrimitiveScene from "./primitive/PrimitiveScene";

export default class GameHandler {
  private _currentSceneKey: string;
  private _game!: Phaser.Game;
  private readonly _sceneKeyToScene: { [key: string]: PrimitiveScene } = {};
  constructor(private readonly _scenes: PrimitiveScene[]) {
    // Attach and load
    for (const sceneClass of _scenes) {
      this._sceneKeyToScene[sceneClass.SceneName] = sceneClass;
    }

    // Start off at the first scene that's displayed
    this._currentSceneKey = _scenes[0].SceneName;
  }

  startGame() {
    enable3d(
      () =>
        (this._game = new Phaser.Game({
          type: Phaser.WEBGL,
          transparent: true,
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
            height:
              window.innerHeight * Math.max(1, window.devicePixelRatio / 2),
          },
          parent: "game",

          scene: this._scenes,
          ...Canvas(),
        }))
    ).withPhysics("/assets");
  }
}
