class SceneTitle extends Phaser.Scene {
  constructor() {
    super('SceneTitle');
  }
  preload() {}
  create() {
    this.back = this.add.image(0, 0, "titleBack");
    this.back.setOrigin(0, 0);
    this.back.displayWidth = game.config.width;
    this.back.displayHeight = game.config.height;

    const cx = game.config.width / 2;
    const cy = game.config.height / 2;

    this.add.text(cx, cy - 120, 'DEMON\nGAME', {
      fontSize: 64,
      fontStyle: 'bold',
      color: '#ee348c',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
    }).setOrigin(0.5);

    const btn = this.add.image(cx, cy + 80, 'btnStart');
    Align.scaleToGameW(btn, 0.45);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('SceneMain'));
  }
}
