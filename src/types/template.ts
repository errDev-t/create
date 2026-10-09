import type { ManifestContribution } from './manifest.js'

export type PackagePatch = {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    scripts?: Record<string, string>
}

export type TemplateMetadata = {
    // Where the template files should be copied in the generated project.
    // Layers use the destination of their parent UI instead.
    destination?: string

    // Extra folders to look in for optional layers like Tailwind or Zustand.
    // The UI's own layers folder is checked first.
    layerSources?: string[]

    // Templates that need to be copied before this one.
    // Use `into` to copy a required template into a specific subfolder.
    requires?: Array<string | { template: string; into?: string }>

    // Extra entries to add to fxmanifest.lua.
    // All paths are relative to the template's destination.
    manifest?: ManifestContribution

    // Dependencies and scripts to add to the generated package.json.
    package?: PackagePatch
}

export type Template = {
    // Template path relative to `templates/`, for example `ui/react`.
    id: string

    // Folder containing the template files.
    // Omitted when the template only adds metadata or requires other templates.
    filesDirectory?: string

    // Settings that control how the template is generated.
    metadata: TemplateMetadata
}