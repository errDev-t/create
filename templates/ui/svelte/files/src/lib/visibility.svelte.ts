import { fetchNui, isBrowser } from './nui'
import { nuiEvent } from './nuiEvent'

/**
 * Whether the UI is shown. The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function createVisibility() {
  // In a browser there is no client script to open the UI, so start open.
  let visible = $state(isBrowser())

  nuiEvent<boolean>('showUi', show => {
    visible = show !== false
  })

  return {
    get visible() {
      return visible
    },

    show() {
      visible = true
    },

    // Tells the client script to release NUI focus.
    close() {
      visible = false
      fetchNui('hideFrame').catch(() => {})
    },
  }
}
