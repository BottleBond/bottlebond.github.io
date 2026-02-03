# Implementation Plan: Hugo Markdown Refactor

**Branch**: `001-bottlebond-podcast-site` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Refactor HTML-based pages to markdown content files using Hugo templates

## Summary

Convert all page content from custom HTML layouts to markdown files that leverage the hugo-universal-theme's templating system. This simplifies content editing by moving text content into markdown files while using the theme's built-in partial system for dynamic rendering.

## Technical Context

**Language/Version**: Hugo v0.155.2 (Go templates)
**Primary Dependencies**: hugo-universal-theme (Bootstrap 3, Font Awesome 6, jQuery)
**Storage**: File-based (data/*.json for structured data, content/*.md for page content)
**Testing**: Manual verification via `hugo server`
**Target Platform**: GitHub Pages (static HTML output)
**Project Type**: Static site (Hugo SSG)
**Performance Goals**: <1s build time, <2s first contentful paint
**Constraints**: No server-side processing, all content static at build time
**Scale/Scope**: 6 main pages + Glass Room blog section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Dynamic Content First | PASS | Content separated into markdown files and JSON data; rendered at build time |
| II. Security By Default | PASS | No user input processing; static output only; mailto link replaces form |
| III. Testable & Continuous Delivery | PASS | Hugo build validates templates; GitHub Actions for CI/CD |
| IV. Observability & Error Handling | PASS | Build errors surface during hugo build; graceful fallbacks in templates |
| V. Accessibility & Performance | PASS | Theme provides Bootstrap accessibility; lazy loading supported |

## Project Structure

### Documentation (this feature)

```text
specs/001-bottlebond-podcast-site/
├── plan.md              # This file
├── research.md          # Phase 0: Hugo markdown patterns
├── data-model.md        # Phase 1: Content structure
├── quickstart.md        # Phase 1: Editing guide
└── contracts/           # N/A (no APIs)
```

### Source Code (repository root)

```text
# Hugo Static Site Structure
content/
├── _index.md            # Homepage content (theme-driven)
├── about.md             # About page (markdown + data reference)
├── contact.md           # Contact page (markdown + mailto)
├── episodes.md          # Episodes page (markdown + shortcode/partial)
├── faq.md               # FAQ page (markdown questions)
└── glass-room/          # Blog section
    ├── _index.md        # Blog listing
    └── [era-folders]/   # Blog posts by era

data/
├── hosts.json           # Host/guest information
├── faqs.json            # FAQ questions and answers
├── episodes.json        # Episode metadata
└── playlists.json       # YouTube playlist IDs

layouts/
└── shortcodes/          # Custom shortcodes for dynamic content
    ├── hosts.html       # Render hosts from data
    ├── episodes.html    # Render episodes from data
    └── youtube.html     # YouTube embed facade

static/
└── images/              # Host photos, logos

themes/
└── hugo-universal-theme/
```

**Structure Decision**: Hugo standard structure with custom shortcodes to bridge markdown content with JSON data files.

## Design Decisions

### Page Conversion Strategy

| Page | Current | Target | Approach |
|------|---------|--------|----------|
| Homepage | Theme default | Theme default | Configure via hugo.toml params |
| About | Empty markdown | Rich markdown | Add content + `{{< hosts >}}` shortcode |
| Contact | Empty markdown | Rich markdown | Add content + mailto link |
| Episodes | Empty markdown | Rich markdown | Add content + `{{< episodes >}}` shortcode |
| FAQ | Empty markdown | Rich markdown | Add Q&A as markdown headers |
| Glass Room | Blog posts | Blog posts | Already working (theme handles) |

### Shortcode Design

1. **`{{< hosts type="host" >}}`** - Renders hosts from data/hosts.json
2. **`{{< episodes category="education" limit="3" >}}`** - Renders episodes from data/episodes.json
3. **`{{< youtube id="VIDEO_ID" >}}`** - Privacy-enhanced YouTube embed

### Content Frontmatter Pattern

```yaml
---
title: "Page Title"
description: "SEO description"
type: "page"
---

# Markdown content here

{{< shortcode-for-dynamic-data >}}

More markdown content...
```

## Complexity Tracking

No constitution violations requiring justification.

## Next Steps

1. Generate research.md with Hugo shortcode best practices
2. Create shortcodes in layouts/shortcodes/
3. Update content/*.md files with rich markdown content
4. Verify build and test all pages
