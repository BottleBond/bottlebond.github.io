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

## Phase 0: Research Tasks

The following unknowns need resolution before design:

1. **Next.js Static Export for GitHub Pages** - Best practices for `output: 'export'` configuration, base path handling, and GitHub Actions deployment workflow
2. **YouTube Embed Best Practices** - Privacy-enhanced mode, lazy loading, responsive sizing, accessibility considerations
3. **Markdown Blog with Next.js** - Optimal approach for static markdown rendering (next-mdx-remote vs contentlayer vs custom gray-matter)
4. **Tailwind CSS Luxury Theme** - Earth tone color palette implementation, typography pairing for luxury aesthetic
5. **Contact Form without Backend** - Static site form handling options (Formspree, Netlify Forms alternative for GitHub Pages, client-side only)

---

## Phase 1: Design Outputs (pending research)

- `data-model.md` - Entity schemas and relationships
- `contracts/` - TypeScript interfaces and JSON schemas
- `quickstart.md` - Developer setup guide

