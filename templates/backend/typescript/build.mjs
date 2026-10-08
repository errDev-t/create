import { readdirSync } from 'node:fs'
import path from 'node:path'
import { build, context } from 'esbuild'

const watch = process.argv.includes('--watch')

// Each top-level .ts file in these folders is bundled into dist/<folder>/.
// Subfolders and config/ are pulled in through imports.
const targets = [
    { dir: 'client', platform: 'browser', format: 'iife' },
    { dir: 'server', platform: 'node', format: 'cjs' },
    { dir: 'shared', platform: 'neutral', format: 'iife' },
]

for (const { dir, platform, format } of targets) {
    const entryPoints = readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
        .map(entry => path.join(dir, entry.name))

    if (!entryPoints.length) continue

    const options = {
        entryPoints,
        outdir: `dist/${dir}`,
        outbase: dir,
        bundle: true,
        platform,
        format,
        target: 'es2020',
        logLevel: 'info',
    }

    if (watch) {
        await (await context(options)).watch()
    } else {
        await build(options)
    }
}
