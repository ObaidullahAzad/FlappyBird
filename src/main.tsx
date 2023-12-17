import Phaser from "phaser";
import "./index.css";

const speedDown: number = 300;

const sizes = {
  width: 500,
  height: 500,
};

const assets = {
  bird: {
    yellow: "bird-yellow",
  },
  animation: {
    bird: {
      yellow: {
        clapWings: "yellow-clap-wings",
        stop: "yellow-stop",
      },
    },
  },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
  }

  preload() {
    this.load.image("bg", "/images/background-day.png");
    this.load.spritesheet(
      assets.bird.yellow,
      "/images/bird-yellow-sprite.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.anims.create({
      key: assets.animation.bird.yellow.clapWings,
      frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player = this.add.sprite(100, 300, assets.bird.yellow);
    this.player.play(assets.animation.bird.yellow.clapWings, true);
  }
  update() {}
}

export const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.width,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: speedDown,
      },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
