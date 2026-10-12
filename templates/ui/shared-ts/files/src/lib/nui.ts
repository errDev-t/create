import type { NuiMessage } from '@/types/index'
import { mockNui } from './mocks'

declare global {
    interface Window {
        GetParentResourceName?: () => string
        invokeNative?: unknown
    }
}

export const isBrowser = (): boolean => !window.invokeNative

export function onNuiMessage<T = unknown>(action: string, handler: (data: T, message: NuiMessage<T>) => void): () => void {
    const listener = (event: MessageEvent<NuiMessage<T> | undefined>) => {
        const message = event.data

        if (message && (action === '*' || message.action === action)) handler(message.data, message)
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
}

export function dispatchNuiMessage(action: string, data?: unknown) {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }))
}

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
