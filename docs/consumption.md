# Consume Bifrost source

The Bifrost Design System follows the shadcn ownership model: copy readable source into the consuming app, commit it there, and adapt it deliberately. There is no runtime design-system package to keep synchronized.

## Add a component from this checkout

```bash
node scripts/add.mjs button --root /path/to/consumer-app
```

The command resolves registry dependencies and writes to `src/components/bifrost/`. It never edits an existing file unless that file is one of the selected registry targets, so review the diff before committing.

Registry components import their shared stylesheet directly. If an app wants to establish the theme before any component renders, import the component layer once near the app entry:

```ts
import "./components/bifrost/components.css";
```

Then use the copied source directly:

```tsx
import { BfButton } from "./components/bifrost/BfButton";

export function SaveAction() {
  return <BfButton>Save changes</BfButton>;
}
```

Use `field` for native text, textarea, and short fixed-list controls. Use `combobox` when the list must be visually consistent, searchable, descriptive, async-aware, or multi-select. Use `data-table` for production entity tables; it owns the constrained scroller and keeps its footer outside that scroller.

## Hosted registry output

`npm run registry:build` writes shadcn-compatible JSON payloads to `apps/bifrost-design-system/public/r/`. Each payload contains source, declared npm dependencies, registry dependencies, and the intended target path. The catalog can serve these files directly when deployed.

## Theme contract

Tokens read Bifrost host variables first (`--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`) and retain documented standalone values. Consumers should let the Bifrost provider own `.dark`; do not create a separate application theme store.

## Adaptation contract

- Keep focus, semantic role, keyboard, reduced-motion, and linked error-message behavior intact.
- Preserve non-color status cues.
- If a local product need changes the public API, record the change at the copied component and add a focused test.
- Pull future improvements by reviewing source diffs, not by silently upgrading a binary package.
