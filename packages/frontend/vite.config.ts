import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// // import { resolve } from 'path'
// import svgrPlugin from "vite-plugin-svgr";
// import tsconfigPaths from 'vite-tsconfig-paths'
// // https://vite.dev/config/
// export default defineConfig({
  
//   plugins: [
//     react(),
//     tailwindcss(),
//         // To enable import '@src/' type of imports
//     // viteTsconfigPaths(),
//     // To enable import of SVG as React component
//     svgrPlugin(),
//     tsconfigPaths()
//   ],
//   server:{
//     // host : '192.168.1.2',
//     host: 'localhost',
//     port : 5173,
//   },
//   resolve: {
//     // Explicitly setting mainFields to default value. For some reason, Vitest isn't
//     // respecting the 'module' field in package.json without specifying it explicitly
//     mainFields: ["module", "jsnext:main", "jsnext"],
//     alias: {
//       path: "rollup-plugin-node-polyfills/polyfills/path",
//     },
//   },
  
//   define: {
//     "process.env": process.env,
//   },
// })

// import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// import viteTsconfigPaths from "vite-tsconfig-paths";
import tsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from "vite-plugin-svgr";
// import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
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
    // tailwindcss(),
    // To enable import '@src/' type of imports
    tsconfigPaths(),
    // To enable import of SVG as React component
    svgrPlugin(),
  ],
  
});