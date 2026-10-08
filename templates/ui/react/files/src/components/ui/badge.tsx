import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'accent' | 'success'
  dot?: boolean
}

export function Badge({ variant = 'default', dot = false, className, ...props }: Props) {
  const classes = ['badge', variant !== 'default' && `badge-${variant}`, dot && 'badge-dot', className].filter(Boolean).join(' ')

  return <span className={classes} {...props} />
}
