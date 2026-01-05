#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const createCanvas = () => {
  const { createCanvas } = require('canvas');
  return createCanvas(64, 64);
};

const assetsDir = path.join(__dirname, '../public');

const dirs = ['sprites', 'audio', 'fonts'];
dirs.forEach(dir => {
  const dirPath = path.join(assetsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const createPlaceholderImage = (filename, width, height, color, text = '') => {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  if (text) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  }
  
  const outputPath = path.join(assetsDir, 'sprites', filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${filename}`);
};

const createPlaceholderSpriteSheet = (filename, width, height, frames, colors) => {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  
  canvas.width = width * frames;
  canvas.height = height;
  
  for (let i = 0; i < frames; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(i * width, 0, width, height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(i * width, 0, width, height);
  }
  
  const outputPath = path.join(assetsDir, 'sprites', filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${filename}`);
};

const createPlaceholderAudio = (filename) => {
  const outputPath = path.join(assetsDir, 'audio', filename);
  const { exec } = require('child_process');
  
  try {
    exec(`ffmpeg -f lavfi -i "sine=frequency=440:duration=0.1" -y "${outputPath}"`, (error) => {
      if (error) {
        fs.writeFileSync(outputPath, Buffer.from([]));
      }
    });
    console.log(`Created: ${filename}`);
  } catch (e) {
    fs.writeFileSync(outputPath, Buffer.from([]));
  }
};

console.log('Generating placeholder assets...\n');

createPlaceholderImage('robotics.png', 64, 64, '#4a90e2', '🤖');
createPlaceholderImage('coding.png', 64, 64, '#50c878', '💻');
createPlaceholderImage('tinkering.png', 64, 64, '#ffa500', '🔧');
createPlaceholderImage('glitch.png', 32, 32, '#ff00ff');
createPlaceholderImage('window_chrome.png', 260, 180, '#2d2d44');
createPlaceholderImage('loading_bar.png', 200, 20, '#1a1a2e');
createPlaceholderImage('click_to_play.png', 120, 35, '#4a4a6a');
createPlaceholderImage('title_bg.png', 320, 240, '#0a0a1a');
createPlaceholderImage('title_logo.png', 200, 80, '#8B4513');
createPlaceholderImage('bedroom_bg.png', 320, 240, '#2d1b4e');
createPlaceholderImage('bed.png', 64, 48, '#8b4513');
createPlaceholderImage('desk.png', 80, 48, '#654321');
createPlaceholderImage('pc.png', 48, 48, '#333333');
createPlaceholderImage('poster.png', 48, 64, '#4169e1');
createPlaceholderImage('door.png', 32, 48, '#8b4513');
createPlaceholderImage('snake_bg.png', 320, 240, '#0a1a0a');
createPlaceholderImage('scratch_bg.png', 320, 240, '#4e2d6e');
createPlaceholderImage('roblox_bg.png', 320, 240, '#1e3a5f');
createPlaceholderImage('campus_bg.png', 320, 240, '#3d5c3d');
createPlaceholderImage('tree.png', 64, 64, '#228b22');
createPlaceholderImage('building.png', 96, 64, '#8b7355');
createPlaceholderImage('path.png', 20, 20, '#8b7355');
createPlaceholderImage('cursor.png', 16, 16, '#ffffff');

createPlaceholderSpriteSheet('player.png', 32, 32, 12, ['#ff6b6b', '#4ecdc4', '#ffe66d']);
createPlaceholderSpriteSheet('snake.png', 16, 16, 4, ['#00ff00']);
createPlaceholderSpriteSheet('apple.png', 12, 12, 2, ['#ff0000']);
createPlaceholderSpriteSheet('npc1.png', 32, 32, 4, ['#9b59b6']);
createPlaceholderSpriteSheet('npc2.png', 32, 32, 4, ['#3498db']);
createPlaceholderSpriteSheet('npc3.png', 32, 32, 4, ['#e74c3c']);
createPlaceholderSpriteSheet('friend1.png', 32, 32, 4, ['#1abc9c']);
createPlaceholderSpriteSheet('friend2.png', 32, 32, 4, ['#f39c12']);
createPlaceholderSpriteSheet('friend3.png', 32, 32, 4, ['#8e44ad']);
createPlaceholderSpriteSheet('friend4.png', 32, 32, 4, ['#2ecc71']);

const audioFiles = [
  'dialogue_beep.mp3',
  'glitch.mp3',
  'suspense.mp3',
  'loading.mp3',
  'click.mp3',
  'title_music.mp3',
  'select_sound.mp3',
  'room_music.mp3',
  'door_open.mp3',
  'footstep.mp3',
  'snake_music.mp3',
  'eat_sound.mp3',
  'slither.mp3',
  'scratch_music.mp3',
  'block_snap.mp3',
  'move.mp3',
  'roblox_music.mp3',
  'ambient.mp3',
  'multiplayer_music.mp3',
  'cheer.mp3',
  'emote.mp3',
  'campus_music.mp3',
  'birds.mp3',
  'outro_music.mp3'
];

audioFiles.forEach(file => createPlaceholderAudio(file));

console.log('\nPlaceholder assets generated successfully!');
console.log('\nNote: Audio files are empty placeholders. For actual audio:');
console.log('1. Add CC0 music from https://freepd.com/ or https://incompetech.com/');
console.log('2. Add SFX from https://opengameart.org/');
console.log('3. Replace the placeholder files in public/audio/');
console.log('\nFor images, replace placeholder files in public/sprites/ with actual pixel art.');
