import { createRoot } from 'react-dom/client'
import { isBrowser } from './lib/nui'
import { StrictMode } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import App from './App'
import './styles/index.css'

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (isBrowser()) document.documentElement.dataset.env = 'browser'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
)