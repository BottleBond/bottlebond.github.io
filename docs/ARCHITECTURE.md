# BottleBond Architecture

## Template Hierarchy

```
layouts/index.html              — Homepage (standalone, not baseof-based)
  partials/headers.html         — <head> metadata (from theme)
  partials/custom_headers.html  — Custom CSS link (bottlebond.css)
  partials/top.html             — Top bar with social icons
  partials/nav.html             — Main navigation
  partials/carousel.html        — Hero carousel
  content/_index.md             — Rendered shortcodes (featured-episode)
  partials/features.html        — Feature cards section
  partials/testimonials.html    — Host teaser section
  partials/see_more.html        — Newsletter / CTA section
  partials/recent_posts.html    — Latest Glass Room posts
  partials/footer.html          — Custom footer (overrides theme)
  partials/scripts.html         — JS bundle (from theme)

layouts/glass-room/single.html  — Glass Room article pages
layouts/glass-room/list.html    — Glass Room section listing

Theme: themes/hugo-universal-theme/layouts/_default/
  baseof.html                   — Base template for non-homepage pages
  single.html, list.html        — Default layouts using {{ define "main" }}
```

Content pages (episodes, about, contact, faq) use the theme's `baseof.html`
via `{{ define "main" }}` blocks. Glass Room has its own standalone layouts.

### Partials (custom overrides in layouts/partials/)

| Partial | Purpose |
|---------|---------|
| `custom_headers.html` | Injects `bottlebond.css` into every page |
| `footer.html` | Custom footer with navigation, social links, recent posts |

### Shortcodes (layouts/shortcodes/)

| Shortcode | Used in | Description |
|-----------|---------|-------------|
| `episodes.html` | `/episodes/` | Episode card grid with category filter |
| `featured-episode.html` | Homepage `_index.md` | Random featured episode with embed |
| `top-tastings.html` | `/episodes/` | Ranked tasting lists (seasonal + all-time) |
| `hosts.html` | `/about/` | Host/guest cards with social links |
| `faqs.html` | `/faq/` | Accordion FAQ from data/faqs.json |
| `youtube.html` | Content pages | YouTube video embed helper |
| `social-clip.html` | Content pages | TikTok/Instagram embed (v1 stub) |

## Data Pipeline

### YouTube Sync (`tools/sync/`)

```
YouTube API --> tools/sync/sync.mjs --> data/episodes.json
                                    --> content/episodes.md (optional)
```

- Runs on schedule (daily cron via `.github/workflows/sync.yml`)
- Also runs during deploy (`.github/workflows/deploy.yml`)
- Config: `sync-config.json` (channelId, blocklist)
- Secret: `YOUTUBE_API_KEY`

### Buzzsprout Sync (`tools/buzzsprout/`)

```
Buzzsprout RSS --> tools/buzzsprout/sync.mjs --> data/buzzsprout.json
```

- Parses Buzzsprout podcast RSS feed (XML)
- Fuzzy-matches episodes to YouTube data by title similarity
- Config: `sync-config.json` (buzzsprout.feedUrl) or `--feed-url` CLI arg
- Supports `--dry-run` flag
- Currently commented out in workflows (no feed URL configured yet)

### Notion Export (`tools/notion/` — if present)

- Exports Notion database content to Hugo-compatible Markdown
- Outputs to `data/notion/` directory
- Config: `sync-config.json` (notion section)

### Taster List Page Generator (`tools/tasterlist/` — if present)

- Generates individual taster profile pages from data
- Runs during deploy before Hugo build

## How to Add a New Content Type to Glass Room

1. Create a new Markdown file in `content/glass-room/<era>/`:
   ```markdown
   ---
   title: "Article Title"
   date: 2026-04-01
   author: "Author Name"
   era: "modern-era"
   tags: ["bourbon", "history"]
   ---
   Article body in Markdown...
   ```
2. The `<era>` folder maps to editorial periods (e.g., `2024/`, `2025/`).
3. The article automatically appears in:
   - Glass Room list page (`/glass-room/`)
   - Homepage recent posts section
   - Footer recent posts
   - RSS feed (if enabled)

## How to Add a New Social Platform

1. **Data**: Add the platform to `data/hosts.json` social links:
   ```json
   { "platform": "newplatform", "url": "https://..." }
   ```
2. **Shortcode**: Add icon mapping in `layouts/shortcodes/hosts.html`:
   ```html
   {{ if eq .platform "newplatform" }}<i class="fab fa-newplatform"></i>{{ end }}
   ```
3. **Config**: Add URL to `hugo.toml` under `[params.social]`:
   ```toml
   newplatform = "https://..."
   ```
4. **Top bar** (optional): Add a `[[menu.topbar]]` entry in `hugo.toml`
5. **Content pages**: Update `content/about.md` and `content/contact.md`
   social link sections

## Analytics Events (bbTrack)

The site uses a lightweight analytics wrapper via `static/js/` scripts:

- `featured-episode.js` — Handles random episode selection and display
- Analytics tracking can be added by calling a `bbTrack(event, data)` function
  from any page script
- Events are designed to be provider-agnostic (can wire to Google Analytics,
  Plausible, or any backend)

Common event patterns:
```javascript
// Track episode plays
bbTrack('episode_play', { episodeId: id, source: 'featured' });

// Track outbound clicks
bbTrack('outbound_click', { platform: 'youtube', url: href });
```

## File Structure Overview

```
bottlebond.github.io/
  .github/workflows/     — CI/CD (deploy.yml, sync.yml)
  content/               — Hugo content pages
    _index.md            — Homepage content (featured episode shortcode)
    about.md             — About page with host shortcodes
    contact.md           — Contact page
    episodes.md          — Episodes listing page
    faq.md               — FAQ page
    glass-room/          — Blog section organized by era
  data/                  — JSON data files consumed by Hugo templates
    episodes.json        — YouTube episode data
    buzzsprout.json      — Buzzsprout podcast data
    hosts.json           — Host and guest profiles
    faqs.json            — FAQ entries
    toptastings.json     — Curated tasting rankings
  layouts/               — Hugo template overrides
    index.html           — Homepage layout
    glass-room/          — Glass Room section layouts
    partials/            — Partial template overrides
    shortcodes/          — Reusable content components
  static/                — Static assets served as-is
    css/bottlebond.css   — Main custom stylesheet
    js/                  — Client-side JavaScript
    img/                 — Images and logos
  themes/                — Hugo theme (Git submodule)
  tools/                 — Build-time data sync scripts
    sync/                — YouTube playlist sync (Node.js)
    buzzsprout/          — Buzzsprout RSS sync (Node.js)
  sync-config.json       — Shared config for all sync tools
  hugo.toml              — Hugo site configuration
```
