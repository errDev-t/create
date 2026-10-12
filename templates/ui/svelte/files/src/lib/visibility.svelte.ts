import { fetchNui, isBrowser } from './nui'
import { nuiEvent } from './nuiEvent'

/**
 * Whether the UI is shown. The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function createVisibility() {
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

    close() {
      visible = false
      fetchNui('hideFrame').catch(() => {})
    },
  }
}
