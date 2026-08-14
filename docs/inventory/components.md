# Bifrost frontend component inventory

- Baseline: `a75ee49a432b3ed110df98f8ea0e27e87a4262cd`
- Source: `/home/jack/GitHub/bifrost`
- Generated evidence: [`components.json`](components.json)
- Per-source migration evidence: [`migration-ledger.json`](migration-ledger.json)

## Scope and method

The inventory parses every non-test `.tsx` file under `client/src`, records top-level exports and prop declarations with source lines, resolves static relative and `@/` imports to consumers, records external dependencies, and flags raw native controls plus accessibility and state vocabulary. The generator is `scripts/inventory-bifrost.mjs`; rerunning it against another commit creates a comparable snapshot.

The baseline contains:

- 386 component/page/context TSX files
- 559 exported component symbols
- 53 shared `client/src/components/ui` primitive files
- 87 files with no static inbound import; these require dynamic/route/obsolete verification rather than an assumption that they are dead
- 4 additional app/demo TSX files under `apps/progress-demo` and `docs/demo/files-gallery`

The machine inventory is exhaustive. The tables below consolidate that source into coherent design-system families.

## Foundation primitives

| Proposed family | Existing source and baseline line | Existing API / dependencies | Consumers | Contract and migration |
| --- | --- | --- | ---: | --- |
| BfButton | `client/src/components/ui/button.tsx:42` | shadcn-style `Button`; CVA variants; Radix Slot; React button props | 225 | Highest-risk adapter. Keep the current variants, `asChild`, ref, disabled, and destructive API while applying Bifrost tokens. The Phase 1 `BfButton` is the app-facing source target, not a drop-in replacement yet. |
| BfStatus / Badge | `client/src/components/ui/badge.tsx:33` | CVA badge variants, optional Radix Slot | 109 | Separate status from interactive/category badge. Preserve the existing import through an adapter; migrate status use to flat text + square signal. |
| BfField | `client/src/components/ui/input.tsx:5`, `textarea.tsx:5`, `label.tsx:6`, `select.tsx:7`, `form.tsx:19` | Native inputs plus Radix Label/Select and React Hook Form wrappers | 85 / 20 / 76 / 37 / 7 | Keep low-level primitives. Add a composed field anatomy that owns persistent label, description/error linkage, leading-icon spacing, and invalid/disabled contracts. |
| BfSurface | `client/src/components/ui/card.tsx:5` | Seven unopinionated structural exports | 75 | Preserve exports for compatibility but remove “card by default” visual assumptions. Map to flat surface, section, and inset roles. |
| BfSkeleton | `client/src/components/ui/skeleton.tsx:3` | Single styled block | 74 | Preserve API; add accessible busy-region recipe and reduced-motion behavior at the pattern layer. |
| BfDialog | `client/src/components/ui/dialog.tsx:10`, `alert-dialog.tsx:7` | Radix composition; portal/overlay/content/header/footer/title/description/action/cancel | 66 / 47 | Keep Radix focus and dismissal behavior. Redesign surface/spacing and enforce separately scrolling body. Alert dialog remains a distinct destructive-decision contract. |
| BfAlert | `client/src/components/ui/alert.tsx:22` | CVA variants; `role="alert"`; title/description/action | 40 | Close to the Phase 1 target. Add polite vs assertive semantics and recovery-action guidance without breaking existing composition. |
| BfSelection | `client/src/components/ui/checkbox.tsx:9`, `radio-group.tsx:6`, `switch.tsx:6` | Radix checkbox/radio/switch primitives | 37 / 6 / 26 | Preserve primitive props/ref behavior. Standardize target sizes, visible label anatomy, immediate-switch semantics, and high-contrast states. |
| BfDataTable | `client/src/components/ui/data-table.tsx:38`, `table.tsx:5` | Semantic table wrappers; DataTable row adds `clickable` and `href` | 34 / 8 | Consolidate false duplicate table anatomy. Preserve semantic elements and row navigation; add density, sticky header, selection, loading/empty/error, and action-column recipes. |
| BfTabs | `client/src/components/ui/tabs.tsx:7` | Radix root/list/trigger/content with CVA list variants | 22 | Preserve Radix API. Add equal/content distribution and visible focus. Migrate the agent-only `PillTabs` after behavior parity. |
| BfSearch / Command | `client/src/components/search/SearchBox.tsx:14`, `ui/command.tsx:60`, `ui/combobox.tsx:39` | SearchBox used 20 times; cmdk command composition; Combobox has options/value/loading/empty API | 20 / 18 / 16 | One field anatomy, three behaviors: filter, command surface, and select-from-set. Do not merge their semantics merely because each contains search. |
| BfOrganizationScope | `client/src/components/forms/OrganizationSelect.tsx:32,73,122` | `GLOBAL` / `ALL` / org-id tri-state; loading/error; command selection | 30 | Preserve wire-level `__GLOBAL__` and `__ALL__` sentinels in a product adapter. The external registry should expose semantic values, not leak sentinels. |
| BfOverlay menu | `client/src/components/ui/popover.tsx:6`, `dropdown-menu.tsx:9`, `context-menu.tsx:7`, `sheet.tsx:8`, `tooltip.tsx:19` | Radix compositions | 25 / 9 / 8 / 10 / 20 | Preserve positioning, focus, keyboard, portal, submenu, and modality semantics; share visual tokens only. |
| BfDateTime | `client/src/components/ui/calendar.tsx:12`, `date-time-picker.tsx:71`, `date-range-picker.tsx:20` | react-day-picker/date-fns; explicit min/max/disabled/aria label on DateTimePicker | 4 / 1 / 5 | Keep domain APIs; unify field shell and timezone/validation guidance before visual migration. |
| BfPagination / Progress | `client/src/components/ui/pagination.tsx:11`, `progress.tsx:6` | Semantic nav/link exports; Radix progress | 5 / 8 | Preserve programmatic labels/value semantics; adopt Bifrost motion and bounded-result language. |

