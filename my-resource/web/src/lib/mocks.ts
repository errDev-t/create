/**
 * Browser-only responses for fetchNui. Add one for every RegisterNUICallback
 * in your client script. Open the page with ?nuiError to simulate a failure.
 */
const mocks: Record<string, (data: unknown) => unknown> = {
    hideFrame: () => ({}),
    getClientData: () => ({ x: 215.76, y: -810.12, z: 30.73 }),
}

export async function mockNui<T>(event: string, data: unknown): Promise<T> {
    const mock = mocks[event]

    if (!mock) {
        throw new Error(`No browser mock for "${event}". Add one in src/lib/mocks.ts.`)
    }

    await new Promise(resolve => setTimeout(resolve, 600))

    if (new URLSearchParams(window.location.search).has('nuiError')) {
        throw new Error(`Mocked failure for "${event}".`)
    }

    return mock(data) as T
}
