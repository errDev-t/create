import { ErrorBoundary as SolidErrorBoundary, type JSX } from 'solid-js'
import { fetchNui } from '@/lib/nui'

export default function ErrorBoundary(props: { children: JSX.Element; fallback?: JSX.Element }) {
    return (
        <SolidErrorBoundary
            fallback={error => {
                console.error('[NUI] Unhandled UI error:', error)

                // Release NUI focus so the player isn't stuck on a broken UI.
                fetchNui('hideFrame').catch(() => {})

                return props.fallback ?? null
            }}
        >
            {props.children}
        </SolidErrorBoundary>
    )
}