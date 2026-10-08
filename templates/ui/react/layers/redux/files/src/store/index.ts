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

export const { setVisible } = appSlice.actions

export const store = configureStore({
  reducer: { app: appSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
