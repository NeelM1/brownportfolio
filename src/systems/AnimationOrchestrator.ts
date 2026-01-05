import gsap from 'gsap';
import type { AnimationKeyframe } from '../types';

export class AnimationOrchestrator {
  private static instance: AnimationOrchestrator;
  private masterTimeline: gsap.core.Timeline;
  private scene: Phaser.Scene | null = null;
  private effectsContainer: Phaser.GameObjects.Container | null = null;

  private constructor() {
    this.masterTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        console.log('Cutscene complete');
      }
    });
  }

  static getInstance(): AnimationOrchestrator {
    if (!AnimationOrchestrator.instance) {
      AnimationOrchestrator.instance = new AnimationOrchestrator();
    }
    return AnimationOrchestrator.instance;
  }

  initialize(scene: Phaser.Scene): void {
    this.scene = scene;
    this.effectsContainer = scene.add.container(0, 0);
    this.effectsContainer.setDepth(9999);
    this.createOverlay();
  }

  private overlay: Phaser.GameObjects.Rectangle | null = null;

  private createOverlay(): void {
    if (!this.scene) return;
    this.overlay = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0
    );
    this.overlay.setOrigin(0.5);
    this.effectsContainer?.add(this.overlay);
  }

  getTimeline(): gsap.core.Timeline {
    return this.masterTimeline;
  }

  play(): void {
    this.masterTimeline.play();
  }

  pause(): void {
    this.masterTimeline.pause();
  }

  resume(): void {
    this.masterTimeline.resume();
  }

  seek(time: number): void {
    this.masterTimeline.seek(time);
  }

  restart(): void {
    this.masterTimeline.restart();
  }

  addLabel(label: string, time?: number): gsap.core.Timeline {
    return this.masterTimeline.addLabel(label, time);
  }

  toLabel(label: string): void {
    this.masterTimeline.tweenTo(label);
  }

  animateSprite(
    sprite: Phaser.GameObjects.Sprite,
    keyframes: AnimationKeyframe[],
    _duration: number = 1
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();
    
    keyframes.forEach((kf, index) => {
      timeline.to(sprite, {
        x: kf.x,
        y: kf.y,
        duration: kf.duration,
        ease: kf.ease || 'none',
        onUpdate: () => {
          sprite.x = gsap.getProperty(sprite, 'x') as number;
          sprite.y = gsap.getProperty(sprite, 'y') as number;
        }
      }, index > 0 ? `-${kf.duration * 0.1}` : 0);

      if (kf.scaleX !== undefined || kf.scaleY !== undefined) {
        timeline.to(sprite, {
          scaleX: kf.scaleX ?? sprite.scaleX,
          scaleY: kf.scaleY ?? sprite.scaleY,
          duration: kf.duration,
          ease: kf.ease || 'none'
        }, `<`);
      }

      if (kf.alpha !== undefined) {
        timeline.to(sprite, {
          alpha: kf.alpha,
          duration: kf.duration,
          ease: kf.ease || 'none'
        }, `<`);
      }

      if (kf.rotation !== undefined) {
        timeline.to(sprite, {
          angle: Phaser.Math.RadToDeg(kf.rotation),
          duration: kf.duration,
          ease: kf.ease || 'none'
        }, `<`);
      }
    });

    return timeline;
  }

  moveSprite(
    sprite: Phaser.GameObjects.Sprite,
    x: number,
    y: number,
    duration: number = 1,
    ease: string = 'power1.inOut'
  ): gsap.core.Tween {
    const tween = gsap.to(sprite, {
      x: x,
      y: y,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        sprite.x = gsap.getProperty(sprite, 'x') as number;
        sprite.y = gsap.getProperty(sprite, 'y') as number;
      }
    });

    return tween;
  }

  fadeSprite(
    sprite: Phaser.GameObjects.Sprite,
    alpha: number,
    duration: number = 0.5
  ): gsap.core.Tween {
    return gsap.to(sprite, {
      alpha: alpha,
      duration: duration,
      ease: 'power1.inOut'
    });
  }

  scaleSprite(
    sprite: Phaser.GameObjects.Sprite,
    scale: number,
    duration: number = 0.5,
    ease: string = 'back.out(1.7)'
  ): gsap.core.Tween {
    return gsap.to(sprite, {
      scaleX: scale,
      scaleY: scale,
      duration: duration,
      ease: ease
    });
  }

  cameraShake(
    intensity: number = 5,
    duration: number = 0.5,
    _ease: string = 'power1.out'
  ): gsap.core.Timeline {
    if (!this.scene) return gsap.timeline();

    const camera = this.scene.cameras.main;
    const originalX = camera.scrollX;
    const originalY = camera.scrollY;

    const timeline = gsap.timeline();

    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * intensity;
      const offsetY = (Math.random() - 0.5) * intensity;

      timeline.to(
        {},
        {
          duration: duration / 10,
          onStart: () => {
            camera.scrollX = originalX + offsetX;
            camera.scrollY = originalY + offsetY;
          }
        }
      );
    }

    timeline.to(
      {},
      {
        duration: duration / 10,
        onStart: () => {
          camera.scrollX = originalX;
          camera.scrollY = originalY;
        }
      }
    );

    return timeline;
  }

  fadeScreen(
    toAlpha: number,
    duration: number = 0.5,
    color: number = 0x000000
  ): gsap.core.Tween {
    if (!this.overlay) {
      return gsap.to({}, { duration: 0 });
    }

    this.overlay.fillColor = color;
    return gsap.to(this.overlay, {
      alpha: toAlpha,
      duration: duration,
      ease: 'power1.inOut'
    });
  }

  screenFlash(
    color: number = 0xffffff,
    duration: number = 0.2
  ): gsap.core.Timeline {
    if (!this.overlay) return gsap.timeline();

    const timeline = gsap.timeline();

    timeline.to(this.overlay, {
      fillStyle: { color: color },
      alpha: 0.8,
      duration: duration * 0.1,
      ease: 'power2.out'
    });

    timeline.to(this.overlay, {
      alpha: 0,
      duration: duration * 0.9,
      ease: 'power2.in'
    });

    return timeline;
  }

  cameraPan(
    x: number,
    y: number,
    duration: number = 1,
    ease: string = 'power1.inOut'
  ): gsap.core.Tween {
    if (!this.scene) return gsap.to({}, { duration: 0 });

    const camera = this.scene.cameras.main;

    return gsap.to(camera, {
      scrollX: x - camera.width / 2,
      scrollY: y - camera.height / 2,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        camera.scrollX = gsap.getProperty(camera, 'scrollX') as number;
        camera.scrollY = gsap.getProperty(camera, 'scrollY') as number;
      }
    });
  }

  cameraZoom(
    zoom: number,
    duration: number = 1,
    ease: string = 'power1.inOut'
  ): gsap.core.Tween {
    if (!this.scene) return gsap.to({}, { duration: 0 });

    const camera = this.scene.cameras.main;

    return gsap.to(camera, {
      zoom: zoom,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        camera.zoom = gsap.getProperty(camera, 'zoom') as number;
      }
    });
  }

  textTyping(
    textObject: Phaser.GameObjects.Text,
    text: string,
    _duration: number = 1,
    speed: number = 30,
    onChar?: (char: string, index: number) => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();
    const chars = text.split('');
    let currentText = '';

    chars.forEach((char, index) => {
      timeline.to(
        {},
        {
          duration: speed / 1000,
          onStart: () => {
            currentText += char;
            textObject.setText(currentText);
            onChar?.(char, index);
          }
        }
      );
    });

    return timeline;
  }

  particleEffect(
    x: number,
    y: number,
    particleCount: number = 10,
    _duration: number = 1
  ): gsap.core.Timeline {
    if (!this.scene) return gsap.timeline();

    const particles: Phaser.GameObjects.Rectangle[] = [];
    const container = this.scene.add.container(x, y);

    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.rectangle(
        0,
        0,
        4,
        4,
        0xffffff,
        Math.random() * 0.5 + 0.5
      );
      container.add(particle);
      particles.push(particle);
    }

    const timeline = gsap.timeline();

    particles.forEach((particle) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 20;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      timeline.to(
        particle,
        {
          x: endX,
          y: endY,
          alpha: 0,
          duration: _duration,
          ease: 'power1.out'
        },
        0
      );
    });

    timeline.call(() => {
      container.destroy();
    });

    return timeline;
  }

  glitchEffect(
    target: Phaser.GameObjects.GameObject,
    _duration: number = 0.3,
    intensity: number = 2
  ): gsap.core.Timeline {
    const timeline = gsap.timeline();

    for (let i = 0; i < 8; i++) {
      timeline.to(
        target,
        {
          x: (target as Phaser.GameObjects.Sprite).x + (Math.random() - 0.5) * intensity,
          y: (target as Phaser.GameObjects.Sprite).y + (Math.random() - 0.5) * intensity,
          duration: 0.02,
          ease: 'none'
        }
      );
    }

    timeline.to(
      target,
      {
        x: (target as Phaser.GameObjects.Sprite).x,
        y: (target as Phaser.GameObjects.Sprite).y,
        duration: 0.02
      }
    );

    return timeline;
  }

  bounceSprite(
    sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text,
    height: number = 20,
    _duration: number = 0.5
  ): gsap.core.Timeline {
    const startY = sprite.y;
    const timeline = gsap.timeline();

    timeline.to(sprite, {
      y: startY - height,
      duration: _duration / 2,
      ease: 'power2.out'
    });

    timeline.to(sprite, {
      y: startY,
      duration: _duration / 2,
      ease: 'bounce.out'
    });

    return timeline;
  }

  getTotalDuration(): number {
    return this.masterTimeline.duration();
  }

  getCurrentTime(): number {
    return this.masterTimeline.time();
  }

  getProgress(): number {
    return this.masterTimeline.progress();
  }
}
