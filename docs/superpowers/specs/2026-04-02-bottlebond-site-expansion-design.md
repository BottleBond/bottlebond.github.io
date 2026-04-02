# BottleBond Site Expansion — Design Spec

**Date:** 2026-04-02
**Status:** Draft
**Scope:** Comprehensive site redesign — new sections, data pipelines, viral features, analytics

---

## 1. Overview

Expand the BottleBond Hugo site from a 6-page podcast website into a full bourbon/whiskey content platform. Add new content sections (Taster List, expanded Glass Room), viral engagement features (quiz, shareable cards), multi-source data pipelines (Notion, Buzzsprout, site capture), analytics/tracking, and a unified base template ensuring consistency across all pages.

The site remains static (Hugo + GitHub Pages) with data synced at build time.

## 2. Brand Identity

### Logo Assets
- **Navigation:** Full wordmark on navy background (white text, gold filigree)
- **Favicon / Mobile nav:** BB monogram (navy variant on light, gold on dark)
- **Shareable cards / OG images:** White-on-navy wordmark or gold monogram depending on context

### Color Palette (from logo assets)
| Token | Hex | Usage |
|-------|-----|-------|
| `--bb-navy` | `#2B3A52` | Primary brand color, nav background, headings |
| `--bb-gold` | `#B8965A` | Accent, filigree, highlights, CTAs |
| `--bb-white` | `#FFFFFF` | Text on dark backgrounds |
| `--bb-cream` | `#F5F5F0` | Light page backgrounds |
| `--bb-charcoal` | `#2C2C2C` | Dark section backgrounds, footer |
| `--bb-deep-brown` | `#654321` | Secondary text, flavor tags |
| `--bb-copper` | `#B87333` | Secondary accent, era badges |

*Note: Exact hex values will be color-picked from the logo assets during implementation. The above are approximations from visual inspection.*

### Typography
- **Headings:** Playfair Display (serif) — matches the ornate Victorian logo style
- **Body:** Lora (serif) — warm, readable complement
- Both loaded via Google Fonts

### Color Scale (BottleBond Grading System)
| Grade | Color | Hex (fill/border) | Meaning |
|-------|-------|-------------------|---------|
| GREEN | Green | `#2E7D32` / `#4CAF50` | Easily approachable — great for beginners |
| BLUE | Blue | `#1565C0` / `#42A5F5` | Good but more complex — developing palates |
| BLACK | Black | `#1a1a1a` / `#555555` | Serious experience needed to appreciate |
| RED | Red | `#B71C1C` / `#EF5350` | No-go — skip it |

## 3. Site Architecture

### Navigation
**Main nav (7 items):** Home, Episodes, Glass Room, Taster List, About, FAQ, Contact

**Social bar (6 links):** YouTube, Instagram, TikTok, Discord, Buzzsprout, Patreon

### Unified Base Template

Every page uses a single `layouts/_default/baseof.html`:

```
baseof.html
├── partials/head.html        — meta, OG tags, fonts, CSS
├── partials/analytics.html   — consent banner + GA4/Meta/TikTok pixels
├── partials/nav.html         — wordmark logo, main menu, social bar
├── block "main"              — page-specific content
├── partials/footer.html      — 4-column footer
└── partials/scripts.html     — JS, tracking event dispatch
```

All existing custom layouts (homepage, Glass Room list/single, episodes) will be refactored to use `{{ define "main" }}` blocks within this base template. No page renders outside this shell.

### Page Map

| Page | Path | Content Source |
|------|------|---------------|
| Homepage | `/` | Featured episode (random), playlist carousel, Glass Room preview, Taster List picks, quiz CTA, host teaser, newsletter CTA |
| Episodes | `/episodes/` | YouTube playlist sections (auto-synced), Buzzsprout badge per episode, Top Tastings, search/filter |
| Glass Room | `/glass-room/` | Tabbed hub: Eras + Guides + Glossary + How-Tos. Notion content pipeline |
| Taster List | `/taster-list/` | Bottle catalog with color scale, host scores, filters, shareable cards |
| Quiz | `/quiz/` | "Find Your Bourbon" personality quiz, shareable results |
| About | `/about/` | Host/cohost/guest bios |
| FAQ | `/faq/` | Collapsible Q&A by category |
| Contact | `/contact/` | Mailto + social links |

## 4. Taster List

### Purpose
Searchable, filterable catalog of every bourbon/whiskey reviewed on the show. Each bottle displays individual host color grades, flavor notes, and links to the episode where it was reviewed.

### Data Model (`data/tasterlist.json`)

