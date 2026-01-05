import Phaser from 'phaser';
import { Scene1_RealWorldIntro } from '../scenes/Scene1_RealWorldIntro';
import { Scene2_GameInterruption } from '../scenes/Scene2_GameInterruption';
import { Scene3_TitleScreen } from '../scenes/Scene3_TitleScreen';
import { Scene4_StartingRoom } from '../scenes/Scene4_StartingRoom';
import { Scene5_SnakeWorld } from '../scenes/Scene5_SnakeWorld';
import { Scene6_ScratchWorld } from '../scenes/Scene6_ScratchWorld';
import { Scene7_RobloxEra } from '../scenes/Scene7_RobloxEra';
import { Scene8_Multiplayer } from '../scenes/Scene8_Multiplayer';
import { Scene9_BrownCampus } from '../scenes/Scene9_BrownCampus';
import { Scene10_EndScreen } from '../scenes/Scene10_EndScreen';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 4
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  scene: [
    Scene1_RealWorldIntro,
    Scene2_GameInterruption,
    Scene3_TitleScreen,
    Scene4_StartingRoom,
    Scene5_SnakeWorld,
    Scene6_ScratchWorld,
    Scene7_RobloxEra,
    Scene8_Multiplayer,
    Scene9_BrownCampus,
    Scene10_EndScreen
  ]
};

export const SCENE_KEYS = {
  SCENE_1: 'Scene1_RealWorldIntro',
  SCENE_2: 'Scene2_GameInterruption',
  SCENE_3: 'Scene3_TitleScreen',
  SCENE_4: 'Scene4_StartingRoom',
  SCENE_5: 'Scene5_SnakeWorld',
  SCENE_6: 'Scene6_ScratchWorld',
  SCENE_7: 'Scene7_RobloxEra',
  SCENE_8: 'Scene8_Multiplayer',
  SCENE_9: 'Scene9_BrownCampus',
  SCENE_10: 'Scene10_EndScreen'
} as const;

export type SceneKey = typeof SCENE_KEYS[keyof typeof SCENE_KEYS];
