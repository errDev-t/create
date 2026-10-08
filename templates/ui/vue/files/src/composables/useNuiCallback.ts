import { shallowRef } from 'vue'
import { fetchNui } from '../lib/nui'

type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/**
 * Calls a NUI callback and tracks its idle / loading / success / error state.
 *
 * @example
 * const { state, run } = useNuiCallback<Position>('getClientData')
 */
export function useNuiCallback<T = unknown>(event: string) {
  const state = shallowRef<State<T>>({ status: 'idle' })

  async function run(payload?: unknown) {
    state.value = { status: 'loading' }

    try {
      state.value = { status: 'success', data: await fetchNui<T>(event, payload) }
    } catch (error) {
      state.value = { status: 'error', error: error instanceof Error ? error.message : String(error) }
    }
  }

  return { state, run }
}
