import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://shisogaku.github.io/shisogaku-compass/
export default defineConfig({
  base: '/shisogaku-compass/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
