# Component visual and behavioral test matrix

| Family | Unit/contract coverage | Browser behavior | Themes / viewport | Migration gate |
| --- | --- | --- | --- | --- |
| Tokens/theme/density | Token presence and reduced-motion overrides | Toggle theme and all three densities without layout jump | Light/dark; 1536×960; 390×844 | Product host variables map without independent theme state |
| Button | Label fit, click, disabled, loading/busy, icon, destructive | Focus, press, no width shift while loading | Both themes; compact/comfortable/spacious | Existing CVA variants and `asChild` adapter pass |
| Field | Persistent label, help/error linkage, invalid/disabled, leading icon | Keyboard focus, icon spacing ≥8px, no focus flash | Both themes; mobile form | React Hook Form and Radix Select consumers pass |
| Selection | Checkbox/radio/switch semantics and change callbacks | Keyboard and pointer state; target size | Both themes; mobile | Existing Radix props/refs pass |
| Status | Tone mapping, visible text, square signal | Contrast and non-color distinction | Both themes | Domain state maps cover unknown/future states |
| Tabs/navigation | Selected state, equal/content distribution, disabled | Arrow-key behavior through Radix adapter; no layout jump | Both themes; mobile wrapping/scroll | `PillTabs` consumers migrated or adapted |
| Alert/state frame | Assertive/polite roles, recovery copy/action | Loading/empty/error/permission/destructive variants | Both themes; narrow panels | Error boundaries and NoAccess preserve recovery |
| Table/list surface | Semantic headers/cells, clickable row semantics, selection | Sticky header, horizontal containment, loading/filtered-empty/pagination | Both themes; desktop/mobile | Existing row href/callback behavior preserved |
| Dialog/alert dialog | Title/description, Escape/backdrop, close callback | Focus trap/return, separately scrolling body, destructive action order | Both themes; short/tall viewport | All Radix composition exports preserved |
| Menu/popover/sheet/tooltip | Role and keyboard contracts | Portal positioning, nested menu, dismissal, focus return | Both themes; edge placement | Existing Radix APIs preserved |
| Motion/progress | Semantic durations; reduced motion zeroes loops/transforms | Route, disclosure, state entry, loading/progress | Normal/reduced motion | Product route/job progress uses shared tokens |
| Application shell | Slot and current-location contract | responsive rail/drawer, one scroller, stable route scroll | Desktop/tablet/mobile | Router, org scope, permission, dock state preserved |
| Workspace panel | Header/action slots, empty/error/loading | resize, dock, active panel, overflow containment | Desktop/narrow window | Editor/chat/terminal persistence behavior preserved |

Phase 1 currently automates the first six primitive families plus dialog and motion in `scripts/qa.mjs` and focused Vitest files. Product adapter work must add its own compatibility tests against baseline consumers before a migration item can move to `verified`.
