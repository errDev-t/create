const color = name => `hsl(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue,svelte}'],
    theme: {
        extend: {
            // The same tokens the plain CSS uses (src/styles/tokens.css).
            colors: {
                background: color('background'),
                foreground: color('foreground'),
                card: { DEFAULT: color('card'), foreground: color('card-foreground') },
                popover: { DEFAULT: color('popover'), foreground: color('popover-foreground') },
                primary: { DEFAULT: color('primary'), foreground: color('primary-foreground') },
                secondary: { DEFAULT: color('secondary'), foreground: color('secondary-foreground') },
                muted: { DEFAULT: color('muted'), foreground: color('muted-foreground') },
                accent: { DEFAULT: color('accent'), foreground: color('accent-foreground') },
                destructive: { DEFAULT: color('destructive'), foreground: color('destructive-foreground') },
                success: color('success'),
                border: color('border'),
                input: color('input'),
                ring: color('ring'),
            },
            // `border` utilities use the shared border color, as shadcn/ui expects.
            borderColor: {
                DEFAULT: color('border'),
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    plugins: [],
}
