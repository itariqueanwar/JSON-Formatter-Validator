import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html')
      }
    }
  }
});

