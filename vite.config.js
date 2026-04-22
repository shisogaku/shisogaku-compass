import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://shisogaku.github.io/shisogaku-compass/
export default defineConfig({
  base: '/shisogaku-compass/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 初期ロード軽量化のため、ベンダーをチャンク分割
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // React 系を1チャンク
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react';
          }
          // Supabase は重いので独立
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          // それ以外の node_modules は1つに
          return 'vendor';
        },
      },
    },
    // 500kB 警告は分割後の vendor で十分制御できるので少しだけ緩める
    chunkSizeWarningLimit: 700,
  },
});
