import { createApp } from 'vue'
import { isBrowser } from './lib/nui'
import App from './App.vue'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

createApp(App).mount('#app')
