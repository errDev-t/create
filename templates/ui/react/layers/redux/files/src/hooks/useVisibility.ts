import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNui } from '../lib/nui'
import { setVisible, type RootState } from '../store'
import { useNuiEvent } from './useNuiEvent'

/**
 * Whether the UI is shown (kept in the Redux store). The client script toggles it with
 * SendNUIMessage({ action = 'showUi', data = true | false }).
 */
export function useVisibility() {
  const visible = useSelector((state: RootState) => state.app.visible)
  const dispatch = useDispatch()

  useNuiEvent<boolean>('showUi', show => dispatch(setVisible(show !== false)))

  const show = useCallback(() => dispatch(setVisible(true)), [dispatch])

  // Tells the client script to release NUI focus.
  const close = useCallback(() => {
    dispatch(setVisible(false))
    fetchNui('hideFrame').catch(() => {})
  }, [dispatch])

  return { visible, show, close }
}
