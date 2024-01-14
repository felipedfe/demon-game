class SceneLoad extends Phaser.Scene {
  constructor() {
    super('SceneLoad');
  }
  preload() {
    this.progText = this.add.text(0, 0, "0%", {
      color: '#ffffff',
      fontSize: game.config.width / 10
    });
    this.progText.setOrigin(0.5, 0.5);
    Align.center(this.progText);
    Effect.preload(this, 7);
    this.load.on('progress', this.showProgress, this);
    this.load.image("btnStart", "images/btnStart.png");
    this.load.image("titleBack", "images/titleBack.jpg");
    this.load.image("blue", "images/buttons/blue.png");
    this.load.image("red", "images/buttons/red.png");
    this.load.image("orange", "images/buttons/orange.png");
    this.load.image("green", "images/buttons/green.png");
    this.load.image("sample", "images/sample.png");
    this.load.image("arrow", "images/arrow.png");
    this.load.image("target", "images/target.png");
    this.load.image("back", "images/back.jpg");
    this.load.image("block", "images/block.png");
    this.load.image("demon", "images/demon.png");
    this.load.spritesheet('demon-sprites', 'images/demon-sprites.png', { frameWidth: 400, frameHeight: 400 });
    this.load.spritesheet('demon-sprites-bg', 'images/demon-sprites-bg.png', { frameWidth: 400, frameHeight: 400 });
    this.load.spritesheet('block-sprites-bg', 'images/block-sprites-bg.png', { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet('flash-sprites', 'images/flash-sprites.png', { frameWidth: 480, frameHeight: 640 });
    this.load.spritesheet('flash-sprites-2', 'images/flash-sprites-2.png', { frameWidth: 480, frameHeight: 640 });
    //
    //
    //
    /* this.load.audio("right", "audio/right.wav");
     this.load.audio("wrong", "audio/wrong.wav");
     this.load.audio("levelUp", "audio/levelUp.wav");
     this.load.audio("background", "audio/background.mp3");*/
  }
  create() {
    global.emitter = new Phaser.Events.EventEmitter();
    global.controller = new Controller();
    global.mediaManager = new MediaManager({
      scene: this
    });
    this.scene.start("SceneMain");
  }
  showProgress(prog) {
    var per = Math.floor((prog / 1) * 100);
    this.progText.setText(per + "%");

  }
  update() { }
}