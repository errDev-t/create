import { splitProps, type JSX } from 'solid-js'

type Props = JSX.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'accent' | 'success'
  dot?: boolean
}

export function Badge(props: Props) {
  const [local, rest] = splitProps(props, ['variant', 'dot', 'class'])

  const classes = () =>
    ['badge', local.variant && local.variant !== 'default' && `badge-${local.variant}`, local.dot && 'badge-dot', local.class]
      .filter(Boolean)
      .join(' ')

  return <span class={classes()} {...rest} />
}