```json
[
  {
    "id": "eagle-rare-10",
    "name": "Eagle Rare 10 Year",
    "distillery": "Buffalo Trace",
    "proof": 90,
    "price": 35,
    "type": "bourbon",
    "flavorNotes": ["toffee", "oak", "vanilla", "cherry", "leather"],
    "scores": [
      { "host": "Adam", "grade": "blue", "comment": "Great depth" },
      { "host": "Sarah", "grade": "green", "comment": "Super smooth" },
      { "host": "James", "grade": "black", "comment": "Layers for days" }
    ],
    "episodeId": "ep-007",
    "episodeTitle": "Buffalo Trace Deep Dive",
    "reviewedAt": "2025-11-15"
  }
]
```

### Card Design (Compact)
- **Header row:** Bottle name (Georgia serif), distillery + proof + price inline, share button
- **Flavor tags:** Small rounded pills (deep-brown background)
- **Host scores row:** Inline color-coded circles (22px) with host name next to each. All individual scores displayed — no aggregation
- **Episode footer:** Slim one-line link to the episode

### Color Scale Legend
Displayed at the top of the Taster List page as a compact horizontal bar showing all four grades with dot + label.

### Filters
- **Color grade:** Clickable dots (green/blue/black/red) — toggle to filter
- **Host:** Dropdown — filter by a specific host's scores
- **Distillery:** Dropdown
- **Price:** Range brackets (Under $30, $30-60, $60-100, $100+)
- **Search:** Free text search across bottle names and flavor notes

All filtering is client-side JavaScript (no backend needed).

### Shareable Tasting Cards
OG-image-ready version of the card on navy brand background with BB wordmark. Generated as static HTML pages at `/taster-list/{bottle-id}/` with proper `og:image` meta tags for social sharing.

## 5. Glass Room — Learning Hub

### Purpose
Expand the existing Glass Room blog from era-based articles into a structured knowledge center with four content types.

### Content Types

| Type | Badge Color | Description | Content Source |
|------|-------------|-------------|----------------|
| **Era** | Copper (`#B87333`) | Existing historical deep dives (Prohibition, Modern Craft, Homework) | Existing markdown |
| **Guide** | Green (`#2E7D32`) | Structured learning paths: 101 (Beginner), 201 (Intermediate), 301 (Advanced). Tied to color scale levels | Notion pipeline + manual |
| **Glossary** | Gold (`#B8965A`) | Searchable A-Z of whiskey terms. Each entry links to relevant guides and episodes | Notion pipeline + manual |
| **How-To** | Navy (`#2B4F73`) | Practical skills: nosing, tasting, pairing, building a collection. Step-by-step format | Notion pipeline + manual |

### Landing Page
- Tabbed navigation: All / Eras / Guides / Glossary / How-To
- Unified feed showing all content types with type badges
- Each entry: thumbnail, type badge, title, description
- Tags and categories for cross-discovery

### Content Structure (`content/glass-room/`)
```
glass-room/
├── _index.md                    (hub landing page)
├── prohibition-era/             (existing era)
├── modern-craft/                (existing era)
├── homework/                    (existing era)
├── guides/                      (NEW)
│   ├── _index.md
│   ├── bourbon-101.md
│   └── barrel-influence.md
├── glossary/                    (NEW)
│   ├── _index.md
│   └── terms.md (or individual term pages)
├── how-to/                      (NEW)
│   ├── _index.md
│   ├── nosing-like-a-pro.md
│   └── building-a-collection.md
```

### Notion Content Pipeline
Content flows: Notion workspace → Export tool (API or manual Markdown drop to `data/notion/`) → Curate (add frontmatter, assign type + tags) → Publish (move to `content/glass-room/`).

The pipeline accepts both:
- **Notion API export** (spec 004 tool, when implemented)
- **Manual file drop** (export from Notion app as Markdown, place in `data/notion/`)

## 6. Viral Features

### "Find Your Bourbon" Quiz (`/quiz/`)
- 7 personality-style lifestyle questions (e.g., "How do you take your coffee?")
- Each answer maps to a color grade (green/blue/black/red)
- Final result = your dominant color grade
- Result card shows: color badge, personality description, 3 recommended bottles from the Taster List
- All client-side JavaScript — no backend

### "What's Your Color?" (Quiz Variant)
- Shorter version (3-4 questions) focused specifically on the color scale
- Embeddable as a widget on other pages (homepage CTA, Glass Room sidebar)

### Shareable Result Cards
- Designed for screenshots and OG image sharing
- Navy brand background with BB wordmark
- Color grade badge with glow effect
- Personality description + recommended bottles
- URL watermark (bottle.bond/quiz)
- Proper `og:image` meta tags so link previews show the result

