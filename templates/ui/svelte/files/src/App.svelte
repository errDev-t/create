<script lang="ts">
  import { LayoutDashboard, X } from 'lucide-svelte'
  import Badge from './components/Badge.svelte'
  import Button from './components/Button.svelte'
  import CallbackCard from './components/CallbackCard.svelte'
  import MessageCard from './components/MessageCard.svelte'
  import { isBrowser } from './lib/nui'
  import { createVisibility } from './lib/visibility.svelte'

  const appName = '{{projectName}}'
  const browser = isBrowser()
  const ui = createVisibility()

  function onKeyDown(event: KeyboardEvent) {
    if (ui.visible && event.key === 'Escape') ui.close()
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="app">
  <div class="window" data-open={String(ui.visible)}>
    <header class="window-header">
      <div class="brand">
        <span class="brand-mark"><LayoutDashboard class="icon icon-lg" /></span>
        <div>
          <h1 class="brand-title">{appName}</h1>
          <p class="brand-sub">NUI starter</p>
        </div>
      </div>
      <div class="header-actions">
        <Badge variant={browser ? 'accent' : 'success'} dot>
          {browser ? 'Browser preview' : 'In game'}
        </Badge>
        <Button variant="ghost" size="icon" aria-label="Close" onclick={ui.close}>
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
      <span>{browser ? 'Browser preview with mocked NUI callbacks' : 'Connected to the game client'}</span>
    </footer>
  </div>

  {#if browser && !ui.visible}
    <Button class="dev-reopen" variant="outline" size="sm" onclick={ui.show}>Reopen UI</Button>
  {/if}
</div>
