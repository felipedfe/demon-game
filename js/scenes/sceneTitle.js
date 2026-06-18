class SceneTitle extends Phaser.Scene {
  constructor() {
    super('SceneTitle');
  }
  preload() { }
  create() {
    this.back = this.add.tileSprite(0, 0, 480, 640, "back");
    this.cameras.main.setBackgroundColor('#ffffff')
    this.back.setOrigin(0, 0);
    this.back.setAlpha(0.4);
    this.back.displayWidth = game.config.width;
    this.back.displayHeight = game.config.height;

    // this.cameras.main.setBackgroundColor('#ffffff')

    const cx = game.config.width / 2;
    const cy = game.config.height / 2;

    this.add.text(cx, cy - 120, 'MASK\nSHOT', {
      fontFamily: "'Bebas Neue'",
      fontSize: game.config.width * 0.45,
      color: '#5e00a7',
      // stroke: '#5e00a7',
      // strokeThickness: 8,
      lineSpacing: -55,
      align: 'center',
      shadow: {
        offsetX: -8,
        offsetY: 0,
        color: '#ee348c',
        blur: 0,
        fill: true,
      }
    }).setOrigin(0.5);

    const btn = this.add.image(cx, cy + 200, 'btnStart');
    Align.scaleToGameW(btn, 0.45);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('SceneMain'));
  }

  update() {
    this.back.tilePositionY -= 1;
  }
}
