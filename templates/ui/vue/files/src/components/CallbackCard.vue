<script setup lang="ts">
import { LoaderCircle, MapPin, TriangleAlert } from 'lucide-vue-next'
import { useNuiCallback } from '@/composables/useNuiCallback'
import type { Position } from '@/types'
import Button from './Button.vue'

// Calls the getClientData NUI callback and shows what comes back.
const { state, run } = useNuiCallback<Position>('getClientData')
const axes = ['x', 'y', 'z'] as const
</script>

<template>
  <section class="card">
    <div class="card-head">
      <div>
        <h2 class="card-title">UI to client</h2>
        <p class="card-desc">Calls RegisterNUICallback in your client script with fetchNui.</p>
      </div>
      <Button size="sm" :disabled="state.status === 'loading'" @click="run()">
        <LoaderCircle v-if="state.status === 'loading'" class="icon icon-sm spin" />
        <MapPin v-else class="icon icon-sm" />
        Fetch position
      </Button>
    </div>

    <div v-if="state.status === 'idle'" class="empty">
      <MapPin class="icon" />
      <strong>No data yet</strong>
      <span>Press Fetch position to call the client script.</span>
    </div>

    <div v-else-if="state.status === 'loading'" class="coords" aria-busy="true">
      <div class="skeleton" />
      <div class="skeleton" />
      <div class="skeleton" />
    </div>

    <div v-else-if="state.status === 'error'" class="alert" role="alert">
      <TriangleAlert class="icon icon-lg" />
      <div>
        <strong>Request failed</strong>
        <p>{{ state.error }}</p>
      </div>
      <Button variant="outline" size="sm" @click="run()">Retry</Button>
    </div>

    <div v-else class="coords">
      <div v-for="axis in axes" :key="axis" class="coord">
        <span class="coord-label">{{ axis.toUpperCase() }}</span>
        <span class="coord-value">{{ state.data[axis].toFixed(2) }}</span>
      </div>
    </div>
  </section>
</template>
