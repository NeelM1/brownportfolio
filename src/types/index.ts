export interface DialogueLine {
  speaker?: string;
  text: string;
  speed?: number;
  sfx?: string;
}

export interface DialogueSequence {
  lines: DialogueLine[];
  onComplete?: () => void;
}

export interface CutsceneAsset {
  key: string;
  path: string;
  type: 'image' | 'spritesheet' | 'audio' | 'tilemap' | 'font';
  frameWidth?: number;
  frameHeight?: number;
  frameConfig?: Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig;
}

export interface SceneConfig {
  key: string;
  assets: CutsceneAsset[];
  preload: () => void;
  create: () => void;
  update: () => void;
}

export interface CameraEffect {
  type: 'shake' | 'fade' | 'zoom' | 'pan';
  duration: number;
  intensity?: number;
  easing?: string;
}

export interface FakeCursorState {
  x: number;
  y: number;
  visible: boolean;
  clicking: boolean;
}

export interface AudioConfig {
  music?: {
    key: string;
    volume?: number;
    loop?: boolean;
  };
  sfx?: {
    key: string;
    volume?: number;
  };
}

export interface AnimationKeyframe {
  x: number;
  y: number;
  duration: number;
  ease?: string;
  scaleX?: number;
  scaleY?: number;
  alpha?: number;
  rotation?: number;
}

export interface GameState {
  currentScene: string;
  isPlaying: boolean;
  timelineProgress: number;
  dialogueActive: boolean;
}

export interface SpriteConfig {
  key: string;
  x: number;
  y: number;
  frame?: string | number;
  scale?: number;
  alpha?: number;
  depth?: number;
  originX?: number;
  originY?: number;
}
