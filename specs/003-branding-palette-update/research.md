# Research: Branding & Palette Update

**Feature**: 003-branding-palette-update
**Date**: 2026-02-22

## Decision 1: Blue Palette Selection

**Decision**: Use a 5-tone navy/steel/slate blue palette that harmonizes with existing gold (#D4AF37), copper (#B87333), and cream (#F5F5F0) accents.

**Rationale**: The palette was selected for:
- Premium, sophisticated feel consistent with bourbon/whiskey brand identity
- All tones meet WCAG 2.1 AA contrast requirements against their target backgrounds
- Desaturated, cool blues complement warm metallic accents (gold, copper) through temperature contrast
- Luminance values closely match the tones they replace (e.g., Slate ≈ dark marsala)

**Final Palette**:

| Token | Hex | RGB | Luminance | Role |
|-------|-----|-----|-----------|------|
| `--bb-navy` | `#2B4F73` | 43, 79, 115 | 0.0734 | Primary accent: links, buttons, headings |
| `--bb-steel-blue` | `#35678A` | 53, 103, 138 | 0.1229 | Hover states, secondary accent |
| `--bb-slate` | `#2C3E50` | 44, 62, 80 | 0.0456 | Dark accents: borders, dark backgrounds |
| `--bb-light-steel` | `#B8C8D8` | 184, 200, 216 | 0.5646 | Light backgrounds: pagination, highlights |
| `--bb-dusty-blue` | `#567490` | 86, 116, 144 | 0.1649 | Medium decorative: navbar focus states |

**Alternatives considered**:
- Bright/royal blues (#0066CC family) — rejected as too corporate and neon, conflicts with premium spirits aesthetic
- Teal/cyan blues (#2E8B8B family) — rejected as too green-leaning, doesn't read as "blue"
- Powder/baby blues (#87CEEB family) — rejected as too light and casual for a premium brand

## Decision 2: WCAG Contrast Validation

**Decision**: All palette combinations pass WCAG 2.1 AA requirements.

| Color Pair | Contrast Ratio | Requirement | Status |
|-----------|---------------|-------------|--------|
| Navy `#2B4F73` on Cream `#F5F5F0` | 7.78:1 | ≥4.5:1 (normal text) | PASS |
| Navy `#2B4F73` on White `#FFFFFF` | 8.51:1 | ≥4.5:1 (normal text) | PASS |
| Steel Blue `#35678A` on Cream `#F5F5F0` | 5.55:1 | ≥4.5:1 (normal text) | PASS |
| Steel Blue `#35678A` on White `#FFFFFF` | 6.07:1 | ≥4.5:1 (normal text) | PASS |
| Slate `#2C3E50` on Cream `#F5F5F0` | 10.04:1 | ≥4.5:1 (normal text) | PASS |
| Charcoal `#2C2C2C` on Light Steel `#B8C8D8` | 8.17:1 | ≥4.5:1 (normal text) | PASS |
| Cream `#F5F5F0` on Dusty Blue `#567490` | 4.47:1 | ≥3:1 (large text/UI) | PASS |
| Cream `#F5F5F0` on Navy `#2B4F73` | 7.78:1 | ≥4.5:1 (normal text) | PASS |
| Gold `#D4AF37` on Charcoal `#2C2C2C` | ~5.8:1 | ≥4.5:1 (normal text) | PASS (unchanged) |

## Decision 3: Marsala Override Strategy

**Decision**: Override all 7 marsala CSS custom properties in the `bottlebond.css` `:root` block. Do not edit the theme file.

**Rationale**: The marsala theme defines 7 custom properties used across ~100 CSS rules. By overriding the custom property declarations (not individual rules), a single block of 7 lines neutralizes all 100 usages via the CSS cascade. The `bottlebond.css` is loaded after the theme CSS, so `:root` declarations will win.

**Mapping**:

| Marsala Variable | Old Value | New Value | Blue Token |
|-----------------|-----------|-----------|------------|
| `--primary-accent` | `#955251` | `#2B4F73` | `--bb-navy` |
| `--navbar-border-top` | `#532e2d` | `#2C3E50` | `--bb-slate` |
| `--button-border` | `#6d3c3b` | `#2C3E50` | `--bb-slate` |
| `--link-focus` | `#633736` | `#2C3E50` | `--bb-slate` |
| `--link-hover-bg` | `#74403f` | `#2C3E50` | `--bb-slate` |
| `--pagination-bg` | `#d2adad` | `#B8C8D8` | `--bb-light-steel` |
| `--navbar-focus` | `#c08c8c` | `#567490` | `--bb-dusty-blue` |

**Alternatives considered**:
- Editing theme CSS directly — rejected per spec assumption (theme files not modified)
- Creating a separate override CSS file — rejected, bottlebond.css already serves this purpose
- Duplicating all 100 rules with new values — rejected, overriding custom properties is far simpler

## Decision 4: Logo Integration Approach

**Decision**: Use Hugo's native `logo` and `logo_small` config parameters. No template override needed.

**Rationale**: The theme's `nav.html` partial (line 4-13) already supports:
- `disabled_logo = false` → renders logo images
- `logo` param → shown on desktop/tablet via `hidden-xs hidden-sm`
- `logo_small` param → shown on mobile via `visible-xs visible-sm`
- Automatic homepage link via `<a class="navbar-brand home" href="/">`
- Max height constrained to 42px by theme CSS

**Config change**:
```toml
disabled_logo = false
logo = "img/BB_Gold.png"
logo_small = "img/Icon - Gold.png"
```

**Fallback**: If images fail to load, the browser shows alt text ("BottleBond logo"). For enhanced fallback, CSS can style the alt text or the `logo_text` param can be retained as a configuration backup.

**Alternatives considered**:
- Custom nav.html partial override with `<picture>` element — rejected, unnecessary complexity
- SVG conversion of logo PNGs — rejected, out of scope per spec
- JavaScript-based fallback detection — rejected, over-engineered for static site

## Decision 5: Burnt-Sienna Replacement Scope

**Decision**: Replace only `--bb-burnt-sienna` (#8B4513) with `--bb-navy` (#2B4F73). Retain `--bb-copper` (#B87333) and `--bb-deep-brown` (#654321) unchanged.

**Rationale**: Per user clarification, only the burnt-sienna tone is being replaced. Copper serves as a warm accent for hover states (episode cards, host social links, Glass Room TOC) and complements the blue primary color through temperature contrast. Deep-brown provides heading warmth.

**Impact**: 9 CSS rules in bottlebond.css reference `--bb-burnt-sienna`. After replacement, the token will be renamed to `--bb-navy` and all 9 references updated.

**Hover state update**: Some hover states currently transition from burnt-sienna → copper. After the palette change, these will transition from navy → steel-blue (blue family hover) while copper remains for component-specific warm accents (episode cards, host links, Glass Room links).
