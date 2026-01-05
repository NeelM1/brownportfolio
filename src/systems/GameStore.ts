import { create } from 'zustand';
import type { GameState } from '../types';

interface GameStore extends GameState {
  setCurrentScene: (scene: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setTimelineProgress: (progress: number) => void;
  setDialogueActive: (active: boolean) => void;
  reset: () => void;
}

const initialState: GameState = {
  currentScene: '',
  isPlaying: false,
  timelineProgress: 0,
  dialogueActive: false
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setCurrentScene: (scene) => set({ currentScene: scene }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setTimelineProgress: (progress) => set({ timelineProgress: progress }),

  setDialogueActive: (active) => set({ dialogueActive: active }),

  reset: () => set(initialState)
}));
