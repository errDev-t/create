import path from 'node:path'

import { readFile, writeFile } from 'node:fs/promises'

import type {
    ManifestConfig,
    ManifestContribution,
} from '../types/manifest.js'

export async function readTemplateManifest(
    directory: string,
): Promise<ManifestContribution> {
    const manifestPath = path.join(directory, 'manifest.json')

    let content: string

    try {
        content = await readFile(manifestPath, 'utf8')
    } catch {
        throw new Error(`Missing template manifest: ${manifestPath}`)
    }

    try {
        return JSON.parse(content) as ManifestContribution
    } catch {
        throw new Error(`Invalid JSON in template manifest: ${manifestPath}`)
    }
}

type ListKey =
    | 'dependencies'
    | 'clientScripts'
    | 'serverScripts'
    | 'sharedScripts'
    | 'files'

function externalFirst(scripts: string[]) {
    return [
        ...scripts.filter(script => script.startsWith('@')),
        ...scripts.filter(script => !script.startsWith('@')),
    ]
}

export function mergeManifest(
    contributions: ManifestContribution[],
): ManifestConfig {
    const collect = (key: ListKey) => [
        ...new Set(contributions.flatMap(
            contribution => contribution[key] ?? [],
        )),
    ]

    const uiPage = contributions
        .map(contribution => contribution.uiPage)
        .filter(page => page !== undefined)
        .at(-1)

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
    }
}

const quote = (value: string) =>
    `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

export function renderManifest(manifest: ManifestConfig) {
    const lines = [
        `fx_version ${quote(manifest.fxVersion)}`,
        `game ${quote(manifest.game)}`,
    ]

    if (manifest.lua54) {
        lines.push("lua54 'yes'")
    }

    lines.push('')

    const blocks: [string, string[]][] = [
        ['dependencies', manifest.dependencies],

        ['client_scripts', manifest.clientScripts],
        
        ['server_scripts', manifest.serverScripts],
        
        ['shared_scripts', manifest.sharedScripts],

        ['files', manifest.files],
    ]

    for (const [name, values] of blocks) {
        if (!values.length) continue

        lines.push(
            `${name} {`,
            ...values.map(value => `    ${quote(value)},`),
            '}',
            '',
        )
    }

    if (manifest.uiPage) {
        lines.push(`ui_page ${quote(manifest.uiPage)}`, '')
    }

    return lines.join('\n')
}


export async function generateManifest(
    projectDirectory: string,
    contributions: ManifestContribution[],
) {
    await writeFile(
        path.join(projectDirectory, 'fxmanifest.lua'),
        renderManifest(mergeManifest(contributions)),
        'utf8',
    )
}
