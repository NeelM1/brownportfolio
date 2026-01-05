import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { AnimationOrchestrator } from './systems/AnimationOrchestrator';
import { AudioEngine } from './systems/AudioEngine';
import { useGameStore } from './systems/GameStore';

export class Game {
  private static instance: Game;
  private game!: Phaser.Game;
  private animationOrchestrator: AnimationOrchestrator;
  private audioEngine: AudioEngine;

  private constructor() {
    this.animationOrchestrator = AnimationOrchestrator.getInstance();
    this.audioEngine = AudioEngine.getInstance();
    this.initializeGame();
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  private initializeGame(): void {
    this.game = new Phaser.Game(gameConfig);

    this.game.events.once('ready', () => {
      console.log('Game ready!');
      this.onGameReady();
    });
  }

  private onGameReady(): void {
    console.log('Initializing audio...');
    this.audioEngine['initializeAudio']().catch((error) => {
      console.warn('Audio initialization failed:', error);
    });

    useGameStore.getState().setIsPlaying(true);

    const timeline = this.animationOrchestrator.getTimeline();
    
    timeline.eventCallback('onUpdate', () => {
      const progress = this.animationOrchestrator.getProgress();
      useGameStore.getState().setTimelineProgress(progress);
    });

    timeline.eventCallback('onComplete', () => {
      console.log('Cutscene complete!');
      useGameStore.getState().setIsPlaying(false);
    });

    setTimeout(() => {
      this.startCutscene();
    }, 1000);
  }

  private startCutscene(): void {
    console.log('Starting cutscene...');
    this.animationOrchestrator.play();
  }

  getPhaserGame(): Phaser.Game {
    return this.game;
  }

  getAnimationOrchestrator(): AnimationOrchestrator {
    return this.animationOrchestrator;
  }

  getAudioEngine(): AudioEngine {
    return this.audioEngine;
  }
}

let gameInstance: Game | null = null;

export function initGame(): Game {
  if (!gameInstance) {
    gameInstance = Game.getInstance();
  }
  return gameInstance;
}

export function getGame(): Game {
  if (!gameInstance) {
    throw new Error('Game not initialized. Call initGame() first.');
  }
  return gameInstance;
}

if (import.meta.env.DEV) {
  (window as any).game = () => gameInstance;
  (window as any).getTimeline = () => gameInstance?.getAnimationOrchestrator().getTimeline();
  (window as any).play = () => gameInstance?.getAnimationOrchestrator().play();
  (window as any).pause = () => gameInstance?.getAnimationOrchestrator().pause();
  (window as any).resume = () => gameInstance?.getAnimationOrchestrator().resume();
  (window as any).seek = (time: number) => gameInstance?.getAnimationOrchestrator().seek(time);
}
