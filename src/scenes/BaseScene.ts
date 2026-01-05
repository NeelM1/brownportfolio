import Phaser from 'phaser';
import { DialogueSystem } from '../systems/DialogueSystem';
import { AnimationOrchestrator } from '../systems/AnimationOrchestrator';
import { FakeInteractionSystem } from '../systems/FakeInteractionSystem';
import { AudioEngine } from '../systems/AudioEngine';
import type { SpriteConfig } from '../types';

export abstract class BaseScene extends Phaser.Scene {
  protected dialogueSystem!: DialogueSystem;
  protected animationOrchestrator!: AnimationOrchestrator;
  protected fakeInteraction!: FakeInteractionSystem;
  protected audioEngine!: AudioEngine;

  constructor(key: string) {
    super({ key });
  }

  preload(): void {
    this.loadAssets();
    this.loadDefaultAssets();
  }

  create(): void {
    this.initializeSystems();
    this.createScene();
    this.setupTimeline();
  }

  update(): void {
    this.updateScene();
  }

  protected abstract loadAssets(): void;
  protected abstract createScene(): void;
  protected abstract setupTimeline(): void;
  protected updateScene(): void {}

  private loadDefaultAssets(): void {
    this.load.setPath('assets');
  }

  private initializeSystems(): void {
    this.dialogueSystem = new DialogueSystem(this);
    this.animationOrchestrator = AnimationOrchestrator.getInstance();
    if (!this.animationOrchestrator['scene']) {
      this.animationOrchestrator.initialize(this);
    }
    this.fakeInteraction = new FakeInteractionSystem(this);
    this.audioEngine = AudioEngine.getInstance();
  }

  protected loadSprite(key: string, path: string): void {
    this.load.image(key, path);
  }

  protected loadSpriteSheet(
    key: string,
    path: string,
    frameWidth: number,
    frameHeight: number,
    frameConfig?: Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig
  ): void {
    this.load.spritesheet(key, path, {
      frameWidth,
      frameHeight,
      ...frameConfig
    });
  }

  protected loadTilemap(key: string, path: string): void {
    this.load.tilemapTiledJSON(key, path);
  }

  protected loadAudio(key: string, path: string): void {
    this.load.audio(key, [path]);
  }

  protected loadFont(key: string, path: string): void {
    this.load.bitmapFont(key, path);
  }

  protected createSprite(config: SpriteConfig): Phaser.GameObjects.Sprite {
    const sprite = this.add.sprite(
      config.x,
      config.y,
      config.key,
      config.frame
    );
    
    if (config.scale !== undefined) {
      sprite.setScale(config.scale);
    }
    
    if (config.alpha !== undefined) {
      sprite.setAlpha(config.alpha);
    }
    
    if (config.depth !== undefined) {
      sprite.setDepth(config.depth);
    }
    
    if (config.originX !== undefined && config.originY !== undefined) {
      sprite.setOrigin(config.originX, config.originY);
    }

    return sprite;
  }

  protected createTilemap(tilemapKey: string, tilesetKey: string): Phaser.Tilemaps.Tilemap {
    const tilemap = this.make.tilemap({ key: tilemapKey });
    void tilemap.addTilesetImage(tilesetKey);
    return tilemap;
  }

  protected createAnimatedSprite(
    key: string,
    x: number,
    y: number,
    frameRate: number = 8,
    repeat: number = -1
  ): Phaser.GameObjects.Sprite {
    const sprite = this.add.sprite(x, y, key);
    sprite.play({ key: `${key}_idle`, frameRate, repeat });
    return sprite;
  }

  protected createCharacter(
    key: string,
    x: number,
    y: number,
    _direction: 'down' | 'left' | 'right' | 'up' = 'down'
  ): Phaser.GameObjects.Sprite {
    const sprite = this.add.sprite(x, y, key);
    sprite.setFrame(0);
    return sprite;
  }

  protected showDialogue(
    speaker: string,
    text: string,
    speed?: number
  ): void {
    this.dialogueSystem.show({
      lines: [{ speaker, text, speed }]
    });
  }

  protected hideDialogue(): void {
    this.dialogueSystem.hide();
  }

  protected playAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animationKey: string
  ): void {
    sprite.play(animationKey);
  }

  protected stopAnimation(sprite: Phaser.GameObjects.Sprite): void {
    sprite.stop();
  }

  protected setCameraBounds(width: number, height: number): void {
    this.cameras.main.setBounds(0, 0, width, height);
  }

  protected centerCameraOn(x: number, y: number): void {
    this.cameras.main.centerOn(x, y);
  }

  protected fadeIn(duration: number = 0.5): void {
    this.cameras.main.fadeIn(duration * 1000, 0, 0, 0);
  }

  protected fadeOut(duration: number = 0.5): void {
    this.cameras.main.fadeOut(duration * 1000, 0, 0, 0);
  }

  protected delay(duration: number): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(duration * 1000, resolve);
    });
  }

  protected createBackground(color: number = 0x000000): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      color
    );
  }

  protected createText(
    x: number,
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    const defaultStyle = {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#ffffff',
      ...style
    };

    return this.add.text(x, y, text, defaultStyle);
  }

  protected createCenteredText(
    y: number,
    text: string,
    style?: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    const textObj = this.createText(0, y, text, style);
    textObj.setOrigin(0.5, 0.5);
    textObj.setX(this.scale.width / 2);
    return textObj;
  }

  protected getTimeline(): gsap.core.Timeline {
    return this.animationOrchestrator.getTimeline();
  }

  protected playMusic(key: string, loop: boolean = true): void {
    this.audioEngine.playMusic(key, loop);
  }

  protected stopMusic(fadeDuration: number = 0.5): void {
    this.audioEngine.stopMusic(fadeDuration);
  }

  protected playSFX(key: string): void {
    this.audioEngine.playSFX(key);
  }

  protected shakeScreen(intensity: number = 5, duration: number = 0.5): void {
    const shake = this.animationOrchestrator.cameraShake(intensity, duration);
    this.getTimeline().add(shake);
  }
}
