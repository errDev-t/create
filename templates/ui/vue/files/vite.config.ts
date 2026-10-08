import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

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
