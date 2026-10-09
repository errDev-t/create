import type { FrameworkDefinition } from '../../types/framework.js'

export const esx: FrameworkDefinition = {
    manifest: {
        dependencies: [
            'es_extended',
        ],

        sharedScripts: [
            "@es_extended/imports.lua",
        ],
    },
}
