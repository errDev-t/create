import { Component, ErrorInfo, ReactNode } from 'react'
import { useNuiCallback } from '@/hooks/useNuiCallback'

interface BoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onCrash: () => void
}

class Boundary extends Component<BoundaryProps, { hasError: boolean }> {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[NUI] Unhandled UI error:', error, info.componentStack)
        this.props.onCrash()
    }

    render() {
        return this.state.hasError ? (this.props.fallback ?? null) : this.props.children
    }
}

export default function ErrorBoundary({
    children,
    fallback,
}: {
    children: ReactNode
    fallback?: ReactNode
}) {
    const { run } = useNuiCallback('hideFrame')

    return (
        <Boundary fallback={fallback} onCrash={() => void run()}>
            {children}
        </Boundary>
    )
}