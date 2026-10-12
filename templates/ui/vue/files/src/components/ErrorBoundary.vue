<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { fetchNui } from '@/lib/nui'

const hasError = ref(false)

onErrorCaptured((error, _instance, info) => {
  console.error('[NUI] Unhandled UI error:', error, info)

  hasError.value = true

  fetchNui('hideFrame').catch(() => {})

  return false
})
</script>

<template>
  <slot v-if="!hasError" />
  <slot v-else name="fallback" />
</template>