<script lang="ts">
  import { MessageSquare, Send } from 'lucide-svelte'
  import { dispatchNuiMessage, isBrowser } from '../lib/nui'
  import { nuiEvent } from '../lib/nuiEvent'
  import type { NuiMessage } from '../types'
  import Badge from './Badge.svelte'
  import Button from './Button.svelte'

  let last = $state<{ message: NuiMessage; time: Date } | null>(null)

  // Shows the latest message the client script sent with SendNUIMessage.
  nuiEvent('*', (_data, message) => {
    last = { message, time: new Date() }
  })
</script>

<section class="card">
  <div class="card-head">
    <div>
      <h2 class="card-title">Client to UI</h2>
      <p class="card-desc">Sent with SendNUIMessage, received with nuiEvent.</p>
    </div>
    {#if isBrowser()}
      <Button variant="outline" size="sm" onclick={() => dispatchNuiMessage('ping', { sent: Date.now() })}>
        <Send class="icon icon-sm" />
        Send test message
      </Button>
    {/if}
  </div>

  {#if last}
    <div class="message">
      <Badge variant="accent">{last.message.action}</Badge>
      <code class="message-data">{JSON.stringify(last.message.data)}</code>
      <time class="message-time">{last.time.toLocaleTimeString([], { hour12: false })}</time>
    </div>
  {:else}
    <div class="empty">
      <MessageSquare class="icon" />
      <strong>Waiting for a message</strong>
      <span>Send one from your client script.</span>
    </div>
  {/if}
</section>
