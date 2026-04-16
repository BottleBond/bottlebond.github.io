# Design System — BottleBond

## Product Context
- **What this is:** Premium bourbon & whiskey education platform — podcast, tasting reviews, learning hub, interactive quiz
- **Who it's for:** Bourbon enthusiasts from curious beginners to seasoned connoisseurs
- **Space/industry:** Spirits media / bourbon podcast. Peers: Bourbon Pursuit, Whisky Advocate, distillery brand sites
- **Project type:** Content-heavy editorial site with interactive features (Hugo static site on GitHub Pages)

## Aesthetic Direction
- **Direction:** Luxury-Editorial hybrid — dark-first cinematic feel
- **Decoration level:** Intentional — subtle paper grain texture on surfaces, gold rule lines between sections, BB monogram watermark at ~3% opacity on hero sections
- **Mood:** Walking into a private tasting room at dusk. Warm, rich, authoritative but inviting. Not a podcast landing page — a bourbon knowledge destination.
- **Reference sites:** Buffalo Trace (earthy editorial grid), Whisky Advocate (magazine hierarchy), Bourbon Pursuit (podcast peer — gap to exploit)

## Typography
- **Display/Hero:** Playfair Display (900, 700, 400) — ornate Victorian serif matching the logo; for page titles, hero headings, section headers
- **Body:** Source Serif 4 (400, 600, 700 + italic) — refined screen serif with strong hierarchy at small sizes; for article body, descriptions, long-form content
- **UI/Labels:** DM Sans (400, 500, 600, 700) — modern sans counterpoint; for nav items, buttons, badges, metadata, filters, timestamps
- **Data/Tables:** DM Sans with tabular-nums — for prices, proof numbers, dates
- **Code:** JetBrains Mono (if needed for any code content)
- **Loading:** Google Fonts via `<link>` in `<head>` with `preconnect`
- **Scale:**
  - Hero: clamp(48px, 8vw, 96px)
  - H1: clamp(36px, 5vw, 64px)
  - H2: clamp(28px, 4vw, 42px)
  - H3: 24px
  - H4: 20px
  - Body: 18px (line-height 1.8)
  - UI: 14px
  - Small/Labels: 12px
  - Micro: 11px (badges, timestamps)

## Color

### Approach: Dark-First with Warm Surfaces
Dark is the default identity. Every surface has warmth — no cold grays. Cream appears as "parchment" cards that float above the dark, like tasting notes on a mahogany bar.

### Core Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--bb-warm-black` | `#1C1917` | Primary background — warm, not cold |
| `--bb-warm-dark` | `#231F1C` | Secondary surface |
| `--bb-warm-surface` | `#2A2623` | Elevated surface (cards on dark) |
| `--bb-navy` | `#2B3A52` | Brand primary — nav accents, badges |
| `--bb-gold` | `#B8965A` | Primary accent — headings, CTAs, links, rules |
| `--bb-amber` | `#C4873B` | Secondary accent — hover states, "bourbon in glass" warmth |
| `--bb-copper` | `#B87333` | Tertiary accent — era badges, secondary highlights |
| `--bb-cream` | `#F5F0E8` | Light surface — parchment cards, body text on dark |
| `--bb-deep-brown` | `#654321` | Text on light surfaces, flavor tag backgrounds |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F5F0E8` (cream) | Primary text on dark backgrounds |
| `--text-secondary` | `#A89F94` | Body text, descriptions |
| `--text-muted` | `#6B6259` | Timestamps, labels, metadata |
| `--text-on-card` | `#1C1917` | Text on cream parchment cards |
| `--text-accent` | `#B8965A` (gold) | Highlighted text, links |

### BottleBond Color Scale
| Grade | Fill | Border | Glow | Meaning |
|-------|------|--------|------|---------|
| GREEN | `#2E7D32` | `#4CAF50` | `rgba(76,175,80,0.4)` | Easily approachable |
| BLUE | `#1565C0` | `#42A5F5` | `rgba(66,165,245,0.4)` | Complex, developing palate |
| BLACK | `#1a1a1a` | `#555555` | `rgba(85,85,85,0.4)` | Expert — serious experience |
| RED | `#B71C1C` | `#EF5350` | `rgba(239,83,80,0.4)` | No-go — skip it |

