import { createStore } from 'zustand/vanilla'
import { isBrowser } from '../lib/nui'

interface AppState {
    visible: boolean
}

export const store = createStore<AppState>(() => ({
    // In a browser there is no client script to open the UI, so start open.
    visible: isBrowser(),
}))

// Used by the framework adapter in useVisibility; add your own state to the store above.
export const getVisible = () => store.getState().visible
export const setVisible = (visible: boolean) => store.setState({ visible })
export const subscribe = (listener: () => void) => store.subscribe(() => listener())
