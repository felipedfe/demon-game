class SceneBase extends Phaser.Scene {

  initSharedState({ arrowCount = 40, arrowSpeed = -420, targetLife = 22 } = {}) {
    this.arrowGroup    = this.physics.add.group();
    this.arrowCount    = arrowCount;
    this.arrowsShot    = 0;
    this.arrowSpeed    = arrowSpeed;
    this.score         = 0;
    this.isDead        = false;
    this.targetLife    = targetLife;
    this.targetLifeMax = targetLife;
    this.aGrid         = new AlignGrid({ scene: this, rows: 11, cols: 11 });
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#fff');
    this.back = this.add.tileSprite(0, 0, 480, 640, 'back');
    this.back.displayWidth  = game.config.width;
    this.back.displayHeight = game.config.height;
    this.back.setOrigin(0, 0);
    this.back.setAlpha(0.4);
    this.back.setDepth(0);
  }

  createArrowHUD() {
    this.arrowCountText = this.add.text(0, 0, this.arrowCount, {
      fontSize: 30,
      fontFamily: "'Bebas Neue'",
      color: '#5e00a7',
    });
    this.arrowCountText.setOrigin(0.5, 0.5);
    this.aGrid.placeAtIndex(111, this.arrowCountText);
    this.arrowCountText.setDepth(10);

    this.arrowIcon = this.add.image(0, 0, 'arrow');
    this.arrowIcon.displayWidth = 10;
    this.arrowIcon.scaleY = this.arrowIcon.scaleX;
    this.aGrid.placeAtIndex(110, this.arrowIcon);
    this.arrowIcon.setDepth(10);
  }

  createLifeBar() {
    const barW = game.config.width * 0.55;
    const barH = 14;
    const barX = game.config.width / 2 - barW / 2;
    const barY = 10;
    this.lifeBarBg   = this.add.rectangle(barX, barY, barW, barH, 0xec358d).setOrigin(0, 0).setDepth(10);
    this.lifeBar     = this.add.rectangle(barX, barY, barW, barH, 0x2be714).setOrigin(0, 0).setDepth(10);
    this.lifeBarMaxW = barW;
  }

  updateLifeBar() {
    const pct = this.targetLife / this.targetLifeMax;
    this.lifeBar.width = this.lifeBarMaxW * pct;
  }

  addArrow = (pointer) => {
    if (this.arrowGroup.getLength() > 0) return;
    this.arrowCount -= 1;
    this.arrowsShot += 1;
    this.arrowCountText.setText(this.arrowCount);
    const arrow = this.physics.add.sprite(0, 0, 'arrow');
    Align.scaleToGameW(arrow, 0.02);
    arrow.setDepth(5);
    this.arrowGroup.add(arrow);
    this.aGrid.placeAtIndex(104, arrow);
    arrow.x = pointer.x;
    arrow.setVelocityY(this.arrowSpeed);
  }

  goToResults(nextScene, stageLabel) {
    const accuracy = this.arrowsShot > 0
      ? Math.round((this.score / this.arrowsShot) * 100)
      : 0;
    this.scene.start('SceneResults', {
      accuracy,
      arrowsUsed: this.arrowsShot,
      nextScene,
      stageLabel,
    });
  }
}
