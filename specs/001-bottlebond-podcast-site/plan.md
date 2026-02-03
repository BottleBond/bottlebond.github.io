# Implementation Plan: BottleBond Podcast Website

**Branch**: `001-bottlebond-podcast-site` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-bottlebond-podcast-site/spec.md`

## Summary

Premium bourbon podcast website using Next.js 16 with static export for GitHub Pages. Features YouTube video embeds, era-organized blog (The Glass Room), FAQ, About, and Contact pages with a luxury lounge aesthetic using earth tone colors.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.x (App Router)
**Primary Dependencies**: React 19, Tailwind CSS v4, gray-matter, remark/rehype, Web3Forms
**Storage**: Static JSON files + Markdown blog posts (no database)
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)
**Target Platform**: Static site on GitHub Pages (bottlebond.github.io)
**Project Type**: Web application (frontend only, static export)
**Performance Goals**: <2s FCP on 3G, <500ms page navigation
**Constraints**: No server-side rendering, no API routes, images unoptimized
**Scale/Scope**: ~8 pages, 12+ episodes, 2 hosts, 10 FAQs, 2+ blog posts

## Constitution Check

*GATE: All checks pass ✅*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Dynamic Content First | ✅ | Content from JSON/Markdown, separated from presentation |
| II. Security By Default | ✅ | HTTPS (GitHub Pages), form input sanitization, no secrets in repo |
| III. Testable & Continuous | ✅ | Jest unit tests, Playwright E2E, GitHub Actions CI/CD |
| IV. Observability | ⚠️ | User-friendly errors; analytics deferred to Phase 2.5 |
| V. Accessibility & Performance | ✅ | WCAG 2.1 AA target, lazy loading, performance budget |

---

## CRITICAL GAP ANALYSIS: Content Data Population

### Current State (NEEDS ATTENTION)

After reviewing the implementation and source data, the following gaps were identified:

#### 1. YouTube Video IDs - ALL PLACEHOLDERS ❌

The current `episodes.json` uses **placeholder YouTube IDs**:
```json
"youtubeId": "dQw4w9WgXcQ"  // This is the Rick Roll video!
"youtubeId": "abc123xyz"    // Fake ID
"youtubeId": "hist001abc"   // Fake ID
```

**Required Action**: Populate with real video IDs from the specified playlists:
- Main feed: `PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ`
- History & Education: `PLkEG2GQlU7uFYy3tRx_YZ5CXg79I5bnhi`

#### 2. Playlist IDs - PARTIALLY CORRECT ⚠️

| Playlist | Status | Current ID |
|----------|--------|------------|
| Main (All Episodes) | ✅ Correct | `PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ` |
| History & Education | ✅ Correct | `PLkEG2GQlU7uFYy3tRx_YZ5CXg79I5bnhi` |
| Tastings | ❌ Placeholder | `PLkEG2GQlU7uH8nK3tL4x5Z6CXg79I5abc` |
| Seasonal | ❌ Placeholder | `PLkEG2GQlU7uH8nK3tL4x5Z6CXg79I5def` |
| Top 10 | ❌ Placeholder | `PLkEG2GQlU7uH8nK3tL4x5Z6CXg79I5ghi` |

**Required Action**: Get actual playlist IDs from YouTube channel owner or create playlists.

#### 3. Host/Bio Information - NEEDS VERIFICATION ⚠️

Current `hosts.json`:
- Primary host: "Adam Lathers" ✅ (matches user context)
- Co-host: "Sarah Mitchell" ❓ (need to verify if accurate)

**bottle.bond website finding**: The original site only says "Welcome from the guys" with no individual bios.

**Required Action**: Confirm host names and get actual bios/photos from site owner.

#### 4. Social Links - MISMATCH ❌

| Platform | Current Mock | Actual bottle.bond |
|----------|--------------|-------------------|
| Twitter/X | ✅ Included | ❌ Not on site |
| Instagram | ✅ Included | ✅ Present |
| YouTube | ✅ Included | ❌ Not linked |
| TikTok | ❌ Missing | ✅ Present |
| Facebook | ❌ Missing | ✅ Present |

**Required Action**: Update social links to match actual platforms used.

#### 5. Blog Content - NOT MIGRATED ❌

The bottle.bond site has actual content:
- "Stitzel-Weller and How it Survived Prohibition" (Jan 20, 2025)
- "The Show" post with platform links

Current blog posts are placeholders.

**Required Action**: Migrate actual blog content from bottle.bond.

---

## Recommended Design Updates

### 1. YouTube Data Sync Strategy

**Option A: Manual Population (Recommended for MVP)**
- Content editor manually enters video IDs from YouTube playlists
- Provides full control over which videos appear in each section
- No API costs or rate limits

**Option B: Build-Time YouTube API Sync**
- Use YouTube Data API v3 to fetch playlist contents at build time
- Requires API key (env variable)
- Auto-updates on each deploy
- May exceed API quotas with frequent deploys

**Recommendation**: Start with Option A, migrate to Option B in Phase 2.5.

### 2. Content Migration Checklist (Phase 2.5)

```markdown
## CM: Content Migration Tasks

### YouTube Data (Priority: HIGH)
- [ ] CM-YT01: Extract video IDs from main playlist PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ
- [ ] CM-YT02: Extract video IDs from education playlist PLkEG2GQlU7uFYy3tRx_YZ5CXg79I5bnhi
- [ ] CM-YT03: Get or create actual Tastings playlist ID
- [ ] CM-YT04: Curate Top 10 All Time list (manual selection)
- [ ] CM-YT05: Curate Seasonal Top 5 list (manual selection)
- [ ] CM-YT06: Update episodes.json with real video metadata

