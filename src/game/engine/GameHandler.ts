import { enable3d, Canvas } from "@enable3d/phaser-extension";
import PrimitiveScene from "./primitive/PrimitiveScene";

export default class GameHandler {
  private _currentSceneKey = "";
  private _game!: Phaser.Game;
  private readonly _sceneKeyToScene: { [key: string]: PrimitiveScene } = {};

  startGame() {
    this._game = new Phaser.Game({
      type: Phaser.WEBGL,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
        height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2),
      },
      parent: "game",

      ...Canvas(),
    });
    enable3d(() => this._game).withPhysics("/assets");
    return this;
  }

  initScenes(scenes: PrimitiveScene[]) {
    // Attach and load
    for (const sceneClass of scenes) {
      this._sceneKeyToScene[sceneClass.SceneName] = sceneClass;
      this._game.scene.add(sceneClass.SceneName, sceneClass);
    }

    // Start off at the first scene that's displayed
    this._currentSceneKey = scenes[0].SceneName;
    this._game.scene.start(this._currentSceneKey);
  }
}
