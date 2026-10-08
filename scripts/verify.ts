// Generates a matrix of projects and checks their structure and fxmanifest.lua.
// Run with: npm run verify   (no network or npm install needed)

import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { generateProject } from '../src/generator/index.js'
import { findPackageRoots } from '../src/generator/install.js'
import { listFiles } from '../src/utils/files.js'
import type { ProjectConfig } from '../src/types/prompt.js'

const exists = (file: string) => stat(file).then(() => true, () => false)
const read = (file: string) => readFile(file, 'utf8')

type Parsed = {
    scalars: Record<string, string>
    blocks: Record<string, string[]>
}

/** Reads our own fxmanifest.lua output format back into data. */
function parseManifest(text: string): Parsed {
    const scalars: Record<string, string> = {}
    const blocks: Record<string, string[]> = {}

    for (const match of text.matchAll(/^(\w+) \{\n([\s\S]*?)^\}/gm)) {
        blocks[match[1]!] = [...match[2]!.matchAll(/^ {4}'((?:[^'\\]|\\.)*)',$/gm)].map(entry => entry[1]!)
    }

    for (const match of text.matchAll(/^(\w+) '([^']*)'$/gm)) {
        scalars[match[1]!] = match[2]!
    }

    return { scalars, blocks }
}

const cases: ProjectConfig[] = []

for (const backendLanguage of ['lua', 'javascript', 'typescript'] as const) {
    for (const uiFramework of ['vanilla', 'react', 'vue', 'svelte', 'solid'] as const) {
        cases.push({
            projectName: `${backendLanguage}-${uiFramework}`,
            backendLanguage,
            framework: 'standalone',
            hasUi: true,
            uiFramework,
            styling: 'css',
        })
    }
}

for (const framework of ['qbox', 'qbcore'] as const) {
    cases.push({
        projectName: `lua-react-${framework}`,
        backendLanguage: 'lua',
        framework,
        hasUi: true,
        uiFramework: 'react',
        styling: 'css',
    })
}

cases.push(
    { projectName: 'ts-qbcore-vue-tailwind-zustand', backendLanguage: 'typescript', framework: 'qbcore', hasUi: true, uiFramework: 'vue', styling: 'tailwind', stateManager: 'zustand' },
    { projectName: 'lua-react-shadcn-redux', backendLanguage: 'lua', framework: 'qbox', hasUi: true, uiFramework: 'react', styling: 'tailwind', useShadcn: true, stateManager: 'redux' },
    { projectName: 'lua-react-zustand', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'react', styling: 'css', stateManager: 'zustand' },
    { projectName: 'js-svelte-tailwind-redux', backendLanguage: 'javascript', framework: 'standalone', hasUi: true, uiFramework: 'svelte', styling: 'tailwind', stateManager: 'redux' },
    { projectName: 'lua-solid-zustand', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'solid', styling: 'css', stateManager: 'zustand' },
    { projectName: 'lua-solid-tailwind-redux', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'solid', styling: 'tailwind', stateManager: 'redux' },
    { projectName: 'lua-none', backendLanguage: 'lua', framework: 'qbox', hasUi: false },
    { projectName: 'ts-none', backendLanguage: 'typescript', framework: 'standalone', hasUi: false },
)

const workDirectory = await mkdtemp(path.join(os.tmpdir(), 'err-create-verify-'))

process.chdir(workDirectory)

let failures = 0

