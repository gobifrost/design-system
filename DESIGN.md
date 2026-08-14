# Bifrost Design System

The Bifrost Design System is the operating layer for Bifrost software: dark-first, exact, information-dense, and visibly connected. The website is the brand authority; the catalog translates its language into product controls without shrinking a marketing page into an application.

**North star: Chromatic Rail.** A thin Bifrost bridge seam locates an otherwise restrained, work-first interface.

## Brand baseline

Evidence was captured from `gobifrost/website` at `afa9e9b4842304c54ff1b5d79d010017f1da23cb`.

- Native marks are copied without reconstruction from `public/logo-square.svg`, `public/logo-lightmode.svg`, and `public/favicon.svg`.
- The default canvas is `#08090b`, the primary surface is `#0a0c0f`, and decisive action cyan is `#2fd4d4`.
- The bridge spectrum runs red → orange → yellow → green → cyan → blue → purple → magenta. It appears as a rare, thin seam, localized route, or progress signal—not a decorative panel fill or viewport frame.
- Inter is the interface workhorse, Prompt is reserved for brand/display moments, and JetBrains Mono carries code and measurements.
- Voice is direct, specific, calm, and technically honest.

## Principles

1. **Structure carries density.** Alignment, rules, and stable placement do more work than cards.
2. **Cyan is a decision.** Reserve it for action, focus, and current location.
3. **The bridge communicates connection.** Spectrum motion represents transfer, continuity, progress, or a system relationship.
4. **State is redundant by design.** Text, icon or shape, and color work together.
5. **Motion preserves causality.** Movement acknowledges input or connects before and after; it does not decorate rest.
6. **Source ownership beats lock-in.** Consumers copy registry source and keep the accessibility contract visible.

## Tokens

The canonical source is `apps/bifrost-design-system/src/design-system/tokens.css`. Components consume semantic `--bf-*` roles; they do not hard-code theme colors.

### Theme

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#f7f9fa` fallback | `#08090b` fallback |
| Surface | `#ffffff` fallback | `#0a0c0f` fallback |
| Primary | `#087f86` | `#2fd4d4` |
| Text | `#101419` fallback | `#f7f9fb` fallback |
| Muted text | `#51606c` fallback | `#9caab5` fallback |
| Boundary | `#d7dfe3` fallback | `#252c34` fallback |

The fallbacks make the source runnable outside Bifrost. Inside Bifrost, canvas, foreground, card, muted, and border roles inherit the host variables. The host provider owns `.dark`; a consuming app must not create a second theme store.

### Geometry and density

- Control / surface / feature radii: 6 / 4 / 8px. Status is never rendered as a pill.
- Compact: 32px controls, 40px rows, 8px local gap, 16px surface padding.
- Comfortable: 40px controls, 48px rows, 12px local gap, 20px surface padding.
- Spacious: 48px controls, 60px rows, 16px local gap, 28px surface padding.
- Density changes rhythm only; component meaning, tokens, and behavior remain stable.

### Elevation

Surfaces are flat at rest. Hairlines and tonal shifts establish hierarchy. Floating menus and dialogs may use `--bf-shadow-float` and `--bf-shadow-modal` because they occupy a real layer.

## Typography

- Display: Prompt, `clamp(3rem, 6vw, 6.4rem)`, tightly set, used once per viewport.
- Interface: Inter, 12–16px depending on purpose; metadata remains legible and is not artificially miniaturized.
- Code: JetBrains Mono, 11–13px with comfortable line height.
- Sentence case is the default. Uppercase is limited to short state and specimen signals.

## Motion

The motion thesis is **quiet machinery**.

- Feedback: 120ms for press, hover, focus, and small state acknowledgement.
- Disclosure: 220ms for accordions, compact layout changes, and overlay entry.
- Route: 360ms maximum, with a short settle that preserves location.
- Progress: 1600ms only for genuine ongoing work.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for arrival and `cubic-bezier(0.2, 0, 0, 1)` for ordinary state change.

With `prefers-reduced-motion: reduce`, durations become 0ms and blur, clipping, translation, rotation, and loops are removed. State changes remain immediate and legible.

## Component contracts

- Buttons fit their full labels, maintain one primary action per local decision, expose disabled/loading semantics, and show a 2px cyan focus ring.
- Fields keep persistent labels, reserve real space around leading icons, connect help/error copy with `aria-describedby`, and pair errors with text.
- Checkbox, radio, and switch semantics are not interchangeable. Switches apply immediately; form choices wait for submission.
- Status labels are text plus a square semantic signal on a flat surface. Color is never the only cue.
- Tabs distribute bounded peers evenly; long sets may scroll and size to content.
- Alerts identify what happened and, when useful, the recovery action.
- Dialogs use a bounded surface with a separately scrolling body, Escape/backdrop dismissal, and focus return.
- Searchable set selection uses BfCombobox or BfMultiSelect. Both own query filtering, keyboard traversal, descriptions/keywords, empty/loading/disabled/error states, and linked field messaging; multi-select also owns tag removal, limits, and bulk selection.
- BfDataTable owns a content-sized-until-constrained scroller, sticky semantic headers, sorting, single/multi selection, loading/empty/error states, row activation, and a pinned footer/pagination region. Entity-specific columns, data fetching, filters, and actions stay with the consumer.

## Layout and responsiveness

The catalog uses one nested content scroller with a stable gutter. The document root never grows a second scrollbar during route or dialog animation. Desktop uses a persistent rail; below 900px it becomes a header and modal navigation drawer. Dense tables may scroll horizontally only when their semantic structure cannot reflow.

## Distribution

`registry.json` is the source manifest. `npm run registry:build` emits shadcn-compatible payloads to the catalog's `public/r/` directory, and `node scripts/add.mjs <item> --root <app>` copies dependency-complete source into a consumer. See `docs/consumption.md`.

## QA standard

Every component change requires a focused unit test and a browser pass in both themes at representative desktop and mobile sizes. Browser QA covers route continuity, native assets, density, labels and spacing, keyboard/programmatic state, modal containment, reduced motion, horizontal overflow, and console errors.
