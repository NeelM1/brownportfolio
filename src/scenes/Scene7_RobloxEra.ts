import { BaseScene } from './BaseScene';

export class Scene7_RobloxEra extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;
  private npcs: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('Scene7_RobloxEra');
  }

  protected loadAssets(): void {
    this.load.image('roblox_bg', 'sprites/roblox_bg.png');
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('npc1', 'sprites/npc1.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('npc2', 'sprites/npc2.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('npc3', 'sprites/npc3.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('roblox_music', 'audio/roblox_music.mp3');
    this.load.audio('ambient', 'audio/ambient.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x1e3a5f);

    const timeline = this.getTimeline();
    timeline.addLabel('scene7_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'roblox_bg');
    bg.setScale(1.5);

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('roblox_music', true);
    });

    this.player = this.createSprite({ key: 'player', x: 160, y: 140, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 0.5
    });

    const npcConfigs = [
      { key: 'npc1', x: 60, y: 80 },
      { key: 'npc2', x: 240, y: 100 },
      { key: 'npc3', x: 100, y: 180 }
    ];

    npcConfigs.forEach((config) => {
      const npc = this.createSprite({ key: config.key, x: config.x, y: config.y, scale: 1, alpha: 0, depth: 8 });
      this.npcs.push(npc);
    });

    this.npcs.forEach((npc) => {
      timeline.to(npc, {
        alpha: 1,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'In 2018, my cousin introduced me to Roblox and Fortnite.', speed: 35 },
          { speaker: 'Neel', text: 'And everything changed.', speed: 50 },
          { speaker: 'Neel', text: 'These games revealed entire systems...', speed: 40 },
          { speaker: 'Neel', text: '3D worlds. Physics. Shared experiences.', speed: 40 },
          { speaker: 'Neel', text: 'Events like the 2018 Roblox Egg Hunt were game-changing.', speed: 35 },
          { speaker: 'Neel', text: 'Minecraft followed...', speed: 50 },
          { speaker: 'Neel', text: 'I wasn\'t just playing anymore. I was analyzing.', speed: 40 },
          { speaker: 'Neel', text: 'Understanding how worlds work.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 14 });

    const npcAnimations: Phaser.GameObjects.Sprite[] = [...this.npcs];

    npcAnimations.forEach((npc, index) => {
      timeline.to({}, {
        duration: 0.1,
        onStart: () => {
          this.animationOrchestrator.bounceSprite(npc, 5, 0.3);
        }
      }, `>${index * 1.5}`);
    });

    const npcMovements = [
      { npc: 0, x: 80, y: 90 },
      { npc: 1, x: 220, y: 110 },
      { npc: 2, x: 120, y: 160 }
    ];

    npcMovements.forEach((movement) => {
      timeline.to(npcAnimations[movement.npc], {
        x: movement.x,
        y: movement.y,
        duration: 1,
        ease: 'power1.inOut'
      });
    });

    timeline.call(() => {
      this.animationOrchestrator.cameraPan(160, 130, 2);
    });

    timeline.to({}, { duration: 3 });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'Every game taught me something about design, systems, and community.', speed: 35 }
        ]
      });
    });

    timeline.to({}, { duration: 4 });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene8_Multiplayer');
    });

    timeline.addLabel('scene7_end');
  }

  protected setupTimeline(): void {}
}
