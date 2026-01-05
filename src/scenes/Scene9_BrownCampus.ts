import { BaseScene } from './BaseScene';

export class Scene9_BrownCampus extends BaseScene {
  private player!: Phaser.GameObjects.Sprite;

  constructor() {
    super('Scene9_BrownCampus');
  }

  protected loadAssets(): void {
    this.load.image('campus_bg', 'sprites/campus_bg.png');
    this.load.image('tree', 'sprites/tree.png');
    this.load.image('building', 'sprites/building.png');
    this.load.image('path', 'sprites/path.png');
    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.audio('campus_music', 'audio/campus_music.mp3');
    this.load.audio('birds', 'audio/birds.mp3');
    this.load.audio('footstep', 'audio/footstep.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x3d5c3d);

    const timeline = this.getTimeline();
    timeline.addLabel('scene9_start');

    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'campus_bg');
    bg.setScale(1.5);

    const trees = [
      { x: 40, y: 60 },
      { x: 280, y: 70 },
      { x: 50, y: 180 },
      { x: 270, y: 190 }
    ];

    trees.forEach((treePos) => {
      void this.createSprite({ key: 'tree', x: treePos.x, y: treePos.y, scale: 1, depth: 6 });
    });

    const buildings = [
      { x: 160, y: 50, scale: 0.8 },
      { x: 80, y: 200, scale: 0.6 },
      { x: 240, y: 200, scale: 0.6 }
    ];

    buildings.forEach((buildingPos) => {
      void this.createSprite({ 
        key: 'building', 
        x: buildingPos.x, 
        y: buildingPos.y, 
        scale: buildingPos.scale, 
        depth: 5 
      });
    });

    const paths = [
      { x: 160, y: 120, width: 20, height: 100 },
      { x: 100, y: 150, width: 120, height: 20 }
    ];

    paths.forEach((path) => {
      const pathSprite = this.add.rectangle(
        path.x,
        path.y,
        path.width,
        path.height,
        0x8b7355,
        0.6
      );
      pathSprite.setDepth(4);
    });

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('campus_music', true);
      this.playSFX('birds');
    });

    this.player = this.createSprite({ key: 'player', x: 60, y: 200, scale: 1, alpha: 0, depth: 10 });

    timeline.to(this.player, {
      alpha: 1,
      duration: 0.5
    });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'And here we are.', speed: 50 },
          { speaker: 'Neel', text: 'Brown University.', speed: 50 },
          { speaker: 'Neel', text: 'This feels like the final level — but also, a new beginning.', speed: 35 },
          { speaker: 'Neel', text: 'At Brown, I\'m ready to do what I\'ve always done.', speed: 35 },
          { speaker: 'Neel', text: 'Explore. Experiment. Create.', speed: 40 },
          { speaker: 'Neel', text: 'Keep building. Keep learning. And keep gaming.', speed: 40 }
        ]
      });
    });

    timeline.to({}, { duration: 12 });

    const walkPath = [
      { x: 90, y: 185 },
      { x: 130, y: 160 },
      { x: 160, y: 140 },
      { x: 180, y: 120 },
      { x: 160, y: 100 },
      { x: 140, y: 90 },
      { x: 160, y: 120 }
    ];

    walkPath.forEach((point, index) => {
      timeline.to(this.player, {
        x: point.x,
        y: point.y,
        duration: 0.8,
        ease: 'none',
        onStart: () => {
          if (index % 2 === 0) {
            this.playSFX('footstep');
          }
        }
      });
    });

    timeline.call(() => {
      this.animationOrchestrator.cameraPan(160, 120, 1.5);
    });

    timeline.call(() => {
      this.animationOrchestrator.particleEffect(160, 120, 15, 1);
      this.playSFX('birds');
    });

    timeline.to({}, { duration: 2 });

    timeline.call(() => {
      this.dialogueSystem.show({
        lines: [
          { speaker: 'Neel', text: 'This isn\'t just a dream.', speed: 50 },
          { speaker: 'Neel', text: 'This is the next quest.', speed: 50 },
          { speaker: 'Neel', text: 'And I\'m ready to play.', speed: 50 }
        ]
      });
    });

    timeline.to({}, { duration: 6 });

    timeline.call(() => {
      this.fadeOut(1);
    });

    timeline.call(() => {
      this.stopMusic(1);
    });

    timeline.to({}, { duration: 1 });

    timeline.call(() => {
      this.scene.start('Scene10_EndScreen');
    });

    timeline.addLabel('scene9_end');
  }

  protected setupTimeline(): void {}
}
