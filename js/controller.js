class Controller {
    constructor() {
        global.emitter.on(global.constants.START_GAME, this.startGame, this);
        global.emitter.on(global.constants.SHOW_TITLE, this.showTitle, this);
        global.emitter.on(global.constants.SHOW_INSTR, this.showInstructions, this);
        global.emitter.on(global.constants.SHOW_SETTINGS, this.showSettings, this);
        global.emitter.on(global.constants.TOGGLE_MUSIC, this.toggleMusic, this);
        global.emitter.on(global.constants.TOGGLE_SOUND, this.toggleSound, this);
    }
    startGame(scene) {
        scene.start("SceneMain");
    }
    showInstructions(scene) {
        scene.start("SceneInstructions");
    }
    showSettings(scene) {
        scene.start("SceneSettings");
    }
    showTitle(scene) {
        scene.start("SceneTitle");
    }
    toggleMusic() {
        global.model.musicOn = !global.model.musicOn;
    }
    toggleSound() {
        global.model.sfxOn = !global.model.sfxOn;
    }
}