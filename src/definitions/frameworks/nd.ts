import type { FrameworkDefinition } from '../../types/framework.js';

const getCoreObjectLUA = "local NDCore = exports['ND_Core']";
const getCoreObjectJS = "const NDCore = exports['ND_Core']";
const getCoreObjectTS = "const NDCore = global.exports['ND_Core']";

export const nd: FrameworkDefinition = {
    manifest: {
        dependencies: [
            'ND_Core',
        ],
        sharedScripts: [
            '@ND_Core/init.lua',
        ],
    },

    inject: {
        lua: {
            client: [getCoreObjectLUA],
            server: [getCoreObjectLUA],
        },
        javascript: {
            client: [getCoreObjectJS],
            server: [getCoreObjectJS],
        },
        typescript: {
            client: [getCoreObjectTS],
            server: [getCoreObjectTS],
        },
    },
};
