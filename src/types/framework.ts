import type { BackendLanguage } from './prompt.js'
import type { ManifestContribution } from './manifest.js'


/** Lines added to the top of every generated client/server source file. */
export type SourceInjection = {
    client?: string[]
    server?: string[]
}

export type FrameworkDefinition = {
    manifest?: ManifestContribution

    /**
     * Source injection is per backend language, because a Lua line
     * is meaningless in a JavaScript file.
     */
    inject?: Partial<Record<BackendLanguage, SourceInjection>>
}
