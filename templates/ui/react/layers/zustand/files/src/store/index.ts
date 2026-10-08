import { create } from 'zustand'
import { isBrowser } from '../lib/nui'

interface AppState {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const useAppStore = create<AppState>(set => ({
  // In a browser there is no client script to open the UI, so start open.
  visible: isBrowser(),
  setVisible: visible => set({ visible }),
}))
