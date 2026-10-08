import { useCallback } from 'react'
import { fetchNui } from '../lib/nui'
import { useAppStore } from '../store'
import { useNuiEvent } from './useNuiEvent'

/**
 * Whether the UI is shown (kept in the Zustand store). The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function useVisibility() {
  const visible = useAppStore(state => state.visible)
  const setVisible = useAppStore(state => state.setVisible)

  useNuiEvent<boolean>('showUi', show => setVisible(show !== false))

  const show = useCallback(() => setVisible(true), [setVisible])

  // Tells the client script to release NUI focus.
  const close = useCallback(() => {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
  }, [setVisible])

  return { visible, show, close }
}
