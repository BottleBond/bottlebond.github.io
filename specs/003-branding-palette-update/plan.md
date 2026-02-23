# Implementation Plan: Branding & Palette Update

**Branch**: `003-branding-palette-update` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-branding-palette-update/spec.md`

## Summary

Replace all pink, red, and marsala-toned colors with a blue palette and integrate the BB_Gold logo into the navigation bar. The marsala theme base stylesheet will not be edited; all overrides are applied through `static/css/bottlebond.css`. The burnt-sienna design token is replaced with a navy blue; copper and deep-brown are retained. Logo integration requires only a `hugo.toml` config change — the theme natively supports responsive logo images.

## Technical Context

**Language/Version**: Hugo (Go templates), CSS3
**Primary Dependencies**: hugo-universal-theme (marsala color variant)
**Storage**: Static files (CSS, PNG images)
**Testing**: Hugo build verification (`hugo --minify`), visual inspection at 3 viewports
**Target Platform**: GitHub Pages (static hosting)
**Project Type**: Static site (Hugo)
**Performance Goals**: N/A — CSS-only changes, no runtime impact
**Constraints**: Must not edit theme files directly; all overrides via `static/css/bottlebond.css` and `hugo.toml`
**Scale/Scope**: 1 CSS file, 1 config file, ~109 color references to override

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Dynamic Content First | N/A | CSS/branding is presentation-layer, no content changes |
| II. Security By Default | PASS | No user input, no API changes, no secrets |
| III. Testable & Continuous Delivery | PASS | Hugo build gate; visual verification checklist |
| IV. Observability & Error Handling | N/A | Static CSS, no runtime errors to handle |
| V. Accessibility & Performance | PASS | Blue palette selected to meet WCAG 2.1 AA contrast (≥4.5:1 normal text, ≥3:1 large text) |
| VI. Documentation Accompaniment | PASS | README to be updated with branding/palette documentation |

No violations. All applicable gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/003-branding-palette-update/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Blue palette research & contrast validation
├── quickstart.md        # Phase 1: Verification steps
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
static/
├── css/
│   └── bottlebond.css      # Custom stylesheet — all palette overrides here
└── img/
    ├── BB_Gold.png          # Full logo (navbar desktop/tablet)
    ├── BB_Blue.png          # Blue variant (unused in nav)
    ├── BB_White.png         # White variant (unused in nav)
    ├── Icon - Gold.png      # Compact logo (navbar mobile)
    ├── Icon - Blue.png      # Blue icon (unused in nav)
    ├── Icon - White.png     # White icon (unused in nav)
    └── Icon - Black.png     # Black icon (unused in nav)

hugo.toml                    # Logo config: logo, logo_small, disabled_logo
```

**Structure Decision**: No new files created beyond the spec artifacts. All CSS changes go into the existing `bottlebond.css`. Logo integration is purely config (`hugo.toml`). The theme's `nav.html` partial natively supports responsive logo rendering — no template override needed.

## Implementation Approach

### User Story 1 — Replace Pink/Red Palette with Blues (P1)

**Scope**: 109 color references across 2 files

#### Step 1: Define new blue design tokens in `bottlebond.css`

Replace `--bb-burnt-sienna` with `--bb-navy` and add new tokens for marsala overrides:

| Token | Hex | Purpose | Replaces |
|-------|-----|---------|----------|
| `--bb-navy` | See research.md | Primary accent (links, buttons, headings) | `--bb-burnt-sienna` (#8B4513) |
| `--bb-steel-blue` | See research.md | Hover states, secondary accent | Marsala hover tones |
| `--bb-slate` | See research.md | Dark accents (borders, dark backgrounds) | Dark marsala tones (#532e2d, #633736, #6d3c3b, #74403f) |
| `--bb-light-steel` | See research.md | Light backgrounds (pagination) | Light marsala (#d2adad) |
| `--bb-dusty-blue` | See research.md | Medium decorative (navbar focus) | Marsala focus (#c08c8c) |

#### Step 2: Override marsala theme CSS variables

Add overrides in `bottlebond.css` `:root` block for all 7 marsala custom properties:

| Marsala Variable | Current Value | Override With |
|-----------------|---------------|---------------|
| `--primary-accent` | #955251 | `var(--bb-navy)` |
| `--navbar-border-top` | #532e2d | `var(--bb-slate)` |
| `--button-border` | #6d3c3b | `var(--bb-slate)` |
| `--link-focus` | #633736 | `var(--bb-slate)` |
| `--link-hover-bg` | #74403f | `var(--bb-slate)` |
| `--pagination-bg` | #d2adad | `var(--bb-light-steel)` |
| `--navbar-focus` | #c08c8c | `var(--bb-dusty-blue)` |

This covers all 100 usages of marsala variables via cascade.

#### Step 3: Update burnt-sienna references in `bottlebond.css`

Replace all 9 references to `var(--bb-burnt-sienna)` with `var(--bb-navy)`:

1. `.faq-category h3` → color
2. `.btn-primary, .btn-template-main` → background-color
3. `.btn-primary:hover, .btn-template-main:hover` → border-color
4. `.btn-default, .btn-template-transparent-primary` → border-color, color
5. `.btn-default:hover, .btn-template-transparent-primary:hover` → background-color
6. `.glass-room-era h3` → color
7. `.glass-room-breadcrumb a` → color
8. `a` (global links) → color

#### Step 4: Update hover states

Replace `var(--bb-copper)` hover references that currently pair with burnt-sienna to use `var(--bb-steel-blue)`:

- `.episode-card h4 a:hover` → color
- `#blog-homepage .post-entry h2 a:hover` → color
- `.host-social a:hover` → color
- `.glass-room-toc a:hover` → color
- `a:hover` (global) → color

### User Story 2 — Integrate Logos (P2)

#### Step 1: Update `hugo.toml` logo configuration

```toml
disabled_logo = false
logo = "img/BB_Gold.png"
logo_small = "img/Icon - Gold.png"
# logo_text = "BottleBond"  # Retained as fallback but disabled_logo=false uses images
```

The theme's `nav.html` handles everything:
- Desktop/tablet: Shows `BB_Gold.png` via `hidden-xs hidden-sm` class
- Mobile: Shows `Icon - Gold.png` via `visible-xs visible-sm` class
- Logo links to homepage via `<a class="navbar-brand home" href="/">`
- Max height constrained to 42px by theme CSS

#### Step 2: Add logo fallback and sizing CSS

Add to `bottlebond.css`:
- Logo `onerror` fallback is not needed — the theme handles this via the `disabled_logo` / `logo_text` pattern. If images fail to load, add CSS to ensure graceful degradation.
- Adjust logo sizing if 42px max-height needs refinement for the specific BB_Gold asset.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Marsala theme has inline styles not covered by CSS variables | Low | Medium | Search for hardcoded hex values in theme templates |
| Blue palette fails WCAG contrast on some backgrounds | Medium | High | Pre-validate all combinations via contrast checker in research.md |
| Logo image too large/small at 42px constraint | Low | Low | Test and adjust CSS max-height if needed |
| CSS specificity conflicts with theme styles | Medium | Medium | Use `!important` sparingly where theme uses it |
