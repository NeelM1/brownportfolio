import { BaseScene } from './BaseScene';

export class Scene3_TitleScreen extends BaseScene {
  private titleText!: Phaser.GameObjects.Text;
  private pressStartText!: Phaser.GameObjects.Text;

  constructor() {
    super('Scene3_TitleScreen');
  }

  protected loadAssets(): void {
    this.load.image('title_bg', 'sprites/title_bg.png');
    this.load.image('title_logo', 'sprites/title_logo.png');
    this.load.audio('title_music', 'audio/title_music.mp3');
    this.load.audio('select_sound', 'audio/select.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x0a0a1a);

    const timeline = this.getTimeline();
    timeline.addLabel('scene3_start');

    const stars = this.add.container();
    for (let i = 0; i < 50; i++) {
      const star = this.add.rectangle(
        Math.random() * this.scale.width,
        Math.random() * this.scale.height,
        Math.random() * 2 + 1,
        Math.random() * 2 + 1,
        0xffffff,
        Math.random() * 0.5 + 0.5
      );
      stars.add(star);
    }
    stars.setDepth(1);

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('title_music', true);
    });

    this.titleText = this.createCenteredText(80, 'BROWN UNIVERSITY', {
      fontSize: '16px',
      color: '#8B4513',
      fontStyle: 'bold'
    });
    this.titleText.setAlpha(0);

    timeline.to(this.titleText, {
      alpha: 1,
      duration: 1,
      ease: 'power2.out'
    });

    void this.animationOrchestrator.bounceSprite(this.titleText, 10, 1.5);

    this.pressStartText = this.createCenteredText(140, 'PRESS START', {
      fontSize: '10px',
      color: '#ffff00'
    });
    this.pressStartText.setAlpha(0);

    timeline.to(this.pressStartText, {
      alpha: 1,
      duration: 0.5,
      delay: 0.5
    });

    const blinkTimeline = gsap.timeline({ repeat: -1 });
    blinkTimeline.to(this.pressStartText, {
      alpha: 0.3,
      duration: 0.5,
      ease: 'none'
    });
    blinkTimeline.to(this.pressStartText, {
      alpha: 1,
      duration: 0.5,
      ease: 'none'
    });

    timeline.to({}, { duration: 2 });

    timeline.call(() => {
      this.fakeInteraction.showCursor(50, 200);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.add(this.fakeInteraction.moveCursorTo(this.scale.width / 2, 140, 0.5, 'power1.inOut'));
    timeline.to({}, { duration: 0.3 });

    timeline.call(() => {
      this.playSFX('select_sound');
      this.pressStartText.setColor('#ffffff');
      setTimeout(() => this.pressStartText.setColor('#ffff00'), 200);
    });

    timeline.add(this.fakeInteraction.click(this.scale.width / 2, 140, 0.1));

    timeline.call(() => {
      blinkTimeline.kill();
      this.pressStartText.setAlpha(0);
    });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.call(() => {
      this.stopMusic(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene4_StartingRoom');
    });

    timeline.addLabel('scene3_end');
  }

  protected setupTimeline(): void {}
}
