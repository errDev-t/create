import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { useNuiEvent } from '@/hooks/useNuiEvent'
import { dispatchNuiMessage, isBrowser } from '@/lib/nui'
import type { NuiMessage } from '@/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

/** Shows the latest message the client script sent with SendNUIMessage. */
export function MessageCard() {
  const [last, setLast] = useState<{ message: NuiMessage; time: Date } | null>(null)

  useNuiEvent('*', (_data, message) => setLast({ message, time: new Date() }))

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2 className="card-title">Client to UI</h2>
          <p className="card-desc">Sent with SendNUIMessage, received with useNuiEvent.</p>
        </div>
        {isBrowser() && (
          <Button variant="outline" size="sm" onClick={() => dispatchNuiMessage('ping', { sent: Date.now() })}>
            <Send className="icon icon-sm" />
            Send test message
          </Button>
        )}
      </div>

      {last ? (
        <div className="message">
          <Badge variant="accent">{last.message.action}</Badge>
          <code className="message-data">{JSON.stringify(last.message.data)}</code>
          <time className="message-time">{last.time.toLocaleTimeString([], { hour12: false })}</time>
        </div>
      ) : (
        <div className="empty">
          <MessageSquare className="icon" />
          <strong>Waiting for a message</strong>
          <span>Send one from your client script.</span>
        </div>
      )}
    </section>
  )
}
