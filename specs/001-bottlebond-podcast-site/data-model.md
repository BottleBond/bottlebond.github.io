# Data Model: BottleBond Podcast Website

**Date**: 2026-02-15 | **Branch**: `001-bottlebond-podcast-site`

---

## Overview

All data is stored as JSON files in `data/` (episode, host, FAQ, playlist, and ranking data) or as Markdown files with frontmatter in `content/glass-room/` (blog posts). Hugo reads these at build time and makes them available to templates via `site.Data.*` and `.Pages` respectively.

---

## Entity: Episode

**Source**: `data/episodes.json` (`.episodes[]`)
**Status**: Exists (12 records)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., `ep_main_001`) |
| `title` | string | Yes | Episode title |
| `description` | string | Yes | Episode summary |
| `youtubeId` | string | Yes | YouTube video ID for embed/link |
| `playlistId` | string | Yes | Category: `main`, `education`, `tastings`, `seasonal`, `top10` |
| `thumbnailUrl` | string | Yes | YouTube thumbnail URL |
| `duration` | string | Yes | Duration in `MM:SS` format |
| `publishedAt` | string (ISO 8601) | Yes | Publication timestamp |
| `popularity` | integer (0–100) | Yes | Popularity score; used for Top 10 All Time ranking |
| `tags` | string[] | No | Content tags for categorization |

**Access patterns**:
- Filter by `playlistId` for section display (education, tastings, etc.)
- Sort by `popularity` descending for Top 10 All Time computation
- Filter by `playlistId = "main"` for featured episode random selection
- First 3 by popularity per playlist for "most popular" sections

**Validation rules**:
- `id` must be unique across all episodes
- `youtubeId` must be a valid YouTube video ID
- `popularity` must be 0–100 inclusive

---

## Entity: Person (Host/Guest)

**Source**: `data/hosts.json` (`.hosts[]` and `.guests[]`)
**Status**: Exists (2 hosts + 3 guests)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., `host_001`) |
| `name` | string | Yes | Display name |
| `role` | string | Yes | `host`, `cohost`, or `guest` |
| `bio` | string | Yes | Biographical text |
| `photoUrl` | string | Yes | Path to photo image |
| `socialLinks` | object[] | No | Array of `{platform, url}` objects |
| `featured` | boolean | Yes | Whether to show on About page |
| `order` | integer | Yes | Display order within role group |

**Access patterns**:
- Filter by `role` for About page sections (host, cohost, guest)
- Sort by `order` within each role group
- Filter by `featured = true` for homepage host teaser

**Validation rules**:
- `id` must be unique
- `role` must be one of: `host`, `cohost`, `guest`
- `order` determines display sequence (ascending)

---

## Entity: BlogPost

**Source**: Markdown files in `content/glass-room/<era>/*.md`
**Status**: Exists (3 posts across 3 eras)

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `date` | string (date) | Yes | Publication date |
| `era` | string | Yes | Historical era label (display name) |
| `author` | string | Yes | Author name |
| `description` | string | Yes | Post summary/excerpt |
| `featured` | boolean | No | Whether to feature on homepage |
| `tags` | string[] | No | Content tags |
| `draft` | boolean | No | Hugo built-in; `true` hides from production |

**Era derivation**: Era is determined by folder structure (e.g., `glass-room/prohibition-era/` → "Prohibition Era"). The `era` frontmatter field is the display name.

**Access patterns**:
- Top-level Glass Room: `.RegularPagesRecursive` returns ALL posts across eras
- Era landing page: `.RegularPages` returns posts within that era only
- `.Sections` on top-level lists child sections (eras) for navigation
- Sort by `.Date` (oldest first per spec, configurable)

**Section structure**:
```
content/glass-room/
├── _index.md                          # Top-level section page (TOC for all eras)
├── prohibition-era/
│   ├── _index.md                      # Era landing page
│   └── the-whiskey-rebellion.md       # Individual post
├── modern-craft/
│   ├── _index.md                      # Era landing page
│   └── rise-of-craft-distilling.md    # Individual post
└── homework/
    ├── _index.md                      # Era landing page
    └── is-all-base-distillate-vodka.md # Individual post
```

---

## Entity: Playlist

**Source**: `data/playlists.json` (`.playlists[]`)
**Status**: Exists (5 records)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier matching episode `playlistId` |
| `name` | string | Yes | Display name |
| `slug` | string | Yes | URL-friendly name |
| `youtubePlaylistId` | string | Yes | YouTube playlist ID |
| `description` | string | Yes | Playlist description |
| `category` | string | Yes | Category: `main`, `education`, `tastings`, `seasonal`, `top10` |

**Access patterns**:
- Look up playlist metadata by `id` to get YouTube playlist URLs
- Used by episode shortcodes to link "View All" to YouTube playlists

---

## Entity: TopTasting (Ranked Episode)

**Source**: `data/toptastings.json` (`.seasonal[]` and `.allTime[]`)
**Status**: Exists (5 seasonal + 10 all-time)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `episodeId` | string | Yes | References `Episode.id` |
| `rank` | integer | Yes | Display position (1-based) |
| `listType` | string | Yes | `season` or `alltime` |
| `season` | string | Conditional | Season label (required for seasonal, e.g., "Winter 2026") |
| `addedAt` | string (ISO 8601) | Yes | When added to list |
| `note` | string | No | Curator's note/comment |

**Top-level fields**:
- `currentSeason` (string): Label for current season display

**Note on all-time**: Per spec clarification, the all-time list should be **computed** by sorting episodes by `popularity` descending. The `toptastings.json` all-time entries serve as a fallback/cache but the shortcode should compute from `episodes.json` for the all-time view.

---

## Entity: FAQ

**Source**: `data/faqs.json` (`.faqs[]`)
**Status**: Exists (10 records)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `question` | string | Yes | FAQ question text |
| `answer` | string | Yes | FAQ answer text |
| `category` | string | Yes | Group label (e.g., "Basics", "Production", "Tasting") |
| `order` | integer | Yes | Display order within category |

**Access patterns**:
- Group by `category` for accordion sections
- Sort by `order` within each category

---

## Entity: Contact

**Source**: `hugo.toml` (`params.email`)
**Status**: Exists

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Contact email address (`website@bottle.bond`) |

**Access**: Available in templates via `site.Params.email`

---

## Relationships

```
Episode ---< TopTasting (episodeId → Episode.id)
Episode ---- Playlist   (playlistId → Playlist.id)
Person  ---- standalone (no FK relationships)
BlogPost --- standalone (organized by folder/section hierarchy)
FAQ     ---- standalone (grouped by category field)
```

---

## Data Integrity Notes

1. All entities have canonical `id` fields per constitution requirement
2. All time-sensitive data has ISO 8601 timestamps (`publishedAt`, `addedAt`, `date`)
3. Episode↔TopTasting relationship uses `episodeId` foreign key
4. Episode↔Playlist relationship uses `playlistId` category identifier
5. BlogPost era is derived from folder structure (single source of truth)
6. No circular dependencies between entities