### Host Data (Priority: HIGH)
- [ ] CM-HOST01: Confirm primary host name and bio
- [ ] CM-HOST02: Confirm co-host name and bio (if applicable)
- [ ] CM-HOST03: Obtain host photos (webp format, optimized)
- [ ] CM-HOST04: Update social links (Facebook, Instagram, TikTok)

### Blog Migration (Priority: MEDIUM)
- [ ] CM-BLOG01: Export "Stitzel-Weller" post from WordPress
- [ ] CM-BLOG02: Convert to Markdown with proper frontmatter
- [ ] CM-BLOG03: Place in prohibition-era folder
- [ ] CM-BLOG04: Migrate any images to public/images/blog/

### Asset Migration (Priority: MEDIUM)
- [ ] CM-ASSET01: Download logo from bottle.bond
- [ ] CM-ASSET02: Extract any usable images from WordPress media
```

### 3. Architecture Enhancement: Episode Data Script

Create a utility script to help populate episode data:

```typescript
// scripts/fetch-playlist.ts (for future Phase 2.5)
// Usage: YOUTUBE_API_KEY=xxx npx ts-node scripts/fetch-playlist.ts PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ

async function fetchPlaylistVideos(playlistId: string) {
  // Fetch from YouTube Data API v3
  // Transform to Episode format
  // Output to episodes.json
}
```

### 4. Design Consistency Updates

Based on the luxury lounge aesthetic:

| Element | Current | Recommendation |
|---------|---------|----------------|
| Logo | Text only | Add bottle.bond logo from WordPress |
| Social Icons | Generic SVG | Match actual platforms (add TikTok, Facebook) |
| Featured Episode | Random selection | Consider "Editor's Pick" with manual curation |
| Color Scheme | On-brand | Verified correct (earth tones) |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-bottlebond-podcast-site/
├── plan.md              # This file ✅
├── research.md          # Technology decisions ✅
├── data-model.md        # Entity definitions ✅
├── quickstart.md        # Developer guide ✅
├── contracts/           # TypeScript interfaces ✅
└── tasks.md             # Implementation tasks ✅
```

### Source Code (repository root)

```text
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage with featured episode
│   ├── about/page.tsx      # Host bios
│   ├── episodes/page.tsx   # Episode sections
│   ├── glass-room/         # Blog
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Individual posts
│   ├── faq/page.tsx        # FAQ accordion
│   └── contact/page.tsx    # Contact form
├── components/
│   ├── ui/                 # Button, Card, Section, Skeleton
│   ├── layout/             # Header, Footer, Navigation
│   ├── episodes/           # YouTubeEmbed, EpisodeCard, FeaturedEpisode
│   ├── about/              # PersonCard, HostSection, GuestGrid
│   ├── blog/               # BlogCard, TableOfContents, MarkdownRenderer
│   ├── faq/                # FAQItem, FAQCategory
│   └── forms/              # ContactForm
├── lib/
│   ├── data/               # Data fetching utilities
│   └── utils/              # markdown.ts helpers
├── content/
│   ├── episodes.json       # ⚠️ NEEDS REAL DATA
│   ├── playlists.json      # ⚠️ NEEDS VERIFICATION
│   ├── hosts.json          # ⚠️ NEEDS VERIFICATION
│   ├── faqs.json           # Generic content OK for MVP
│   ├── top-tastings.json   # ⚠️ NEEDS CURATION
│   └── glass-room/         # Blog posts (Markdown)
├── styles/
│   └── globals.css         # Tailwind v4 theme
└── types/
    └── index.ts            # TypeScript interfaces

tests/
├── unit/                   # Jest unit tests
├── integration/            # React Testing Library
└── e2e/                    # Playwright specs

public/
├── images/
│   ├── hosts/              # Host photos (need real images)
│   ├── guests/             # Guest photos
│   ├── logo/               # Site logo (need from bottle.bond)
│   └── blog/               # Blog post images
└── favicon.ico
```

**Structure Decision**: Frontend-only static site using Next.js App Router with JSON/Markdown content sources.

---

## Complexity Tracking

No constitution violations requiring justification. Design follows minimum viable complexity.

---

## Implementation Status

### Completed Phases ✅

- **Phase 1**: Setup & Infrastructure
- **Phase 2**: Foundational Components
- **Phase 3**: US1 - Homepage with Featured Episode
- **Phase 4**: US2 - Educational Episodes
- **Phase 5**: US3 - Tasting Episodes
- **Phase 6**: US4 - About the Hosts
- **Phase 7**: US5 - The Glass Room Blog
- **Phase 8**: US6 - FAQ Page
- **Phase 9**: US7 - Contact Form
- **Phase 10**: US8 - Content Editor Workflow

### Pending: Phase 2.5 - Content Migration

**CRITICAL**: Before production deployment, the following must be completed:

1. **Replace placeholder YouTube IDs** with real video IDs from channel
2. **Verify host information** accuracy
3. **Update social links** to match actual platforms
4. **Migrate blog content** from WordPress

### Pending: Phase 11 - Polish

- Accessibility audit
- Performance optimization
- Cross-browser testing
- Final deployment verification

---

## Next Steps (Priority Order)

1. **Immediate**: Content owner provides real YouTube video IDs
2. **Immediate**: Verify host names/bios with content owner
3. **Short-term**: Migrate "Stitzel-Weller" blog post from bottle.bond
4. **Short-term**: Update social links (add TikTok, Facebook; verify Instagram)
5. **Medium-term**: Implement YouTube API sync script (Phase 2.5)
6. **Medium-term**: Complete accessibility audit

---

**Version**: 2.0.0 | **Last Updated**: 2026-02-02 | **Status**: Implementation Complete, Content Migration Required
