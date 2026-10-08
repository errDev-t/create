export type BackendLanguage =
    | 'lua'
    | 'javascript'
    | 'typescript'

export type Framework =
    | 'standalone'
    | 'qbcore'
    | 'qbox'
    | 'esx'
    | 'vrp'
    | 'nd'

export type UiFramework =
    | 'vanilla'
    | 'react'
    | 'vue'
    | 'svelte'
    | 'solid'

export type Styling =
    | 'tailwind'
    | 'css'

export type StateManager =
    | 'zustand'
    | 'redux'

export type ProjectConfig = {
    projectName: string
    backendLanguage: BackendLanguage
    framework: Framework
    hasUi: boolean
    uiFramework?: UiFramework
    styling?: Styling
    useShadcn?: boolean
    stateManager?: StateManager
}