import { createSignal } from 'solid-js'
import { fetchNui, isBrowser } from '@/lib/nui'
import { createNuiEvent } from './createNuiEvent'

/**
 * Whether the UI is shown. The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function createVisibility() {
  // In a browser there is no client script to open the UI, so start open.
  const [visible, setVisible] = createSignal(isBrowser())

  createNuiEvent<boolean>('showUi', show => setVisible(show !== false))

  const show = () => setVisible(true)

  // Tells the client script to release NUI focus.
  const close = () => {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
  }

  return { visible, show, close }
}