### Future Viral Features (designed for but not built in v1)
- Flavor wheel explorer
- Weekly hot takes / rankings
- Community badges and leaderboards

## 7. Data Pipelines

### YouTube Sync (existing — spec 002)
Already implemented in `tools/sync/`. Runs daily via GitHub Actions + on every deploy. Syncs episodes, playlists, thumbnails to `data/episodes.json` and `data/playlists.json`.

### Notion Export (spec 004 — to be implemented)
Node.js CLI tool exporting Notion workspace to local Markdown + metadata. Outputs to `data/notion/`. Supports API export or manual Markdown file drop as fallback.

### Buzzsprout RSS
- New sync tool or build-time fetch of Buzzsprout RSS feed
- Extract: audio episode URL, listen links per episode
- Store as `data/buzzsprout.json`
- Used to add "Listen on Buzzsprout" badge to each episode card
- YouTube remains the primary episode format; Buzzsprout is secondary audio link

### Site Content Capture (bottle.bond)
- One-time capture of all live content from bottle.bond
- Ensure all current content is represented in the repo
- Use existing `bin/mirror_site.py` or manual audit
- No ongoing sync needed — repo becomes the source of truth after capture

## 8. Analytics & Tracking

### Consent Management
- Cookie consent banner on first visit (GDPR/CCPA compliant)
- Blocks all tracking until user accepts
- Preference stored in localStorage
- Partial in `layouts/partials/analytics.html`

### Providers
| Provider | Purpose | Events |
|----------|---------|--------|
| **GA4** | Core analytics | Page views, quiz_start, quiz_complete, tasting_card_share, episode_play, filter_use, glossary_search |
| **Meta Pixel** | Facebook/Instagram retargeting | PageView, QuizComplete, ShareCard |
| **TikTok Pixel** | TikTok ad campaigns | PageView, CompleteQuiz, ShareContent |

### Configuration (`hugo.toml`)
```toml
[params.analytics]
  ga4_id = ""              # GA-XXXXXXXXXX
  meta_pixel_id = ""       # from Meta Business
  tiktok_pixel_id = ""     # from TikTok Ads
  consent_required = true
```

### Event Dispatch Wrapper
A `window.bbTrack(eventName, eventData)` JavaScript function that dispatches to all active providers. Single integration point for adding future providers (Mailchimp, Chartable, affiliate tracking).

## 9. Social Integration

### Current State (link-out only)
All social platforms linked from nav social bar and footer:
- YouTube (primary — existing)
- Instagram
- TikTok
- Discord (new)
- Buzzsprout (new)
- Patreon (existing)

### Future (curated clips — not in v1)
Architecture will support adding curated TikTok/Instagram clips to pages later. The data model and template system will have hooks for embedded social content, but no implementation in v1.

## 10. Mobile Responsiveness

All new components designed mobile-first:
- **Taster List cards:** Stack to single column, scores row wraps gracefully
- **Glass Room tabs:** Horizontal scroll on mobile
- **Quiz:** Full-width answers, large tap targets
- **Filter bar:** Collapsible on mobile, expandable with a "Filters" button
- **Nav:** Hamburger menu with BB monogram, social links in drawer
- **Shareable cards:** Sized for mobile screenshots (portrait aspect ratio)

Breakpoints:
- Mobile: < 768px (single column)
- Tablet: 768px-1024px (2-column grids)
- Desktop: > 1024px (full layout)

## 11. SEO & Social Sharing

- Proper `og:title`, `og:description`, `og:image` on every page
- Taster List bottle pages get unique OG images (the shareable card)
- Quiz result pages get unique OG images (the result card)
- Structured data (JSON-LD) for podcast episodes
- Sitemap.xml generated by Hugo
- Canonical URLs

## 12. Implementation Sequence

This design will be decomposed into implementation phases, each independently shippable:

1. **Foundation** — Custom `baseof.html`, nav restructure (add Discord, Buzzsprout, TikTok), analytics partial, consent banner, site content capture, mobile polish
2. **Taster List** — Data model, bottle catalog page, filters, compact cards, color scale legend, shareable cards
3. **Glass Room Expansion** — Guides, Glossary, How-To content types, tabbed landing page, Notion content pipeline
4. **Viral Features** — "Find Your Bourbon" quiz, result cards, OG image generation, share functionality
5. **Buzzsprout Integration** — RSS sync, "Listen on" badges per episode
6. **Social & Future** — Curated clip support, community features architecture