Other primitive sources—including accordion, avatar, calendar, chart, chat composer, collapsible, context viewer, expression editor, hover card, input group, multi-combobox, rich-text editor/toolbar, slider, tags input, toggle/group, variables tree, and verdict toggle—are individually captured in the JSON ledger with APIs, dependencies, source lines, states, and consumers.

## Product compositions

| Proposed pattern | Representative source refs | Consolidation judgment |
| --- | --- | --- |
| Application shell | `client/src/components/layout/AppLayout.tsx:19`, `Layout.tsx:11`, `Sidebar.tsx:239`, `AppHeader.tsx:41` | Define stable shell slots, navigation/current-location behavior, responsive collapse, and content-sized scrollers. Preserve router, permission, and organization scope behavior. |
| Workspace shell | `client/src/components/editor/EditorLayout.tsx:40`, `chat/ChatLayout.tsx:14`, `app-code-editor/AppCodeEditorLayout.tsx:13` | Related anatomy, not duplicates. Share rail/panel/dock primitives while retaining editor resize/persistence and chat conversation behavior. |
| Notification and progress center | `layout/NotificationCenter.tsx:355`, `UnifiedDock.tsx:13`, `RouteTransitionProgress.tsx:55` | Unify state language and Bifrost progress motion; keep notification persistence/actions separate from route progress. |
| Operational status | `execution/RunStatusBadge.tsx:33`, `users/UserStatusBadge.tsx:17`, `agents/Chip.tsx:30`, `solutions/SolutionManagedBadge.tsx:15` | Consolidate tone/icon/text anatomy into BfStatus adapters. Domain status-to-tone mapping remains near the feature. |
| Loading / empty / error | `PageLoader.tsx:9`, `files/InlineLoader.tsx:7`, `jsx-app/AppLoadingSkeleton.tsx:23`, `ErrorBoundary.tsx:13`, `PageErrorBoundary.tsx:16`, `NoAccess.tsx:7` | Create state primitives and recipes, not one mega-component. Loading scale, route recovery, permissions, and embedded-app boot have different semantics. |
| Data-management surface | `events/EventsTable.tsx:58`, `SubscriptionsTable.tsx:55`, `DeliveriesTable.tsx:72`, `reports/UsageTables.tsx:31` | Share toolbar/table/pagination/state anatomy while keeping entity-specific columns and actions local. |
| Dialog form | Representative dialog families under events, integrations, users, solutions, tables, files, and workflows | Keep domain forms local; standardize dialog containment, field anatomy, action order, destructive confirmation, async submit, and recovery. |
| Entity list surface | `applications/ApplicationListSurface.tsx:18`, `forms/FormListSurface.tsx:21`, `workflows/WorkflowListSurface.tsx:16` | Strong extraction candidate for header/filter/list/loading/empty/permission behavior with render slots. |
| Code and structured-data workbench | editor/file tree/terminal family, `shared/JsonYamlEditor.tsx:31`, table/query/policy editors | Share workspace chrome, diff/status, error, and command patterns. Monaco/Tiptap/tree domain behavior remains specialized. |

## Coverage boundary

The separate `apps/progress-demo/_layout.tsx`, `apps/progress-demo/pages/index.tsx`, and two `docs/demo/files-gallery` TSX files are recorded as app/demo consumers, not canonical primitive definitions. Test fixtures, hidden worktrees, generated declarations, and `node_modules` are intentionally excluded from the product baseline.

## Runtime export boundary

The product also exposes selected components to generated/hosted applications through `client/src/lib/bifrost-runtime.ts:94-195` and `client/src/lib/app-code-platform/components.ts:15-269`. These are public compatibility surfaces even though they are `.ts` rather than `.tsx`. Existing explicit collisions with Lucide names (`Badge`, `Sheet`, `Table`, `Command`) must remain coordinated with SDK/runtime contract tests. A future `RuntimeComponentRegistry` should version additions and deprecations in this one boundary rather than re-exporting ad hoc feature components.
