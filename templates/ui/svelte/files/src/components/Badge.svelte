<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    variant = 'default',
    dot = false,
    children,
  }: { variant?: 'default' | 'accent' | 'success'; dot?: boolean; children?: Snippet } = $props()
</script>

<span class={['badge', variant !== 'default' && `badge-${variant}`, dot && 'badge-dot']}>
  {@render children?.()}
</span>
