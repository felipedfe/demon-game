var game;
var global;
window.onload = function () {
  // var isMobile = navigator.userAgent.indexOf("Mobile");
  // if (isMobile == -1) {
  //   isMobile = navigator.userAgent.indexOf("Tablet");
  // }
  var w = 480;
  var h = 640;

  // if (isMobile != -1) {
  //   w = window.innerWidth;
  //   h = window.innerHeight;
  // }
  var config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      }
    },
    scene: [
      SceneLoad,
      SceneTitle,
      SceneInstructions,
      SceneSettings,
      SceneMain,
      SceneOver
    ]
  };
  global = {};
  global.settings = new GlobalSettings();
  game = new Phaser.Game(config);
  global.game = game;
  global.constants = new Constants();
}