for (const config of cases) {
    try {
        const project = await generateProject(config)
        const manifest = parseManifest(await read(path.join(project, 'fxmanifest.lua')))
        const files = await listFiles(project)

        // fxmanifest basics
        assert.equal(manifest.scalars.fx_version, 'cerulean')
        assert.equal(manifest.scalars.game, 'gta5')

        // no duplicates, no empty blocks
        for (const [name, entries] of Object.entries(manifest.blocks)) {
            assert.ok(entries.length > 0, `empty ${name} block`)
            assert.equal(new Set(entries).size, entries.length, `duplicate entry in ${name}`)
        }

        assert.doesNotMatch(await read(path.join(project, 'fxmanifest.lua')), /\{\n\}/)

        // every non-build path in the manifest points at a real file
        const uiRoot = config.hasUi ? 'web/' : undefined
        const referenced = [
            ...(manifest.blocks.shared_scripts ?? []),
            ...(manifest.blocks.client_scripts ?? []),
            ...(manifest.blocks.server_scripts ?? []),
        ].filter(entry => !entry.startsWith('@'))

        const isBackendBuildOutput = (entry: string) => entry.startsWith('dist/')

        for (const entry of referenced) {
            if (isBackendBuildOutput(entry)) continue

            const pattern = new RegExp('^' + entry.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$')

            assert.ok(files.some(file => pattern.test(file)), `${entry} matches no generated file`)
        }

        // typescript backend: manifest must point at compiled output, never at .ts
        if (config.backendLanguage === 'typescript') {
            for (const entry of referenced) assert.doesNotMatch(entry, /\.ts$/)
            assert.ok(manifest.blocks.client_scripts?.includes('dist/client/*.js'))
        }

        // framework contributions survive the UI merge
        if (config.framework === 'qbox') {
            assert.deepEqual(manifest.blocks.shared_scripts?.[0], '@qbx_core/modules/lib.lua')
            assert.deepEqual(manifest.blocks.client_scripts?.[0], '@qbx_core/modules/playerdata.lua')
        }

        if (config.framework === 'qbcore') {
            assert.deepEqual(manifest.blocks.dependencies, ['qb-core'])
        } else {
            assert.equal(manifest.blocks.dependencies, undefined)
        }

        if (config.framework === 'qbcore' && config.backendLanguage === 'lua') {
            for (const file of files.filter(file => /^(client|server)\/.*\.lua$/.test(file))) {
                const head = (await read(path.join(project, file))).split(/\r?\n/)[0]

                assert.equal(head, "local QBCore = exports['qb-core']:GetCoreObject()", file)
            }
        }

        // UI
        if (config.hasUi && config.uiFramework) {
            const web = path.join(project, 'web')
            const webFiles = await listFiles(web)
            const hasFile = (pattern: RegExp) => webFiles.some(file => pattern.test(file))
            const hasPackage = webFiles.includes('package.json')
            const dependencies: Record<string, string> = {}

            // ui_page and files must point at real files (or at what the build writes)
            if (config.uiFramework === 'vanilla') {
                assert.ok(!hasPackage, 'vanilla must not have a package.json')
                assert.ok(!hasFile(/vite|node_modules|^dist\//), 'vanilla must have no build tooling')
                assert.ok(!hasFile(/\.(jsx?|tsx?|vue|svelte)$/) || webFiles.every(file => !/\.(tsx|ts|vue|svelte)$/.test(file)), 'vanilla must be plain JS')
                assert.equal(manifest.scalars.ui_page, 'web/index.html')
                assert.ok(files.includes(manifest.scalars.ui_page!), 'ui_page does not exist')

                for (const pattern of manifest.blocks.files ?? []) {
                    const matcher = new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*\*\/\*/g, '.+').replace(/\*/g, '[^/]*') + '$')

                    assert.ok(files.some(file => matcher.test(file)), `files entry ${pattern} matches nothing`)
                }

                assert.ok(hasFile(/^css\/style\.css$/) && hasFile(/^js\/main\.js$/))
            } else {
                const viteConfig = webFiles.find(file => /^vite\.config\.(ts|js)$/.test(file))

                assert.ok(viteConfig, 'web/vite.config is missing')

                // the manifest paths must agree with where the template's build writes
                const outDir = /outDir:\s*'([^']+)'/.exec(await read(path.join(web, viteConfig!)))?.[1]

                assert.ok(outDir, 'vite.config has no outDir')
                assert.equal(manifest.scalars.ui_page, `web/${outDir}/index.html`)
                assert.deepEqual(manifest.blocks.files, [`web/${outDir}/**/*`])

                const webPackage = JSON.parse(await read(path.join(web, 'package.json')))

                assert.ok(webPackage.scripts.build, 'web build script missing')
                assert.match(webPackage.name, /^[a-z0-9-]+-ui$/)

                Object.assign(dependencies, webPackage.dependencies, webPackage.devDependencies)

                // Lucide is the only icon set
                assert.equal(Object.keys(dependencies).filter(name => name.startsWith('lucide-')).length, 1)
                assert.ok(!webFiles.some(file => /icons\.(ts|js)$/.test(file)), 'hand-made icon file found')

                // optional layers: exactly what was selected
                assert.equal('tailwindcss' in dependencies, config.styling === 'tailwind')
                assert.equal('zustand' in dependencies, config.stateManager === 'zustand')
                assert.equal('@reduxjs/toolkit' in dependencies, config.stateManager === 'redux')
                assert.equal('clsx' in dependencies, Boolean(config.useShadcn))
                assert.equal(hasFile(/^postcss\.config\.js$/), config.styling === 'tailwind')
                assert.equal(hasFile(/^tailwind\.config\.js$/), config.styling === 'tailwind')
                assert.equal(hasFile(/^components\.json$/), Boolean(config.useShadcn))
                assert.equal(hasFile(/^src\/lib\/utils\.ts$/), Boolean(config.useShadcn))
                assert.equal(hasFile(/^src\/store\//), Boolean(config.stateManager), 'store files must exist only when state is selected')
                assert.ok(hasFile(/^\.gitignore$/), '_gitignore was not renamed')
            }

            assert.ok(!files.some(file => file.endsWith('_gitignore')))
            assert.ok(!files.some(file => /(^|\/)(node_modules|dist|build)\//.test(file)), 'build output in the project')
            assert.ok(hasFile(/^index\.html$/))

            // the same UI everywhere: both cards, Lucide-based icons, no emoji
            const source = (await Promise.all(webFiles.filter(file => /\.(html|tsx|vue|svelte|js)$/.test(file) && !file.startsWith('css/')).map(file => read(path.join(web, file))))).join('\n')

            assert.match(source, /Client to UI/)
            assert.match(source, /UI to client/)
            assert.doesNotMatch(source, /\p{Extended_Pictographic}/u)
        } else {
            assert.equal(manifest.scalars.ui_page, undefined)
            assert.equal(manifest.blocks.files, undefined)
            assert.ok(!files.some(file => file.startsWith('web/')))
        }

        // no unreplaced template variables, no template metadata leaked
        for (const file of files) {
            assert.ok(!/(^|\/)template\.json$/.test(file), `${file} leaked into the project`)

            if (/\.(png|jpg|woff2?)$/.test(file)) continue

            assert.doesNotMatch(await read(path.join(project, file)), /\{\{\w+\}\}/, `${file} has an unreplaced variable`)
        }

        // package roots: backend and web stay separate
        const roots = (await findPackageRoots(project)).map(root => root.directory)

        assert.deepEqual(
            roots,
            [
                ...(config.backendLanguage === 'typescript' ? ['.'] : []),
                ...(config.hasUi && config.uiFramework !== 'vanilla' ? ['web'] : []),
            ],
        )

        console.log(`ok    ${config.projectName}`)
    } catch (error) {
        failures++
        console.log(`FAIL  ${config.projectName}\n      ${error instanceof Error ? error.message.split('\n').join('\n      ') : error}`)
    }
}

// error paths
const expectError = async (name: string, config: ProjectConfig, pattern: RegExp) => {
    try {
        await generateProject(config)
        failures++
        console.log(`FAIL  ${name}: expected an error`)
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)

        if (pattern.test(message)) console.log(`ok    ${name}`)
        else {
            failures++
            console.log(`FAIL  ${name}: ${message}`)
        }
    }
}

await expectError('unregistered framework is rejected before writing', { projectName: 'x1', backendLanguage: 'lua', framework: 'does-not-exist' as ProjectConfig['framework'], hasUi: false }, /not supported yet/)
await expectError('shadcn needs tailwind', { projectName: 'x2', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'react', styling: 'css', useShadcn: true }, /requires Tailwind/)
await expectError('shadcn unsupported for vue', { projectName: 'x3', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'vue', styling: 'tailwind', useShadcn: true }, /does not support "shadcn"/)
await expectError('vanilla has no tailwind layer', { projectName: 'x4', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'vanilla', styling: 'tailwind' }, /does not support "tailwind"/)
await expectError('vanilla has no state layer', { projectName: 'x5', backendLanguage: 'lua', framework: 'standalone', hasUi: true, uiFramework: 'vanilla', styling: 'css', stateManager: 'redux' }, /does not support "redux"/)
await expectError('existing directory is protected', { projectName: 'lua-none', backendLanguage: 'lua', framework: 'standalone', hasUi: false }, /already exists/)

const leftovers = (await listFiles(workDirectory)).filter(file => file.startsWith('x1/') || file.startsWith('x2/') || file.startsWith('x3/') || file.startsWith('x4/') || file.startsWith('x5/'))

if (leftovers.length) {
    failures++
    console.log('FAIL  failed generations left files behind:', leftovers)
}

await rm(workDirectory, { recursive: true, force: true })

console.log(failures ? `\n${failures} check(s) failed` : `\nAll ${cases.length + 6} checks passed`)
process.exit(failures ? 1 : 0)
