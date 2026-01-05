import { BaseScene } from './BaseScene';

export class Scene4_StartingRoom extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;

  constructor() {
    super('Scene4_StartingRoom');
  }

  protected loadAssets(): void {
    this.load.image('bedroom_bg', 'sprites/bedroom_bg.png');
    this.load.image('bed', 'sprites/bed.png');
    this.load.image('desk', 'sprites/desk.png');
    this.load.image('pc', 'sprites/pc.png');
    this.load.image('poster', 'sprites/poster.png');
    this.load.image('door', 'sprites/door.png');
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('room_music', 'audio/room_music.mp3');
    this.load.audio('door_open', 'audio/door_open.mp3');
    this.load.audio('footstep', 'audio/footstep.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x2d1b4e);

    const timeline = this.getTimeline();
    timeline.addLabel('scene4_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bedroom_bg');
    bg.setScale(1.5);
    bg.setDepth(0);

    void this.createSprite({ key: 'bed', x: 50, y: 80, scale: 1.2, depth: 5 });
    void this.createSprite({ key: 'desk', x: 220, y: 70, scale: 1.2, depth: 5 });
    void this.createSprite({ key: 'pc', x: 220, y: 50, scale: 1, depth: 6 });
    void this.createSprite({ key: 'poster', x: 120, y: 40, scale: 0.8, depth: 5 });
    const door = this.createSprite({ key: 'door', x: 160, y: 35, scale: 1, depth: 5 });

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('room_music', true);
    });

    this.player = this.createSprite({ key: 'player', x: 100, y: 150, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 1
    });

    timeline.to({}, { duration: 1 });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'Wait... am I inside a game?', speed: 40 },
          { speaker: '', text: '...', speed: 60, sfx: 'beep' },
          { speaker: 'Neel', text: 'Whatever. Hey Brown — on the inside, I\'ve always been a gamer.', speed: 40 },
          { speaker: 'Neel', text: 'Gaming isn\'t just entertainment. It\'s how I think, how I learn, how I connect.', speed: 35 },
          { speaker: 'Neel', text: 'It started with Snake on an old Nokia phone...', speed: 40 },
          { speaker: 'Neel', text: 'Then moved to building worlds in Roblox...', speed: 40 },
          { speaker: 'Neel', text: 'Hundreds of hours strategizing with friends...', speed: 40 },
          { speaker: 'Neel', text: 'Every game taught me something new about systems, creativity, and collaboration.', speed: 35 },
          { speaker: 'Neel', text: 'Let me show you...', speed: 50 }
        ]
      });
    });

    timeline.to({}, { duration: 20 });

    timeline.call(() => {
      this.playSFX('footstep');
    });

    const walkPath = [
      { x: 120, y: 150 },
      { x: 140, y: 140 },
      { x: 150, y: 130 },
      { x: 155, y: 80 }
    ];

    walkPath.forEach((point, index) => {
      timeline.to(this.player, {
        x: point.x,
        y: point.y,
        duration: 0.8,
        ease: 'none',
        onStart: () => {
          if (index < walkPath.length - 1) {
            this.playSFX('footstep');
          }
        }
      });
    });

    timeline.to({}, { duration: 0.3 });

    timeline.call(() => {
      this.playSFX('door_open');
      door.setFrame(1);
    });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene5_SnakeWorld');
    });

    timeline.addLabel('scene4_end');
  }

  protected setupTimeline(): void {}
}
