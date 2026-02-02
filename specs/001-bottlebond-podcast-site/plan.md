# Implementation Plan: BottleBond Podcast Website

**Branch**: `001-bottlebond-podcast-site` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification with WordPress migration, Next.js static export for GitHub Pages

## Summary

Build a premium podcast website for BottleBond showcasing bourbon/whiskey education and tasting content. The site will use Next.js with static export for GitHub Pages hosting, featuring embedded YouTube players, a markdown-based blog ("The Glass Room"), curated episode sections ("Top Tastings of the Season", "Top 10 of All Time"), and a warm luxury aesthetic with earth tones. Content migrates from the existing WordPress site at bottle.bond.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+
**Primary Dependencies**: Next.js (App Router), React 18, Tailwind CSS, gray-matter (frontmatter parsing), next-mdx-remote or similar (markdown rendering)
**Storage**: Static JSON files for episode/host data; Markdown files for blog posts; no database required
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)
**Target Platform**: GitHub Pages (static HTML/CSS/JS export)
**Project Type**: Web application (frontend-only, static export)
**Performance Goals**: <2s FCP on 3G, <500ms page navigation, Core Web Vitals green
**Constraints**: Static export only (no server-side API routes), no CDN initially, GitHub Pages URL structure
**Scale/Scope**: ~6 pages, ~50 episodes initial, ~10 blog posts, responsive 320px-1920px

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Dynamic Content First | ✅ PASS | Content in structured JSON/MD files, separated from presentation components |
| II. Security By Default | ✅ PASS | HTTPS via GitHub Pages, form inputs sanitized, no secrets in repo |
| III. Testable & Continuous Delivery | ✅ PASS | Unit/integration/E2E tests planned; GitHub Actions CI/CD |
| IV. Observability & Error Handling | ✅ PASS | User-friendly error states, graceful degradation for missing content |
| V. Accessibility & Performance | ✅ PASS | WCAG 2.1 AA target, performance budget enforced, lazy loading |

**Gate Result**: PASSED - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
.specify/features/001-bottlebond-podcast-site/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (data schemas)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with nav/footer
│   ├── page.tsx            # Homepage with featured episode
│   ├── about/
│   │   └── page.tsx        # About page (hosts, guests)
│   ├── episodes/
│   │   └── page.tsx        # Episodes page (all sections)
│   ├── glass-room/
│   │   ├── page.tsx        # Blog listing with TOC
│   │   └── [slug]/
│   │       └── page.tsx    # Individual blog post
│   ├── faq/
│   │   └── page.tsx        # FAQ page
│   └── contact/
│       └── page.tsx        # Contact form
├── components/
│   ├── ui/                 # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── episodes/
│   │   ├── EpisodeCard.tsx
│   │   ├── YouTubeEmbed.tsx
│   │   └── EpisodeSection.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── TableOfContents.tsx
│   │   └── MarkdownRenderer.tsx
│   └── forms/
│       └── ContactForm.tsx
├── lib/
│   ├── data/               # Data fetching utilities
│   │   ├── episodes.ts
│   │   ├── posts.ts
│   │   └── hosts.ts
│   └── utils/
│       └── markdown.ts
├── content/
│   ├── episodes.json       # Episode metadata
│   ├── hosts.json          # Host/guest data
│   ├── faqs.json           # FAQ content
│   └── glass-room/         # Blog posts (markdown)
│       ├── prohibition/
│       └── modern-era/
└── styles/
    └── globals.css         # Tailwind + custom styles

tests/
├── unit/
├── integration/
└── e2e/

