import gsap from 'gsap';

export class FakeInteractionSystem {
  private scene: Phaser.Scene;
  private cursorSprite!: Phaser.GameObjects.Sprite;
  private clickEffect: Phaser.GameObjects.Sprite | null = null;
  private clickCallbacks: Map<string, () => void> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createCursor();
  }

  private createCursor(): void {
    this.cursorSprite = this.scene.add.sprite(0, 0, 'cursor');
    this.cursorSprite.setOrigin(0, 0);
    this.cursorSprite.setDepth(10000);
    this.cursorSprite.setVisible(false);
    this.cursorSprite.setScale(2);
  }

  showCursor(x: number = 100, y: number = 100): void {
    this.cursorSprite.setPosition(x, y);
    this.cursorSprite.setVisible(true);
  }

  hideCursor(): void {
    this.cursorSprite.setVisible(false);
  }

  moveCursorTo(
    x: number,
    y: number,
    duration: number = 0.5,
    ease: string = 'power1.inOut',
    onComplete?: () => void
  ): gsap.core.Tween {
    return gsap.to(this.cursorSprite, {
      x: x,
      y: y,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        this.cursorSprite.x = gsap.getProperty(this.cursorSprite, 'x') as number;
        this.cursorSprite.y = gsap.getProperty(this.cursorSprite, 'y') as number;
      },
      onComplete: () => {
        onComplete?.();
      }
    });
  }

  hoverElement(element: Phaser.GameObjects.GameObject, duration: number = 0.3): gsap.core.Tween {
    const bounds = (element as Phaser.GameObjects.Sprite).getBounds();
    const centerX = bounds.centerX;
    const centerY = bounds.centerY;

    return this.moveCursorTo(centerX, centerY, duration, 'power1.inOut');
  }

  click(
    x: number,
    y: number,
    duration: number = 0.1,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();

    timeline.to(this.cursorSprite, {
      scaleX: 1.5,
      scaleY: 1.5,
      duration: duration * 0.5,
      ease: 'power2.out'
    });

    timeline.call(() => {
      this.createClickEffect(x, y);
    });

    timeline.to(this.cursorSprite, {
      scaleX: 2,
      scaleY: 2,
      duration: duration * 0.5,
      ease: 'power2.out'
    });

    timeline.call(() => {
      onComplete?.();
    });

    return timeline;
  }

  clickElement(
    element: Phaser.GameObjects.GameObject,
    duration: number = 0.1,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const bounds = (element as Phaser.GameObjects.Sprite).getBounds();
    const centerX = bounds.centerX;
    const centerY = bounds.centerY;

    return this.click(centerX, centerY, duration, onComplete);
  }

  hoverAndClick(
    element: Phaser.GameObjects.GameObject,
    hoverDuration: number = 0.3,
    clickDuration: number = 0.1,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();

    timeline.add(this.hoverElement(element, hoverDuration));
    timeline.add(this.clickElement(element, clickDuration));
    timeline.call(() => {
      onComplete?.();
    });

    return timeline;
  }

  registerCallback(id: string, callback: () => void): void {
    this.clickCallbacks.set(id, callback);
  }

  triggerCallback(id: string): void {
    const callback = this.clickCallbacks.get(id);
    if (callback) {
      callback();
    }
  }

  private createClickEffect(x: number, y: number): void {
    this.clickEffect = this.scene.add.sprite(x, y, 'click_effect');
    this.clickEffect.setOrigin(0.5, 0.5);
    this.clickEffect.setDepth(9999);
    this.clickEffect.play('click_anim');
    this.clickEffect.once('animationcomplete', () => {
      this.clickEffect?.destroy();
      this.clickEffect = null;
    });
  }

  createFakeButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    id: string,
    style?: {
      backgroundColor?: number;
      textColor?: string;
      borderColor?: number;
      fontSize?: string;
    }
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    container.setDepth(100);

    const bg = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      style?.backgroundColor || 0x000000,
      0.8
    );
    bg.setStrokeStyle(2, style?.borderColor || 0xffffff);
    container.add(bg);

    const buttonText = this.scene.add.text(
      0,
      0,
      text,
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: style?.fontSize || '10px',
        color: style?.textColor || '#ffffff',
        fontStyle: 'bold'
      }
    );
    buttonText.setOrigin(0.5, 0.5);
    container.add(buttonText);

    container.setData('buttonId', id);

    return container;
  }

  createFakeProgressBar(
    x: number,
    y: number,
    width: number,
    height: number,
    fillPercentage: number = 0,
    backgroundColor: number = 0x000000,
    fillColor: number = 0x00ff00
  ): { container: Phaser.GameObjects.Container; fill: Phaser.GameObjects.Rectangle } {
    const container = this.scene.add.container(x, y);
    container.setDepth(100);

    const bg = this.scene.add.rectangle(0, 0, width, height, backgroundColor, 0.8);
    bg.setStrokeStyle(1, 0xffffff);
    container.add(bg);

    const fill = this.scene.add.rectangle(
      -width / 2 + 2,
      0,
      (width - 4) * fillPercentage,
      height - 4,
      fillColor,
      1
    );
    fill.setOrigin(0, 0.5);
    container.add(fill);

    return { container, fill };
  }

  animateProgressBar(
    fill: Phaser.GameObjects.Rectangle,
    targetWidth: number,
    duration: number = 1,
    ease: string = 'power1.inOut'
  ): gsap.core.Tween {
    return gsap.to(fill, {
      width: targetWidth,
      duration: duration,
      ease: ease
    });
  }

  createFakeMenu(
    x: number,
    y: number,
    width: number,
    options: string[],
    id: string
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    container.setDepth(100);

    const itemHeight = 30;
    const totalHeight = options.length * itemHeight + 20;

    const bg = this.scene.add.rectangle(
      0,
      0,
      width,
      totalHeight,
      0x000000,
      0.9
    );
    bg.setStrokeStyle(2, 0xffffff);
    container.add(bg);

    options.forEach((option, index) => {
      const optionY = -totalHeight / 2 + 15 + index * itemHeight;

      const optionBg = this.scene.add.rectangle(
        0,
        optionY,
        width - 20,
        itemHeight - 4,
        0x333333,
        0.5
      );
      optionBg.setData('optionIndex', index);
      container.add(optionBg);

      const optionText = this.scene.add.text(
        0,
        optionY,
        option,
        {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '8px',
          color: '#ffffff'
        }
      );
      optionText.setOrigin(0.5, 0.5);
      container.add(optionText);
    });

    container.setData('menuId', id);

    return container;
  }

  highlightMenuItem(menu: Phaser.GameObjects.Container, index: number): void {
    const options = menu.list.filter((item) => item.getData('optionIndex') !== undefined) as Phaser.GameObjects.Rectangle[];
    
    options.forEach((option) => {
      const optIndex = option.getData('optionIndex');
      if (optIndex === index) {
        option.fillColor = 0x666666;
      } else {
        option.fillColor = 0x333333;
      }
    });
  }

  getCursorPosition(): { x: number; y: number } {
    return {
      x: this.cursorSprite.x,
      y: this.cursorSprite.y
    };
  }

  destroy(): void {
    this.cursorSprite.destroy();
    this.clickEffect?.destroy();
  }
}
