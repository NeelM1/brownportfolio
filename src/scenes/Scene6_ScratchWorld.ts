import { BaseScene } from './BaseScene';

export class Scene6_ScratchWorld extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;
  private blocks: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super('Scene6_ScratchWorld');
  }

  protected loadAssets(): void {
    this.load.image('scratch_bg', 'sprites/scratch_bg.png');
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('scratch_music', 'audio/scratch_music.mp3');
    this.load.audio('block_snap', 'audio/block_snap.mp3');
    this.load.audio('move_sound', 'audio/move.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x4e2d6e);

    const timeline = this.getTimeline();
    timeline.addLabel('scene6_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'scratch_bg');
    bg.setScale(1.5);

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('scratch_music', true);
    });

    this.player = this.createSprite({ key: 'player', x: 160, y: 180, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 0.5
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'Then came Scratch.', speed: 40 },
          { speaker: 'Neel', text: 'Drag blocks. Move a character. Create outcomes.', speed: 40 },
          { speaker: 'Neel', text: 'Scratch showed me how creativity and logic connect.', speed: 40 },
          { speaker: 'Neel', text: 'Each block was a different path — like Brown\'s Open Curriculum.', speed: 35 },
          { speaker: 'Neel', text: 'Leading to different... or even the same outcomes.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 10 });

    const blockColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];
    
    for (let i = 0; i < 5; i++) {
      const block = this.add.rectangle(
        30 + i * 55,
        220,
        45,
        20,
        blockColors[i],
        0.8
      );
      block.setStrokeStyle(2, 0xffffff);
      block.setAlpha(0);
      block.setDepth(5 + i);
      this.blocks.push(block);
    }

    this.blocks.forEach((block, index) => {
      timeline.to(block, {
        alpha: 1,
        duration: 0.3,
        ease: 'back.out(1.5)',
        onStart: () => {
          this.playSFX('block_snap');
        }
      }, `>${index * 0.4}`);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'See how they fit together?', speed: 40 },
          { speaker: 'Neel', text: 'Motion. Looks. Sound. Events.', speed: 40 },
          { speaker: 'Neel', text: 'Building worlds, one block at a time.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 6 });

    this.blocks.forEach((block) => {
      timeline.to(block, {
        y: block.y - 80,
        duration: 1,
        ease: 'power1.inOut'
      });
    });

    const platformY = 100;

    timeline.to(this.player, {
      x: 30,
      y: platformY + 20,
      duration: 0.5,
      ease: 'power1.inOut'
    });

    this.blocks.forEach((block, _index) => {
      timeline.to(this.player, {
        x: block.x,
        y: platformY,
        duration: 0.4,
        ease: 'none',
        onStart: () => {
          this.playSFX('move_sound');
          void this.animationOrchestrator.bounceSprite(this.player, 8, 0.2);
        }
      });
    });

    timeline.to(this.player, {
      x: 280,
      y: platformY + 20,
      duration: 0.5,
      ease: 'power1.inOut'
    });

    timeline.call(() => {
      this.animationOrchestrator.cameraPan(160, 120, 2);
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'At Brown, I want to keep building like this.', speed: 40 },
          { speaker: 'Neel', text: 'Exploring different paths, making connections.', speed: 40 },
          { speaker: 'Neel', text: 'Creating something greater than the sum of its parts.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 7 });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene7_RobloxEra');
    });

    timeline.addLabel('scene6_end');
  }

  protected setupTimeline(): void {}
}
