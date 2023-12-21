import * as Phaser from "phaser";
import "./index.css";
import { GameScene } from "./play";
import { StartScene } from "./StartScene";

const speedDown: number = 0;

const sizes = {
  width: 288,
  height: 512,
};

export const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: speedDown,
      },
      debug: true,
    },
  },
  scene: [StartScene, GameScene],
};

export const game = new Phaser.Game(config);
