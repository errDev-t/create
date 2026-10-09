import { ref } from 'vue'
import { fetchNui, isBrowser } from '@/lib/nui'
import { useNuiEvent } from './useNuiEvent'

/**
 * Whether the UI is shown. The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function useVisibility() {
  // In a browser there is no client script to open the UI, so start open.
  const visible = ref(isBrowser())

  useNuiEvent<boolean>('showUi', show => {
    visible.value = show !== false
  })

  function show() {
    visible.value = true
  }

  // Tells the client script to release NUI focus.
  function close() {
    visible.value = false
    fetchNui('hideFrame').catch(() => {})
  }

  return { visible, show, close }
}
