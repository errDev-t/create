-- NUI glue for the web/ UI. The UI listens for the 'showUi' action and calls
-- the NUI callbacks registered below (see web/src/nui and web/src/nui/mocks.ts).

local function setVisible(visible)
    SetNuiFocus(visible, visible)
    SendNUIMessage({ action = 'showUi', data = visible })
end

RegisterCommand('show-nui', function()
    setVisible(true)
end, false)

-- Called by the UI when it closes (close button or Esc).
RegisterNUICallback('hideFrame', function(_, cb)
    setVisible(false)
    cb({})
end)

-- Example callback: the UI's Player tab asks for the player's position.
RegisterNUICallback('getClientData', function(_, cb)
    local coords = GetEntityCoords(PlayerPedId())

    cb({ x = coords.x, y = coords.y, z = coords.z })
end)
