#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../public');

const dirs = ['sprites', 'audio', 'fonts'];
dirs.forEach(dir => {
  const dirPath = path.join(assetsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

function createSimplePNG(filename, width, height, color, text = '') {
  const outputPath = path.join(assetsDir, 'sprites', filename);
  
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function createIHDR(width, height) {
    const buf = Buffer.alloc(13);
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    buf[8] = 8; 
    buf[9] = 2; 
    buf[10] = 0;
    buf[11] = 0;
    buf[12] = 0;
    return createChunk('IHDR', buf);
  }
  
  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crc = Buffer.alloc(4);
    return Buffer.concat([length, typeBuf, data, crc]);
  }
  
  function createIDAT(width, height, color) {
    const channels = 3;
    const bytesPerPixel = channels;
    const rowSize = 1 + width * bytesPerPixel;
    const rawData = Buffer.alloc(rowSize * height);
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    for (let y = 0; y < height; y++) {
      rawData[y * rowSize] = 0; 
      for (let x = 0; x < width; x++) {
        const idx = y * rowSize + 1 + x * 3;
        rawData[idx] = r;
        rawData[idx + 1] = g;
        rawData[idx + 2] = b;
      }
    }
    
    return createChunk('IDAT', rawData);
  }
  
  const ihdr = createIHDR(width, height);
  const idat = createIDAT(width, height, color);
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  const png = Buffer.concat([PNG_SIGNATURE, ihdr, idat, iend]);
  
  fs.writeFileSync(outputPath, png);
  console.log(`Created: ${filename}`);
}

function createEmptyMP3(filename) {
  const outputPath = path.join(assetsDir, 'audio', filename);
  
  const mp3Header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  
  fs.writeFileSync(outputPath, mp3Header);
  console.log(`Created: ${filename}`);
}

console.log('Generating placeholder assets...\n');

const spriteFiles = [
  { name: 'robotics.png', w: 64, h: 64, c: '#4a90e2' },
  { name: 'coding.png', w: 64, h: 64, c: '#50c878' },
  { name: 'tinkering.png', w: 64, h: 64, c: '#ffa500' },
  { name: 'glitch.png', w: 32, h: 32, c: '#ff00ff' },
  { name: 'window_chrome.png', w: 260, h: 180, c: '#2d2d44' },
  { name: 'loading_bar.png', w: 200, h: 20, c: '#1a1a2e' },
  { name: 'click_to_play.png', w: 120, h: 35, c: '#4a4a6a' },
  { name: 'title_bg.png', w: 320, h: 240, c: '#0a0a1a' },
  { name: 'title_logo.png', w: 200, h: 80, c: '#8B4513' },
  { name: 'bedroom_bg.png', w: 320, h: 240, c: '#2d1b4e' },
  { name: 'bed.png', w: 64, h: 48, c: '#8b4513' },
  { name: 'desk.png', w: 80, h: 48, c: '#654321' },
  { name: 'pc.png', w: 48, h: 48, c: '#333333' },
  { name: 'poster.png', w: 48, h: 64, c: '#4169e1' },
  { name: 'door.png', w: 32, h: 48, c: '#8b4513' },
  { name: 'snake_bg.png', w: 320, h: 240, c: '#0a1a0a' },
  { name: 'scratch_bg.png', w: 320, h: 240, c: '#4e2d6e' },
  { name: 'roblox_bg.png', w: 320, h: 240, c: '#1e3a5f' },
  { name: 'campus_bg.png', w: 320, h: 240, c: '#3d5c3d' },
  { name: 'tree.png', w: 64, h: 64, c: '#228b22' },
  { name: 'building.png', w: 96, h: 64, c: '#8b7355' },
  { name: 'path.png', w: 20, h: 20, c: '#8b7355' },
  { name: 'cursor.png', w: 16, h: 16, c: '#ffffff' },
  { name: 'player.png', w: 128, h: 32, c: '#ff6b6b' },
  { name: 'snake.png', w: 64, h: 16, c: '#00ff00' },
  { name: 'apple.png', w: 24, h: 12, c: '#ff0000' },
  { name: 'npc1.png', w: 128, h: 32, c: '#9b59b6' },
  { name: 'npc2.png', w: 128, h: 32, c: '#3498db' },
  { name: 'npc3.png', w: 128, h: 32, c: '#e74c3c' },
  { name: 'friend1.png', w: 128, h: 32, c: '#1abc9c' },
  { name: 'friend2.png', w: 128, h: 32, c: '#f39c12' },
  { name: 'friend3.png', w: 128, h: 32, c: '#8e44ad' },
  { name: 'friend4.png', w: 128, h: 32, c: '#2ecc71' }
];

spriteFiles.forEach(file => {
  createSimplePNG(file.name, file.w, file.h, file.c);
});

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

audioFiles.forEach(file => createEmptyMP3(file));

console.log('\n✓ Placeholder assets generated successfully!');
console.log('\n⚠️  Note: These are simple placeholder assets.');
console.log('   For production, replace them with actual game assets:');
console.log('   • Sprites: public/sprites/');
console.log('   • Audio: public/audio/');
console.log('\n📚 Recommended CC0 Asset Sources:');
console.log('   • Sprites: https://kenney.nl/assets, https://opengameart.org/');
console.log('   • Music: https://freepd.com/, https://incompetech.com/');
console.log('   • Font: Press Start 2P (Google Fonts)');
