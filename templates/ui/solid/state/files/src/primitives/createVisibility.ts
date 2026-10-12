import { createSignal, onCleanup } from 'solid-js'
import { fetchNui } from '@/lib/nui'
import { getVisible, setVisible, subscribe } from '@/store/'
import { createNuiEvent } from './createNuiEvent'

/**
 * Whether the UI is shown (kept in the store). The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function createVisibility() {
  const [visible, setSignal] = createSignal(getVisible())

  onCleanup(subscribe(() => setSignal(getVisible())))

  createNuiEvent<boolean>('showUi', show => setVisible(show !== false))

  const show = () => setVisible(true)

  const close = () => {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
  }

  return { visible, show, close }
}
