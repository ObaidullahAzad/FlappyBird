import * as Phaser from "phaser";
import "./index.css";

const speedDown: number = 0;

const sizes = {
  width: 288,
  height: 512,
};

const assets = {
  bird: {
    red: "bird-red",
    yellow: "bird-yellow",
    blue: "bird-blue",
  },
  obstacle: {
    pipe: {
      green: {
        top: "pipe-green-top",
        bottom: "pipe-green-bottom",
      },
      red: {
        top: "pipe-red-top",
        bottom: "pipe-red-bo",
      },
    },
  },
  scene: {
    width: 144,
    background: {
      day: "background-day",
      night: "background-night",
    },
    ground: "ground",
    gameOver: "game-over",
    restart: "restart-button",
    messageInitial: "message-initial",
  },
  scoreboard: {
    width: 25,
    base: "number",
    number0: "number0",
    number1: "number1",
    number2: "number2",
    number3: "number3",
    number4: "number4",
    number5: "number5",
    number6: "number6",
    number7: "number7",
    number8: "number8",
    number9: "number9",
  },
  animation: {
    bird: {
      red: {
        clapWings: "red-clap-wings",
        stop: "red-stop",
      },
      blue: {
        clapWings: "blue-clap-wings",
        stop: "blue-stop",
      },
      yellow: {
        clapWings: "yellow-clap-wings",
        stop: "yellow-stop",
      },
    },
    ground: {
      moving: "moving-ground",
      stop: "stop-ground",
    },
  },
};

class GameScene extends Phaser.Scene {
  Hit: string = "sdksjajhdjkashkjdkaskjdaskjdh";

  constructor() {
    super("scene-game");
  }

  preload() {
    console.log(this.Hit);
    this.load.image("bg", "/images/background-day.png");
    this.load.spritesheet(
      assets.bird.yellow,
      "/images/bird-yellow-sprite.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.image("pipe-top", "/images/pipe-green-top.png");
    this.load.image("pipe-bottom", "/images/pipe-green-bottom.png");
    this.load.spritesheet(assets.scene.ground, "/images/ground-sprite.png", {
      frameWidth: 336,
      frameHeight: 112,
    });
  }
  create() {
    this.time.addEvent({
      delay: 600,
      callback: this.spawnPipe,
      callbackScope: this, // Ensure 'this' refers to the correct context
      repeat: 10000, // Repeat the event
    });
    this.back = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.anims.create({
      key: assets.animation.bird.yellow.clapWings,
      frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: assets.animation.ground.moving,
      frames: this.anims.generateFrameNumbers(assets.scene.ground, {
        start: 0,
        end: 2,
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.anims.create({
      key: assets.animation.ground.stop,
      frames: [
        {
          key: assets.scene.ground,
          frame: 0,
        },
      ],
      frameRate: 20,
    });
    this.ground = this.physics.add.sprite(144, 488, assets.scene.ground);
    this.ground.anims.play(assets.animation.ground.moving);

    this.bird = this.physics.add.sprite(100, 300, "bird");
    this.bird.play(assets.animation.bird.yellow.clapWings, true);
    this.bird.setScale(1);
    this.bird.body.collideWorldBounds = true;
    this.bird.body.gravity.y = 800;
    this.bird.body.gravity.x = 0;
    this.pipes = this.physics.add.group();
    this.input.on("pointerdown", this.passer);

    // Spacebar jump event
    this.cursor = this.input.keyboard?.createCursorKeys();
    // Score
    this.score = -4;
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: 16,
    });
    this.scoreText.setDepth(20);
    this.ground.body.immovable = true;
    this.physics.add.collider(this.bird, this.ground);
    this.scoreText.visible = false;
  }
  update() {
    // Spacebar jump
    if (this.cursor.up.isDown) {
      this.bird.body.velocity.y = -300;
    }

    // Bird movement
    this.bird.body.velocity.x = 0;

    if (this.bird.body.velocity.y > 10) {
      this.bird.angle = 0;
    } else if (this.bird.body.velocity.y < 0) {
      this.bird.angle = -30;
    } else {
      this.bird.angle = 30;
    }

    // Check for pipe
    this.physics.add.overlap(
      this.bird,
      this.pipe,
      function (bird, pipe) {
        if (bird.y > 220 + this.yup && bird.y < 320 - this.yup + 100) {
          this.addScore(); // Increment score if bird passes gap
        }
      },
      null,
      this
    );
    if (this.score == 0) {
      this.scoreText.visible = true;
    }
  }
  spawnPipe() {
    const gap = 100;
    this.yup = Phaser.Math.Between(50, 100);
    const topPipe = this.pipes.create(500, this.yup, "pipe-top");
    topPipe.setScale(1);
    const bottomPipe = this.pipes.create(
      500,
      this.yup + gap + topPipe.height,
      "pipe-bottom"
    );

    this.physics.add.group(topPipe, bottomPipe);
    topPipe.body.velocity.x = -200;
    bottomPipe.body.velocity.x = -200;
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
    this.physics.add.collider(this.bird, topPipe, this.gameOver, null, this);
    this.physics.add.collider(this.bird, bottomPipe);
    this.addScore();
  }
  addScore() {
    this.score++;
    this.updateScoreText();
  }
  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }
  gameOver() {
    this.scene.pause("scene-game");
    this.bird.body.setVelocity(0, 0);
    this.ground.anims.play(assets.animation.ground.stop);
    this.add.text(50, 250, "Game Over!", {
      fontSize: 32,
      color: "red",
    });
  }
  passer() {
    console.log("Bird has passed");
  }
}

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
  scene: [GameScene],
};

export const game = new Phaser.Game(config);
