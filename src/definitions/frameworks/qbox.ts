import type { FrameworkDefinition } from '@/types/framework.js'

export const qbox: FrameworkDefinition = {
    manifest: {
        sharedScripts: [
            '@qbx_core/modules/lib.lua',
        ],

        clientScripts: [
            '@qbx_core/modules/playerdata.lua',
        ],
    },
}