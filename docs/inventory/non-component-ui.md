# Non-component and one-off UI inventory

Baseline: `a75ee49a432b3ed110df98f8ea0e27e87a4262cd`.

The AST scan found relatively little direct native-control markup because most product code already uses shared primitives. The important debt is therefore not only raw markup; it is repeated higher-order anatomy scattered across feature components.

## Direct native controls to normalize

| Source refs | Evidence | Proposed replacement | Notes |
| --- | --- | --- | --- |
| `client/src/components/editor/SourceControlPanel.tsx:921,1023,1104,1135,1369,1384,1422,1496` | Seven native buttons and one native input in a complex panel | BfButton/BfField-compatible primitives plus CommandBar and FileChangeList patterns | Preserve git operations, keyboard navigation, disabled/busy state, and compact density. Migrate in bounded sections rather than rewriting the panel. |
| `client/src/components/workflows/WorkflowSidebar.tsx:54,87,143,176,402,416` | Six native buttons across tree/navigation actions | IconButton / TreeAction adapter | Requires accessible names, current selection, focus management, and compact hit targets. |
| `client/src/components/integrations/ConfigOverridesTab.tsx:305,317,367,402,414` | Four native buttons and one textarea | BfButton/BfField plus EditableKeyValue pattern | Preserve JSON/value editing, validation, copy/reset, and dirty state. |
| `client/src/pages/SolutionDetail.tsx:1226,1287,1351,2400,2412` | Five native buttons embedded in a 2,400-line route | SectionAction / InlineDisclosure controls | Extract route sections first; do not introduce a generic component that hides solution-domain behavior. |
| `apps/progress-demo/pages/index.tsx:1-194` | Standalone app built with SDK hooks, native controls, and local styles | Registry-token starter plus OperationProgress pattern | Treat as a real consumption test for copied source and host theme behavior. |
| `docs/demo/files-gallery/gallery_index.tsx:1-102` | Documentation demo with SDK hooks, inline styles, and native controls | FileGallery recipe plus BfButton/BfStateFrame | Keep it outside the product bundle, but migrate it as documentation evidence. |

## Repeated anatomy that should become patterns

### List-surface frame

Applications, forms, and workflows each own a list surface. The common contract is page title, search/filter, creation action, loading, empty, error, permissions, and content-sized results. Proposed `EntityListSurface` accepts render slots and never owns fetching.

### Status mapping

Run, user, agent, solution, passkey, integration match, and diagnostic queue states each build badge/chip variants. Proposed `BfStatus` owns anatomy and accessible text; each domain keeps an explicit state→tone/icon/label map.

### Async operation state

Route progress, OAuth refresh, summary backfill, package installation, indexing, app update, source sync, and workflow execution all surface work. Proposed `OperationProgress` standardizes queued/running/succeeded/failed/cancelled language, progress, and reduced motion while preserving each job's data source.

### Empty/error/permission frame

`NoAccess`, route error boundaries, inline empty tables, missing selections, and disconnected integrations need a shared state anatomy: clear title, explanation, relevant technical detail, one primary recovery action, and optional secondary navigation. They remain separate semantic states.

### Dialog form frame

Dozens of domain dialogs repeat title/description, scroll body, field stack, async submit, cancellation, destructive mode, and API-error recovery. Proposed `DialogForm` is a recipe around the compatible Radix dialog and React Hook Form, not a replacement for domain DTO logic.

### Inspector / reference panel

Policy reference, file policy reference, event topic reference, claim reference, dependency panels, and context panels share a narrow read/inspect surface. Proposed `InspectorPanel` defines header, tabs/sections, code/value rows, copy affordances, and constrained scrolling.

### Workspace panel chrome

Editor, terminal, source control, file tree, app dependencies, chat sidebar, and execution sidebar need consistent resize handles, panel headers, active location, empty state, and dock behavior. Proposed `WorkspacePanel` supplies chrome and motion; domain internals remain local.

## State gaps to verify during migration

- Loading that replaces content versus loading that preserves stale content
- Empty data versus filtered-empty versus permission-hidden
- Disabled controls whose reason is not visible
- Destructive actions that currently use ordinary dialogs/buttons
- Long dialog content and nested-scroll containment
- Route transitions and panel motion under reduced-motion preference
- Keyboard behavior for tree rows, clickable table rows, icon-only actions, and custom comboboxes
- Status color contrast and non-color cues in both themes
