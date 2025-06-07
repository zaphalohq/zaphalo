import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    // Explicitly setting mainFields to default value. For some reason, Vitest isn't
    // respecting the 'module' field in package.json without specifying it explicitly
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: {
      path: "rollup-plugin-node-polyfills/polyfills/path",
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgrPlugin(),
  ],
  define: {
    "process.env": process.env,
  },
  server: {
    host: 'localhost',
    port: 5173
  }
  
});