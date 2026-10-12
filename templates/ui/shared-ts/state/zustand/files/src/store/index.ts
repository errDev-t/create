import { createStore } from 'zustand/vanilla'
import { isBrowser } from '@/lib/nui'

interface AppState {
    visible: boolean
}

export const store = createStore<AppState>(() => ({
    visible: isBrowser(),
}))

export const getVisible = () => store.getState().visible
export const setVisible = (visible: boolean) => store.setState({ visible })
export const subscribe = (listener: () => void) => store.subscribe(() => listener())
