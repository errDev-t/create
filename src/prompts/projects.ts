import type {
    BackendLanguage,
    Framework,
    UiFramework,
    Styling,
    StateManager,
    ProjectConfig,
} from '@/types/prompt.js'

import {
    isCancel,
    outro,
    text,
    select,
    confirm,
} from '@clack/prompts'

import { getSupportedLayers } from '@/templates/index.js'

function answer<V>(value: V): Exclude<V, symbol> {
    if (isCancel(value)) {
        outro('Cancelled.')
        process.exit(0)
    }

    return value as Exclude<V, symbol>
}

export async function promptProject(): Promise<ProjectConfig> {
    const projectName = answer(await text({
        message: 'What is your project name?',
        placeholder: 'my-resource',
    })) || 'my-resource'

    const backendLanguage = answer(await select<BackendLanguage>({
        message: 'What language do you want to use for the backend?',
        options: [
            { value: 'lua', label: 'Lua' },
            { value: 'javascript', label: 'JavaScript' },
            { value: 'typescript', label: 'TypeScript' },
        ],
    }))

    const framework = answer(await select<Framework>({
        message: 'What framework do you want to use?',
        options: [
            { value: 'standalone', label: 'Standalone' },
            { value: 'qbcore', label: 'QBCore' },
            { value: 'qbox', label: 'Qbox' },
            { value: 'esx', label: 'ESX' },
            { value: 'vrp', label: 'vRP' },
        ],
    }))

    const hasUi = answer(await confirm({
        message: `Do you want to include a UI in ${projectName}?`,
    }))

    let uiFramework: UiFramework | undefined
    let styling: Styling | undefined
    let useShadcn: boolean | undefined
    let stateManager: StateManager | undefined

    if (hasUi) {
        uiFramework = answer(await select<UiFramework>({
            message: 'What UI framework do you want to use?',
            options: [
                { value: 'vanilla', label: 'Vanilla' },
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'svelte', label: 'Svelte' },
                { value: 'solid', label: 'Solid' },
            ],
        }))

        const supported = await getSupportedLayers(uiFramework)

        styling = supported.has('tailwind')
            ? answer(await select<Styling>({
                message: 'What styling do you want to use?',
                options: [
                    { value: 'css', label: 'Normal CSS' },
                    { value: 'tailwind', label: 'Tailwind' },
                ],
            }))
            : 'css'

        if (styling === 'tailwind' && supported.has('shadcn')) {
            useShadcn = answer(await confirm({
                message: `Do you want to include shadcn/ui in ${projectName}?`,
                initialValue: false,
            }))
        }

        const stateOptions = (['zustand', 'redux'] as const).filter(layer => supported.has(layer))

        if (stateOptions.length) {
            const stateChoice = answer(await select<StateManager | 'none'>({
                message: 'What state management do you want to use?',
                options: [
                    { value: 'none', label: 'None' },
                    ...stateOptions.map(value => ({ value, label: value === 'zustand' ? 'Zustand' : 'Redux' })),
                ],
            }))

            stateManager = stateChoice === 'none' ? undefined : stateChoice
        }
    }

    return {
        projectName,
        backendLanguage,
        framework,
        hasUi,
        uiFramework,
        styling,
        useShadcn,
        stateManager,
    }
}
