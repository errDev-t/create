fx_version 'cerulean'
game 'gta5'
lua54 'yes'

client_scripts {
    'client/*.lua',
}

server_scripts {
    'server/*.lua',
}

shared_scripts {
    'common/*.lua',
}

files {
    'web/dist/**/*',
}

ui_page 'web/dist/index.html'
