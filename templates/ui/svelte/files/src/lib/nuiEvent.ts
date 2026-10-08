import { onMount } from 'svelte'
import { onNuiMessage } from './nui'
import type { NuiMessage } from '../types'

/**
 * Runs `handler` whenever the client script sends `action` with SendNUIMessage.
 * Use '*' to receive every message. Call it while a component initialises.
 *
 * @example
 * nuiEvent<boolean>('showUi', show => (visible = show))
 */
export function nuiEvent<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void) {
  onMount(() => onNuiMessage<T>(action, handler))
}
