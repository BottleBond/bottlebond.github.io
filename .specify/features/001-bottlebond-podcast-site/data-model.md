# Data Model: BottleBond Podcast Website

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## Entity Relationship Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Episode   │────▶│   Playlist  │     │   Person    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       │
       ▼                                       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ TopTasting  │     │  BlogPost   │     │    FAQ      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Era      │
                    └─────────────┘
```

---

## Core Entities

### Episode

Represents a single podcast episode from YouTube.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier (e.g., `ep_001`) |
| title | string | Yes | Episode title |
| description | string | No | Episode description/summary |
| youtubeId | string | Yes | YouTube video ID |
| playlistId | string | Yes | Reference to parent Playlist |
| thumbnailUrl | string | Yes | Episode thumbnail URL |
| duration | string | Yes | Duration in `MM:SS` or `HH:MM:SS` format |
| publishedAt | string (ISO 8601) | Yes | Publication date |
| popularity | number | No | Popularity score (0-100) for sorting |
| tags | string[] | No | Content tags for filtering |

**Validation Rules:**
- `youtubeId` must be 11 characters (YouTube video ID format)
- `duration` must match pattern `^\d{1,2}:\d{2}(:\d{2})?$`
- `popularity` must be between 0 and 100

---

### Playlist

Categorizes episodes by content type.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| name | string | Yes | Display name |
| slug | string | Yes | URL-friendly identifier |
| youtubePlaylistId | string | Yes | YouTube playlist ID |
| description | string | No | Playlist description |
| category | enum | Yes | `main` \| `education` \| `tastings` \| `seasonal` \| `top10` |

**Predefined Playlists:**
- `main` - All episodes (featured selection source)
- `education` - History & Education episodes
- `tastings` - Tasting episodes
- `seasonal` - Top Tastings of the Season
- `top10` - Top 10 of All Time

---

### Person

Represents hosts, co-hosts, and recurring guests.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| name | string | Yes | Display name |
| role | enum | Yes | `host` \| `cohost` \| `guest` |
| bio | string | Yes | Biographical text |
| photoUrl | string | Yes | Profile photo URL |
| socialLinks | SocialLink[] | No | Social media links |
| featured | boolean | No | Show on About page |
| order | number | No | Display order |

**SocialLink:**
```typescript
interface SocialLink {
  platform: 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'website';
  url: string;
}
```

---

### BlogPost (The Glass Room)

Represents a blog post stored as Markdown.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| slug | string | Yes | URL-friendly identifier (derived from filename) |
| title | string | Yes | Post title (from frontmatter) |
| date | string (ISO 8601) | Yes | Publication date |
| era | string | Yes | Era category (e.g., "Prohibition") |
| author | string | Yes | Author name |
| description | string | No | Post summary/excerpt |
| featured | boolean | No | Featured post flag |
| tags | string[] | No | Content tags |
| content | string | N/A | Markdown content (not stored, loaded at build) |

**Era Categories (ordered oldest to newest):**
1. Colonial Era
2. Early American
3. Prohibition Era
4. Post-War Revival
5. Modern Craft
6. Contemporary

**File Location:** `src/content/glass-room/{slug}.md`

---

### TopTasting

Represents a curated top-rated episode.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| episodeId | string | Yes | Reference to Episode |
| rank | number | Yes | Position in list (1-10) |
| listType | enum | Yes | `season` \| `alltime` |
| season | string | No | Season identifier (e.g., "Winter 2026") |
| addedAt | string (ISO 8601) | Yes | When added to list |
| note | string | No | Editor's note about selection |

**Validation:**
- `rank` must be 1-10 for `alltime`, 1-5 for `season`
- `season` required when `listType` is `season`

---

### FAQ

Represents a frequently asked question.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| question | string | Yes | The question text |
| answer | string | Yes | The answer (supports Markdown) |
| category | string | No | Category for grouping |
| order | number | No | Display order within category |

**Categories:**
- Basics
- Production
- Tasting
- Podcast
- General

---

### ContactMessage

Represents a submitted contact form.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| name | string | Yes | Sender name |
| email | string | Yes | Sender email |
| subject | string | Yes | Message subject |
| message | string | Yes | Message body |
| submittedAt | string (ISO 8601) | Yes | Submission timestamp |
| status | enum | Yes | `new` \| `read` \| `replied` |

**Note:** Contact messages are handled by Web3Forms service. This schema is for reference only.

---

## State Transitions

### BlogPost Lifecycle

```
Draft → Published → Updated
  │         │          │
  └─────────┼──────────┘
            ▼
        Archived (future)
```

### ContactMessage Flow

```
Submitted → New → Read → Replied
              │
              └→ Archived (after 90 days)
```

---

## Data Volume Assumptions

| Entity | Initial Count | Expected Growth |
|--------|---------------|-----------------|
| Episodes | ~50 | +2-4/month |
| Playlists | 5 | Stable |
| Persons | 5-10 | Slow growth |
| BlogPosts | 10 | +1-2/month |
| FAQs | 10-20 | Slow growth |
| TopTastings | 15 (10 alltime + 5 season) | Quarterly updates |

---

## Index Strategy (for build-time queries)

### Episodes
- By playlist (category filtering)
- By popularity (top episodes)
- By publication date (chronological)

### BlogPosts
- By era (grouped display)
- By date (chronological TOC)
- By slug (individual post lookup)

### Persons
- By role (hosts vs guests)
- By order (display sorting)

---

## Data Source Mapping

| Entity | Initial Source | Production Source |
|--------|----------------|-------------------|
| Episodes | `src/content/episodes.json` | YouTube API (future) |
| Playlists | `src/content/playlists.json` | Static config |
| Persons | `src/content/hosts.json` | CMS (future) |
| BlogPosts | `src/content/glass-room/*.md` | Git repository |
| FAQs | `src/content/faqs.json` | CMS (future) |
| TopTastings | `src/content/top-tastings.json` | Manual curation |
