import * as Phaser from "phaser";
import { enable3d, Canvas } from "@enable3d/phaser-extension";
import PlayScene from "@game/main/PlayScene";
export function launch() {
  enable3d(
    () =>
      new Phaser.Game({
        type: Phaser.WEBGL,
        transparent: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: window.innerWidth * Math.max(1, window.devicePixelRatio / 2),
          height: window.innerHeight * Math.max(1, window.devicePixelRatio / 2),
        },
        parent: "game",

        scene: PlayScene,
        ...Canvas(),
      })
  ).withPhysics("/assets");
}

// window.addEventListener("load", () => {
//   enable3d(() => new Phaser.Game(config)).withPhysics("assets/ammo");
// });
