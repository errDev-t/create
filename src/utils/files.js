import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const TEMPLATE_MANIFEST = 'manifest.json';
const RENAMED_FILES = {
    _gitignore: '.gitignore',
};
export async function copyTemplateFiles(sourceDirectory, destinationDirectory, variables = {}) {
    await copyDirectory(sourceDirectory, destinationDirectory, variables, true);
}
async function copyDirectory(sourceDirectory, destinationDirectory, variables, isTemplateRoot = false) {
    const entries = await readdir(sourceDirectory, {
        withFileTypes: true,
    });
    await mkdir(destinationDirectory, {
        recursive: true,
    });
    for (const entry of entries) {
        const sourcePath = path.join(sourceDirectory, entry.name);
        const destinationPath = path.join(destinationDirectory, RENAMED_FILES[entry.name] ?? entry.name);
        if (isTemplateRoot && entry.name === TEMPLATE_MANIFEST) {
            continue;
        }
        if (entry.isDirectory()) {
            await copyDirectory(sourcePath, destinationPath, variables);
            continue;
        }
        const content = await readFile(sourcePath);
        if (content.includes(0)) {
            await writeFile(destinationPath, content);
            continue;
        }
        let text = content.toString('utf8');
        for (const [key, value] of Object.entries(variables)) {
            text = text.replaceAll(`{{${key}}}`, value);
        }
        await writeFile(destinationPath, text);
    }
}
// Every file under a directory, as forward-slash paths relative to it.
export async function listFiles(directory, prefix = '') {
    const entries = await readdir(path.join(directory, prefix), { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const relativePath = prefix
            ? `${prefix}/${entry.name}`
            : entry.name;
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules')
                continue;
            files.push(...await listFiles(directory, relativePath));
        }
        else {
            files.push(relativePath);
        }
    }
    return files;
}
// Convert FiveM-style globs to a regular expression.
function globToRegExp(pattern) {
    let source = '';
    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        if (char === '*' && pattern[i + 1] === '*') {
            i++;
            if (pattern[i + 1] === '/') {
                i++;
                source += '(?:.*/)?';
            }
            else {
                source += '.*';
            }
        }
        else if (char === '*') {
            source += '[^/]*';
        }
        else {
            source += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
        }
    }
    return new RegExp(`^${source}$`);
}
export function matchesAnyGlob(file, patterns) {
    return patterns.some(pattern => globToRegExp(pattern).test(file));
}
