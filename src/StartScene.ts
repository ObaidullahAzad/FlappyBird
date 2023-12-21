import * as Phaser from "phaser";

export class StartScene extends Phaser.Scene {
  back: Phaser.GameObjects.Image | undefined;
  ground: Phaser.GameObjects.Sprite | undefined;
  bird: Phaser.GameObjects.Sprite | undefined;
  startbtn!: Phaser.GameObjects.Image;
  constructor() {
    super("start-scene");
  }
  preload() {
    this.load.image("bg", "/images/background-day.png");
    this.load.spritesheet("bird", "/images/bird-yellow-sprite.png", {
      frameWidth: 34,
      frameHeight: 24,
    });
    this.load.spritesheet("ground", "/images/ground-sprite.png", {
      frameWidth: 336,
      frameHeight: 112,
    });
    this.load.image("initial", "/images/message-initial.png");
  }
  create() {
    this.back = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.back.setInteractive();
    this.anims.create({
      key: "clapWings",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "moving-ground",
      frames: this.anims.generateFrameNumbers("ground", {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.ground = this.add.sprite(144, 488, "ground");
    this.ground.anims.play("moving-ground");
    this.bird = this.add.sprite(100, 300, "bird");
    this.bird.play("clapWings", true);
    this.startbtn = this.add.image(150, 200, "initial");
    this.back.on("pointerdown", this.startgame, this);
  }
  update() {}
  startgame() {
    this.scene.start("scene-game");
  }
}
