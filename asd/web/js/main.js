const browser = isBrowser()

const $ = id => document.getElementById(id)

// Lets the stylesheet draw a backdrop when previewing outside the game.
if (browser) document.documentElement.dataset.env = 'browser'

// ---------- Window ----------

let visible = browser // In a browser there is no client script to open the UI.

function setVisible(value) {
    visible = value
    $('window').dataset.open = String(value)
    $('reopen').toggleAttribute('hidden', !(browser && !value))
}

// Tells the client script to release NUI focus.
function close() {
    setVisible(false)
    fetchNui('hideFrame').catch(() => {})
}

// The client script toggles the UI with SendNUIMessage({ action = 'showUi', data = true | false }).
onNuiMessage('showUi', show => setVisible(show !== false))

window.addEventListener('keydown', event => {
    if (visible && event.key === 'Escape') close()
})

$('close').addEventListener('click', close)
$('reopen').addEventListener('click', () => setVisible(true))

$('environment').textContent = browser ? 'Browser preview' : 'In game'
$('environment').classList.add(browser ? 'badge-accent' : 'badge-success')
$('status').textContent = browser ? 'Browser preview with mocked NUI callbacks' : 'Connected to the game client'

// ---------- Client to UI ----------

// Shows the latest message the client script sent with SendNUIMessage.
onNuiMessage('*', (data, message) => {
    $('message-action').textContent = message.action
    $('message-data').textContent = JSON.stringify(data)
    $('message-time').textContent = new Date().toLocaleTimeString([], { hour12: false })

    $('message-empty').hidden = true
    $('message').hidden = false
})

if (browser) {
    $('send-test').hidden = false
    $('send-test').addEventListener('click', () => dispatchNuiMessage('ping', { sent: Date.now() }))
}

// ---------- UI to client ----------

// Shows the part of the card that matches idle | loading | error | success.
function setStatus(status) {
    document.querySelectorAll('#callback [data-state]').forEach(element => {
        element.toggleAttribute('hidden', element.dataset.state !== status)
    })

    $('fetch').disabled = status === 'loading'
    document.querySelector('#fetch [data-icon="idle"]').toggleAttribute('hidden', status === 'loading')
    document.querySelector('#fetch [data-icon="loading"]').toggleAttribute('hidden', status !== 'loading')
}

// Calls the getClientData NUI callback and shows what comes back.
async function fetchPosition() {
    setStatus('loading')

    try {
        const position = await fetchNui('getClientData')

        for (const axis of ['x', 'y', 'z']) {
            document.querySelector(`[data-axis="${axis}"]`).textContent = position[axis].toFixed(2)
        }

        setStatus('success')
    } catch (error) {
        $('error').textContent = error instanceof Error ? error.message : String(error)
        setStatus('error')
    }
}

$('fetch').addEventListener('click', fetchPosition)
$('retry').addEventListener('click', fetchPosition)

setVisible(visible)
