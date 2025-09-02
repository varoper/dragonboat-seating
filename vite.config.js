import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative paths for all assets
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',       // default output folder
    assetsDir: 'assets',  // folder for JS/CSS/images inside dist
    sourcemap: false,     // optional, if you don’t need source maps
    rollupOptions: {
      output: {
        // optional: keep hashed names for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  }
});
