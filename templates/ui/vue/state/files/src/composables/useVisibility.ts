import { onUnmounted, ref } from 'vue'
import { fetchNui } from '../lib/nui'
import { getVisible, setVisible, subscribe } from '../store'
import { useNuiEvent } from './useNuiEvent'

/**
 * Whether the UI is shown (kept in the store). The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function useVisibility() {
  const visible = ref(getVisible())

  onUnmounted(subscribe(() => {
    visible.value = getVisible()
  }))

  useNuiEvent<boolean>('showUi', show => setVisible(show !== false))

  function show() {
    setVisible(true)
  }

  // Tells the client script to release NUI focus.
  function close() {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
  }

  return { visible, show, close }
}
