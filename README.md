# Bifrost Design System

Production tokens, React components, motion, patterns, and migration guidance for Bifrost interfaces.

The catalog is a Bifrost `standalone_v2` app and also runs as an ordinary Vite project. Components are distributed as source through a shadcn-style registry: consumers copy the files into their app, then own and adapt them.

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
```

Browser QA accepts `QA_BASE_URL` and defaults to `http://127.0.0.1:4173`.

## Consume source

Build the registry, then copy a component and its dependencies into an app:

```bash
npm run registry:build
node scripts/add.mjs button --root /path/to/app
```

See [docs/consumption.md](docs/consumption.md), [DESIGN.md](DESIGN.md), and [docs/design-requirements.md](docs/design-requirements.md).

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

On 2026-08-14: TypeScript typecheck passed; 9 Vitest files / 9 tests passed; production build passed; 10 registry payloads built; the collision-safe copier passed install/refusal checks; browser QA passed routes, assets, light/dark themes, densities, keyboard selection, component states, dialog containment, motion, reduced motion, mobile layout, contrast, spacing, and console checks. The broader Bifrost product suites were not run because this repository does not modify the Bifrost product baseline.
