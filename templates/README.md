# Templates

A template is a folder with `template.json` (metadata) and an optional `files/` folder (copied as-is; `{{projectName}}` and `{{projectSlug}}` are replaced).

```jsonc
{
    "destination": "web",                  // UI only: where files/ is copied inside the project
    "layerSources": ["ui/shared/layers"],  // UI only: extra folders searched for optional layers
    "requires": [                          // copied first; `into` targets a sub-folder of the destination
        "ui/shared-ts",
        { "template": "ui/shared", "into": "src/styles" }
    ],
    "manifest": {                          // merged into fxmanifest.lua; paths are relative to `destination`
        "uiPage": "dist/index.html",
        "files": ["dist/**/*"]
    },
    "package": {                           // merged into <destination>/package.json
        "dependencies": { "zustand": "^5.0.3" }
    }
}
```

- `ui/<name>` is a UI; its `layers/<layer>` folders (and `layerSources`) are the optional add-ons. A layer is offered in the prompts only if a folder with that name exists, so Vanilla (no build step) offers none.
- Layers are copied after the UI and overwrite files with the same path (state layers replace `useVisibility`, Tailwind replaces `styles/index.css`, shadcn replaces `components/ui/*`).
- `ui/shared` holds the design tokens and CSS used by all five UIs. `ui/shared-ts` holds the TypeScript NUI helpers used by React, Vue, Svelte and Solid. `ui/shared-ts/state/*` are framework-neutral stores used by the Vue, Svelte and Solid state layers.
- The build output folder in a UI's `vite.config` and the `manifest` in its `template.json` must agree. `npm run verify` checks that.
- Files named `_gitignore` are written as `.gitignore`.
