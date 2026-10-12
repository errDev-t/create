export interface NuiMessage<T = unknown> {
    action: string
    data: T
}

export interface Position {
    x: number
    y: number
    z: number
}