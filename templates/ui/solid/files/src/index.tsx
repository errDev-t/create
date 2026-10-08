import { render } from 'solid-js/web'
import { isBrowser } from './lib/nui'
import App from './App'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

render(() => <App />, document.getElementById('root')!)
