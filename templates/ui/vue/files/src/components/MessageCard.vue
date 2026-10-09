<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquare, Send } from 'lucide-vue-next'
import { useNuiEvent } from '@/composables/useNuiEvent'
import { dispatchNuiMessage, isBrowser } from '@/lib/nui'
import type { NuiMessage } from '@/types'
import Badge from './Badge.vue'
import Button from './Button.vue'

const last = ref<{ message: NuiMessage; time: Date } | null>(null)
const browser = isBrowser()

// Shows the latest message the client script sent with SendNUIMessage.
useNuiEvent('*', (_data, message) => {
  last.value = { message, time: new Date() }
})
</script>

<template>
  <section class="card">
    <div class="card-head">
      <div>
        <h2 class="card-title">Client to UI</h2>
        <p class="card-desc">Sent with SendNUIMessage, received with useNuiEvent.</p>
      </div>
      <Button v-if="browser" variant="outline" size="sm" @click="dispatchNuiMessage('ping', { sent: Date.now() })">
        <Send class="icon icon-sm" />
        Send test message
      </Button>
    </div>

    <div v-if="last" class="message">
      <Badge variant="accent">{{ last.message.action }}</Badge>
      <code class="message-data">{{ JSON.stringify(last.message.data) }}</code>
      <time class="message-time">{{ last.time.toLocaleTimeString([], { hour12: false }) }}</time>
    </div>

    <div v-else class="empty">
      <MessageSquare class="icon" />
      <strong>Waiting for a message</strong>
      <span>Send one from your client script.</span>
    </div>
  </section>
</template>
