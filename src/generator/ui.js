import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { copyTemplateFiles } from '@/utils/files.js';
import { loadTemplate, resolveLayerTemplate } from '@/templates/index.js';
import { templateVariables } from './variables.js';
function layerIds(config) {
    const layers = [];
    if (config.styling === 'tailwind')
        layers.push('tailwind');
    if (config.useShadcn)
        layers.push('shadcn');
    if (config.stateManager)
        layers.push(config.stateManager);
    return layers;
}
async function collect(template, folder, planned) {
    if (planned.some(entry => entry.template.id === template.id && entry.into === folder))
        return;
    for (const required of template.metadata.requires ?? []) {
        const { template: id, into = '' } = typeof required === 'string' ? { template: required } : required;
        await collect(await loadTemplate(id), into, planned);
    }
    planned.push({ template, into: folder });
}
export async function planUI(config) {
    if (!config.hasUi)
        return undefined;
    if (!config.uiFramework) {
        throw new Error('A UI was requested but no UI framework was selected.');
    }
    if (config.useShadcn && config.styling !== 'tailwind') {
        throw new Error('shadcn/ui requires Tailwind.');
    }
    const ui = await loadTemplate(`ui/${config.uiFramework}`);
    if (!ui.metadata.destination) {
        throw new Error(`Template "${ui.id}" must declare a "destination".`);
    }
    const templates = [];
    await collect(ui, '', templates);
    for (const layer of layerIds(config)) {
        const template = await resolveLayerTemplate(config.uiFramework, layer);
        if (!template) {
            throw new Error(`The ${config.uiFramework} UI does not support "${layer}".`);
        }
        await collect(template, '', templates);
    }
    return {
        destination: ui.metadata.destination,
        templates,
    };
}
function sorted(record) {
    return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}
async function patchPackageJson(directory, patch, templateId) {
    const packagePath = path.join(directory, 'package.json');
    let packageJson;
    try {
        packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
    }
    catch {
        throw new Error(`Template "${templateId}" patches package.json, but ${packagePath} is missing or invalid.`);
    }
    for (const section of ['dependencies', 'devDependencies', 'scripts']) {
        const additions = patch[section];
        if (!additions)
            continue;
        const merged = { ...packageJson[section], ...additions };
        packageJson[section] = section === 'scripts' ? merged : sorted(merged);
    }
    await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}
function withDestination(manifest, destination) {
    const prefix = (value) => value.startsWith('@') ? value : path.posix.join(destination, value);
    const result = { ...manifest };
    if (manifest.uiPage)
        result.uiPage = prefix(manifest.uiPage);
    if (manifest.files)
        result.files = manifest.files.map(prefix);
    if (manifest.sharedScripts)
        result.sharedScripts = manifest.sharedScripts.map(prefix);
    if (manifest.clientScripts)
        result.clientScripts = manifest.clientScripts.map(prefix);
    if (manifest.serverScripts)
        result.serverScripts = manifest.serverScripts.map(prefix);
    return result;
}
export async function generateUI(config, projectDirectory, plan) {
    const destinationDirectory = path.join(projectDirectory, plan.destination);
    const variables = templateVariables(config);
    const contributions = [];
    for (const { template, into } of plan.templates) {
        if (template.filesDirectory) {
            await copyTemplateFiles(template.filesDirectory, path.join(destinationDirectory, into), variables);
        }
        if (template.metadata.package) {
            await patchPackageJson(destinationDirectory, template.metadata.package, template.id);
        }
        if (template.metadata.manifest) {
            contributions.push(withDestination(template.metadata.manifest, plan.destination));
        }
    }
    return contributions;
}
export async function generateNuiBackend(config, projectDirectory) {
    if (!config.hasUi)
        return [];
    const template = await loadTemplate(`features/nui/${config.backendLanguage}`);
    if (template.filesDirectory) {
        await copyTemplateFiles(template.filesDirectory, projectDirectory, templateVariables(config));
    }
    return template.metadata.manifest ? [template.metadata.manifest] : [];
}
