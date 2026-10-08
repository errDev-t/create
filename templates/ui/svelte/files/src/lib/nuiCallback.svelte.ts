import { fetchNui } from './nui'

type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

/**
 * Calls a NUI callback and tracks its idle / loading / success / error state.
 *
 * @example
 * const position = nuiCallback<Position>('getClientData')
 * position.run()   // then read position.state.status
 */
export function nuiCallback<T = unknown>(event: string) {
  let state = $state<State<T>>({ status: 'idle' })

  async function run(payload?: unknown) {
    state = { status: 'loading' }

    try {
      state = { status: 'success', data: await fetchNui<T>(event, payload) }
    } catch (error) {
      state = { status: 'error', error: error instanceof Error ? error.message : String(error) }
    }
  }

  return {
    get state() {
      return state
    },
    run,
  }
}
