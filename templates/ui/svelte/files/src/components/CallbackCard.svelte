<script lang="ts">
  import { LoaderCircle, MapPin, TriangleAlert } from 'lucide-svelte'
  import { nuiCallback } from '../lib/nuiCallback.svelte'
  import type { Position } from '../types'
  import Button from './Button.svelte'

  // Calls the getClientData NUI callback and shows what comes back.
  const position = nuiCallback<Position>('getClientData')
  const axes = ['x', 'y', 'z'] as const
</script>

<section class="card">
  <div class="card-head">
    <div>
      <h2 class="card-title">UI to client</h2>
      <p class="card-desc">Calls RegisterNUICallback in your client script with fetchNui.</p>
    </div>
    <Button size="sm" disabled={position.state.status === 'loading'} onclick={() => position.run()}>
      {#if position.state.status === 'loading'}
        <LoaderCircle class="icon icon-sm spin" />
      {:else}
        <MapPin class="icon icon-sm" />
      {/if}
      Fetch position
    </Button>
  </div>

  {#if position.state.status === 'idle'}
    <div class="empty">
      <MapPin class="icon" />
      <strong>No data yet</strong>
      <span>Press Fetch position to call the client script.</span>
    </div>
  {:else if position.state.status === 'loading'}
    <div class="coords" aria-busy="true">
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
    </div>
  {:else if position.state.status === 'error'}
    <div class="alert" role="alert">
      <TriangleAlert class="icon icon-lg" />
      <div>
        <strong>Request failed</strong>
        <p>{position.state.error}</p>
      </div>
      <Button variant="outline" size="sm" onclick={() => position.run()}>Retry</Button>
    </div>
  {:else}
    {@const data = position.state.data}
    <div class="coords">
      {#each axes as axis (axis)}
        <div class="coord">
          <span class="coord-label">{axis.toUpperCase()}</span>
          <span class="coord-value">{data[axis].toFixed(2)}</span>
        </div>
      {/each}
    </div>
  {/if}
</section>
