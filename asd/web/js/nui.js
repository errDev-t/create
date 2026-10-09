// NUI helpers. These are plain globals, loaded by index.html before main.js.

/** True in a regular browser (open index.html), false inside the game. */
function isBrowser() {
    return !window.invokeNative
}

/**
 * Runs `handler` when the client script sends `action` with SendNUIMessage.
 * Pass '*' to receive every message. Returns a function that stops listening.
 */
function onNuiMessage(action, handler) {
    const listener = event => {
        const message = event.data

        if (message && (action === '*' || message.action === action)) handler(message.data, message)
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
}

/** Does what SendNUIMessage does in game, to test message handling in a browser. */
function dispatchNuiMessage(action, data) {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }))
}

/**
 * Calls a RegisterNUICallback in the client script and resolves with what it
 * passes to `cb`. In a browser it uses the mocks in mocks.js instead.
 */
async function fetchNui(event, data) {
    if (isBrowser()) return mockNui(event, data)

    const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data ?? {}),
    })

    if (!response.ok) {
        throw new Error(`NUI callback "${event}" failed (${response.status}).`)
    }

    return response.json()
}
