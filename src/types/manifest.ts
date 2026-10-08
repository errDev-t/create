/** What a single layer (backend, framework, UI, feature) adds to fxmanifest.lua. */
export type ManifestContribution = {
    lua54?: boolean

    dependencies?: string[]

    clientScripts?: string[]

    serverScripts?: string[]

    sharedScripts?: string[]

    uiPage?: string

    files?: string[]
}

/** The merged result that gets rendered into fxmanifest.lua. */
export type ManifestConfig = {
    fxVersion: string
    game: string

    lua54: boolean

    dependencies: string[]

    clientScripts: string[]

    serverScripts: string[]

    sharedScripts: string[]

    uiPage?: string

    files: string[]
}