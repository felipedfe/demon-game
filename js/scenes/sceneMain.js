class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload() {

  }
  create() {
    //////////// variaveis /////////////
    // grupo de flechas
    this.arrowGroup = this.physics.add.group();
    // grupo de blocos
    this.blockGroup = this.physics.add.group();
    // velocidade do target
    this.speed = 100;
    this.arrowCount = 100;
    this.arrowsShot = 0;
    // life do demon
    this.targetLife = 2;
    this.score = 0;
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

    // Animação de tela piscando
    this.anims.create({
      key: 'flash',
      frames: this.anims.generateFrameNumbers('flash-sprites-2', { start: 0, end: 2 }),
      frameRate: 30,
      repeat: 20,
    });

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

    this.scoreText = this.add.text(0, 0, "0/0", { color: "#000000", fontSize: 30 });
    this.scoreText.setOrigin(0.5, 0.5);
    this.aGrid.placeAtIndex(108, this.scoreText);

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
    this.blockGroup.add(block);
    this.aGrid.placeAtIndex(pos, block);
    block.setVelocityX(this.speed);
    block.setImmovable();
  };

  updateText = () => {
    this.scoreText.setText(`${this.score}/${this.arrowsShot}`)
  };

  hitBlock = (arrow, block) => {
    arrow.destroy();
  };

  restoreBlinkAnimation = () => {
    this.target.stop('hit')
    this.target.play('blink');
  };

  hitTarget = (target, arrow) => {
    this.target.stop('blink');
    this.target.play('hit');

    this.time.addEvent({ delay: 300, callback: this.restoreBlinkAnimation, callbackScope: this, loop: false });

    arrow.destroy();
    this.targetLife -= 1;
    this.score += 1;
    this.speed += 10;
    this.updateText();

    if (this.score === 10) {
      this.addBlock(50, 0);
    }

    if (this.score === 20) {
      this.addBlock(68, 2);
    }

    console.log("target speed: ", this.target.body.velocity)
    if (this.target.body.velocity.x < 0) {
      this.target.setVelocityX(-this.speed);
    }
    if (this.target.body.velocity.x > 0) {
      this.target.setVelocityX(this.speed);
    }
  };

  addArrow = (pointer) => {
    this.arrowCount -= 1;
    this.arrowsShot += 1;
    this.arrowCountText.setText(this.arrowCount);
    const arrow = this.physics.add.sprite(0, 0, "arrow");
    // const arrow = this.add.rectangle(0, 0, 20, 70, 0xfff000)
    Align.scaleToGameW(arrow, 0.02);
    this.arrowGroup.add(arrow);
    this.aGrid.placeAtIndex(93, arrow);
    arrow.x = pointer.x;
    arrow.setVelocityY(-250);
    this.updateText();
  }

  update() {
    // pro fundo subir infinitamente
    this.back.tilePositionY -= 1;

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
          child.setVelocityX(this.speed);
        }
        if (child.x > game.config.width) {
          child.setVelocityX(-this.speed);
        }
      }
    });

    // quando o alvo é destruído
    if (this.targetLife < 0) {
      console.log("FIM!")
      this.targetLife = 0;

      this.flash.alpha = 1;
      this.flash.play("flash");
    }

    // FIM UPDATE
  }
}