import type { DialogueSequence } from '../types';

export class DialogueSystem {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Rectangle;
  private speakerText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private continueIndicator!: Phaser.GameObjects.Text;
  private isActive: boolean = false;
  private currentLineIndex: number = 0;
  private currentSequence: DialogueSequence | null = null;
  private typingSpeed: number = 30;
  private typingTimer: Phaser.Time.TimerEvent | null = null;
  private displayedText: string = '';
  private targetText: string = '';
  private onLineComplete: (() => void) | null = null;
  private onSequenceComplete: (() => void) | null = null;
  private onCharacterTyping: ((char: string) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createDialogueBox();
  }

  private createDialogueBox(): void {
    const width = 300;
    const height = 80;
    const x = this.scene.scale.width / 2;
    const y = this.scene.scale.height - 50;

    this.container = this.scene.add.container(x, y);
    this.container.setDepth(1000);

    this.background = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      0.9
    );
    this.background.setStrokeStyle(2, 0xffffff);
    this.container.add(this.background);

    this.speakerText = this.scene.add.text(
      -width / 2 + 8,
      -height / 2 + 4,
      '',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ffff00',
        fontStyle: 'bold'
      }
    );
    this.container.add(this.speakerText);

    this.dialogueText = this.scene.add.text(
      -width / 2 + 8,
      -height / 2 + 20,
      '',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#ffffff',
        wordWrap: { width: width - 16 },
        lineSpacing: 4
      }
    );
    this.container.add(this.dialogueText);

    this.continueIndicator = this.scene.add.text(
      width / 2 - 8,
      height / 2 - 8,
      '▼',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#ffff00'
      }
    );
    this.continueIndicator.setOrigin(1, 1);
    this.container.add(this.continueIndicator);

    this.container.setVisible(false);
    this.continueIndicator.setVisible(false);
  }

  show(sequence: DialogueSequence): void {
    if (this.isActive) {
      return;
    }

    this.currentSequence = sequence;
    this.currentLineIndex = 0;
    this.onSequenceComplete = sequence.onComplete || null;
    this.isActive = true;
    this.container.setVisible(true);
    this.displayLine();
  }

  hide(): void {
    if (this.typingTimer) {
      this.typingTimer.remove();
      this.typingTimer = null;
    }
    this.isActive = false;
    this.container.setVisible(false);
    this.continueIndicator.setVisible(false);
    this.displayedText = '';
    this.dialogueText.setText('');
    this.speakerText.setText('');
  }

  private displayLine(): void {
    if (!this.currentSequence) {
      return;
    }

    const line = this.currentSequence.lines[this.currentLineIndex];
    
    if (line.speaker) {
      this.speakerText.setText(line.speaker);
    } else {
      this.speakerText.setText('');
    }

    this.typingSpeed = line.speed || 30;
    this.targetText = line.text;
    this.displayedText = '';
    this.dialogueText.setText('');
    this.continueIndicator.setVisible(false);

    this.startTyping();

    if (line.sfx === 'beep') {
      this.onCharacterTyping = () => {
        this.scene.sound.play('dialogue_beep', { volume: 0.1 });
      };
    }
  }

  private startTyping(): void {
    if (this.typingTimer) {
      this.typingTimer.remove();
    }

    this.typingTimer = this.scene.time.addEvent({
      delay: this.typingSpeed,
      repeat: this.targetText.length - 1,
      callback: this.onTypeCharacter,
      callbackScope: this
    });
  }

  private onTypeCharacter(): void {
    this.displayedText = this.targetText.substring(0, this.displayedText.length + 1);
    this.dialogueText.setText(this.displayedText);

    if (this.onCharacterTyping) {
      const char = this.displayedText[this.displayedText.length - 1];
      if (char && char !== ' ') {
        this.onCharacterTyping(char);
      }
    }

    if (this.displayedText === this.targetText) {
      this.onLineComplete = () => {
        this.nextLine();
      };
      this.continueIndicator.setVisible(true);
    }
  }

  skipTyping(): void {
    if (this.typingTimer) {
      this.typingTimer.remove();
      this.typingTimer = null;
    }

    this.displayedText = this.targetText;
    this.dialogueText.setText(this.displayedText);
    this.onLineComplete = () => {
      this.nextLine();
    };
    this.continueIndicator.setVisible(true);
  }

  advance(): void {
    if (!this.isActive) {
      return;
    }

    if (this.typingTimer) {
      this.skipTyping();
    } else if (this.onLineComplete) {
      this.onLineComplete();
      this.onLineComplete = null;
    }
  }

  private nextLine(): void {
    this.currentLineIndex++;

    if (this.currentLineIndex >= this.currentSequence!.lines.length) {
      this.onSequenceComplete?.();
      this.hide();
    } else {
      this.displayLine();
    }
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  isDialogueActive(): boolean {
    return this.isActive;
  }
}
