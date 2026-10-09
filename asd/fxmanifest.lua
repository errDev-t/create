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
    'web/index.html',
    'web/css/**/*',
    'web/js/**/*',
}

ui_page 'web/index.html'
