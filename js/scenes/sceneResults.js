class SceneResults extends Phaser.Scene {
  constructor() {
    super('SceneResults');
  }

  init(data) {
    this.accuracy = data.accuracy || 0;
    this.arrowsUsed = data.arrowsUsed || 0;
    this.nextScene = data.nextScene || 'SceneMain';
    this.stageLabel = data.stageLabel || 'STAGE CLEAR';
    this.isFinalStage = data.isFinalStage || false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff');
    this.back = this.add.tileSprite(0, 0, 480, 640, 'back');
    this.back.displayWidth = game.config.width;
    this.back.displayHeight = game.config.height;
    this.back.setOrigin(0, 0);
    this.back.setAlpha(0.4);

    const cx = game.config.width / 2;
    const cy = game.config.height / 2;

    const stagStyle = {
      fontFamily: "'Bebas Neue'",
      // color: '#ee348c', 
      color: '#2be714',
      fontSize: 80,
      // shadow: {
      //   offsetX: -8,
      //   offsetY: 4,
      //   color: '#2be714',
      //   blur: 0,
      //   fill: true,
      // }
    };
    // this.add.text(cx, cy - 180, this.stageLabel, stagStyle).setOrigin(0.5);

    const stageText = this.add.text(cx, cy - 180, this.stageLabel, stagStyle).setOrigin(0.5);

    // pisca nas cores da paleta
    const colors = [
      '#2be714', 
      // '#ee348c',
      '#5e00a7'
    ];
    let i = 0;
    this.time.addEvent({
      delay: 400,   // menor = pisca mais rápido
      callback: () => {
        stageText.setStyle({ color: colors[i % colors.length] });
        i++;
      },
      loop: true,
    });


    const labelStyle = { fontFamily: "'Bebas Neue'", color: '#5e00a7', fontSize: 60 };
    this.add.text(cx, cy - 60, 'ACCURACY', labelStyle).setOrigin(0.5);

    const pctStyle = { fontFamily: "'Bebas Neue'", color: '#ee348c', fontSize: 140 };
    this.add.text(cx, cy + 40, `${this.accuracy}%`, pctStyle).setOrigin(0.5);

    // const arrowStyle = { fontFamily: "'Bebas Neue'", color: '#5e00a7', fontSize: 40 };
    // this.add.text(cx, cy + 110, `ARROWS USED: ${this.arrowsUsed}`, arrowStyle).setOrigin(0.5);

    const btnKey = this.isFinalStage ? 'btnPlayAgain' : 'btnNext';
    const btn = this.add.image(cx, cy + 200, btnKey);
    Align.scaleToGameW(btn, 0.45);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => { this.scene.start(this.nextScene); });
  }

  update() {
    this.back.tilePositionY -= 1;
  }
}
