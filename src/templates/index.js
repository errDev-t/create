import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { templatesDir } from '@/utils/paths.js';
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const isStringArray = (value) => Array.isArray(value) && value.every(item => typeof item === 'string');
const isStringRecord = (value) => isObject(value) && Object.values(value).every(item => typeof item === 'string');
function assertKnownKeys(value, allowed, where) {
    for (const key of Object.keys(value)) {
        if (!allowed.includes(key)) {
            throw new Error(`${where}: unknown key "${key}".`);
        }
    }
}
function parseManifest(value, where) {
    if (!isObject(value))
        throw new Error(`${where}: "manifest" must be an object.`);
    assertKnownKeys(value, [
        'lua54', 'dependencies', 'clientScripts', 'serverScripts',
        'sharedScripts', 'files', 'uiPage',
    ], `${where} (manifest)`);
    for (const [key, entry] of Object.entries(value)) {
        const valid = key === 'lua54' ? typeof entry === 'boolean'
            : key === 'uiPage' ? typeof entry === 'string'
                : isStringArray(entry);
        if (!valid)
            throw new Error(`${where}: manifest "${key}" has the wrong type.`);
    }
    return value;
}
function parsePackage(value, where) {
    if (!isObject(value))
        throw new Error(`${where}: "package" must be an object.`);
    assertKnownKeys(value, ['dependencies', 'devDependencies', 'scripts'], `${where} (package)`);
    for (const [key, entry] of Object.entries(value)) {
        if (!isStringRecord(entry)) {
            throw new Error(`${where}: package "${key}" must map names to strings.`);
        }
    }
    return value;
}
function parseMetadata(raw, where) {
    if (!isObject(raw))
        throw new Error(`${where}: template.json must contain an object.`);
    assertKnownKeys(raw, ['destination', 'layerSources', 'requires', 'manifest', 'package'], where);
    const metadata = {};
    if (raw.destination !== undefined) {
        const destination = raw.destination;
        if (typeof destination !== 'string' ||
            !destination ||
            path.isAbsolute(destination) ||
            destination.split(/[\\/]/).includes('..')) {
            throw new Error(`${where}: "destination" must be a relative path inside the project.`);
        }
        metadata.destination = destination;
    }
    if (raw.layerSources !== undefined) {
        if (!isStringArray(raw.layerSources))
            throw new Error(`${where}: "layerSources" must be a string array.`);
        metadata.layerSources = raw.layerSources;
    }
    if (raw.requires !== undefined) {
        const valid = Array.isArray(raw.requires) &&
            raw.requires.every(entry => typeof entry === 'string' ||
                (isObject(entry) &&
                    typeof entry.template === 'string' &&
                    (entry.into === undefined || (typeof entry.into === 'string' && !path.isAbsolute(entry.into) && !entry.into.split(/[\\/]/).includes('..')))));
        if (!valid)
            throw new Error(`${where}: "requires" must list template ids or { template, into } objects.`);
        metadata.requires = raw.requires;
    }
    if (raw.manifest !== undefined)
        metadata.manifest = parseManifest(raw.manifest, where);
    if (raw.package !== undefined)
        metadata.package = parsePackage(raw.package, where);
    return metadata;
}
/** Loads `<templatesDir>/<id>/template.json`; `files/` is optional. */
export async function loadTemplate(id) {
    const directory = path.join(templatesDir, id);
    const metadataPath = path.join(directory, 'template.json');
    const where = `Template "${id}"`;
    let content;
    try {
        content = await readFile(metadataPath, 'utf8');
    }
    catch {
        throw new Error(`${where} was not found (missing ${metadataPath}).`);
    }
    let raw;
    try {
        raw = JSON.parse(content);
    }
    catch {
        throw new Error(`${where} has invalid JSON in ${metadataPath}.`);
    }
    const filesPath = path.join(directory, 'files');
    return {
        id,
        filesDirectory: await directoryExists(filesPath) ? filesPath : undefined,
        metadata: parseMetadata(raw, where),
    };
}
async function directoryExists(directory) {
    return readdir(directory).then(() => true, () => false);
}
async function layerFolders(ui) {
    const { metadata } = await loadTemplate(`ui/${ui}`);
    return [`ui/${ui}/layers`, ...(metadata.layerSources ?? [])];
}
export async function resolveLayerTemplate(ui, layer) {
    for (const folder of await layerFolders(ui)) {
        if (await directoryExists(path.join(templatesDir, folder, layer))) {
            return loadTemplate(`${folder}/${layer}`);
        }
    }
    return undefined;
}
export async function getSupportedLayers(ui) {
    const folders = await layerFolders(ui);
    const names = [];
    for (const folder of folders) {
        try {
            names.push(...await readdir(path.join(templatesDir, folder)));
        }
        catch {
            // Ignore missing layer folders.
        }
    }
    return new Set(names);
}
