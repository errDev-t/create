// NUI glue for the web/ UI. The UI listens for the 'showUi' action and calls
// the NUI callbacks registered below (see web/src/nui and web/src/nui/mocks.ts).

type NuiCallback = (data: unknown) => void

function setVisible(visible: boolean) {
    SetNuiFocus(visible, visible)
    SendNUIMessage({ action: 'showUi', data: visible })
}

RegisterCommand('show-nui', () => setVisible(true), false)

// Called by the UI when it closes (close button or Esc).
RegisterNuiCallbackType('hideFrame')
on('__cfx_nui:hideFrame', (_data: unknown, cb: NuiCallback) => {
    setVisible(false)
    cb({})
})

// Example callback: the UI's Player tab asks for the player's position.
RegisterNuiCallbackType('getClientData')
on('__cfx_nui:getClientData', (_data: unknown, cb: NuiCallback) => {
    const [x, y, z] = GetEntityCoords(PlayerPedId(), true)

    cb({ x, y, z })
})
