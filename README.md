# Bifrost Design System

Production tokens, React components, motion, patterns, and migration guidance for Bifrost interfaces.

The catalog is a Bifrost `standalone_v2` app and also runs as an ordinary Vite project. Components are distributed as source through a shadcn-style registry: consumers copy the files into their app, then own and adapt them.

Start with the practical path: build the registry, add the component source you need, and then adapt it inside your app.

## Visual intent

| Layer | Role | Guidance |
| --- | --- | --- |
| Teal | Primary action, focus, current selection | Use it for the thing the user is meant to do next. |
| Spectrum | Transport and live work | Use it for movement, stream activity, and changing execution conditions. |
| Semantic | Success, warning, error | Use it to communicate outcome, regardless of connection state. |
| Neutral | Structure, chrome, and reading surfaces | Use it to keep the stream readable and calm. |

Bifrost components share one theme contract across the core design system and consuming apps. Let the host own `.dark` and the shared tokens so the same source works in the catalog, local app previews, and copied registry output.

## Run locally

```bash
cd apps/bifrost-design-system
npm install
npm run dev
```

## Verify

```bash
cd apps/bifrost-design-system
npm run typecheck
npm run test
npm run build
cd ../..
npm run registry:build
npm run qa
npm run qa:execution
```

Browser QA accepts `QA_BASE_URL` and defaults to `http://127.0.0.1:4173`.

## Consume source

Build the registry, then copy a component and its dependencies into an app:

```bash
npm run registry:build
node scripts/add.mjs button --root /path/to/app
```

For the execution stream, use:

```bash
npm run registry:build
node scripts/add.mjs execution-stream --root ../your-app
```

Preview the local replay surface at `/execution` in the catalog app. It shows synthetic failure and reconnect examples so you can review the stream without a live backend.

See [docs/consumption.md](docs/consumption.md), [docs/execution-stream.md](docs/execution-stream.md), [DESIGN.md](DESIGN.md), and [docs/design-requirements.md](docs/design-requirements.md).

Testing expectations and coverage notes live in [docs/component-test-matrix.md](docs/component-test-matrix.md).

## Bifrost product migration

Phase 2 is baselined to Bifrost commit `a75ee49a432b3ed110df98f8ea0e27e87a4262cd`. This repository includes an exhaustive generated inventory of 386 TSX sources / 559 component exports, a per-source migration ledger, consolidated non-component UI findings, a compatibility strategy, and a behavioral test matrix:

- [docs/inventory/components.md](docs/inventory/components.md)
- [docs/inventory/non-component-ui.md](docs/inventory/non-component-ui.md)
- [docs/migration-ledger.md](docs/migration-ledger.md)
- [docs/compatibility.md](docs/compatibility.md)
- [docs/component-test-matrix.md](docs/component-test-matrix.md)

Regenerate machine-readable evidence with `node scripts/inventory-bifrost.mjs` while the baseline checkout is available at `/home/jack/GitHub/bifrost`.

## Brand evidence

The visual baseline and native assets come from `gobifrost/website` at commit `afa9e9b4842304c54ff1b5d79d010017f1da23cb`. Structural parity comes from `gocovi/covi-design-system` at commit `565cb8d34d08cf5b500482b3c996a9fb78c12364`.

## Verified milestone

On 2026-08-14: TypeScript typecheck passed; 13 Vitest files / 19 tests passed; the registry installer contract test passed; production build passed; 14 registry payloads built; the copier composed shared dependencies and refused divergent consumer source; browser QA passed routes, native and candidate vector assets, light/dark themes, densities, searchable single/multi selection, data-table sorting/selection/filter/pagination and fit-to-container behavior, viewport-aware row actions, dialog containment, motion, reduced motion, mobile layout, contrast, spacing, and console checks. Impeccable source detection returned no findings. The broader Bifrost product suites were not run because this repository does not modify the Bifrost product baseline.
