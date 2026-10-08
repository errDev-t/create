import { onCleanup, onMount } from 'solid-js'
import { onNuiMessage } from '../lib/nui'
import type { NuiMessage } from '../types'

/**
 * Runs `handler` whenever the client script sends `action` with SendNUIMessage.
 * Use '*' to receive every message. Call it inside a component.
 *
 * @example
 * createNuiEvent<boolean>('showUi', show => setVisible(show))
 */
export function createNuiEvent<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void) {
  onMount(() => {
    onCleanup(onNuiMessage<T>(action, handler))
  })
}
