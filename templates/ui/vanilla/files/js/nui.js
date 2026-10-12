function isBrowser() {
    return !window.invokeNative
}

function onNuiMessage(action, handler) {
    const listener = event => {
        const message = event.data

        if (message && (action === '*' || message.action === action)) handler(message.data, message)
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
}

function dispatchNuiMessage(action, data) {
    window.dispatchEvent(new MessageEvent('message', { data: { action, data } }))
}

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