import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
}

export function Button({ variant = 'default', size = 'default', className, ...props }: Props) {
  const classes = ['btn', `btn-${variant}`, size !== 'default' && `btn-${size}`, className].filter(Boolean).join(' ')

  return <button type="button" className={classes} {...props} />
}
