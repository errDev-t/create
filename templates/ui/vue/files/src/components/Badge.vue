<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'accent' | 'success'; dot?: boolean }>(), {
  variant: 'default',
  dot: false,
})
</script>

<template>
  <span :class="['badge', variant !== 'default' && `badge-${variant}`, dot && 'badge-dot']">
    <slot />
  </span>
</template>
