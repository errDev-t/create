<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'icon'
  }>(),
  { variant: 'default', size: 'default' },
)
</script>

<template>
  <button type="button" :class="['btn', `btn-${variant}`, size !== 'default' && `btn-${size}`]">
    <slot />
  </button>
</template>
