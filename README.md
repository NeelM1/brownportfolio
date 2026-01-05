# Brown University Portfolio - RPG Cutscene Engine

A complex, fully non-interactive 2D top-down RPG cutscene experience for a Brown University application portfolio. The entire experience is a single, continuous 2–3 minute cinematic narrative told through the language of classic Pokémon-era pixel games (GBA/DS style).

## Tech Stack

- **Phaser 3** - Game framework, scene management, sprite/tilemap handling
- **GSAP** - Timeline-based animation orchestration, tweening engine
- **Tone.js** - Audio synthesis, dynamic music/SFX mixing
- **TypeScript** - Type safety, complex state management
- **Vite** - Dev server, HMR, production build
- **Zustand** - Event-driven state management

## Features

- ✅ 10 fully scripted cutscene scenes
- ✅ Master GSAP timeline orchestrating entire cutscene (2–3 minute duration)
- ✅ Dialogue system with typing animation and queue management
- ✅ Sprite animation and grid-based movement
- ✅ Fake interaction layer (cursor, clicks, menus)
- ✅ Audio engine with music/SFX mixing
- ✅ Visual effects (screen shake, fade, particles, glitches)
- ✅ Pixel-perfect rendering at 320×240 base, cleanly upscaled
- ✅ No real gameplay — fully scripted, non-interactive cutscene

## Project Structure

```
brown-rpg-cutscene-engine/
├── src/
│   ├── config/
│   │   └── gameConfig.ts         # Phaser game configuration
│   ├── scenes/
│   │   ├── BaseScene.ts          # Base scene class with common functionality
│   │   ├── Scene1_RealWorldIntro.ts
│   │   ├── Scene2_GameInterruption.ts
│   │   ├── Scene3_TitleScreen.ts
│   │   ├── Scene4_StartingRoom.ts
│   │   ├── Scene5_SnakeWorld.ts
│   │   ├── Scene6_ScratchWorld.ts
│   │   ├── Scene7_RobloxEra.ts
│   │   ├── Scene8_Multiplayer.ts
│   │   ├── Scene9_BrownCampus.ts
│   │   └── Scene10_EndScreen.ts
│   ├── systems/
│   │   ├── AudioEngine.ts        # Tone.js audio management
│   │   ├── DialogueSystem.ts     # Dialogue box with typing animation
│   │   ├── AnimationOrchestrator.ts  # Master GSAP timeline controller
│   │   ├── FakeInteractionSystem.ts  # Fake cursor, clicks, menus
│   │   └── GameStore.ts          # Zustand state management
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── main.ts                   # Entry point
├── public/
│   ├── sprites/                  # Game sprites (placeholder assets)
│   ├── audio/                    # Music and SFX (placeholder assets)
│   └── README.md                 # Asset documentation
├── scripts/
│   └── generate-assets.js        # Generate placeholder assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The game will open at `http://localhost:3000`

## Building

Build for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Assets

### Placeholder Assets

Generate placeholder assets for testing:

```bash
npm run generate-assets
```

This will create simple placeholder sprites and empty audio files. Note that you'll need the `canvas` and optional `ffmpeg` packages for full functionality:

```bash
npm install --save-dev canvas
# Optional for audio generation
# sudo apt-get install ffmpeg  # Linux
# brew install ffmpeg          # macOS
```

### Production Assets

Replace the placeholder assets in `public/sprites/` and `public/audio/` with actual game assets.

#### Recommended CC0 Sources

- **Sprites**: [Kenney.nl](https://kenney.nl/assets), [OpenGameArt](https://opengameart.org/)
- **Music**: [Incompetech](https://incompetech.com/music/), [Freepd.com](https://freepd.com/)
- **SFX**: [OpenGameArt](https://opengameart.org/)
- **Font**: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts OFL)

#### Required Asset List

See `public/README.md` for a complete list of required assets with specifications.

## Scenes Overview

1. **Scene 1 — Real World Intro**: Text overlays, pixel-art icons, glitch effect
2. **Scene 2 — Game Interruption**: Fake game window, loading screen, click to play
3. **Scene 3 — Title Screen**: "Brown University" title, bouncing animation
4. **Scene 4 — Starting Room**: Pixel bedroom, player character introduction
5. **Scene 5 — Snake World**: Snake game nostalgia, Python journey
6. **Scene 6 — Scratch World**: Block-based environment, Open Curriculum analogy
7. **Scene 7 — Roblox/Minecraft Era**: Voxel-inspired world, systems introduction
8. **Scene 8 — Multiplayer**: Friend sprites join, collaboration theme
9. **Scene 9 — Brown Campus Final Level**: Campus environment, final message
10. **Scene 10 — End Screen**: Credits, thank you message

## Development Controls

When running in development mode, you can access timeline controls from the browser console:

```javascript
play()      // Play the cutscene
pause()     // Pause the cutscene
resume()    // Resume from pause
seek(time)  // Jump to specific time (in seconds)
getTimeline() // Get the GSAP timeline object
```

## Customization

### Adjusting Timeline

The master timeline is controlled by `AnimationOrchestrator`. Each scene adds animations to this timeline:

```typescript
const timeline = this.getTimeline();
timeline.addLabel('my_event');
timeline.to(sprite, { x: 100, duration: 1 });
timeline.call(() => { console.log('Callback!'); });
```

### Adding Dialogue

```typescript
this.dialogueSystem.show({
  lines: [
    { speaker: 'Neel', text: 'Hello, world!', speed: 40 },
    { speaker: '', text: '...', sfx: 'beep' }
  ]
});
```

### Fake Interactions

```typescript
// Show and move fake cursor
this.fakeInteraction.showCursor(x, y);
this.fakeInteraction.moveCursorTo(targetX, targetY, duration);

// Fake button click
const button = this.fakeInteraction.createFakeButton(...);
this.fakeInteraction.hoverAndClick(button);
```

### Audio Control

```typescript
// Music
this.playMusic('bgm_key', true);  // loop
this.stopMusic(fadeDuration);

// SFX
this.playSFX('effect_key');

// Procedural audio
this.audioEngine.generateBeep(800, 0.05);
```

## Performance

- Target FPS: 60
- Base Resolution: 320×240 (pixel-perfect)
- Display Resolution: 1280×720 or 1920×1080 (upscaled)
- Pixel Art: Enabled (no anti-aliasing)
- Estimated Total Size: < 10MB (with optimized assets)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is created as a portfolio piece for Brown University. 

Assets used should be properly licensed (CC0, MIT, OFL). See the credits in Scene 10 for specific asset attributions.

## Credits

**Created by**: Neel Marripalapu

**Frameworks & Libraries**:
- Phaser 3
- GSAP
- Tone.js
- Zustand
- TypeScript
- Vite

## Notes

- All interactions are scripted — this is a non-interactive cutscene experience
- The focus is on visual polish, cinematic quality, and narrative pacing
- Audio is crucial for the nostalgic tone — ensure good quality music/SFX
- Code is well-commented for future tweaks and portfolio showcase

## Future Enhancements (Optional)

- Shader-based effects (CRT scanlines, chromatic aberration)
- Advanced particle system (dust, rain, pollen)
- Dynamic music generation (Tone.js procedural composition)
- Web Audio API visualization
- Service Worker caching (offline playback)
- Recording as video (.mp4) for fallback submission
