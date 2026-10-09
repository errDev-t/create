import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { frameworks } from '../definitions/frameworks/index.js';
import { listFiles, matchesAnyGlob } from '../utils/files.js';
export function getFramework(name) {
    const framework = frameworks[name];
    if (!framework) {
        throw new Error(`Framework "${name}" is not supported yet.`);
    }
    return framework;
}
function injectLines(content, lines) {
    const existing = new Set(content.split(/\r?\n/).map(line => line.trim()));
    const missing = lines.filter(line => !existing.has(line.trim()));
    if (!missing.length)
        return content;
    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    const header = missing.join(eol) + eol;
    return content.trim() ? header + eol + content : header;
}
async function injectIntoFiles(projectDirectory, patterns, lines) {
    const files = (await listFiles(projectDirectory))
        .filter(file => matchesAnyGlob(file, patterns));
    for (const file of files) {
        const filePath = path.join(projectDirectory, file);
        const content = await readFile(filePath, 'utf8');
        const updated = injectLines(content, lines);
        if (updated !== content) {
            await writeFile(filePath, updated);
        }
    }
}
export async function generateFramework(framework, config, projectDirectory, backend) {
    const injection = framework.inject?.[config.backendLanguage];
    if (injection?.client?.length) {
        await injectIntoFiles(projectDirectory, backend.clientScripts ?? [], injection.client);
    }
    if (injection?.server?.length) {
        await injectIntoFiles(projectDirectory, backend.serverScripts ?? [], injection.server);
    }
    return framework.manifest ?? {};
}
