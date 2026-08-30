/**
 * Centralized Audio Service for Moodify Global Music Player
 * Wraps HTML5 Audio API to manage audio loading, playback, state events, volume, and seeking.
 */

class AudioService {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.listeners = new Set();
  }

  getAudioInstance() {
    return this.audio;
  }

  load(url) {
    if (!url) return;
    this.audio.src = url;
    this.audio.load();
  }

  async play(url) {
    if (url && this.audio.src !== url) {
      this.load(url);
    }
    return await this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seek(seconds) {
    if (isFinite(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  setVolume(val) {
    const clamped = Math.max(0, Math.min(1, val));
    this.audio.volume = clamped;
  }

  getCurrentTime() {
    return this.audio.currentTime || 0;
  }

  getDuration() {
    return this.audio.duration || 0;
  }

  isPaused() {
    return this.audio.paused;
  }

  onTimeUpdate(callback) {
    this.audio.addEventListener("timeupdate", callback);
    return () => this.audio.removeEventListener("timeupdate", callback);
  }

  onEnded(callback) {
    this.audio.addEventListener("ended", callback);
    return () => this.audio.removeEventListener("ended", callback);
  }

  onError(callback) {
    this.audio.addEventListener("error", callback);
    return () => this.audio.removeEventListener("error", callback);
  }
}

const audioService = new AudioService();
export default audioService;
