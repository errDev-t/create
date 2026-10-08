import { onMounted, onUnmounted } from 'vue'
import { onNuiMessage } from '../lib/nui'
import type { NuiMessage } from '../types'

/**
 * Runs `handler` whenever the client script sends `action` with SendNUIMessage.
 * Use '*' to receive every message. Call it inside setup().
 *
 * @example
 * useNuiEvent<boolean>('showUi', show => (visible.value = show))
 */
export function useNuiEvent<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void) {
  let stop: (() => void) | undefined

  onMounted(() => {
    stop = onNuiMessage<T>(action, handler)
  })

  onUnmounted(() => stop?.())
}
