<div align="center">

# err-create

**Scaffold a FiveM resource in one command.**
Lua, JavaScript or TypeScript backend. Optional framework wiring. Optional NUI. A `fxmanifest.lua` that matches what was actually generated.

[![npm version](https://img.shields.io/npm/v/err-create?color=111&label=npm)](https://www.npmjs.com/package/err-create)
[![license](https://img.shields.io/npm/l/err-create?color=111)](https://www.npmjs.com/package/err-create)
[![Discord](https://img.shields.io/badge/discord-ERR-111?logo=discord&logoColor=white)](https://discord.gg/qAhtxRMsb)

</div>

---

## Preview

<div align="center">

![err-create terminal preview](https://raw.githubusercontent.com/errDev-t/create/main/docs/assets/terminal.gif)

<sub>The interactive CLI, start to finish.</sub>

</div>

## Why

Starting a FiveM resource usually means the same setup work: a manifest, a folder layout, a build step for TypeScript, NUI plumbing, a Vite config, and wiring for your framework. `err-create` does that once, from your answers, and gets out of the way.

It only generates what you select. Choose no state manager and there is no store. Choose plain CSS and there is no Tailwind. Choose Vanilla and there is no build tooling at all.

## Install

```bash
npx err-create
```

Or with `npm create`:

```bash
npm create @noterr
```

## Quick start

```bash
npx err-create
```

The CLI asks, in this order:

| Prompt | Choices |
| --- | --- |
| Project name | free text, default `my-resource` |
| Backend language | Lua, JavaScript, TypeScript |
| Framework | Standalone, QBCore, Qbox, ESX, vRP |
| Include a UI? | yes / no |
| UI framework | Vanilla, React, Vue, Svelte, Solid |
| Styling | Normal CSS, Tailwind |
| shadcn/ui | yes / no |
| State management | None, Zustand, Redux |
| Install dependencies? | yes / no (default yes) |

Questions that don't apply are skipped. For example, Vanilla has no styling, shadcn or state questions, and shadcn is only offered when Tailwind is selected on a UI that supports it.

The install step is always last. It runs `npm install` in every generated folder that has a `package.json`. If it fails, your project is kept and the CLI tells you which folder to run it in.

## Options

### Backend

| Backend | Source | Manifest loads |
| --- | --- | --- |
| Lua | `client/`, `server/`, `common/` | the `.lua` files (`lua54 'yes'` is set) |
| JavaScript | `client/`, `server/`, `shared/`, `config/` | `client/*.js`, `server/*.js`, `shared/*.js` |
| TypeScript | the same folders as JavaScript, as `.ts` | compiled output in `dist/` |

The TypeScript backend comes with its own `package.json`, `tsconfig.json` files and an esbuild-based `build.mjs`. The manifest points at the compiled JavaScript, never at `.ts` files.

### Framework

| Framework | What it adds |
| --- | --- |
| Standalone | Nothing. |
| QBCore | `qb-core` in `dependencies`, and the `QBCore` object at the top of every client and server file. |
| Qbox | `@qbx_core/modules/lib.lua` in `shared_scripts` and `@qbx_core/modules/playerdata.lua` in `client_scripts`. |
| ESX, vRP | Selectable in the prompt. |

Framework entries that load from another resource (`@resource/...`) are always ordered before your own scripts.

### UI

| UI | Build | Output used by the manifest |
| --- | --- | --- |
| Vanilla | none, plain HTML, CSS and JS | `web/index.html` |
| React | Vite | `web/dist/index.html` |
| Vue | Vite | `web/dist/index.html` |
| Svelte | Vite | `web/dist/index.html` |
| Solid | Vite | `web/dist/index.html` |

All five render the same starter window: a client-to-UI message card and a UI-to-client callback card with loading, error and empty states. Icons are [Lucide](https://lucide.dev) everywhere. The UI lives in `web/`, with its own `package.json` when it has a build step.

### Styling, shadcn and state

| Layer | Available for | Notes |
| --- | --- | --- |
| Normal CSS | all UIs | shared design tokens, no extra dependencies |
| Tailwind | React, Vue, Svelte, Solid | Tailwind v3 with PostCSS, mapped to the same tokens |
| shadcn/ui | React, with Tailwind | `components.json`, `cn()` helper and the `Button` and `Badge` components |
| Zustand | React, Vue, Svelte, Solid | holds UI visibility; the hook that uses it is swapped in |
| Redux | React, Vue, Svelte, Solid | Redux Toolkit, same idea |

Picking **None** for state generates no store files, folders or packages.

## What you get

Lua backend, Qbox, React UI:

```text
police-job/
├── fxmanifest.lua
├── client/
├── common/
├── server/
└── web/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── components/
        ├── hooks/
        ├── lib/        # fetchNui, onNuiMessage, browser mocks
        ├── types/
        └── styles/
```

```lua
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

shared_scripts {
    '@qbx_core/modules/lib.lua',
    'common/*.lua',
}

client_scripts {
    '@qbx_core/modules/playerdata.lua',
    'client/*.lua',
}

server_scripts {
    'server/*.lua',
}

files {
    'web/dist/**/*',
}

ui_page 'web/dist/index.html'
```

TypeScript backend, no UI:

```text
police-job/
├── fxmanifest.lua
├── package.json
├── tsconfig.json
├── build.mjs
├── client/
├── config/
├── server/
└── shared/
```

```bash
cd police-job
npm run build        # writes dist/client, dist/server, dist/shared
```

### Working on the UI

Built UIs (React, Vue, Svelte, Solid):

```bash
cd web
npm run dev          # browser preview with mocked NUI callbacks
npm run build        # writes web/dist, which the manifest points at
```

Vanilla needs no tooling. Open `web/index.html` in a browser for a preview, or start the resource in game.

In a browser, `fetchNui` answers from `src/lib/mocks.ts` (`js/mocks.js` in Vanilla). Add an entry there for every NUI callback you register. Add `?nuiError` to the URL to see the error state.

## Customize it

The generator is built from plain files, so changing it rarely means touching TypeScript.

| To change | Edit |
| --- | --- |
| What a backend generates | `templates/backend/<language>/`. `manifest.json` there declares how the manifest loads those files. |
| A UI | `templates/ui/<name>/`. `template.json` declares where it is copied (`destination`), its manifest entries (`uiPage`, `files`) and `package` patches. |
| Optional layers (Tailwind, shadcn, Zustand, Redux) | `templates/ui/<name>/layers/<layer>/`. A layer shows up in the prompts when its folder exists. |
| Shared UI design and NUI helpers | `templates/ui/shared/` (CSS tokens) and `templates/ui/shared-ts/` (TypeScript helpers). |
| A framework | `src/definitions/frameworks/`. A framework is data: manifest entries plus optional source lines injected into client and server files. |

New files in a template are copied automatically; the generator never lists them. Text files can use `{{projectName}}` and `{{projectSlug}}`. A file named `_gitignore` is written as `.gitignore`. The full metadata format is in [`templates/README.md`](https://github.com/errDev-t/create/blob/main/templates/README.md).

## Contributing

Adding a template, a framework, a UI layer, or fixing something you ran into is all fair game. You don't need to ask first.

```bash
git clone https://github.com/errDev-t/create.git
cd create
npm install
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs the CLI from source with `tsx`. |
| `npm run typecheck` | Type-checks the project (`tsc --noEmit`). |
| `npm run verify` | Generates a matrix of projects in a temp folder and checks files, manifests and options. No network needed. |

Before opening a pull request, run `npm run typecheck` and `npm run verify`. If you add a template or option, `verify` is where to add a check that it generates what it should.

## Support

Found a bug, stuck on something, or have an idea? Come talk to us in the [ERR Discord](https://discord.gg/err). If it's something that should be tracked, [open an issue](https://github.com/errDev-t/create/issues).

## Links

- npm: [err-create](https://www.npmjs.com/package/err-create)
- GitHub: [errDev-t/create](https://github.com/errDev-t/create)
- Discord: [discord.gg/err](https://discord.gg/qGQNRFMAAG)

## License

ISC