public/
├── images/
└── fonts/
```

**Structure Decision**: Single web application with Next.js App Router. All content is static (JSON/Markdown) with no backend API. Blog posts stored in `src/content/glass-room/` for build-time processing.

## Complexity Tracking

> No violations requiring justification - all gates passed.

---

## Phase 0: Research ✅ COMPLETE

All technical unknowns resolved. See [research.md](research.md) for full details.

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Next.js Static Export | `output: 'export'` with `trailingSlash: true` | Standard approach for GitHub Pages |
| YouTube Embeds | Custom facade component with youtube-nocookie.com | Performance + privacy |
| Markdown Blog | Custom gray-matter + remark/rehype | Stable, flexible, Contentlayer abandoned |
| Tailwind Theme | Custom earth tones with Cormorant Garamond + Inter | Luxury aesthetic |
| Contact Form | Web3Forms | 250 submissions/mo free, no branding |

---

## Phase 1: Design ✅ COMPLETE

All design artifacts generated:

| Artifact | Description | Status |
|----------|-------------|--------|
| [data-model.md](data-model.md) | Entity schemas, relationships, validation rules | ✅ Complete |
| [contracts/types.ts](contracts/types.ts) | TypeScript interfaces for all entities | ✅ Complete |
| [quickstart.md](quickstart.md) | Developer setup and content management guide | ✅ Complete |

---

## Constitution Re-Check (Post-Design)

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Dynamic Content First | ✅ PASS | JSON/Markdown files with typed contracts |
| II. Security By Default | ✅ PASS | Web3Forms handles form securely, no secrets |
| III. Testable & Continuous Delivery | ✅ PASS | GitHub Actions workflow defined |
| IV. Observability & Error Handling | ✅ PASS | Graceful fallbacks in design |
| V. Accessibility & Performance | ✅ PASS | Facade pattern, WCAG targets documented |

---

## Content Migration Strategy

### Source: WordPress Site

The existing WordPress site at [bottle.bond](https://bottle.bond) contains content that must be migrated to the new static site format:

| Content Type | Source Location | Target Format | Target Location |
|--------------|-----------------|---------------|-----------------|
| **Host Bios** | About page | JSON | `src/content/hosts.json` |
| **Host Photos** | WordPress media | Optimized images | `public/images/hosts/` |
| **Guest Bios** | About/Guest pages | JSON | `src/content/hosts.json` |
| **Guest Photos** | WordPress media | Optimized images | `public/images/guests/` |
| **FAQ Content** | FAQ page | JSON | `src/content/faqs.json` |
| **Episode Data** | YouTube playlists | JSON | `src/content/episodes.json` |
| **Episode Thumbnails** | YouTube API | Cached images | `public/images/episodes/` (optional) |
| **Blog Posts** | WordPress posts | Markdown | `src/content/glass-room/{era}/` |
| **Blog Images** | WordPress media | Optimized images | `public/images/blog/` |
| **Site Logo** | WordPress theme | SVG/PNG | `public/images/logo/` |
| **Social Icons** | Various | SVG | `public/images/icons/` |

### Migration Process

1. **Content Extraction**: Fetch content from bottle.bond pages
2. **Image Download**: Download and optimize all media assets
3. **Format Conversion**: Convert to JSON/Markdown formats per data model
4. **Validation**: Verify content matches TypeScript contracts
5. **Integration**: Place files in correct src/content and public/images directories

### Image Optimization Requirements

- **Host/Guest Photos**: 400x400px, WebP format with JPEG fallback
- **Blog Images**: Max 1200px width, WebP format
- **Thumbnails**: 320x180px for episode cards
- **Logo**: SVG preferred, PNG fallback at 2x resolution

### Content Files Structure

```text
public/
├── images/
│   ├── hosts/
│   │   ├── host-name.webp
│   │   └── cohost-name.webp
│   ├── guests/
│   │   └── guest-name.webp
│   ├── blog/
│   │   └── {post-slug}/
│   │       └── featured-image.webp
│   ├── logo/
│   │   ├── bottlebond-logo.svg
│   │   └── bottlebond-logo.png
│   └── icons/
│       └── social/

src/content/
├── episodes.json      # Populated from YouTube playlists
├── playlists.json     # YouTube playlist metadata
├── hosts.json         # Migrated host/guest bios
├── faqs.json          # Migrated FAQ content
├── top-tastings.json  # Curated episode selections
└── glass-room/        # Migrated blog posts
    ├── prohibition/
    │   └── {post-slug}.md
    └── modern-era/
        └── {post-slug}.md
```

---

## Next Steps

Run `/speckit.tasks` to generate actionable implementation tasks based on this plan.

