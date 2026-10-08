<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { LayoutDashboard, X } from 'lucide-vue-next'
import Badge from './components/Badge.vue'
import Button from './components/Button.vue'
import CallbackCard from './components/CallbackCard.vue'
import MessageCard from './components/MessageCard.vue'
import { useVisibility } from './composables/useVisibility'
import { isBrowser } from './lib/nui'

const appName = '{{projectName}}'
const browser = isBrowser()
const { visible, show, close } = useVisibility()

function onKeyDown(event: KeyboardEvent) {
  if (visible.value && event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="app">
    <div class="window" :data-open="String(visible)">
      <header class="window-header">
        <div class="brand">
          <span class="brand-mark"><LayoutDashboard class="icon icon-lg" /></span>
          <div>
            <h1 class="brand-title">{{ appName }}</h1>
            <p class="brand-sub">NUI starter</p>
          </div>
        </div>
        <div class="header-actions">
          <Badge :variant="browser ? 'accent' : 'success'" dot>
            {{ browser ? 'Browser preview' : 'In game' }}
          </Badge>
          <Button variant="ghost" size="icon" aria-label="Close" @click="close">
            <X class="icon" />
          </Button>
        </div>
      </header>

      <main class="window-body">
        <MessageCard />
        <CallbackCard />
      </main>

      <footer class="window-footer">
        <span><kbd>Esc</kbd> to close</span>
        <span>{{ browser ? 'Browser preview with mocked NUI callbacks' : 'Connected to the game client' }}</span>
      </footer>
    </div>

    <Button v-if="browser && !visible" class="dev-reopen" variant="outline" size="sm" @click="show">
      Reopen UI
    </Button>
  </div>
</template>
