import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'public', dest: '' }
      ]
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser': ['phaser'],
          'pixi': ['pixi.js'],
          'gsap': ['gsap'],
          'tone': ['tone']
        }
      }
    }
  },
  publicDir: 'public'
});
