import { onMount } from 'svelte'
import { fetchNui } from './nui'
import { nuiEvent } from './nuiEvent'
import { getVisible, setVisible, subscribe } from '../store'

/**
 * Whether the UI is shown (kept in the store). The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function createVisibility() {
  let visible = $state(getVisible())

  onMount(() => subscribe(() => {
    visible = getVisible()
  }))

  nuiEvent<boolean>('showUi', show => setVisible(show !== false))

  return {
    get visible() {
      return visible
    },

    show() {
      setVisible(true)
    },

    // Tells the client script to release NUI focus.
    close() {
      setVisible(false)
      fetchNui('hideFrame').catch(() => {})
    },
  }
}
