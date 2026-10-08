import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isBrowser } from '../lib/nui'

const appSlice = createSlice({
    name: 'app',
    // In a browser there is no client script to open the UI, so start open.
    initialState: { visible: isBrowser() },
    reducers: {
        setVisible(state, action: PayloadAction<boolean>) {
            state.visible = action.payload
        },
    },
})

export const store = configureStore({
    reducer: { app: appSlice.reducer },
})

// Used by the framework adapter in useVisibility; add your own slices to the store above.
export const getVisible = () => store.getState().app.visible
export const setVisible = (visible: boolean) => {
    store.dispatch(appSlice.actions.setVisible(visible))
}
export const subscribe = (listener: () => void) => store.subscribe(listener)
