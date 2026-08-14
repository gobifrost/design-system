# Bifrost Design System

<!-- impeccable:product-schema 1 -->

## Platform

Web. React + TypeScript applications running standalone or inside a Bifrost `standalone_v2` host.

## Users

The primary users are engineers and product designers building Bifrost itself, Bifrost Solutions, and customer-owned apps. They work across dense MSP operations, automation, agent oversight, configuration, reporting, forms, and client-facing workflows.

## Product Purpose

The Bifrost Design System is the production source of truth for Bifrost-branded interface tokens, components, motion, application patterns, and migration guidance. It makes new work recognizably Bifrost without coupling consumers to a binary UI package: builders copy registry source into their app, own it, and adapt it intentionally.

Success means a builder can inspect a real component state, copy its source, compose a durable operational pattern, and understand its accessibility, responsive, theme, loading, error, empty, permission, destructive, and reduced-motion contracts.

## Positioning

This is not a marketing theme or a generic component gallery. It translates the website's dark, technical, open-source identity into an operating layer for real Bifrost software: decisive cyan action, near-black structure, a restrained spectrum bridge, crisp typography, compact controls, and motion that explains system behavior.

## Operating Context

- Apps may mount inside Bifrost with host-managed light/dark theme state or run locally for development.
- Internal workspaces are often data-dense, persistent, and used by expert operators.
- Customer-facing flows are less frequent and need more explanation without becoming a second brand.
- Components must survive narrow drawers, long tables, variable organization branding, permission gates, async work, and keyboard-only use.

## Brand Authority

- Website baseline: `gobifrost/website` at `afa9e9b4842304c54ff1b5d79d010017f1da23cb` (local checkout `/home/jack/GitHub/gobifrost`).
- Native logo masters come directly from that repository. They are never redrawn or converted.
- Core dark colors are `#08090b` canvas, `#0a0c0f` surface, near-white foreground, muted blue-gray, and `#2fd4d4` primary cyan.
- The Bifrost bridge is a thin feathered spectrum from red through magenta. It is a route, progress, or structural seam—not a decorative gradient fill.
- Inter is the interface workhorse; Prompt is reserved for identity and selected display moments; JetBrains Mono is reserved for code and measurements.
- Voice is direct, specific, technically honest, and free of hype.

## Product Principles

1. Structure carries density. Alignment, rules, hierarchy, and stable placement do more work than cards.
2. The bridge communicates connection. Spectrum motion belongs to route continuity, transfer, progress, and system relationships.
3. Cyan is a decision. Use it for action, focus, and current location, not decoration.
4. State is redundant by design. Shape, icon, text, and color work together.
5. Motion preserves causality. It acknowledges input, connects before and after, and communicates real progress.
6. Source ownership beats package lock-in. Registry output is copied into consuming apps and remains readable.

## Accessibility & Inclusion

Semantic structure, keyboard operation, visible focus, WCAG AA contrast, non-color status cues, responsive layouts, zoom tolerance, and complete reduced-motion behavior are component contracts. Loading, empty, error, disabled, permission, destructive, and recovery states are not optional polish.

## Phase 1 Reference

Feature breadth and QA discipline are inherited from the Covi Design System baseline at commit `565cb8d34d08cf5b500482b3c996a9fb78c12364`. Covi visual language and brand assets are explicitly not inherited.
