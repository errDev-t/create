import { LoaderCircle, MapPin, TriangleAlert } from 'lucide-react'
import { useNuiCallback } from '@/hooks/useNuiCallback'
import type { Position } from '@/types'
import { Button } from './ui/button'

/** Calls the getClientData NUI callback and shows what comes back. */
export function CallbackCard() {
  const { state, run } = useNuiCallback<Position>('getClientData')

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2 className="card-title">UI to client</h2>
          <p className="card-desc">Calls RegisterNUICallback in your client script with fetchNui.</p>
        </div>
        <Button size="sm" disabled={state.status === 'loading'} onClick={() => run()}>
          {state.status === 'loading' ? <LoaderCircle className="icon icon-sm spin" /> : <MapPin className="icon icon-sm" />}
          Fetch position
        </Button>
      </div>

      {state.status === 'idle' && (
        <div className="empty">
          <MapPin className="icon" />
          <strong>No data yet</strong>
          <span>Press Fetch position to call the client script.</span>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="coords" aria-busy="true">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {state.status === 'error' && (
        <div className="alert" role="alert">
          <TriangleAlert className="icon icon-lg" />
          <div>
            <strong>Request failed</strong>
            <p>{state.error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => run()}>
            Retry
          </Button>
        </div>
      )}

      {state.status === 'success' && (
        <div className="coords">
          {(['x', 'y', 'z'] as const).map(axis => (
            <div className="coord" key={axis}>
              <span className="coord-label">{axis.toUpperCase()}</span>
              <span className="coord-value">{state.data[axis].toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
