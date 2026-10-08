import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
export async function readTemplateManifest(directory) {
    const manifestPath = path.join(directory, 'manifest.json');
    let content;
    try {
        content = await readFile(manifestPath, 'utf8');
    }
    catch {
        throw new Error(`Missing template manifest: ${manifestPath}`);
    }
    try {
        return JSON.parse(content);
    }
    catch {
        throw new Error(`Invalid JSON in template manifest: ${manifestPath}`);
    }
}
function externalFirst(scripts) {
    return [
        ...scripts.filter(script => script.startsWith('@')),
        ...scripts.filter(script => !script.startsWith('@')),
    ];
}
export function mergeManifest(contributions) {
    const collect = (key) => [
        ...new Set(contributions.flatMap(contribution => contribution[key] ?? [])),
    ];
    const uiPage = contributions
        .map(contribution => contribution.uiPage)
        .filter(page => page !== undefined)
        .at(-1);
    return {
        fxVersion: 'cerulean',
        game: 'gta5',
        lua54: contributions.some(contribution => contribution.lua54),
        dependencies: collect('dependencies'),
        clientScripts: externalFirst(collect('clientScripts')),
        serverScripts: externalFirst(collect('serverScripts')),
        sharedScripts: externalFirst(collect('sharedScripts')),
        ...(uiPage && { uiPage }),
        files: collect('files'),
    };
}
const quote = (value) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
export function renderManifest(manifest) {
    const lines = [
        `fx_version ${quote(manifest.fxVersion)}`,
        `game ${quote(manifest.game)}`,
    ];
    if (manifest.lua54) {
        lines.push("lua54 'yes'");
    }
    lines.push('');
    const blocks = [
        ['dependencies', manifest.dependencies],
        ['client_scripts', manifest.clientScripts],
        ['server_scripts', manifest.serverScripts],
        ['shared_scripts', manifest.sharedScripts],
        ['files', manifest.files],
    ];
    for (const [name, values] of blocks) {
        if (!values.length)
            continue;
        lines.push(`${name} {`, ...values.map(value => `    ${quote(value)},`), '}', '');
    }
    if (manifest.uiPage) {
        lines.push(`ui_page ${quote(manifest.uiPage)}`, '');
    }
    return lines.join('\n');
}
export async function generateManifest(projectDirectory, contributions) {
    await writeFile(path.join(projectDirectory, 'fxmanifest.lua'), renderManifest(mergeManifest(contributions)), 'utf8');
}
