# Bifrost Design System — derived requirements

## Design problem

Bifrost app builders need to create internal and client-facing applications without rebuilding the visual language, shell, controls, and common operational patterns every time. Today the evidence is split across three places: the website expresses the newest Bifrost brand, the legacy design-system app catalogs reusable app UI, and MSP prototypes demonstrate the density of real operational work. Without a shared system, builders must reconcile those sources independently, producing visual drift and unnecessary cognitive load for both builders and users.

## L0 — Cognitive load

**Constraint.** Working memory can hold only a few active chunks, and unattended visual inconsistency still consumes processing capacity.

**Violation.** Current Bifrost apps mix host primitives, local CSS variables, hard-coded colors, unrelated shell models, and copied components. A builder must decide the visual grammar while also solving the product problem; an app user must relearn hierarchy and controls between Bifrost apps.

**R1.** The system must reduce each interface to one visual grammar with canonical tokens, predictable component APIs, explicit density choices, and a small number of compositional patterns. Minimalism must remove interpretive noise without removing information needed for expert work.

**Citations:** Cowan (2001, 2010) for working-memory capacity; Hassin et al. (2009) for working memory consumed by unconscious processing.

## L1 — First-impression architecture

**Constraint.** People form visual-quality and trust judgments before they consciously inspect interaction details.

**Violation.** Existing Bifrost surfaces vary enough in palette, density, navigation, and state treatment that a user may recognize the product category before recognizing Bifrost. Dark presentation is not itself the problem; unstructured darkness and generic developer-tool conventions are.

**R2.** Every Bifrost app must be recognizable at first glance through stable brand signals evidenced by the website: near-black structure, decisive cyan, a rare bridge spectrum, Prompt/Inter hierarchy, thin dividers, and one clear focal action or state per region. Light mode must remain equally deliberate rather than becoming an inverted afterthought.

**Citations:** Lindgaard et al. (2006) for 50-millisecond visual judgments; Kurosu and Kashimura (1995) for the aesthetic-usability effect.

## L2 — Processing fluency

**Constraint.** Consistent, easy-to-process signals are experienced as more credible and trustworthy; near-miss inconsistency is especially expensive because it looks accidental.

**Violation.** The references use overlapping but incompatible colors, fonts, radii, spacing, and component names. Useful Covi structure and useful Bifrost product conventions cannot determine Bifrost identity; the website-led evidence must settle the semantic token layer.

**R3.** The system must define a single semantic token layer that inherits the platform theme, keeps exact canonical values, and separates brand primitives from functional roles. Components must consume semantic tokens only. Compact, comfortable, and spacious density must alter rhythm—not identity, meaning, or component behavior.

**Citations:** Reber and Schwarz (1999) for perceptual fluency and judged truth; Alter and Oppenheimer (2009) for fluency effects across confidence, liking, and trust.

## L3 — Perception-bias optimization

**Constraint.** People infer quality from coherence and familiar task patterns before they rationalize their judgment. Expert and occasional users bring different predictions about density, explanation, and navigation.

**Violation.** A uniformly sparse system would frustrate internal operators, while a uniformly dense system would make infrequent client users feel lost. Separate visual brands would solve the local problem by creating ecosystem-level inconsistency.

**R4.** The system must support one Bifrost identity across two usage scenes: dense, scan-first internal operation and spacious, explanation-first client interaction. Documentation must demonstrate both with credible application specimens so builders choose composition based on task frequency and user context rather than taste.

**Citations:** Clark (2013) for predictive processing; Seckler et al. (2015) for visual coherence as a direct trust producer.

## L4 — Decision architecture

**Constraint.** A design system changes behavior only when the correct implementation is easier to choose and experience than local invention.

**Violation.** A catalog alone can show attractive specimens without changing how apps are built. Builders still need to know which component or pattern to choose, what states to include, and how to start a real Bifrost app.

**R5.** The system must pair documentation with executable assets: copyable tokens and components, approved app-shell starters, internal and client-facing pattern recipes, complete state examples, and concise “use when / avoid when” guidance. The recommended path must be the shortest path to a working, accessible app.

**Citations:** Hertwig and Erev (2009) for decisions from experience versus description; Trope and Liberman (2010) for matching communication to decision distance.

## Accumulated non-negotiable requirements

- **R1:** One visual grammar must reduce noise while preserving expert information density.
- **R2:** Stable brand signals must make every app recognizably Bifrost at first glance.
- **R3:** Semantic, theme-inheriting tokens must keep identity and behavior consistent across densities.
- **R4:** One identity must serve both internal operator and client-facing usage scenes through composition, not separate themes.
- **R5:** Executable starters and contextual recipes must make correct implementation easier than local invention.

## Derived solution

The minimum system that satisfies all five requirements is:

1. A Bifrost v2 catalog Solution organized as **Foundations**, **Components**, **Patterns**, and **Start building**.
2. A canonical `--bf-*` token layer with brand primitives, semantic surface/text/action/state roles, platform light/dark mappings, spacing, type, radii, elevation, motion, and three density settings.
3. Reusable `Bf*` React components that consume semantic tokens and expose complete interactive states.
4. Higher-order patterns for app shells, page headers, metric groups, data tables, filter toolbars, list-detail, forms, dialogs, empty/error/loading states, and action queues.
5. Two realistic reference compositions—an internal operations workspace and a client-facing workspace—built from the same components and tokens.
6. Starter guidance and source assets that can be copied into a new Bifrost v2 app without depending on the catalog at runtime.

## Proposal check

- **Copy the website directly:** fails R1 and R4 because marketing-scale typography and spacing do not support recurring dense work.
- **Restyle the reference catalog only:** fails R2 and R5 because changing tokens alone does not create a website-led Bifrost language or an owned source path.
- **Standardize the MSP prototypes:** fails R2 and R3 because their local tokens and dense dashboard conventions are not a coherent brand system.
- **Catalog plus reusable starter layer:** satisfies all five requirements when website restraint, existing catalog structure, and operational density are deliberately combined.

## The gap

None of the existing references makes brand recognition, operational density, and implementation reuse true at the same time. The non-obvious requirement is therefore not another component gallery; it is a two-density application grammar with executable starter assets and real pattern specimens.
