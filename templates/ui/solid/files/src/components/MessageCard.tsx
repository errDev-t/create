import { Show, createSignal } from 'solid-js'
import { MessageSquare, Send } from 'lucide-solid'
import { dispatchNuiMessage, isBrowser } from '@/lib/nui'
import { createNuiEvent } from '@/primitives/createNuiEvent'
import type { NuiMessage } from '@/types'
import { Badge } from './Badge'
import { Button } from './Button'

/** Shows the latest message the client script sent with SendNUIMessage. */
export function MessageCard() {
  const [last, setLast] = createSignal<{ message: NuiMessage; time: Date } | null>(null)

  createNuiEvent('*', (_data, message) => setLast({ message, time: new Date() }))

  return (
    <section class="card">
      <div class="card-head">
        <div>
          <h2 class="card-title">Client to UI</h2>
          <p class="card-desc">Sent with SendNUIMessage, received with createNuiEvent.</p>
        </div>
        <Show when={isBrowser()}>
          <Button variant="outline" size="sm" onClick={() => dispatchNuiMessage('ping', { sent: Date.now() })}>
            <Send class="icon icon-sm" />
            Send test message
          </Button>
        </Show>
      </div>

      <Show
        when={last()}
        fallback={
          <div class="empty">
            <MessageSquare class="icon" />
            <strong>Waiting for a message</strong>
            <span>Send one from your client script.</span>
          </div>
        }
      >
        {current => (
          <div class="message">
            <Badge variant="accent">{current().message.action}</Badge>
            <code class="message-data">{JSON.stringify(current().message.data)}</code>
            <time class="message-time">{current().time.toLocaleTimeString([], { hour12: false })}</time>
          </div>
        )}
      </Show>
    </section>
  )
}
