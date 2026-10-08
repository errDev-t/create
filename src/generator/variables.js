export function templateVariables(config) {
    return {
        projectName: config.projectName,
        projectSlug: config.projectName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'resource',
    };
}
