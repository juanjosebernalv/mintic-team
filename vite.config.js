import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Si despliegas en GitHub Pages, ajusta `base` con el nombre de tu repo, ej. '/team-showcase/'.
// Para Netlify deja `base` en '/'.
export default defineConfig({
  plugins: [react()],
  base: '/mintic-team/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
