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

  createFlash() {
    this.flash = this.physics.add.sprite(0, 0, 'flash-sprites-2');
    this.flash.setOrigin(0, 0);
    this.flash.displayWidth  = game.config.width;
    this.flash.displayHeight = game.config.height;
    this.flash.alpha = 0;
    this.flash.setDepth(1);

    if (!this.anims.exists('flash')) {
      this.anims.create({
        key: 'flash',
        frames: this.anims.generateFrameNumbers('flash-sprites-2', { start: 0, end: 2 }),
        frameRate: 30,
        repeat: 20,
      });
    }
    this.flash.on('animationcomplete', () => { this.flash.alpha = 0; });
  }

  playMaskHitSound() {
    this.sound.play('mask-hit', { volume: 0.3 });
  }

  playBlockHitSound() {
    this.sound.play('block-hit', { volume: 0.3 });
  }

  playDeathEffects() {
    this.sound.play('bell', { volume: 0.8 });
    this.sound.play('explosion', { volume: 1 });
    global.mediaManager.fadeOut(this);
    this.flash.alpha = 1;
    this.flash.play('flash');
  }

  showStageIntro(stageNumber, onReady) {
    this.physics.world.pause();

    const cx = game.config.width / 2;
    const cy = game.config.height / 2;

    const overlay = this.add.rectangle(0, 0, game.config.width, game.config.height)
      .setOrigin(0, 0)
      .setDepth(50);

    const text = this.add.text(cx, cy, `STAGE ${stageNumber}`, {
      fontFamily: "'Bebas Neue'",
      color: '#ec358d',
      fontSize: 90,
    }).setOrigin(0.5).setDepth(51);

    this.time.addEvent({
      delay: 1300,
      callbackScope: this,
      callback: () => {
        overlay.destroy();
        text.destroy();
        this.physics.world.resume();
        onReady();
      },
    });
  }

  goToResults(nextScene, stageLabel, isFinalStage = false) {
    const accuracy = this.arrowsShot > 0
      ? Math.round((this.score / this.arrowsShot) * 100)
      : 0;
    this.scene.start('SceneResults', {
      accuracy,
      arrowsUsed: this.arrowsShot,
      nextScene,
      stageLabel,
      isFinalStage,
    });
  }
}
