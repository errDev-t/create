import type { ManifestContribution } from './manifest.js'

/** Entries merged into a generated package.json. */
export type PackagePatch = {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    scripts?: Record<string, string>
}

/** Contents of a template's `template.json`. */
export type TemplateMetadata = {
    /**
     * Where the template's files are copied, relative to the project root.
     * Layers don't declare one: they land in their UI's destination.
     */
    destination?: string

    /**
     * Folders (relative to `templates/`) holding this template's optional layers
     * (tailwind, zustand, ...), searched in order. A UI's own `layers/` folder is
     * always searched first.
     */
    layerSources?: string[]

    /**
     * Other templates (paths relative to `templates/`), copied first.
     * `into` copies one into a sub-folder of the destination (e.g. shared CSS).
     */
    requires?: Array<string | { template: string; into?: string }>

    /** Manifest additions. Paths are relative to `destination`. */
    manifest?: ManifestContribution

    /** Merged into `<destination>/package.json`. */
    package?: PackagePatch
}

export type Template = {
    /** Path relative to `templates/`, e.g. `ui/react`. Used in messages. */
    id: string
    /** Absent for templates that only add metadata (a manifest or `requires`). */
    filesDirectory?: string
    metadata: TemplateMetadata
}
