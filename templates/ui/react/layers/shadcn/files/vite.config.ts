import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  resolve: {
    // shadcn/ui imports from '@/...'.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },

  // Relative URLs, because NUI serves the page from nui://<resource>/.
  base: './',

  build: {
    // Must match the paths in this template's template.json (ui_page / files).
    outDir: 'dist',
    // FiveM ships an older Chromium than current browsers.
    target: 'chrome103',
  },

  server: { port: 3000 },
})
