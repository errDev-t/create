import { mount } from 'svelte'
import { isBrowser } from './lib/nui'
import App from './App.svelte'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

mount(App, { target: document.getElementById('app')! })
