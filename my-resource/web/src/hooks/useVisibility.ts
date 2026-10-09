import { useCallback, useState } from 'react'
import { fetchNui, isBrowser } from '@/lib/nui'
import { useNuiEvent } from './useNuiEvent'

/**
 * Whether the UI is shown. The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function useVisibility() {
  // In a browser there is no client script to open the UI, so start open.
  const [visible, setVisible] = useState(isBrowser)

  useNuiEvent<boolean>('showUi', show => setVisible(show !== false))

  const show = useCallback(() => setVisible(true), [])

  // Tells the client script to release NUI focus.
  const close = useCallback(() => {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
  }, [])

  return { visible, show, close }
}
