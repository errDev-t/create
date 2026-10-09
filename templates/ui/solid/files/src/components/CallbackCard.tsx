import { For, Match, Show, Switch } from 'solid-js'
import { LoaderCircle, MapPin, TriangleAlert } from 'lucide-solid'
import { createNuiCallback } from '@/primitives/createNuiCallback'
import type { Position } from '@/types'
import { Button } from './Button'

/** Calls the getClientData NUI callback and shows what comes back. */
export function CallbackCard() {
  const [state, run] = createNuiCallback<Position>('getClientData')

  const loading = () => state().status === 'loading'

  // Narrow the state union for each branch below.
  const failed = () => {
    const current = state()

    return current.status === 'error' ? current : undefined
  }

  const position = () => {
    const current = state()

    return current.status === 'success' ? current.data : undefined
  }

  return (
    <section class="card">
      <div class="card-head">
        <div>
          <h2 class="card-title">UI to client</h2>
          <p class="card-desc">Calls RegisterNUICallback in your client script with fetchNui.</p>
        </div>
        <Button size="sm" disabled={loading()} onClick={() => run()}>
          <Show when={loading()} fallback={<MapPin class="icon icon-sm" />}>
            <LoaderCircle class="icon icon-sm spin" />
          </Show>
          Fetch position
        </Button>
      </div>

      <Switch>
        <Match when={state().status === 'idle'}>
          <div class="empty">
            <MapPin class="icon" />
            <strong>No data yet</strong>
            <span>Press Fetch position to call the client script.</span>
          </div>
        </Match>

        <Match when={loading()}>
          <div class="coords" aria-busy="true">
            <div class="skeleton" />
            <div class="skeleton" />
            <div class="skeleton" />
          </div>
        </Match>

        <Match when={failed()}>
          {current => (
            <div class="alert" role="alert">
              <TriangleAlert class="icon icon-lg" />
              <div>
                <strong>Request failed</strong>
                <p>{current().error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => run()}>
                Retry
              </Button>
            </div>
          )}
        </Match>

        <Match when={position()}>
          {data => (
            <div class="coords">
              <For each={['x', 'y', 'z'] as const}>
                {axis => (
                  <div class="coord">
                    <span class="coord-label">{axis.toUpperCase()}</span>
                    <span class="coord-value">{data()[axis].toFixed(2)}</span>
                  </div>
                )}
              </For>
            </div>
          )}
        </Match>
      </Switch>
    </section>
  )
}
