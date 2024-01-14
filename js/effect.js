class Effect extends UIBlock {
    constructor(config) {
        super();
        this.scene = config.scene;
        var key = "effect" + config.effectNumber;
        var frameNames = this.scene.anims.generateFrameNumbers(key);
        var animKey = 'animKey' + config.effectNumber;
        //
        //
        if (!this.scene.anims.anims.has(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: frameNames,
                frameRate: 32,
                repeat: false
            });
        }
        //
        this.effectImage = this.scene.add.sprite(0, 0, key);
        this.add(this.effectImage);
        this.effectImage.on('animationcomplete', this.destroyMe, this);
        this.effectImage.play(animKey);
    }
    destroyMe() {
       
        this.destroy();
    }
    static preload(scene, effectNumber) {
        var key = "effect" + effectNumber;
        var path = "images/effects/" + effectNumber + ".png";
        scene.load.spritesheet(key, path, {
            frameWidth: 100,
            frameHeight: 100
        });
    }
}