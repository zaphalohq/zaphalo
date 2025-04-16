import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server:{
    // host : '192.168.1.2',
    host: 'localhost',
    port : 5173,
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),  // Setup alias for '@components'
    },
  },
  define: {
    "process.env": process.env,
  },
})