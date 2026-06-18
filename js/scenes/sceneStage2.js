class SceneStage2 extends SceneBase {
  constructor() {
    super('SceneStage2');
  }

  create() {
    this.wallMargin  = 40;
    this.orbitRadius = 100;
    this.orbitSpeed  = 0.025;
    this.orbitAngle  = 0;
    this.totalSlots  = 9; // X posições, 1 gap inicial

    // fases de velocidade da máscara
    this.phases = [
      { minScore: 0,  speed: 130 },
      { minScore: 5,  speed: 170 },
      { minScore: 11, speed: 200 },
      { minScore: 16, speed: 250 },
    ];
    this.speed = this.phases[0].speed;

    // marcos de score em que uma bola da órbita desaparece
    this.ballMilestones = [3, 6, 8, 12, 15, 17, 18, 19];

    // ataque de desespero: a partir desse score, as bolas restantes saem
    // da órbita e quicam pela tela em diagonal (45°), como no Breakout
    this.desperationScore     = 14;
    this.desperationTriggered = false;
    this.looseBallSpeed       = 500;
    this.looseBalls           = [];

    this.initSharedState({ arrowCount: 40, arrowSpeed: -420, targetLife: 18 });
    this.createBackground();

    // boss
    this.target = this.physics.add.sprite(game.config.width / 2, 130, 'boss-2-sprites-bg');
    Align.scaleToGameW(this.target, 0.27);
    this.target.setImmovable();
    this.target.setVelocityX(this.speed);
    this.target.setDepth(2);

    this.anims.create({
      key: 'blink2',
      frames: this.anims.generateFrameNumbers('boss-2-sprites-bg', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: 'hit2',
      frames: this.anims.generateFrameNumbers('boss-2-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 1,
    });
    this.anims.create({
      key: 'eternalHit2',
      frames: this.anims.generateFrameNumbers('boss-2-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 10,
    });
    this.target.play('blink2');

    // FLASH (efeito de tela ao morrer)
    this.createFlash();

    // bolas de órbita
    this.orbitGroup = this.physics.add.group();
    this.orbitBalls = [];

    // slot 0 começa como gap — cria bolas nos slots 1 a 5
    for (let slot = 1; slot < this.totalSlots; slot++) {
      const ball = this.physics.add.sprite(0, 0, 'bola');
      Align.scaleToGameW(ball, 0.07);
      ball.slotIndex = slot;
      ball.setDepth(3);
      this.orbitGroup.add(ball);
      ball.setImmovable();
      this.orbitBalls.push(ball);
    }

    this.createArrowHUD();
    this.createLifeBar();
    this.setColliders();

    global.mediaManager.restore(this);

    this.showStageIntro(2, () => {
      this.input.on('pointerdown', this.addArrow);
    });
  }

  setColliders = () => {
    this.physics.add.collider(this.target,    this.arrowGroup, this.hitTarget, null);
    this.physics.add.collider(this.orbitGroup, this.arrowGroup, this.hitBall,   null);
  };

  hitBall = (ball, arrow) => {
    arrow.destroy();
    this.playBlockHitSound();
    this.tweens.add({
      targets: ball,
      alpha: 0,
      duration: 50,
      yoyo: true,
      repeat: 1,
      onComplete: () => { ball.alpha = 1; },
    });
  };

  restoreBlinkAnimation = () => {
    this.target.play('blink2');
  };

  hitTarget = (target, arrow) => {
    if (this.isDead) { arrow.destroy(); return; }

    this.target.play('hit2');
    this.time.addEvent({ delay: 600, callback: this.restoreBlinkAnimation, callbackScope: this, loop: false });

    arrow.destroy();
    this.playMaskHitSound();
    this.targetLife -= 1;
    this.score += 1;
    this.updateLifeBar();

    const phase = this.phases.filter(p => this.score >= p.minScore).pop();
    this.speed = phase.speed;
    if (this.target.body.velocity.x < 0) this.target.setVelocityX(-this.speed);
    if (this.target.body.velocity.x > 0) this.target.setVelocityX(this.speed);

    // tint
    this.target.setTint(0xec358d);
    this.time.addEvent({
      delay: 200,
      callback: () => { this.target.clearTint(); },
      callbackScope: this,
    });

    // shake
    const targetXBeforeShake = this.target.x;
    this.tweens.add({
      targets: this.target,
      x: { from: targetXBeforeShake - 4, to: targetXBeforeShake + 4 },
      duration: 20,
      yoyo: true,
      repeat: 2,
      onComplete: () => { this.target.x = targetXBeforeShake; },
    });

    if (!this.desperationTriggered && this.score >= this.desperationScore) {
      this.triggerDesperation();
    } else if (this.ballMilestones.includes(this.score) && this.orbitBalls.length > 0) {
      // remove uma bola da órbita ao bater em um marco de score
      const removed = this.orbitBalls.pop();
      this.tweens.add({
        targets: removed,
        alpha: 0,
        duration: 300,
        onComplete: () => { removed.destroy(); },
      });
    }
  };

  triggerDesperation = () => {
    this.desperationTriggered = true;
    this.looseBalls = this.orbitBalls;
    this.orbitBalls = [];

    this.looseBalls.forEach((ball) => {
      const dirX = Math.random() < 0.5 ? -1 : 1;
      const dirY = Math.random() < 0.5 ? -1 : 1;
      // sempre 45°: componentes X e Y com a mesma magnitude
      const v = this.looseBallSpeed / Math.SQRT2;
      ball.setVelocity(dirX * v, dirY * v);
    });
  };

  update() {
    this.back.tilePositionY -= 3;

    // bounce nas paredes
    if (this.target.x > game.config.width - this.wallMargin) this.target.setVelocityX(-this.speed);
    if (this.target.x < this.wallMargin) this.target.setVelocityX(this.speed);

    // atualiza posição das bolas em órbita
    this.orbitAngle += this.orbitSpeed;
    this.orbitBalls.forEach((ball) => {
      const angle = this.orbitAngle + (ball.slotIndex * ((2 * Math.PI) / this.totalSlots));
      const x = this.target.x + Math.cos(angle) * this.orbitRadius;
      const y = this.target.y + Math.sin(angle) * this.orbitRadius;
      ball.body.reset(x, y);
    });

    // bolas soltas do ataque de desespero quicam nas bordas, mantendo o ângulo de 45°
    this.looseBalls.forEach((ball) => {
      if (ball.x <= 0)                  ball.setVelocityX(Math.abs(ball.body.velocity.x));
      if (ball.x >= game.config.width)  ball.setVelocityX(-Math.abs(ball.body.velocity.x));
      if (ball.y <= 0)                  ball.setVelocityY(Math.abs(ball.body.velocity.y));
      if (ball.y >= game.config.height) ball.setVelocityY(-Math.abs(ball.body.velocity.y));
    });

    // destrói flechas que saem por cima
    this.arrowGroup.children.iterate((child) => {
      if (child && child.y < 0) child.destroy();
    });

    // morte do boss
    if (this.targetLife <= 0 && !this.isDead) {
      this.isDead = true;
      this.playDeathEffects();

      this.input.off('pointerdown', this.addArrow);
      this.target.setVelocityX(0);
      if (this.anims.anims.entries.blink2) this.anims.anims.entries.blink2.destroy();
      this.target.play('eternalHit2');
      this.time.addEvent({ delay: 2100, callback: () => { this.target.alpha = 0; }, callbackScope: this, loop: false });

      this.time.addEvent({
        delay: 2000,
        callbackScope: this,
        callback: () => { this.goToResults('SceneMain', 'STAGE CLEAR', true); },
      });
    }
  }
}
