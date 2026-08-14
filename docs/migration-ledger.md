# Migration ledger

Baseline: `a75ee49a432b3ed110df98f8ea0e27e87a4262cd`.

The exhaustive per-source ledger is machine-readable at [`inventory/migration-ledger.json`](inventory/migration-ledger.json). It contains one entry for every one of the 386 baseline TSX source files with proposed design-system name, source path and exact line, baseline SHA, exports/prop declarations, static consumer evidence, compatibility assessment, replacement/adapter notes, status, and unresolved decisions.

## Program status

| Migration family | Baseline evidence | Proposed target | Compatibility | Status |
| --- | --- | --- | --- | --- |
| Brand, theme, density, motion | Product theme/context plus 53 primitives | `tokens.css`, Bifrost host mapping | Additive token bridge | Phase 1 source ready; product bridge pending |
| Actions | `ui/button.tsx:42`; 225 imports | BfButton + compatible `Button` adapter | Preserve CVA variants, `asChild`, refs, native props | Phase 1 BfButton ready; adapter pending |
| Fields and set selection | `ui/input.tsx:5`, `select.tsx:7`, `combobox.tsx:39`, `multi-combobox.tsx:35`, `forms/MultiCombobox.tsx:35` | BfField + BfCombobox + BfMultiSelect | Preserve RHF/Radix APIs; adapt existing option/value/loading props | Searchable single/multi source ready; product adapters pending |
| Selection | `ui/checkbox.tsx:9`, `radio-group.tsx:6`, `switch.tsx:6` | BfSelection adapters | Preserve Radix APIs and refs | Phase 1 source ready; adapters pending |
| Status | `ui/badge.tsx:33`; 109 imports plus domain badges | BfStatus + domain state maps | Split semantics behind existing Badge adapter | Phase 1 status source ready; product taxonomy pending |
| Navigation | `ui/tabs.tsx:7`, pagination/menus/breadcrumb variants | BfTabs and BfNavigation family | Preserve Radix/menu/nav behavior | BfTabs ready; remaining family planned |
| Feedback | `ui/alert.tsx:22`, error boundaries, NoAccess, toasts | BfAlert + StateFrame recipes | Additive; semantic role review required | BfAlert ready; recipes planned |
| Data | `ui/data-table.tsx:38`, `table.tsx:5`, `EventsTable.tsx:176`, `Knowledge.tsx:423`, `LogsTable.tsx:62` | BfDataTable + entity-table recipes | Preserve semantic table, owned scrolling, pinned footer, and modifier/middle-click row URL behavior | Typed source ready with sort, selection, states, toolbars, and pagination; adapters pending |
| Overlays | `ui/dialog.tsx:10`, alert dialog, sheet, menu, popover, tooltip | BfDialog plus compatible overlay family | Preserve Radix focus/portal/keyboard contracts | BfDialog ready; family adapters planned |
| Loading/progress | `PageLoader.tsx:9`, `InlineLoader.tsx:7`, `AppLoadingSkeleton.tsx:23`, route/job progress | BfProgress, OperationProgress, Skeleton/StateFrame | Keep data/job ownership in feature | Inventoried; contract planned |
| Shell/layout | `layout/AppLayout.tsx:19`, `Sidebar.tsx:239`, `AppHeader.tsx:41`, editor/chat layouts | ApplicationShell and WorkspacePanel patterns | Composition migration; preserve routing/dock/resize | Inventoried; slot contract unresolved |
| Organization scope | `forms/OrganizationSelect.tsx:32,73,122`; 30 imports | BfOrganizationScope product adapter | Preserve GLOBAL/ALL/org-id and wire sentinels | Inventoried; adapter planned |
| Runtime exports | `lib/bifrost-runtime.ts:94-195`, `lib/app-code-platform/components.ts:15-269` | Versioned RuntimeComponentRegistry | Preserve exported names and Lucide collision handling | Inventoried; contract tests required |
| Source distribution | No product registry | `registry.json`, build + copier scripts | Additive, copy-owned, collision-safe | Phase 1 complete |

## Recommended sequence

1. Land token bridge and visual regression baselines without changing consumer imports.
2. Adapt Button, Badge/Status, Field, Dialog, Selection, Alert, and Tabs—the highest-value Phase 1 targets.
3. Adapt existing DataTable/Table and Combobox/MultiCombobox exports onto the production source contracts, then standardize remaining state frames and dialog forms.
4. Migrate layout/workspace chrome after primitive stability.
5. Move feature families incrementally, updating each JSON item from `inventoried` to `adapter ready`, `migrated`, then `verified`.

## Unresolved decisions

- Whether Bf-prefixed app APIs or existing unprefixed product APIs become canonical inside the Bifrost product. Recommendation: keep product imports stable; use Bf names in the external registry.
- Whether `Card` remains a neutral structural primitive or is replaced by explicit Surface/Section/Inset names. Recommendation: retain adapter, discourage new generic Card use.
- DataTable row activation keeps the baseline contract during migration: ordinary click/Enter calls the consumer; Ctrl/Cmd-click and middle-click use the supplied row URL in a new tab. A later semantic-link migration requires consumer-by-consumer review.
- Which shell slots are stable across product, editor, chat, and hosted apps. Resolve with screenshots and state inventories before implementation.
