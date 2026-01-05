import * as Tone from 'tone';

export class AudioEngine {
  private static instance: AudioEngine;
  private musicPlayers: Map<string, Tone.Player> = new Map();
  private sfxPlayers: Map<string, Tone.Player> = new Map();
  private currentMusic: string | null = null;
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;

  private constructor() {
    this.initializeAudio();
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private async initializeAudio(): Promise<void> {
    await Tone.start();
    Tone.Destination.volume.value = Tone.gainToDb(this.masterVolume);
  }

  async loadMusic(key: string, url: string): Promise<void> {
    const player = new Tone.Player(url).toDestination();
    player.volume.value = Tone.gainToDb(this.musicVolume);
    this.musicPlayers.set(key, player);
  }

  async loadSFX(key: string, url: string): Promise<void> {
    const player = new Tone.Player(url).toDestination();
    player.volume.value = Tone.gainToDb(this.sfxVolume);
    this.sfxPlayers.set(key, player);
  }

  playMusic(key: string, loop: boolean = true): void {
    const player = this.musicPlayers.get(key);
    if (player) {
      if (this.currentMusic && this.currentMusic !== key) {
        this.stopMusic();
      }
      player.loop = loop;
      player.start();
      this.currentMusic = key;
    }
  }

  stopMusic(fadeDuration: number = 0.5): void {
    if (this.currentMusic) {
      const player = this.musicPlayers.get(this.currentMusic);
      if (player) {
        if (fadeDuration > 0) {
          player.volume.rampTo(-Infinity, fadeDuration);
          setTimeout(() => {
            player.stop();
            player.volume.value = Tone.gainToDb(this.musicVolume);
          }, fadeDuration * 1000);
        } else {
          player.stop();
        }
      }
      this.currentMusic = null;
    }
  }

  playSFX(key: string): void {
    const player = this.sfxPlayers.get(key);
    if (player) {
      player.stop();
      player.start();
    }
  }

  duckMusic(amount: number = 0.3, duration: number = 0.2): void {
    if (this.currentMusic) {
      const player = this.musicPlayers.get(this.currentMusic);
      if (player) {
        player.volume.rampTo(Tone.gainToDb(amount), duration);
      }
    }
  }

  restoreMusic(duration: number = 0.2): void {
    if (this.currentMusic) {
      const player = this.musicPlayers.get(this.currentMusic);
      if (player) {
        player.volume.rampTo(Tone.gainToDb(this.musicVolume), duration);
      }
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.musicPlayers.forEach((player) => {
      player.volume.value = Tone.gainToDb(this.musicVolume);
    });
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sfxPlayers.forEach((player) => {
      player.volume.value = Tone.gainToDb(this.sfxVolume);
    });
  }

  generateBeep(frequency: number = 800, duration: number = 0.05, volume: number = 0.1): void {
    const osc = new Tone.Oscillator(frequency, 'square').toDestination();
    osc.volume.value = Tone.gainToDb(volume);
    osc.start();
    osc.stop(`+${duration}`);
  }

  generateBlip(frequency: number = 1200, duration: number = 0.03): void {
    const osc = new Tone.Oscillator(frequency, 'sine').toDestination();
    osc.volume.value = Tone.gainToDb(0.15);
    osc.start();
    osc.stop(`+${duration}`);
  }
}
