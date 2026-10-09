import { useCallback, useState } from 'react'
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
 * const { state, run } = useNuiCallback<Position>('getClientData')
 */
export function useNuiCallback<T = unknown>(event: string) {
  const [state, setState] = useState<State<T>>({ status: 'idle' })

  const run = useCallback(
    async (payload?: unknown) => {
      setState({ status: 'loading' })

      try {
        setState({ status: 'success', data: await fetchNui<T>(event, payload) })
      } catch (error) {
        setState({ status: 'error', error: error instanceof Error ? error.message : String(error) })
      }
    },
    [event],
  )

  return { state, run }
}
