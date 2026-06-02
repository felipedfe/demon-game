class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {

  }
  create() {
    // paleta
    // verde -> #2be714
    // rosa -> #ee348c
    // roxo -> #5e00a7

    //////////// variaveis /////////////
    // grupo de flechas
    this.arrowGroup = this.physics.add.group();
    // grupo de blocos
    this.blockGroup = this.physics.add.group();
    // fases de velocidade: velocidade fixa por faixa de score
    this.phases = [
      { minScore: 0, speed: 130 },
      { minScore: 6, speed: 170 },
      { minScore: 11, speed: 200 },
      { minScore: 16, speed: 250 },
    ];
    this.speed = 100; // velocidade da cabeça e blocos
    this.arrowCount = 100;
    this.arrowsShot = 0;
    // life do demon
    this.targetLife = 22;
    this.targetLifeMax = this.targetLife;
    this.isDead = false;
    this.score = 0;

    // velocidade do prjétil
    this.arrowSpeed = -400;
    ////////////////////////////////////

    //BG
    this.back = this.add.tileSprite(0, 0, 480, 640, "back");
    this.back.displayWidth = game.config.width;
    this.back.displayHeight = game.config.height;
    this.back.setOrigin(0, 0);

    // this.background = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xE6FFE1);
    // this.background.setOrigin(0, 0);

    // TARGET
    this.target = this.physics.add.sprite(0, 0, "demon-sprites");

    // FLASH (o flash é renderizado sem opacidade, ela só setado pra 1 quando acaba o jogo)
    this.flash = this.physics.add.sprite(0, 0, "flash-sprites-2");
    this.flash.setOrigin(0, 0);
    this.flash.displayWidth = game.config.width;
    this.flash.displayHeight = game.config.height;
    this.flash.alpha = 0;

    // gerencia as camadas do jogo
    const layer = this.add.layer();
    layer.add([this.back, this.flash, this.target]);

    this.aGrid = new AlignGrid({ scene: this, rows: 11, cols: 11 })
    // this.aGrid.showNumbers();

    // Animação do demon piscando
    this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1, // -1 para loop infinito
    });

    // Animação do demon sendo acertado
    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 1,
    });

    // Animação do demon sendo acertado (congelado)
    this.anims.create({
      key: 'eternalHit',
      frames: this.anims.generateFrameNumbers('demon-sprites-bg', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 10,
    });

    // Animação de tela piscando
    this.anims.create({
      key: 'flash',
      frames: this.anims.generateFrameNumbers('flash-sprites-2', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: 20,
    });
    this.flash.on('animationcomplete', () => { this.flash.alpha = 0; });

    // dá play na animação
    this.target.play('blink');

    Align.scaleToGameW(this.target, 0.27);
    this.aGrid.placeAtIndex(16, this.target);
    // target não se mexe quando acertado
    this.target.setImmovable();

    // target se move no eixo X. Só de setar isso ele já se move automaticamente
    this.target.setVelocityX(this.speed);

    // adiciona flecha
    this.input.on("pointerdown", this.addArrow);

    this.arrowCountText = this.add.text(0, 0, this.arrowCount, { color: "#000000", fontSize: 30 });
    this.arrowCountText.setOrigin(0.5, 0.5);
    this.aGrid.placeAtIndex(100, this.arrowCountText);
    this.arrowIcon = this.add.image(0, 0, "arrow");
    this.arrowIcon.displayWidth = 10;
    this.arrowIcon.scaleY = this.arrowIcon.scaleX;
    this.aGrid.placeAtIndex(99, this.arrowIcon);

    // barra de life da cabeça
    const barW = game.config.width * 0.55;
    const barH = 14;
    const barX = game.config.width / 2 - barW / 2;
    const barY = 10;
    this.lifeBarBg = this.add.rectangle(barX, barY, barW, barH, 0xec358d).setOrigin(0, 0);
    this.lifeBar = this.add.rectangle(barX, barY, barW, barH, 0x2be714).setOrigin(0, 0);
    this.lifeBarMaxW = barW;

    this.setColliders();
  };
  ///////////////////// FIM DE CREATE /////////////////////
  ///////////////////// FIM DE CREATE /////////////////////
  ///////////////////// FIM DE CREATE /////////////////////

  setColliders = () => {
    // seta uma relação de colisão entre o target e o grupo de flechas. this.hitTarget
    // é uma callback chamada no momento da colisão e null após a colisão (nela target
    // e arrow são passados como parametro, pois sao os elementos que colidem)
    this.physics.add.collider(this.target, this.arrowGroup, this.hitTarget, null);
    this.physics.add.collider(this.arrowGroup, this.blockGroup, this.hitBlock, null);
  };

  addBlock = (pos, spriteFrame) => {
    const block = this.physics.add.sprite(0, 0, "block-sprites-bg", spriteFrame);
    block.displayWidth = 50;
    block.displayHeight = block.displayWidth;
    block.blockSpeed = this.speed + 20; // velocidade fixada no momento da criação
    this.blockGroup.add(block);
    this.aGrid.placeAtIndex(pos, block);
    block.setVelocityX(block.blockSpeed);
    block.setImmovable();
  };

  updateLifeBar = () => {
    const pct = this.targetLife / this.targetLifeMax;
    this.lifeBar.width = this.lifeBarMaxW * pct;
  };

  hitBlock = (arrow, block) => {
    arrow.destroy();
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
    // this.target.stop('hit');
    this.target.play('blink');
    console.log(this.target)
  };

  hitTarget = (target, arrow) => {
    // this.target.stop('blink');
    this.target.play('hit');

    this.time.addEvent({ delay: 600, callback: this.restoreBlinkAnimation, callbackScope: this, loop: false });

    // tint rosa leve ao ser acertado
    this.target.setTint(0xec358d);
    this.time.addEvent({
      delay: 200,
      callback: () => {
        this.target.clearTint();
      },
      callbackScope: this,
    });

    // tremida no sprite
    const ox = this.target.x;
    this.tweens.add({
      targets: this.target,
      x: { from: ox - 4, to: ox + 4 },
      duration: 20,
      yoyo: true,
      repeat: 2,
      onComplete: () => { this.target.x = ox; },
    });

    arrow.destroy();
    this.targetLife -= 1;
    this.score += 1;

    const phase = this.phases.filter(p => this.score >= p.minScore).pop();
    this.speed = phase.speed;

    this.updateLifeBar();

    if (this.score === 3) {
      this.addBlock(55, 0);
    }

    if (this.score === 8) {
      this.addBlock(70, 2);
    }

    if (this.score === 16) {
      this.addBlock(85, 3);
    }

    if (this.target.body.velocity.x < 0) {
      this.target.setVelocityX(-this.speed);
    }
    if (this.target.body.velocity.x > 0) {
      this.target.setVelocityX(this.speed);
    }
  };

  addArrow = (pointer) => {
    if (this.arrowGroup.getLength() > 0) return;
    this.arrowCount -= 1;
    this.arrowsShot += 1;
    this.arrowCountText.setText(this.arrowCount);
    const arrow = this.physics.add.sprite(0, 0, "arrow");
    // const arrow = this.add.rectangle(0, 0, 20, 70, 0xfff000)
    Align.scaleToGameW(arrow, 0.02);
    this.arrowGroup.add(arrow);
    this.aGrid.placeAtIndex(104, arrow);
    arrow.x = pointer.x;
    arrow.setVelocityY(this.arrowSpeed);
    this.updateLifeBar();
  }

  update() {
    // pro fundo subir infinitamente
    this.cameras.main.setBackgroundColor('#fff');
    this.back.tilePositionY -= 5;
    this.back.setAlpha(0.4);


    // para alvo inverter a direcao quando toca a parede
    if (this.target.x > game.config.width) {
      this.target.setVelocityX(-this.speed);
    }

    if (this.target.x < 0) {
      this.target.setVelocityX(this.speed);
    }

    this.arrowGroup.children.iterate((child) => {
      if (child) {
        if (child.y < 0) {
          child.destroy();
        }
      }
    });

    this.blockGroup.children.iterate((child) => {
      if (child) {
        if (child.x < 0) {
          child.setVelocityX(child.blockSpeed);
        }
        if (child.x > game.config.width) {
          child.setVelocityX(-child.blockSpeed);
        }
      }
    });

    // quando o alvo é destruído
    if (this.targetLife <= 0 && !this.isDead) {
      this.isDead = true;
      console.log("FIM!")

      // para movimento do target
      this.target.setVelocityX(0);

      // Para as animações
      // this.target.anims.stop();
      // console.log("anims: ", this.anims.anims.entries.blink.paused = true);
      // console.log("anims: ", this.anims.anims.entries.blink.repeat = 1);
      // this.anims.anims.entries.blink.paused = true;
      // console.log("--->", this.anims.anims.entries.blink);
      // this.target.stop('blink');
      if (this.anims.anims.entries.blink) {
        this.anims.anims.entries.blink.destroy();
      }
      this.target.play("eternalHit");
      // console.log("anims: ",this.anims.anims.entries);
      this.time.addEvent({ delay: 2100, callback: () => { this.target.alpha = 0 }, callbackScope: this, loop: false });
      // console.log("anims: ", this.anims.anims.entries.hit.paused = true);

      // Desativa o grupo de flechas
      this.input.off("pointerdown", this.addArrow);

      this.flash.alpha = 1;
      this.flash.play("flash");
      this.targetLife = 0;
      console.log(this.targetLife)
      // this.flash.alpha = 0;
    }

    // FIM UPDATE
  }
}