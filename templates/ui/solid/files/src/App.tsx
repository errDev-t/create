import { Show, onCleanup, onMount } from 'solid-js'
import { LayoutDashboard, X } from 'lucide-solid'
import { Badge } from './components/Badge'
import { Button } from './components/Button'
import { CallbackCard } from './components/CallbackCard'
import { MessageCard } from './components/MessageCard'
import { isBrowser } from './lib/nui'
import { createVisibility } from './primitives/createVisibility'

export default function App() {
  const browser = isBrowser()
  const { visible, show, close } = createVisibility()

  onMount(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (visible() && event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    onCleanup(() => window.removeEventListener('keydown', onKeyDown))
  })

  return (
    <div class="app">
      <div class="window" data-open={String(visible())}>
        <header class="window-header">
          <div class="brand">
            <span class="brand-mark">
              <LayoutDashboard class="icon icon-lg" />
            </span>
            <div>
              <h1 class="brand-title">{{projectName}}</h1>
              <p class="brand-sub">NUI starter</p>
            </div>
          </div>
          <div class="header-actions">
            <Badge variant={browser ? 'accent' : 'success'} dot>
              {browser ? 'Browser preview' : 'In game'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close">
              <X class="icon" />
            </Button>
          </div>
        </header>

        <main class="window-body">
          <MessageCard />
          <CallbackCard />
        </main>

        <footer class="window-footer">
          <span>
            <kbd>Esc</kbd> to close
          </span>
          <span>{browser ? 'Browser preview with mocked NUI callbacks' : 'Connected to the game client'}</span>
        </footer>
      </div>

      <Show when={browser && !visible()}>
        <Button class="dev-reopen" variant="outline" size="sm" onClick={show}>
          Reopen UI
        </Button>
      </Show>
    </div>
  )
}
