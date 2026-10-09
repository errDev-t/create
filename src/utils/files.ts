import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const TEMPLATE_MANIFEST = 'manifest.json'

const RENAMED_FILES: Record<string, string> = {
    _gitignore: '.gitignore',
}

export async function copyTemplateFiles(
    sourceDirectory: string,
    destinationDirectory: string,
    variables: Record<string, string> = {},
) {
    await copyDirectory(
        sourceDirectory,
        destinationDirectory,
        variables,
        true,
    )
}

async function copyDirectory(
    sourceDirectory: string,
    destinationDirectory: string,
    variables: Record<string, string>,
    isTemplateRoot = false,
) {
    const entries = await readdir(sourceDirectory, {
        withFileTypes: true,
    })

    await mkdir(destinationDirectory, {
        recursive: true,
    })

    for (const entry of entries) {
        const sourcePath = path.join(sourceDirectory, entry.name)
        const destinationPath = path.join(
            destinationDirectory,
            RENAMED_FILES[entry.name] ?? entry.name,
        )

        if (isTemplateRoot && entry.name === TEMPLATE_MANIFEST) {
            continue
        }

        if (entry.isDirectory()) {
            await copyDirectory(
                sourcePath,
                destinationPath,
                variables,
            )
            continue
        }

        const content = await readFile(sourcePath)

        // Keep binary files unchanged.
        if (content.includes(0)) {
            await writeFile(destinationPath, content)
            continue
        }

        let text = content.toString('utf8')

        for (const [key, value] of Object.entries(variables)) {
            text = text.replaceAll(`{{${key}}}`, value)
        }

        await writeFile(destinationPath, text)
    }
}

export async function listFiles(
    directory: string,
    prefix = '',
): Promise<string[]> {
    const entries = await readdir(
        path.join(directory, prefix),
        { withFileTypes: true },
    )

    const files: string[] = []

    for (const entry of entries) {
        const relativePath = prefix
            ? `${prefix}/${entry.name}`
            : entry.name

        if (entry.isDirectory()) {
            if (entry.name === 'node_modules') continue

            files.push(
                ...await listFiles(directory, relativePath),
            )
            continue
        }

        files.push(relativePath)
    }

    return files
}

function globToRegExp(pattern: string) {
    let source = ''

    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i]!

        if (char === '*' && pattern[i + 1] === '*') {
            i++

            if (pattern[i + 1] === '/') {
                i++
                source += '(?:.*/)?'
            } else {
                source += '.*'
            }
        } else if (char === '*') {
            source += '[^/]*'
        } else {
            source += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        }
    }

    return new RegExp(`^${source}$`)
}

export function matchesAnyGlob(
    file: string,
    patterns: string[],
) {
    return patterns.some(pattern => globToRegExp(pattern).test(file))
}