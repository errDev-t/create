import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],

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
