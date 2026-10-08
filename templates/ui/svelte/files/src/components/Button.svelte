<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Props = HTMLButtonAttributes & {
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'icon'
    children?: Snippet
  }

  let { variant = 'default', size = 'default', class: className = '', children, ...rest }: Props = $props()
</script>

<button type="button" class={['btn', `btn-${variant}`, size !== 'default' && `btn-${size}`, className]} {...rest}>
  {@render children?.()}
</button>
