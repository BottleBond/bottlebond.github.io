# Implementation Plan: BottleBond Podcast Website

**Branch**: `001-bottlebond-podcast-site` | **Date**: 2026-02-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-bottlebond-podcast-site/spec.md`

## Summary

Build a premium bourbon & whiskey podcast website using Hugo with the hugo-universal-theme, deployed to GitHub Pages. The site features 6 content pages (Home, Episodes, About, Glass Room blog, FAQ, Contact) with data-driven content from JSON files and markdown blog posts. Key technical challenges: installing and customizing the hugo-universal-theme with a vintage distillery aesthetic, implementing client-side featured episode randomization, building a two-tier blog navigation system with era-based landing pages, and computing Top 10 rankings from popularity scores. Significant scaffolding already exists (shortcodes, data files, content pages, CI/CD) but the theme is missing and no custom styling has been applied.

## Technical Context

**Language/Version**: Hugo (Go-based static site generator); HTML templates (Go template language); CSS; JavaScript (vanilla ES6)
**Primary Dependencies**: Hugo (extended edition, latest via GitHub Actions); hugo-universal-theme (Git submodule); Font Awesome (icons, bundled with theme)
**Storage**: Filesystem — JSON data files (`data/`), Markdown content files (`content/`), static assets (`static/`)
**Testing**: Hugo build validation (`hugo --minify` exit code); HTML validation; WCAG 2.1 AA audit (Lighthouse); manual browser testing
**Target Platform**: Static website on GitHub Pages; all modern browsers (Chrome, Firefox, Safari, Edge); viewports 320px–1920px
**Project Type**: Static site (Hugo)
**Performance Goals**: <2s first-contentful-paint on 3G; <500ms page navigation; <1s Glass Room TOC load
**Constraints**: No server-side processing; no user input handling; no secrets in source; HTTPS enforced by GitHub Pages; all content from structured data files
**Scale/Scope**: ~6 pages; ~12 episodes; ~3 blog posts initial; ~10 FAQs; 2 hosts + 3 guests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Dynamic Content First** | PASS | All content rendered from JSON data files and markdown; content separated from presentation via Hugo templates and shortcodes |
| **II. Security By Default** | PASS | HTTPS enforced by GitHub Pages; static site with no user input processing; no secrets in source control |
| **III. Testable & Continuous Delivery** | PASS | CI/CD via GitHub Actions (`deploy.yml`) already configured; Hugo build validates templates; accessibility testing via Lighthouse |
| **IV. Observability & Error Handling** | PASS (with note) | Static site limits observability to client-side; graceful fallbacks defined in edge cases; GitHub Pages provides 99.9% uptime |
| **V. Accessibility & Performance** | PASS | WCAG 2.1 AA compliance targeted; semantic HTML via Hugo templates; performance budget defined (<2s FCP, <500ms nav); lazy loading planned |
| **Additional: SSR/SEO** | PASS | Hugo generates fully server-side rendered static HTML; optimal for SEO |
| **Additional: No secrets in source** | PASS | No secrets needed; YouTube embeds use public video IDs |
| **Workflow: CI Gates** | PASS | GitHub Actions runs `hugo --minify`; deploy only on push to main |

**Gate Result: PASS** — No violations.

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Dynamic Content First** | PASS | Data model uses JSON files with canonical IDs and timestamps; Hugo templates render from structured data |
| **II. Security By Default** | PASS | No new attack vectors; YouTube embeds use privacy-enhanced nocookie domain |
| **III. Testable & Continuous Delivery** | PASS | CI workflow updated with submodule checkout; Hugo build validates all templates and data |
| **IV. Observability & Error Handling** | PASS | Shortcodes include fallback states for missing data; noscript fallback for featured episode |
| **V. Accessibility & Performance** | PASS | Semantic HTML structure; lazy loading on images; CSS-only textures (no heavy image assets) |

**Post-Design Gate: PASS**

## Project Structure

### Documentation (this feature)

```text
specs/001-bottlebond-podcast-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
hugo.toml                        # Hugo configuration (exists)
content/
├── _index.md                    # Homepage (exists, needs enhancement for full showcase)
├── episodes.md                  # Episodes page (exists)
├── about.md                     # About page (exists)
├── contact.md                   # Contact page (exists)
├── faq.md                       # FAQ page (exists)
└── glass-room/
    ├── _index.md                # Glass Room top-level TOC (exists, needs two-tier TOC)
    ├── prohibition-era/
    │   ├── _index.md            # Era landing page (NEW)
    │   └── *.md                 # Blog posts (partially exists)
    ├── modern-craft/
    │   ├── _index.md            # Era landing page (NEW)
    │   └── *.md                 # Blog posts (partially exists)
    └── homework/
        ├── _index.md            # Era landing page (NEW)
        └── *.md                 # Blog posts (partially exists)

data/
├── episodes.json                # Episode data (exists, 12 episodes)
├── hosts.json                   # Host/guest data (exists, 2 hosts + 3 guests)
├── faqs.json                    # FAQ data (exists, 10 FAQs)
├── playlists.json               # Playlist metadata (exists, 5 playlists)
└── toptastings.json             # Top tastings rankings (exists, 10 all-time + 5 seasonal)

layouts/
├── shortcodes/                  # All 6 shortcodes exist
├── _default/
│   ├── baseof.html              # Base template with footer (NEW)
│   ├── list.html                # Default list template (NEW)
│   └── single.html              # Default single template (NEW)
├── partials/
│   ├── footer-custom.html       # Custom footer (NEW)
│   └── head-custom.html         # Custom CSS includes (NEW)
├── glass-room/
│   ├── list.html                # Glass Room / era section list (NEW)
│   └── single.html              # Individual blog post template (NEW)
└── index.html                   # Homepage template override (NEW)

static/
├── css/
│   └── bottlebond.css           # Custom vintage distillery styles (NEW)
├── img/                         # Images (NEW — hosts, textures, carousel)
└── js/
    └── featured-episode.js      # Client-side randomization (exists)

themes/
└── hugo-universal-theme/        # Theme (needs installation via git submodule)

.github/
└── workflows/
    └── deploy.yml               # CI/CD pipeline (exists, needs submodule checkout step)
```

**Structure Decision**: Hugo static site using convention-based layout. Template overrides in `layouts/` customize the theme. Custom CSS in `static/css/`. Theme installed as Git submodule.

## Complexity Tracking

> No constitution violations to justify.

No entries needed — all gates pass.
