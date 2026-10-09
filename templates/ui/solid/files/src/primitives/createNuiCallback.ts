import { createSignal } from 'solid-js'
import { fetchNui } from '@/lib/nui'

type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/**
 * Calls a NUI callback and tracks its idle / loading / success / error state.
 *
 * @example
 * const [state, run] = createNuiCallback<Position>('getClientData')
 * state().status
 */
export function createNuiCallback<T = unknown>(event: string) {
  const [state, setState] = createSignal<State<T>>({ status: 'idle' })

  async function run(payload?: unknown) {
    setState({ status: 'loading' })

    try {
      setState({ status: 'success', data: await fetchNui<T>(event, payload) })
    } catch (error) {
      setState({ status: 'error', error: error instanceof Error ? error.message : String(error) })
    }
  }

  return [state, run] as const
}
