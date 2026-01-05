import { BaseScene } from './BaseScene';

export class Scene1_RealWorldIntro extends BaseScene {
  constructor() {
    super('Scene1_RealWorldIntro');
  }

  protected loadAssets(): void {
    this.load.image('robotics', 'sprites/robotics.png');
    this.load.image('coding', 'sprites/coding.png');
    this.load.image('tinkering', 'sprites/tinkering.png');
    this.load.image('glitch', 'sprites/glitch.png');
    this.load.audio('dialogue_beep', 'audio/dialogue_beep.mp3');
    this.load.audio('glitch_sound', 'audio/glitch.mp3');
    this.load.audio('suspense', 'audio/suspense.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x000000);

    const timeline = this.getTimeline();
    timeline.addLabel('scene1_start');

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.to({}, { duration: 1 });

    const text1 = this.createCenteredText(80, '', { fontSize: '14px' });
    
    timeline.to({}, {
      duration: 0.1,
      onStart: () => {
        this.animationOrchestrator.textTyping(
          text1,
          'Hey, Brown University.',
          2,
          50
        );
      }
    });

    timeline.to({}, { duration: 2.5 });

    const text2 = this.createCenteredText(110, '', { fontSize: '12px' });
    text2.setVisible(false);

    timeline.call(() => {
      text2.setVisible(true);
      this.animationOrchestrator.textTyping(
        text2,
        'My name is Neel Marripalapu...',
        2.5,
        50
      );
    });

    timeline.to({}, { duration: 3 });

    const text3 = this.createCenteredText(140, '', { fontSize: '12px' });
    text3.setVisible(false);

    timeline.call(() => {
      text3.setVisible(true);
      this.animationOrchestrator.textTyping(
        text3,
        'This... is my Brown application.',
        2,
        50
      );
    });

    timeline.to({}, { duration: 2.5 });

    const robotics = this.createSprite({ key: 'robotics', x: 50, y: 200, scale: 1.5, alpha: 0 });
    const coding = this.createSprite({ key: 'coding', x: 120, y: 200, scale: 1.5, alpha: 0 });
    const tinkering = this.createSprite({ key: 'tinkering', x: 190, y: 200, scale: 1.5, alpha: 0 });

    timeline.to(robotics, { alpha: 1, duration: 0.5 });
    timeline.to(coding, { alpha: 1, duration: 0.5 }, '<0.2');
    timeline.to(tinkering, { alpha: 1, duration: 0.5 }, '<0.2');

    this.animationOrchestrator.cameraPan(160, 150, 2);

    const text4 = this.createCenteredText(60, '', { fontSize: '10px', color: '#ffff00' });
    text4.setVisible(false);

    timeline.call(() => {
      text4.setVisible(true);
      this.animationOrchestrator.textTyping(
        text4,
        'On the surface, you\'ll see what I love...',
        2,
        50
      );
    });

    timeline.to({}, { duration: 2.5 });

    const glitch = this.createSprite({ key: 'glitch', x: 280, y: 30, scale: 0.5, alpha: 0 });
    
    timeline.call(() => {
      glitch.alpha = 0;
    });

    for (let i = 0; i < 5; i++) {
      timeline.to(glitch, { alpha: 0.8, duration: 0.05 });
      timeline.to(glitch, { alpha: 0, duration: 0.05 });
    }

    timeline.call(() => {
      this.playSFX('glitch_sound');
    });

    this.shakeScreen(10, 0.3);

    timeline.call(() => {
      text4.setText('But wait... what\'s that in the corner?');
    });

    timeline.to({}, { duration: 1.5 });

    const text5 = this.createCenteredText(120, 'AAAH!', { fontSize: '24px', color: '#ff0000' });
    text5.setVisible(false);

    timeline.call(() => {
      text5.setVisible(true);
      this.shakeScreen(20, 0.5);
      this.playSFX('glitch_sound');
    });

    timeline.to(text5, {
      scale: 1.5,
      duration: 0.1,
      yoyo: true,
      repeat: 3
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene2_GameInterruption');
    });

    timeline.addLabel('scene1_end');
  }

  protected setupTimeline(): void {}
}
