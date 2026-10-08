import type { NuiMessage } from '../types'
import { mockNui } from './mocks'

declare global {
    interface Window {
        GetParentResourceName?: () => string
        invokeNative?: unknown
    }
}

/** True in a regular browser (npm run dev), false inside the game. */
export const isBrowser = (): boolean => !window.invokeNative

/**
 * Runs `handler` when the client script sends `action` with SendNUIMessage.
 * Pass '*' to receive every message. Returns a function that stops listening.
 */
export function onNuiMessage<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void): () => void {
    const listener = (event: MessageEvent<NuiMessage<T> | undefined>) => {
        const message = event.data

        if (message && (action === '*' || message.action === action)) handler(message.data, message)
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
}

/** Does what SendNUIMessage does in game, to test message handling in a browser. */
export function dispatchNuiMessage(action: string, data?: unknown) {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }))
}

/**
 * Calls a RegisterNUICallback in the client script and resolves with what it
 * passes to `cb`. In a browser it uses the mocks in ./mocks.ts instead.
 */
export async function fetchNui<T = unknown>(event: string, data?: unknown): Promise<T> {
    if (isBrowser()) return mockNui<T>(event, data)

    const response = await fetch(`https://${window.GetParentResourceName!()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data ?? {}),
    })

    if (!response.ok) {
        throw new Error(`NUI callback "${event}" failed (${response.status}).`)
    }

    return response.json() as Promise<T>
}
