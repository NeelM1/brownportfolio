import { BaseScene } from './BaseScene';

export class Scene2_GameInterruption extends BaseScene {
  constructor() {
    super('Scene2_GameInterruption');
  }

  protected loadAssets(): void {
    this.load.image('window_chrome', 'sprites/window_chrome.png');
    this.load.image('loading_bar', 'sprites/loading_bar.png');
    this.load.image('click_to_play', 'sprites/click_to_play.png');
    this.load.audio('loading_sound', 'audio/loading.mp3');
    this.load.audio('click_sound', 'audio/click.mp3');
  }

  protected createScene(): void {
    this.createBackground(0x1a1a2e);

    const timeline = this.getTimeline();
    timeline.addLabel('scene2_start');

    const windowWidth = 260;
    const windowHeight = 180;
    const windowX = (this.scale.width - windowWidth) / 2;
    const windowY = (this.scale.height - windowHeight) / 2 - 50;

    const gameWindow = this.add.container(windowX, -windowHeight);
    gameWindow.setDepth(100);

    const chrome = this.add.rectangle(0, 0, windowWidth, windowHeight, 0x2d2d44);
    chrome.setStrokeStyle(3, 0x4a4a6a);
    gameWindow.add(chrome);

    const titleBar = this.add.rectangle(0, -windowHeight / 2 + 15, windowWidth - 6, 25, 0x4a4a6a);
    gameWindow.add(titleBar);

    const closeBtn = this.add.rectangle(windowWidth / 2 - 15, -windowHeight / 2 + 15, 12, 12, 0xff6b6b);
    gameWindow.add(closeBtn);

    const minimizeBtn = this.add.rectangle(windowWidth / 2 - 30, -windowHeight / 2 + 15, 12, 12, 0xffd93d);
    gameWindow.add(minimizeBtn);

    const windowTitle = this.add.text(0, -windowHeight / 2 + 15, 'Portfolio.exe', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    windowTitle.setOrigin(0, 0.5);
    gameWindow.add(windowTitle);

    timeline.to(gameWindow, {
      y: windowY,
      duration: 1,
      ease: 'back.out(0.5)'
    });

    timeline.to({}, { duration: 0.5 });

    const loadingText = this.add.text(0, -20, 'Loading...', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);
    gameWindow.add(loadingText);

    const barBg = this.add.rectangle(0, 10, 200, 20, 0x1a1a2e);
    barBg.setStrokeStyle(2, 0x4a4a6a);
    gameWindow.add(barBg);

    const barFill = this.add.rectangle(-98, 10, 4, 14, 0x00ff88);
    barFill.setOrigin(0, 0.5);
    gameWindow.add(barFill);

    const percentageText = this.add.text(0, 35, '0%', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#00ff88'
    });
    percentageText.setOrigin(0.5);
    gameWindow.add(percentageText);

    timeline.call(() => {
      this.playSFX('loading_sound');
    });

    const loadSteps = [
      { progress: 0.1, text: 'Loading assets...' },
      { progress: 0.3, text: 'Initializing sprites...' },
      { progress: 0.5, text: 'Loading audio...' },
      { progress: 0.7, text: 'Preparing cutscenes...' },
      { progress: 0.9, text: 'Almost ready...' },
      { progress: 1.0, text: 'Ready!' }
    ];

    loadSteps.forEach((step, index) => {
      const targetWidth = 196 * step.progress;
      
      timeline.to(barFill, {
        width: targetWidth,
        duration: 0.5,
        ease: 'power1.inOut',
        onStart: () => {
          if (index > 0) {
            loadingText.setText(step.text);
          }
        }
      });

      timeline.call(() => {
        percentageText.setText(`${Math.floor(step.progress * 100)}%`);
      });
    });

    timeline.to({}, { duration: 0.5 });

    loadingText.setText('');

    const playBtn = this.fakeInteraction.createFakeButton(
      0,
      60,
      120,
      35,
      'Click to Play',
      'play_button',
      {
        backgroundColor: 0x4a4a6a,
        textColor: '#00ff88',
        borderColor: 0x00ff88,
        fontSize: '10px'
      }
    );
    gameWindow.add(playBtn);

    timeline.call(() => {
      this.fakeInteraction.showCursor(30, 150);
    });

    timeline.to({}, { duration: 0.5 });

    const btnBounds = playBtn.getBounds();
    const btnCenterX = btnBounds.centerX + windowX;
    const btnCenterY = btnBounds.centerY + windowY;

    timeline.add(this.fakeInteraction.moveCursorTo(btnCenterX, btnCenterY, 0.5, 'power1.inOut'));
    timeline.to({}, { duration: 0.3 });

    timeline.call(() => {
      this.playSFX('click_sound');
      playBtn.setScale(1.1);
      setTimeout(() => playBtn.setScale(1), 100);
    });

    timeline.add(this.fakeInteraction.click(btnCenterX, btnCenterY, 0.1));

    timeline.call(() => {
      this.fadeOut(0.5);
    });

    timeline.to({}, { duration: 0.5 });

    timeline.call(() => {
      this.scene.start('Scene3_TitleScreen');
    });

    timeline.addLabel('scene2_end');
  }

  protected setupTimeline(): void {}
}
