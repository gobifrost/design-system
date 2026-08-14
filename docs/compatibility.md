# Compatibility strategy

Baseline product: `a75ee49a432b3ed110df98f8ea0e27e87a4262cd`.

The Bifrost product already has a heavily consumed shadcn/Radix primitive layer. A visual replacement that changes imports or props would create unnecessary risk: `Button` alone has 225 static inbound imports, `Badge` 109, `Input` 85, `Card` 75, and `Dialog` 66. The migration therefore proceeds in layers.

## Layer 1 — token bridge

Map existing product semantic variables to `--bf-*` roles and apply the website-led palette, typography, radii, density, focus, and motion. No consumer API changes. This creates broad brand value while preserving behavior.

## Layer 2 — compatible primitive adapters

Keep existing paths and exports (`Button`, `DialogContent`, `TabsTrigger`, and so on) while adapting their internals to the Bifrost contracts. Phase 1 `Bf*` sources are the design reference; product adapters retain the wider existing API.

Example:

```tsx
// Existing consumer remains valid.
<Button variant="destructive" size="sm" asChild>
  <Link to={target}>Remove</Link>
</Button>
```

The adapter must preserve `variant`, `size`, `asChild`, forwarded ref, native props, disabled semantics, and current keyboard behavior. A future app may choose the slimmer `BfButton` API directly.

## Layer 3 — shared anatomy

Introduce composed fields, status, operation progress, list surfaces, dialog forms, state frames, inspector panels, and workspace panel chrome. Feature code retains fetching, DTOs, permission checks, and domain state maps.

## Layer 4 — feature migration

Migrate one bounded consumer family at a time with current screenshots/interaction tests as compatibility evidence. Remove an old path only when static consumers are zero and dynamic/route usage has been checked.

## Exceptional breaking changes

A breaking change is justified only when the existing API prevents accessibility, correct semantics, or durable state behavior. The migration must include:

1. the exact baseline source and consumers;
2. a written tradeoff;
3. an adapter or codemod when feasible;
4. before/after behavioral tests;
5. a removal condition and date/version.

Current candidates:

- Split generic badge usage into status, category label, count, and interactive filter. Keep `Badge` as a temporary adapter.
- Replace clickable non-interactive wrappers with real links/buttons in DataTable and card rows while retaining visual composition.
- Replace `PillTabs` with the accessible Radix-backed BfTabs adapter after matching disabled and selection behavior.
- Consolidate `table.tsx` and `data-table.tsx` only after row-navigation and responsive overflow contracts are proven equivalent.
- Preserve `OrganizationSelect` wire sentinels (`__GLOBAL__`, `__ALL__`) in the product adapter while exposing semantic values to new registry consumers.
- Keep `client/src/lib/bifrost-runtime.ts` and `client/src/lib/app-code-platform/components.ts` export names stable; their manually resolved collisions with Lucide names are an SDK contract, not an internal refactor detail.

## Explicit non-goals

- No one-shot rewrite of the Bifrost frontend.
- No binary runtime design-system dependency.
- No domain logic inside generic visual components.
- No compatibility shim without a named removal condition.
- No assumption that a file with zero static imports is dead; routes, lazy imports, registries, and app loaders must be checked.
