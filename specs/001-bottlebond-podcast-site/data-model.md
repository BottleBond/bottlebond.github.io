# Data Model: BottleBond Hugo Site

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## Content Structure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Hugo Site                                 │
├─────────────────────┬───────────────────────────────────────────┤
│   content/          │   data/                                    │
│   (Markdown)        │   (JSON)                                   │
├─────────────────────┼───────────────────────────────────────────┤
│ _index.md           │ hosts.json → Person entities               │
│ about.md            │ episodes.json → Episode entities           │
│ contact.md          │ faqs.json → FAQ entities                   │
│ episodes.md         │ playlists.json → Playlist config           │
│ faq.md              │ toptastings.json → Curated lists           │
│ glass-room/         │                                            │
│   └─ [era]/[post]   │                                            │
└─────────────────────┴───────────────────────────────────────────┘
```

---

## Content Files (Markdown)

### Page Content Structure

All pages use markdown with YAML frontmatter.

| File | Type | Purpose | Shortcodes |
|------|------|---------|------------|
| `_index.md` | Home | Homepage intro | (theme-controlled) |
| `about.md` | Page | About page | `{{< hosts >}}` |
| `contact.md` | Page | Contact info | (mailto link) |
| `episodes.md` | Page | Episode listing | `{{< episodes >}}` |
| `faq.md` | Page | FAQ content | (markdown headers) |
| `glass-room/_index.md` | Section | Blog listing | (theme-controlled) |
| `glass-room/[era]/[slug].md` | Post | Blog posts | `{{< youtube >}}` |

### Frontmatter Schema

**Standard Page**:
```yaml
---
title: "Page Title"           # Required
description: "SEO description" # Optional
type: "page"                   # Required for theme
---
```

**Blog Post**:
```yaml
---
title: "Post Title"           # Required
date: 2026-02-02              # Required (YYYY-MM-DD)
description: "Brief summary"   # Optional (used for cards)
draft: false                   # Optional (hide from build)
---
```

---

## Data Files (JSON)

### hosts.json

Stores host and guest information.

```json
{
  "hosts": [
    {
      "name": "Adam Lathers",
      "role": "host",
      "bio": "Biographical text...",
      "photo": "/images/hosts/adam.jpg",
      "social": {
        "instagram": "https://instagram.com/...",
        "youtube": "https://youtube.com/..."
      }
    }
  ],
  "guests": [
    {
      "name": "Guest Name",
      "role": "guest",
      "bio": "Biographical text...",
      "photo": "/images/hosts/guest.jpg"
    }
  ]
}
```

**Access in templates**: `.Site.Data.hosts.hosts`, `.Site.Data.hosts.guests`

### episodes.json

Stores episode metadata.

```json
{
  "episodes": [
    {
      "id": "ep_001",
      "title": "Episode Title",
      "description": "Episode summary...",
      "youtubeId": "xxxxxxxxxxx",
      "category": "education",
      "thumbnailUrl": "https://i.ytimg.com/vi/xxxxxxxxxxx/hqdefault.jpg",
      "duration": "45:30",
      "publishedAt": "2026-01-15"
    }
  ]
}
```

**Valid categories**: `main`, `education`, `tastings`, `seasonal`, `top10`

**Access in templates**: `.Site.Data.episodes.episodes`

### faqs.json

Stores FAQ questions and answers.

```json
{
  "faqs": [
    {
      "question": "What is bourbon?",
      "answer": "Bourbon is an American whiskey made from at least 51% corn...",
      "category": "Basics",
      "order": 1
    }
  ]
}
```

**Access in templates**: `.Site.Data.faqs.faqs`

### playlists.json

Stores YouTube playlist configuration.

```json
{
  "playlists": [
    {
      "id": "main",
      "name": "All Episodes",
      "youtubeId": "PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ"
    },
    {
      "id": "education",
      "name": "History & Education",
      "youtubeId": "PLkEG2GQlU7uFYy3tRx_YZ5CXg79I5bnhi"
    }
  ]
}
```

**Access in templates**: `.Site.Data.playlists.playlists`

### toptastings.json

Stores curated top-rated episodes.

```json
{
  "currentSeason": "Winter 2026",
  "seasonal": [
    {
      "episodeId": "ep_001",
      "rank": 1
    }
  ],
  "allTime": [
    {
      "episodeId": "ep_002",
      "rank": 1
    }
  ]
}
```

**Access in templates**: `.Site.Data.toptastings`

---

## Shortcode Data Access Patterns

### hosts.html Shortcode

```html
{{ $role := .Get "role" | default "all" }}
{{ $hosts := .Site.Data.hosts.hosts }}

{{ if eq $role "guest" }}
  {{ $hosts = .Site.Data.hosts.guests }}
{{ else if ne $role "all" }}
  {{ $hosts = where $hosts "role" $role }}
{{ end }}

{{ range $hosts }}
  <!-- render person card -->
{{ end }}
```

### episodes.html Shortcode

```html
{{ $category := .Get "category" | default "all" }}
{{ $limit := .Get "limit" | default 3 }}
{{ $episodes := .Site.Data.episodes.episodes }}

{{ if ne $category "all" }}
  {{ $episodes = where $episodes "category" $category }}
{{ end }}

{{ range first $limit $episodes }}
  <!-- render episode card -->
{{ end }}
```

---

## Era Categories (Glass Room)

Era is determined by folder structure, not frontmatter.

| Folder Path | Era Display Name |
|-------------|------------------|
| `glass-room/colonial/` | Colonial Era |
| `glass-room/early-american/` | Early American |
| `glass-room/prohibition-era/` | Prohibition Era |
| `glass-room/post-war/` | Post-War Revival |
| `glass-room/modern-craft/` | Modern Craft |
| `glass-room/contemporary/` | Contemporary |
| `glass-room/homework/` | Homework |

New eras are created by adding new folders - the system is flexible.

---

## Data Volume Assumptions

| Entity | Location | Initial Count | Growth |
|--------|----------|---------------|--------|
| Pages | `content/*.md` | 5 | Stable |
| Blog Posts | `content/glass-room/` | 10+ | +1-2/month |
| Hosts | `data/hosts.json` | 2-3 | Slow |
| Guests | `data/hosts.json` | 5-10 | Slow |
| Episodes | `data/episodes.json` | 50+ | +2-4/month |
| FAQs | `data/faqs.json` | 10-20 | Slow |

---

## Migration from Previous Structure

| Previous (Next.js) | Current (Hugo) |
|--------------------|----------------|
| `src/content/episodes.json` | `data/episodes.json` |
| `src/content/hosts.json` | `data/hosts.json` |
| `src/content/faqs.json` | `data/faqs.json` |
| `src/content/playlists.json` | `data/playlists.json` |
| `src/content/glass-room/*.md` | `content/glass-room/**/*.md` |
| React components | Hugo shortcodes |
| TypeScript interfaces | JSON schema (implicit) |
