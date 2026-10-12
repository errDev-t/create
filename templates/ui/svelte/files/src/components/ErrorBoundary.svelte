<script lang="ts">
    import type { Snippet } from 'svelte'
    import { fetchNui } from '@/lib/nui'

    let { children, fallback }: { children: Snippet; fallback?: Snippet } = $props()

    function onerror(error: unknown) {
        console.error('[NUI] Unhandled UI error:', error)

        fetchNui('hideFrame').catch(() => {})
    }
</script>

<svelte:boundary {onerror}>
    {@render children()}

    {#snippet failed()}
        {@render fallback?.()}
    {/snippet}
</svelte:boundary>