class SceneMain extends SceneBase {
  constructor() {
    super('SceneMain');
  }
  preload() {}
  create() {
    // paleta
    // verde -> #2be714
    // rosa  -> #ee348c
    // roxo  -> #5e00a7

    this.blockGroup = this.physics.add.group();
    this.phases = [
      { minScore: 0,  speed: 130 },
      { minScore: 5,  speed: 170 },
      { minScore: 11, speed: 200 },
      { minScore: 16, speed: 250 },
    ];
    this.speed      = 100;
    this.wallMargin = 40;

    this.initSharedState({ arrowCount: 40, arrowSpeed: -420, targetLife: 18 });
    this.createBackground();

    // TARGET
    this.target = this.physics.add.sprite(0, 0, "demon-sprites-bg");
    this.target.setDepth(2);

    // FLASH
    this.createFlash();

    this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 1,
    });
    this.anims.create({
      key: 'eternalHit',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 10,
    });

    this.target.play('blink');
    Align.scaleToGameW(this.target, 0.27);
    this.aGrid.placeAtIndex(16, this.target);
    this.target.setImmovable();
    this.target.setVelocityX(this.speed);

    this.createArrowHUD();
    this.createLifeBar();
    this.setColliders();

    global.mediaManager.restore(this);

    this.showStageIntro(1, () => {
      this.input.on("pointerdown", this.addArrow);
    });
  }

  setColliders = () => {
    this.physics.add.collider(this.target, this.arrowGroup, this.hitTarget, null);
    this.physics.add.collider(this.arrowGroup, this.blockGroup, this.hitBlock, null);
  };

  addBlock = (pos, spriteFrame) => {
    const block = this.physics.add.sprite(0, 0, "block-sprites-bg", spriteFrame);
    block.displayWidth  = 50;
    block.displayHeight = block.displayWidth;
    block.blockSpeed    = this.speed + 20;
    block.setDepth(3);
    this.blockGroup.add(block);
    this.aGrid.placeAtIndex(pos, block);
    block.setVelocityX(block.blockSpeed);
    block.setImmovable();
  };

  hitBlock = (arrow, block) => {
    arrow.destroy();
    this.playBlockHitSound();
    this.tweens.add({
      targets: block,
      alpha: 0,
      duration: 50,
      yoyo: true,
      repeat: 1,
      onComplete: () => { block.alpha = 1; },
    });
  };

  restoreBlinkAnimation = () => {
    this.target.play('blink');
  };

  hitTarget = (target, arrow) => {
    if (this.isDead) { arrow.destroy(); return; }
    this.target.play('hit');
    this.playMaskHitSound();

    this.time.addEvent({ delay: 600, callback: this.restoreBlinkAnimation, callbackScope: this, loop: false });

    this.target.setTint(0xec358d);
    this.time.addEvent({
      delay: 200,
      callback: () => { this.target.clearTint(); },
      callbackScope: this,
    });

    const targetXBeforeShake = this.target.x;
    this.tweens.add({
      targets: this.target,
      x: { from: targetXBeforeShake - 4, to: targetXBeforeShake + 4 },
      duration: 20,
      yoyo: true,
      repeat: 2,
      onComplete: () => { this.target.x = targetXBeforeShake; },
    });

    arrow.destroy();
    this.targetLife -= 1;
    this.score += 1;

    const phase = this.phases.filter(p => this.score >= p.minScore).pop();
    this.speed = phase.speed;

    this.updateLifeBar();

    if (this.score === 2)  this.addBlock(55, 0);
    if (this.score === 6)  this.addBlock(70, 2);
    if (this.score === 11) this.addBlock(85, 3);

    if (this.target.body.velocity.x < 0) this.target.setVelocityX(-this.speed);
    if (this.target.body.velocity.x > 0) this.target.setVelocityX(this.speed);
  };

  update() {
    this.back.tilePositionY -= 3;

    if (this.target.x > game.config.width - this.wallMargin) this.target.setVelocityX(-this.speed);
    if (this.target.x < this.wallMargin) this.target.setVelocityX(this.speed);

    this.arrowGroup.children.iterate((child) => {
      if (child && child.y < 0) child.destroy();
    });

    this.blockGroup.children.iterate((child) => {
      if (child) {
        if (child.x < 0) child.setVelocityX(child.blockSpeed);
        if (child.x > game.config.width) child.setVelocityX(-child.blockSpeed);
      }
    });

    if (this.targetLife <= 0 && !this.isDead) {
      this.isDead = true;
      this.playDeathEffects();

      this.target.setVelocityX(0);
      if (this.anims.anims.entries.blink) this.anims.anims.entries.blink.destroy();
      this.target.play("eternalHit");
      this.time.addEvent({ delay: 2100, callback: () => { this.target.alpha = 0; }, callbackScope: this, loop: false });

      this.input.off("pointerdown", this.addArrow);
      this.targetLife = 0;

      this.time.addEvent({
        delay: 2000,
        callbackScope: this,
        callback: () => { this.goToResults('SceneStage2', 'STAGE CLEAR'); },
      });
    }
  }
}
