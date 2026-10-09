import type { ProjectConfig } from '../types/prompt.js'

export function templateVariables(config: ProjectConfig): Record<string, string> {
    return {
        projectName: config.projectName,

        projectSlug: config.projectName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'resource',
    }
}
