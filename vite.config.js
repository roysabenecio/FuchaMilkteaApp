import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
// const path = require('path')


export default defineConfig({
  root: './',
  esbuild: {
    // loader: "jsx"
  },
  build: {
    // Relative to the root
    outDir: '../dist/',
  },
  plugins: [
    // createHtmlPlugin({
    //     inject: {
    //       data: {
    //         title: env === 'production' ? 'My site' : `My site [${env.toUpperCase()}]`,
    //       },
    //     },
    //   }),
    // react({
    //     include: '**/*.{jsx,tsx,js}',
    // }),
    react(),
  ],
  resolve: {
    // alias: {
    //   src: path.resolve(__dirname, 'public/'),
    // }
    publicDir: "./public",
  },
});
