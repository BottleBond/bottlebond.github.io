# Data Model: YouTube Playlist Sync

**Date**: 2026-02-19 | **Branch**: `002-youtube-playlist-sync`

## Entities

### Episode

Represents a single YouTube video synced to the site.

**Identity**: YouTube video ID (e.g., `dQw4w9WgXcQ`) — canonical, immutable.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `id` | string | YouTube | YouTube video ID (canonical episode ID) |
| `title` | string | YouTube | Video title |
| `description` | string | YouTube | Video description |
| `youtubeId` | string | YouTube | Same as `id` (kept for backward compat with shortcodes) |
| `thumbnailUrl` | string | YouTube | URL to video thumbnail (maxresdefault) |
| `duration` | string | YouTube | Duration in `MM:SS` format (converted from ISO 8601) |
| `publishedAt` | string | YouTube | ISO 8601 publish date |
| `playlistId` | string | YouTube | Playlist category ID (e.g., `education`, `tastings`) |
| `popularity` | number | Manual | 0-100 score for ranking (preserved across syncs) |
| `tags` | string[] | Manual | Editorial tags (preserved across syncs) |

**Stored in**: `data/episodes.json` as `{ "episodes": [ ... ] }`

**Uniqueness**: A video may appear in multiple playlists. Each
playlist association creates a separate episode entry. The combination
of `id` + `playlistId` is unique.

**Lifecycle**:
- **Created**: When a video is found in a YouTube playlist during sync
- **Updated**: YouTube-native fields overwritten on every sync; manual
  fields preserved
- **Deleted**: When a video is removed from all non-blocklisted playlists

---

### Playlist

Represents a YouTube playlist synced to the site.

**Identity**: YouTube playlist ID (e.g., `PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ`).

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `id` | string | Derived | Short category ID (e.g., `main`, `education`) |
| `name` | string | YouTube | Playlist display name from YouTube |
| `slug` | string | Derived | URL-friendly version of name |
| `youtubePlaylistId` | string | YouTube | Full YouTube playlist ID |
| `description` | string | YouTube | Playlist description |
| `category` | string | Derived | Same as `id` (backward compat) |

**Stored in**: `data/playlists.json` as `{ "playlists": [ ... ] }`

**Mapping**: The `id` field is derived by slugifying the YouTube playlist
title or using the first playlist discovered in the category. For existing
playlists, the `id` is preserved from the current `playlists.json` to
maintain shortcode compatibility.

**Lifecycle**:
- **Created**: When a new playlist is discovered on the channel
- **Updated**: `name` and `description` overwritten from YouTube on each sync
- **Deleted**: When a playlist is added to the blocklist or removed from
  the channel

---

### Rankings

Represents ordered episode lists for seasonal and all-time rankings.

**Identity**: Composite of `listType` + `episodeId`.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `episodeId` | string | YouTube | YouTube video ID referencing an Episode |
| `rank` | number | YouTube | Position in the YouTube playlist (1-based) |
| `listType` | string | Derived | `"alltime"` or `"season"` |
| `season` | string | Manual | Season name (only for seasonal entries) |
| `addedAt` | string | Manual | ISO 8601 date when entry was added (preserved) |
| `note` | string | Manual | Editorial note (preserved across syncs) |

**Stored in**: `data/toptastings.json` as
`{ "currentSeason": "...", "allTime": [...], "seasonal": [...] }`

**Lifecycle**:
- **Created**: When a video appears in a rankings-associated playlist
- **Updated**: `rank` updated from YouTube playlist order; `note` and
  `addedAt` preserved
- **Deleted**: When referenced episode no longer exists in episode inventory

---

### Sync Configuration

Represents the tool's configuration.

**Identity**: Singleton file at repository root.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `channelId` | string | Manual | YouTube channel ID |
| `blocklist` | string[] | Manual | YouTube playlist IDs to exclude |
| `schedule` | string | Manual | Sync frequency hint (informational) |

**Stored in**: `sync-config.json` at repository root.

**API key**: NOT in config file. Provided via `YOUTUBE_API_KEY` environment
variable.

## Relationships

```text
Sync Configuration
    │
    ├── channelId ──→ YouTube Channel
    │                     │
    │                     └── has many ──→ Playlists
    │                                        │
    │                                        └── contains ──→ Episodes
    │
    └── blocklist ──→ excludes specific Playlists

Rankings
    │
    └── episodeId ──→ references Episode.id
```

## Validation Rules

1. **Episode.id**: Must be a valid YouTube video ID (11 characters,
   alphanumeric + `-_`)
2. **Episode.playlistId**: Must reference an existing Playlist.id
3. **Rankings.episodeId**: Must reference an existing Episode.id
4. **Sync Configuration.channelId**: Must be a valid YouTube channel ID
   (starts with `UC`, 24 characters)
5. **Playlist.youtubePlaylistId**: Must be a valid YouTube playlist ID
   (starts with `PL`)
6. **Episode.popularity**: Integer 0-100 (manual field, not validated by
   sync tool but preserved)
