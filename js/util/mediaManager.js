class MediaManager {
  constructor(config) {
    this.scene = config.scene;
    this.music = null;
    this.musicVolume = 0.35;
  }

  playMusic(key) {
    this.music = this.scene.sound.add(key, { loop: true, volume: this.musicVolume });
    if (this.scene.sound.locked) {
      this.scene.sound.once('unlocked', () => this.music.play());
    } else {
      this.music.play();
    }
  }

  fadeOut(scene, duration = 1500) {
    if (!this.music) return;
    scene.tweens.add({ targets: this.music, volume: 0.2, duration });
  }

  restore(scene, duration = 0) {
    if (!this.music) return;
    scene.tweens.add({ targets: this.music, volume: this.musicVolume, duration });
  }
}
