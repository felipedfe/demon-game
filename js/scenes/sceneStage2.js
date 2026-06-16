class SceneStage2 extends Phaser.Scene {
  constructor() {
    super('SceneStage2');
  }

  create() {
    // BG
    this.cameras.main.setBackgroundColor('#fff');
    this.back = this.add.tileSprite(0, 0, 480, 640, 'back');
    this.back.displayWidth = game.config.width;
    this.back.displayHeight = game.config.height;
    this.back.setOrigin(0, 0);
    this.back.setAlpha(0.4);

    this.arrowGroup = this.physics.add.group();
    this.arrowCount = 100;
    this.arrowsShot = 0;
    this.arrowSpeed = -350;
    this.score = 0;
    this.isDead = false;

    this.targetLife = 22;
    this.targetLifeMax = this.targetLife;

    this.aGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 });

    // HUD — contador de flechas
    this.arrowCountText = this.add.text(0, 0, this.arrowCount, {
      color: "#000000",
      fontSize: 30,
      fontFamily: "'Bebas Neue'",
      color: '#5e00a7'
    });
    this.arrowCountText.setOrigin(0.5, 0.5);
    this.aGrid.placeAtIndex(111, this.arrowCountText);
    this.arrowIcon = this.add.image(0, 0, "arrow");
    this.arrowIcon.displayWidth = 10;
    this.arrowIcon.scaleY = this.arrowIcon.scaleX;
    this.aGrid.placeAtIndex(110, this.arrowIcon);

    // HUD — barra de life do boss
    const barW = game.config.width * 0.55;
    const barH = 14;
    const barX = game.config.width / 2 - barW / 2;
    const barY = 10;
    this.lifeBarBg = this.add.rectangle(barX, barY, barW, barH, 0xec358d).setOrigin(0, 0);
    this.lifeBar = this.add.rectangle(barX, barY, barW, barH, 0x2be714).setOrigin(0, 0);
    this.lifeBarMaxW = barW;

    ////////////////////// Lógica do BOSS //////////////////////
    



    ////////////////////// Lógica do BOSS //////////////////////

    this.input.on('pointerdown', this.addArrow);
  }

  addArrow = (pointer) => {
    if (this.arrowGroup.getLength() > 0) return;
    this.arrowCount -= 1;
    this.arrowsShot += 1;
    this.arrowCountText.setText(this.arrowCount);
    const arrow = this.physics.add.sprite(0, 0, 'arrow');
    Align.scaleToGameW(arrow, 0.02);
    this.arrowGroup.add(arrow);
    this.aGrid.placeAtIndex(104, arrow);
    arrow.x = pointer.x;
    arrow.setVelocityY(this.arrowSpeed);
  }

  updateLifeBar = () => {
    const pct = this.targetLife / this.targetLifeMax;
    this.lifeBar.width = this.lifeBarMaxW * pct;
  }

  goToResults = () => {
    const accuracy = this.arrowsShot > 0
      ? Math.round((this.score / this.arrowsShot) * 100)
      : 0;
    this.scene.start('SceneResults', {
      accuracy,
      arrowsUsed: this.arrowsShot,
      nextScene: 'SceneMain',
      stageLabel: 'YOU WIN',
    });
  }

  update() {
    this.back.tilePositionY -= 1;

    this.arrowGroup.children.iterate((child) => {
      if (child && child.y < 0) child.destroy();
    });
  }
}
