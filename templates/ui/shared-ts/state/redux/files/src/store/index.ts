import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isBrowser } from '@/lib/nui'

const appSlice = createSlice({
    name: 'app',

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

export const getVisible = () => store.getState().app.visible
export const setVisible = (visible: boolean) => {
    store.dispatch(appSlice.actions.setVisible(visible))
}
export const subscribe = (listener: () => void) => store.subscribe(listener)
