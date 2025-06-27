/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/frontend',
  server: {
    port: 5173,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), svgrPlugin(), tailwindcss()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@UI': path.resolve(__dirname, './src/components/UI'),
      '@Context': path.resolve(__dirname, './src/components/Context'),
      '@utils': path.resolve(__dirname, './src/components/utils'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
