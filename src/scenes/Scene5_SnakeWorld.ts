import { BaseScene } from './BaseScene';

export class Scene5_SnakeWorld extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;
  private snake!: Phaser.GameObjects.Sprite;
  private apple!: Phaser.GameObjects.Sprite;

  constructor() {
    super('Scene5_SnakeWorld');
  }

  protected loadAssets(): void {
    this.load.image('snake_bg', 'sprites/snake_bg.png');
    this.load.spritesheet('snake', 'sprites/snake.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('apple', 'sprites/apple.png', {
      frameWidth: 12,
      frameHeight: 12
    });
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('snake_music', 'audio/snake_music.mp3');
    this.load.audio('eat_sound', 'audio/eat.mp3');
    this.load.audio('slither', 'audio/slither.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x0a1a0a);

    const timeline = this.getTimeline();
    timeline.addLabel('scene5_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'snake_bg');
    bg.setScale(1.5);

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('snake_music', true);
    });

    this.player = this.createSprite({ key: 'player', x: 160, y: 140, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 0.5
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'It all started here — Snake.', speed: 40 },
          { speaker: 'Neel', text: 'The simple game that first pulled me into coding.', speed: 40 },
          { speaker: 'Neel', text: 'I didn\'t know it then, but...', speed: 50 },
          { speaker: 'Neel', text: 'This green line on a screen changed everything.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 8 });

    this.snake = this.createSprite({ key: 'snake', x: 80, y: 120, scale: 1.5, alpha: 0 });
    this.apple = this.createSprite({ key: 'apple', x: 200, y: 100, scale: 1.5, alpha: 0 });

    timeline.call(() => {
      this.snake.setAlpha(1);
      this.apple.setAlpha(1);
      this.playSFX('slither');
    });

    const snakePath = [
      { x: 100, y: 120 },
      { x: 120, y: 110 },
      { x: 140, y: 100 },
      { x: 160, y: 90 },
      { x: 180, y: 95 },
      { x: 200, y: 100 }
    ];

    snakePath.forEach((point, index) => {
      timeline.to(this.snake, {
        x: point.x,
        y: point.y,
        duration: 0.4,
        ease: 'none',
        onStart: () => {
          if (index < snakePath.length - 1) {
            this.playSFX('slither');
          }
        }
      });
    });

    timeline.call(() => {
      this.playSFX('eat_sound');
      this.animationOrchestrator.particleEffect(200, 100, 8, 0.5);
      this.apple.setAlpha(0);
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'That simple "eat and grow" mechanic...', speed: 40 },
          { speaker: 'Neel', text: 'It led me to Python.', speed: 50 },
          { speaker: 'Neel', text: 'Which I originally thought was an actual snake.', speed: 40 },
          { speaker: 'Neel', text: 'But I learned. And kept learning.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 6 });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene6_ScratchWorld');
    });

    timeline.addLabel('scene5_end');
  }

  protected setupTimeline(): void {}
}
