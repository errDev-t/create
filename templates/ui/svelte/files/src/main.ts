import { mount } from 'svelte'
import { isBrowser } from './lib/nui'
import Root from './Root.svelte'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

mount(Root, { target: document.getElementById('app')! })