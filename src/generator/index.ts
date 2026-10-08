import path from 'node:path'
import { mkdir, readdir } from 'node:fs/promises'
import type { ProjectConfig } from '@/types/prompt.js'
import type { ManifestContribution } from '@/types/manifest.js'

import { generateBackend } from './backend.js'
import { generateFramework, getFramework } from './framework.js'
import { generateNuiBackend, generateUI, planUI } from './ui.js'
import { generateManifest } from './manifest.js'

async function assertDirectoryIsFree(directory: string) {
    const entries = await readdir(directory).catch(() => [])

    if (entries.length) {
        throw new Error(
            `Directory already exists and is not empty: ${directory}`,
        )
    }
}

export async function generateProject(
    config: ProjectConfig,
) {
    const projectDirectory = path.resolve(
        process.cwd(),
        config.projectName,
    )

    const framework = getFramework(config.framework)
    const uiPlan = await planUI(config)

    await assertDirectoryIsFree(projectDirectory)

    await mkdir(projectDirectory, {
        recursive: true,
    })

    const backend = await generateBackend(
        config,
        projectDirectory,
    )

    const nuiBackend = await generateNuiBackend(
        config,
        projectDirectory,
    )

    const frameworkManifest = await generateFramework(
        framework,
        config,
        projectDirectory,
        backend,
    )

    const contributions: ManifestContribution[] = [
        backend,
        ...nuiBackend,
        frameworkManifest,
    ]

    if (uiPlan) {
        contributions.push(
            ...await generateUI(config, projectDirectory, uiPlan),
        )
    }

    await generateManifest(
        projectDirectory,
        contributions,
    )

    return projectDirectory
}
