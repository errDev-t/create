import path from 'node:path'
import { copyTemplateFiles } from '@/utils/files.js'
import { templatesDir } from '@/utils/paths.js'
import { readTemplateManifest } from './manifest.js'
import { templateVariables } from './variables.js'
import type { ProjectConfig } from '@/types/prompt.js'
import type { ManifestContribution } from '@/types/manifest.js'

export async function generateBackend(
    config: ProjectConfig,
    projectDirectory: string,
): Promise<ManifestContribution> {
    const backendDirectory = path.join(
        templatesDir,
        'backend',
        config.backendLanguage,
    )

    const manifest = await readTemplateManifest(backendDirectory)

    await copyTemplateFiles(
        backendDirectory,
        projectDirectory,
        templateVariables(config),
    )

    return manifest
}
