import { BaseScene } from './BaseScene';

export class Scene10_EndScreen extends BaseScene {
  constructor() {
    super('Scene10_EndScreen');
  }

  protected loadAssets(): void {
    this.load.audio('outro_music', 'audio/outro_music.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x000000);

    const timeline = this.getTimeline();
    timeline.addLabel('scene10_start');

    timeline.call(() => {
      this.fadeIn(1);
    });

    timeline.call(() => {
      this.playMusic('outro_music', false);
    });

    const thanksText = this.createCenteredText(80, '', { fontSize: '14px' });
    thanksText.setAlpha(0);

    timeline.call(() => {
      thanksText.setAlpha(1);
      this.animationOrchestrator.textTyping(
        thanksText,
        'Thanks for playing.',
        2,
        50
      );
    });

    timeline.to({}, { duration: 3 });

    const signatureText = this.createCenteredText(110, '', { fontSize: '10px', color: '#888888' });
    signatureText.setAlpha(0);

    timeline.call(() => {
      signatureText.setAlpha(1);
      this.animationOrchestrator.textTyping(
        signatureText,
        '— Neel Marripalapu',
        1.5,
        50
      );
    });

    timeline.to({}, { duration: 2.5 });

    const creditsTitle = this.createCenteredText(150, 'CREDITS', {
      fontSize: '12px',
      color: '#ffff00',
      fontStyle: 'bold'
    });
    creditsTitle.setAlpha(0);

    timeline.to(creditsTitle, {
      alpha: 1,
      duration: 0.5
    });

    const creditsLines = [
      { text: 'Game Framework: Phaser 3', y: 170 },
      { text: 'Animation: GSAP', y: 185 },
      { text: 'Audio Engine: Tone.js', y: 200 },
      { text: 'State Management: Zustand', y: 215 },
      { text: '', y: 230 },
      { text: 'Assets from:', y: 245 },
      { text: 'Kenney.nl (CC0)', y: 260 },
      { text: 'OpenGameArt (CC0)', y: 275 },
      { text: 'Incompetech (CC0 Music)', y: 290 },
      { text: 'Freepd.com (8-bit Music)', y: 305 },
      { text: 'Google Fonts (Press Start 2P)', y: 320 },
      { text: '', y: 335 },
      { text: 'Built with TypeScript + Vite', y: 350 },
      { text: '© 2024 Neel Marripalapu', y: 365 }
    ];

    const creditTexts: Phaser.GameObjects.Text[] = [];

    creditsLines.forEach((line, index) => {
      const creditText = this.createText(
        this.scale.width / 2,
        line.y,
        line.text,
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '8px',
          color: '#aaaaaa'
        }
      );
      creditText.setOrigin(0.5, 0);
      creditText.setAlpha(0);
      creditTexts.push(creditText);

      timeline.to(creditText, {
        alpha: 1,
        duration: 0.3,
        delay: index * 0.2
      }, 'credits_start');
    });

    timeline.addLabel('credits_start');

    timeline.to({}, { duration: 5 });

    timeline.call(() => {
      const scrollTimeline = gsap.timeline();
      scrollTimeline.to([thanksText, signatureText, creditsTitle], {
        y: '-=100',
        duration: 4,
        ease: 'none'
      });
      creditTexts.forEach((text) => {
        scrollTimeline.to(text, {
          y: '-=100',
          duration: 4,
          ease: 'none'
        }, '<');
      });
    });

    timeline.to({}, { duration: 4 });

    timeline.call(() => {
      this.fadeOut(2);
    });

    timeline.call(() => {
      this.stopMusic(2);
    });

    timeline.to({}, { duration: 2 });

    timeline.call(() => {
      console.log('Cutscene complete!');
    });

    timeline.addLabel('scene10_end');
  }

  protected setupTimeline(): void {}
}
