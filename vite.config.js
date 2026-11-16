import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' keeps asset paths relative, so the build works on GitHub Pages
// under any repository name without extra config. Routing is hash-based.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5183, strictPort: false },
});
