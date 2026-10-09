// Browser-only responses for fetchNui. Add one for every RegisterNUICallback
// in your client script. Open index.html with ?nuiError to simulate a failure.

const mocks = {
    hideFrame: () => ({}),
    getClientData: () => ({ x: 215.76, y: -810.12, z: 30.73 }),
}

async function mockNui(event, data) {
    const mock = mocks[event]

    if (!mock) {
        throw new Error(`No browser mock for "${event}". Add one in js/mocks.js.`)
    }

    await new Promise(resolve => setTimeout(resolve, 600))

    if (new URLSearchParams(window.location.search).has('nuiError')) {
        throw new Error(`Mocked failure for "${event}".`)
    }

    return mock(data)
}
