import { splitProps, type JSX } from 'solid-js'

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
}

export function Button(props: Props) {
  const [local, rest] = splitProps(props, ['variant', 'size', 'class'])

  const classes = () =>
    ['btn', `btn-${local.variant ?? 'default'}`, local.size && local.size !== 'default' && `btn-${local.size}`, local.class]
      .filter(Boolean)
      .join(' ')

  return <button type="button" class={classes()} {...rest} />
}
