import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { isBrowser } from './lib/nui'
import { store } from './store'
import App from './App'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
