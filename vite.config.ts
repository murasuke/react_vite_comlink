import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { comlink } from 'vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? 'react_vite_comlink' : './',
  plugins: [comlink(), react()],
  worker: {
    plugins: [comlink()],
  },
});
