import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 3000, host: '0.0.0.0' },
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: {
    rollupOptions: {
      output: {
        // three.js ide u poseban chunk i učitava se tek kad se Bonexis office pojavi na ekranu
        manualChunks: { three: ['three'] },
      },
    },
  },
});
