import * as Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  Hit: number = 2;
  myEvent: Phaser.Time.TimerEvent | undefined;
  back: Phaser.GameObjects.Image | undefined;
  ground!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bird!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  pipes!: Phaser.Physics.Arcade.Group;
  cursor!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  score!: number;
  scoreText!: Phaser.GameObjects.Text;
  temp: number | undefined;
  button!: Phaser.GameObjects.Image;
  yup: number | undefined;
  topPipe: any;
  bottomPipe: any;

  constructor() {
    super("scene-game");
  }

  preload() {
    this.load.image("bg", "/images/background-day.png");
    this.load.spritesheet("bird", "/images/bird-yellow-sprite.png", {
      frameWidth: 34,
      frameHeight: 24,
    });
    this.load.image("pipe-top", "/images/pipe-green-top.png");
    this.load.image("pipe-bottom", "/images/pipe-green-bottom.png");
    this.load.spritesheet("ground", "/images/ground-sprite.png", {
      frameWidth: 336,
      frameHeight: 112,
    });
    this.load.image("button", "/images/restart-button.png");
  }
  create() {
    console.log(this.Hit);
    this.myEvent = this.time.addEvent({
      delay: 1200,
      callback: this.spawnPipe,
      callbackScope: this,
      repeat: 10000,
    });

    this.back = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.back.setDepth(1);
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
      key: "bird-stop",
      frames: [
        {
          key: "bird",
          frame: 1,
        },
      ],
      frameRate: 20,
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
    this.anims.create({
      key: "stop-ground",
      frames: [
        {
          key: "ground",
          frame: 0,
        },
      ],
      frameRate: 20,
    });
    this.ground = this.physics.add.sprite(144, 565, "ground");
    this.ground.anims.play("moving-ground");
    this.ground.setDepth(20);

    this.bird = this.physics.add.sprite(100, 300, "bird");
    this.bird.play("clapWings", true);
    this.bird.setScale(1);
    this.bird.setDepth(10);
    this.bird.body.collideWorldBounds = true;
    this.bird.body.gravity.y = 800;
    this.bird.body.gravity.x = 0;
    this.pipes = this.physics.add.group();

    // Spacebar jump event
    this.cursor = this.input.keyboard?.createCursorKeys();
    // Score
    this.score = -2;
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: 16,
      fontFamily: "helvetica, sans-serif",
    });
    this.temp = 0;
    this.button = this.add.image(150, 300, "button");
    this.button.setInteractive();
    this.button.setScale(1);
    this.button.setDepth(1000);
    this.button.on("pointerdown", this.passer, this);
    this.button.visible = false;
    this.scoreText.setDepth(20);
    this.ground.body.immovable = true;
    this.physics.add.collider(this.bird, this.ground);
    this.scoreText.visible = false;
    this.Hit = 2;
    this.input.on("pointerdown", this.birdFly, this);
  }
  update() {
    this.bird.body.velocity.x = 0;

    if (this.bird.body.velocity.y > 10) {
      this.bird.angle = 0;
    } else if (this.bird.body.velocity.y < 0) {
      this.bird.angle = -30;
    } else {
      this.bird.angle = 30;
    }

    if (this.score == 0) {
      this.scoreText.visible = true;
    }
    console.log(performance.now());
  }
  spawnPipe() {
    if (this.Hit < 10) {
      const gap = 100;
      this.yup = Phaser.Math.Between(30, 100);
      this.topPipe = this.pipes.create(500, this.yup, "pipe-top");
      this.topPipe.setScale(1);
      this.topPipe.setDepth(4);
      this.bottomPipe = this.pipes.create(
        500,
        this.yup + gap + this.topPipe.height,
        "pipe-bottom"
      );
      this.bottomPipe.setDepth(4);

      this.physics.add.group(this.topPipe, this.bottomPipe);
      this.topPipe.body.velocity.x = -180;
      this.bottomPipe.body.velocity.x = -180;
      this.topPipe.body.immovable = true;
      this.bottomPipe.body.immovable = true;
      const bird = this.bird;
      this.physics.add.collider(
        bird,
        this.topPipe,
        this.gameOver,
        async (_sdas: object) => {
          null;
        },
        this
      );
      this.physics.add.collider(
        this.bird,
        this.bottomPipe,
        this.gameOver,
        async (_sdas: object) => {
          null;
        },
        this
      );
      this.physics.add.collider(this.bird, this.bottomPipe);
      if (this.Hit < 10) {
        this.addScore();
      }
    }
  }
  addScore() {
    this.score++;
    this.updateScoreText();
  }
  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }
  passer() {
    console.log("Bird has passed");
    this.scene.start("scene-game");
  }
  birdFly() {
    this.bird.body.velocity.y = -300;
  }

  gameOver() {
    if (this.score < 0) {
      this.score = 0;
    }
    this.scoreText.setDepth(0);
    this.bird.angle = 90;
    this.bird.anims.play("bird-stop");
    this.bird.body.setVelocity(0, 0);
    this.Hit = 60;
    this.button.visible = true;
    this.topPipe.setDepth(0);
    this.physics.world.timeScale = 55000;
    this.tweens.add({
      targets: this.bird,
      x: 100,
      y: 505,
      duration: 500,
    });

    console.log(this.Hit);
    this.ground.anims.play("stop-ground");
    const gameOverTxt = this.add.text(50, 200, "Game Over!", {
      fontSize: 32,
      color: "red",
      fontFamily: "helvetica, sans-serif",
    });
    const overScore = this.add.text(65, 250, `Your score is ${this.score}`, {
      fontSize: 20,
      color: "white",
      fontFamily: "helvetica, sans-serif",
    });
    overScore.setDepth(20);
    gameOverTxt.setDepth(20);
  }
}
