import { Howl } from "howler";

class AudioManager {
  constructor() {
    this.sound = null;
  }

  load(src) {
    if (this.sound) {
      this.sound.unload();
    }

    this.sound = new Howl({
      src: [src],
      html5: true,
    });

    return this.sound;
  }

  play() {
    this.sound?.play();
  }

  pause() {
    this.sound?.pause();
  }

  stop() {
    this.sound?.stop();
  }

  seek(value) {
    if (!this.sound) return;

    if (value !== undefined) {
      this.sound.seek(value);
    }

    return this.sound.seek();
  }

  duration() {
    return this.sound?.duration() || 0;
  }

  volume(value) {
    if (!this.sound) return 1;

    if (value !== undefined) {
      this.sound.volume(value);
    }

    return this.sound.volume();
  }

  playing() {
    return this.sound?.playing() || false;
  }

  on(event, callback) {
    this.sound?.on(event, callback);
  }

  off(event, callback) {
    this.sound?.off(event, callback);
  }
}

export default new AudioManager();