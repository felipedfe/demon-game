class SceneStage2 extends SceneBase {
  constructor() {
    super('SceneStage2');
  }

  create() {
    this.initSharedState({ arrowCount: 100, arrowSpeed: -350, targetLife: 22 });
    this.createBackground();
    this.createArrowHUD();
    this.createLifeBar();

    ////////////////////// Lógica do BOSS 2 //////////////////////



    ////////////////////// Lógica do BOSS 2 //////////////////////

    this.input.on('pointerdown', this.addArrow);
  }

  update() {
    this.back.tilePositionY -= 1;

    this.arrowGroup.children.iterate((child) => {
      if (child && child.y < 0) child.destroy();
    });
  }
}
