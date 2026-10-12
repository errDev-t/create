import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url';
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],

  base: './',

  build: {
    outDir: 'dist',
    target: 'chrome103',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: { port: 3000 },
})
