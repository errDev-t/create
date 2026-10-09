/** The shape SendNUIMessage delivers to the UI. */
export interface NuiMessage<T = unknown> {
    action: string
    data: T
}

/** What the `getClientData` NUI callback returns (see client script). */
export interface Position {
    x: number
    y: number
    z: number
}