On dark surfaces, grade badges emit a `box-shadow` glow using the glow color. This makes them visually distinctive and screenshot-friendly.

### Dark Mode Strategy
Dark is the default. Light mode available via toggle — swap `--bb-warm-black` surfaces to `--bb-cream`, invert text colors, reduce glow intensity 50%.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable — content breathes
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)
- **Section padding:** 64px vertical (48px on mobile)
- **Card padding:** 16-24px
- **Component gaps:** 8-16px

## Layout
- **Approach:** Creative-editorial — break from Bootstrap 3-column grid
- **Grid:** CSS Grid with `auto-fill, minmax()` for responsive card layouts
- **Max content width:** 1200px
- **Episode browsing:** Horizontal scroll carousels (Netflix-style), not vertical card grids
- **Glass Room articles:** Cream parchment cards on dark surface — "notes on mahogany"
- **Border radius:** sm: 4px (badges), md: 8px (buttons), lg: 12px (cards), xl: 16px (feature cards), full: 9999px (grade dots)

### Creative Risks (implemented)
1. **Cinematic dark-first** — dark warm surfaces as default, cream for parchment content cards
2. **Color Scale as navigation** — persistent color toggle in nav; site content filters by experience level
3. **Scroll-driven storytelling** — homepage unfolds as a story with parallax layers and animated infographics
4. **Social-first shareable cards** — tasting cards, quiz results designed primarily for social screenshots

## Motion
- **Approach:** Intentional — "a curtain being drawn back"
- **Easing:** enter(`cubic-bezier(0.16, 1, 0.3, 1)`) exit(`ease-in`) move(`ease-in-out`)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms) long(400-700ms)
- **Scroll animations:** Subtle fade-in for content sections via IntersectionObserver
- **Quiz transitions:** Smooth fade between questions
- **Card hover:** translateY(-2px) + shadow elevation, 200ms ease-out
- **Grade dot hover:** scale(1.3) with glow intensification

## Logo Usage
- **Navigation (desktop):** Full wordmark — navy background variant (white text, gold filigree)
- **Navigation (mobile):** BB monogram — gold variant
- **Favicon:** BB monogram — gold on transparent
- **Shareable cards / OG images:** White-on-navy wordmark or gold monogram
- **Hero watermark:** BB monogram at 3% opacity on dark hero sections

## Anti-Patterns (never include)
- Pure charcoal `#2C2C2C` or cool gray surfaces — always use warm blacks
- Purple/violet gradients
- 3-column Bootstrap card grids (use horizontal carousels or creative layouts)
- Centered everything with uniform spacing
- Uniform bubbly border-radius
- Stock photo hero sections
- Roboto, Inter, or other generic sans-serif as primary fonts

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-02 | Initial design system created | Created by /design-consultation based on competitive research (Buffalo Trace, Whisky Advocate, Bourbon Pursuit) and brand asset analysis |
| 2026-04-02 | Dark-first cinematic direction | No bourbon podcast does this; Color Scale badges glow on dark; instantly recognizable screenshots |
| 2026-04-02 | Replaced Lora with Source Serif 4 | Better screen rendering, stronger hierarchy at small sizes, more refined than Lora |
| 2026-04-02 | Added DM Sans as UI font | Modern counterpoint to serifs; cleaner nav, badges, and metadata |
| 2026-04-02 | Added warm amber #C4873B | Reads as "bourbon in a glass"; adds warmth alongside gold |
| 2026-04-02 | Color Scale as site-wide navigation | Unprecedented personalization on static site; viral potential with "I'm a Black Label" identity |
| 2026-04-02 | Horizontal episode carousels | Breaks from Bootstrap template look; feels modern like Netflix/Spotify |
| 2026-04-02 | Social-first shareable cards | Every piece of content is a social post waiting to happen; viral by design |
