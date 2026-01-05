import { BaseScene } from './BaseScene';

export class Scene8_Multiplayer extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;
  private friends: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('Scene8_Multiplayer');
  }

  protected loadAssets(): void {
    this.load.image('roblox_bg', 'sprites/roblox_bg.png');
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('friend1', 'sprites/friend1.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('friend2', 'sprites/friend2.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('friend3', 'sprites/friend3.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('friend4', 'sprites/friend4.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('multiplayer_music', 'audio/multiplayer_music.mp3');
    this.load.audio('cheer', 'audio/cheer.mp3');
    this.load.audio('emote', 'audio/emote.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x1e3a5f);

    const timeline = this.getTimeline();
    timeline.addLabel('scene8_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'roblox_bg');
    bg.setScale(1.5);

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('multiplayer_music', true);
    });

    const playerX = 160;
    const playerY = 160;

    this.player = this.createSprite({ key: 'player', x: playerX, y: playerY, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 0.5
    });

    const friendConfigs = [
      { key: 'friend1', x: 80, y: 100, delay: 0.3 },
      { key: 'friend2', x: 240, y: 100, delay: 0.5 },
      { key: 'friend3', x: 80, y: 200, delay: 0.7 },
      { key: 'friend4', x: 240, y: 200, delay: 0.9 }
    ];

    friendConfigs.forEach((config) => {
      const friend = this.createSprite({ key: config.key, x: config.x, y: config.y, scale: 1, alpha: 0, depth: 8 });
      this.friends.push(friend);
    });

    this.friends.forEach((friend, index) => {
      timeline.to(friend, {
        alpha: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
        delay: friendConfigs[index].delay
      });
    });

    timeline.call(() => {
      this.playSFX('cheer');
    });

    timeline.to({}, { duration: 1 });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'But this journey was never solo.', speed: 40 },
          { speaker: 'Neel', text: 'My friends and I spent hundreds of hours together.', speed: 35 },
          { speaker: 'Neel', text: 'Learning strategies. Solving problems. Improving together.', speed: 35 },
          { speaker: 'Neel', text: 'Every win, every loss — we shared them all.', speed: 40 },
          { speaker: 'Neel', text: 'Games taught me teamwork. Communication. Leadership.', speed: 35 }
        ]
      });
    });

    timeline.to({}, { duration: 12 });

    const centerPoint = { x: 160, y: 150 };

    [this.player, ...this.friends].forEach((sprite, index) => {
      timeline.to(sprite, {
        x: centerPoint.x + (index - 2) * 40,
        y: centerPoint.y + (index % 2 === 0 ? -20 : 20),
        duration: 1,
        ease: 'power1.inOut'
      });
    });

    timeline.call(() => {
      this.playSFX('emote');
    });

    [this.player, ...this.friends].forEach((sprite) => {
      this.animationOrchestrator.bounceSprite(sprite, 8, 0.4);
    });

    timeline.call(() => {
      this.animationOrchestrator.cameraZoom(0.8, 1);
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'At Brown, I want to find that same community.', speed: 40 },
          { speaker: 'Neel', text: 'People to learn with. People to grow with.', speed: 40 },
          { speaker: 'Neel', text: 'People to make amazing things with.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 8 });

    timeline.call(() => {
      this.animationOrchestrator.cameraZoom(1, 0.5);
    });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene9_BrownCampus');
    });

    timeline.addLabel('scene8_end');
  }

  protected setupTimeline(): void {}
}
