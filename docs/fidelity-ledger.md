# Fidelity ledger

- Approved reference: `.impeccable/mocks/bifrost-field-guide.png`
- Implemented surface: `apps/bifrost-design-system/src/`
- Primary captures: `.impeccable/screenshots/field-guide-dark-desktop.png`, `.impeccable/screenshots/field-guide-dark-mobile.png`, `.impeccable/screenshots/components-motion-dark-desktop.png`

| Checkpoint | Approved direction | Implemented result | Verdict |
| --- | --- | --- | --- |
| Global silhouette | Narrow chromatic rail, broad work field, right guide | 248px rail, responsive center field, 300px guide; single stable content scroller | Faithful, with more readable navigation labels |
| First-viewport hierarchy | Oversized Bifrost thesis and two actions | Same thesis, Prompt-led display scale, one cyan action and one bounded secondary | Faithful |
| Brand signature | Native mark plus a thin full-spectrum edge | Website-native square mark and an 8-stop vertical/horizontal bridge seam | Faithful |
| Live specimens | Flat bordered rows for action, status, input, navigation, feedback | Interactive code-native rows with live density, status redundancy, and real control spacing | Improved from static concept |
| Right guide | Orientation, install command, and resource links | Start-building command, field-guide routes, and source-ownership note | Faithful, adapted to the local source registry |
| Shape language | Decisive low-radius controls and square content surfaces | 6px controls, 4px surfaces, flat status, hairline hierarchy | Faithful without brittle zero-radius controls |
| Motion | Clearly perceptible but non-ornamental transitions | 120/220/360ms semantic tokens, route settle, disclosure, component entrance, progress, replay specimen | Expanded into a documented contract |
| Responsive behavior | Retain identity and utility on mobile | Header/drawer transposition, stacked actions, contained specimens, no horizontal page overflow | Faithful |

## Visual-pass findings and dispositions

- The first production preview was blank because the v2 host mount path did not also mount a standalone `#root`; the entry point now supports both contracts.
- Route navigation initially retained the previous content scroll position, clipping the next page's title. The shell now resets its content scroller on pathname changes, and browser QA asserts it.
- Ambiguous acceptance selectors were scoped to the labeled catalog navigation so duplicate visible shortcut names remain valid product copy.
- Field help/error text originally became part of the label's accessible name. Field anatomy now keeps descriptions adjacent and linked rather than nested.
- Reference copy still described obsolete 2px/blue/420ms values; catalog properties and documentation now match the shipped 6px/cyan/360ms tokens.
- The finish review found click-only ARIA tab/radio selectors; roving focus plus Arrow/Home/End behavior now ships in BfTabs, DensityControl, and the component-family workbench.
- The source-install command now wraps in place instead of hiding its target behind an ellipsis.
- The mobile nine-family selector now stays on one horizontally scrollable peer row instead of wrapping into a hard-to-scan second row.

## Validation record

The final command record is maintained in `README.md`. Captures cover light and dark themes, 1536×960 desktop, 390×844 mobile, component overlays and motion, patterns, foundations, and start-building guidance.
