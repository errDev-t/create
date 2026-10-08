const getCoreObjectJS = "const QBCore = exports['qb-core'].GetCoreObject()";
const getCoreObjectLUA = "local QBCore = exports['qb-core']:GetCoreObject()";
const getCoreObjectTS = "const QBCore = global.exports['qb-core'].GetCoreObject()";
export const qbcore = {
    manifest: {
        dependencies: [
            'qb-core',
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
