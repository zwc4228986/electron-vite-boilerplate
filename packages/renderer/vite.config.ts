import { join } from 'path'
import { defineConfig } from 'vite'
import electronRenderer from 'vite-plugin-electron-renderer'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  mode: process.env.NODE_ENV,
  plugins: [
    electronRenderer({
      resolve: {
        'electron-store': 'export default require("electron-store");',
        serialport: 'export default require("serialport");',
      },
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
  },
  server: {
    port: pkg.env.PORT,
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
});