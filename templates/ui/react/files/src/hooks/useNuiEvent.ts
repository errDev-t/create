import { useEffect, useRef } from 'react'
import { onNuiMessage } from '../lib/nui'
import type { NuiMessage } from '../types'

/**
 * Runs `handler` whenever the client script sends `action` with SendNUIMessage.
 * Use '*' to receive every message.
 *
 * @example
 * useNuiEvent<boolean>('showUi', show => setVisible(show))
 */
export function useNuiEvent<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void) {
  // Always call the latest handler without resubscribing on every render.
  const saved = useRef(handler)

  useEffect(() => {
    saved.current = handler
  })

  useEffect(() => onNuiMessage<T>(action, (data, message) => saved.current(data, message)), [action])
}
