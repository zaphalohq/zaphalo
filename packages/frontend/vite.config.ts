/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
  return {
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
    'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
    'process.env.VITE_WEBSOCKET_URL': JSON.stringify(env.VITE_WEBSOCKET_URL),
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './build',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}}

);
