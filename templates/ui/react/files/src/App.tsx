import { useEffect } from 'react'
import { LayoutDashboard, X } from 'lucide-react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { CallbackCard } from './components/CallbackCard'
import { MessageCard } from './components/MessageCard'
import { useVisibility } from './hooks/useVisibility'
import { isBrowser } from './lib/nui'

export default function App() {
  const { visible, show, close } = useVisibility()
  const browser = isBrowser()

  useEffect(() => {
    if (!visible) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, close])

  return (
    <div className="app">
      <div className="window" data-open={visible}>
        <header className="window-header">
          <div className="brand">
            <span className="brand-mark">
              <LayoutDashboard className="icon icon-lg" />
            </span>
            <div>
              <h1 className="brand-title">{{projectName}}</h1>
              <p className="brand-sub">NUI starter</p>
            </div>
          </div>
          <div className="header-actions">
            <Badge variant={browser ? 'accent' : 'success'} dot>
              {browser ? 'Browser preview' : 'In game'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close">
              <X className="icon" />
            </Button>
          </div>
        </header>

        <main className="window-body">
          <MessageCard />
          <CallbackCard />
        </main>

        <footer className="window-footer">
          <span>
            <kbd>Esc</kbd> to close
          </span>
          <span>{browser ? 'Browser preview with mocked NUI callbacks' : 'Connected to the game client'}</span>
        </footer>
      </div>

      {browser && !visible && (
        <Button className="dev-reopen" variant="outline" size="sm" onClick={show}>
          Reopen UI
        </Button>
      )}
    </div>
  )
}
