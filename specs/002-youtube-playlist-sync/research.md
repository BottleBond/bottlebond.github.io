# Research: YouTube Playlist Sync

**Date**: 2026-02-19 | **Branch**: `002-youtube-playlist-sync`

## 1. Language / Runtime

**Decision**: Node.js 20 LTS with ESM modules

**Rationale**: GitHub Actions `ubuntu-latest` runners include Node.js
pre-installed. The `googleapis` npm package is Google's official client for
the YouTube Data API v3, well-maintained and widely used. Node.js handles
JSON natively, which is ideal for reading/writing Hugo data files. ESM
modules provide modern import/export syntax.

**Alternatives considered**:
- **Python + google-api-python-client**: Equally capable, but would require
  installing Python and pip in CI (not pre-installed in the Hugo workflow).
- **Bash + curl + jq**: Zero dependencies but complex JSON manipulation,
  poor error handling, no type safety, difficult to test.
- **Go**: Fast single binary, but heavier toolchain setup for a small utility.
  Over-engineered for this use case.

## 2. YouTube Data API v3 Endpoints

**Decision**: Three-step fetch pipeline:
1. `playlists.list` (channelId, part=snippet,contentDetails) — discover all
   playlists
2. `playlistItems.list` (playlistId, part=snippet, maxResults=50) — get
   video IDs and positions per playlist
3. `videos.list` (id=<comma-separated>, part=snippet,contentDetails) — get
   full metadata including duration

**Rationale**: `playlistItems.list` does not return video duration or full
snippet data. A separate `videos.list` call is required, but it supports
batching up to 50 video IDs per request, keeping quota costs low.

**Alternatives considered**:
- **Search API**: 100 units per call vs 1 unit for list calls. Prohibitively
  expensive for routine syncs.
- **RSS feeds**: Free but limited to ~15 most recent videos per channel, no
  playlist-level data, no duration.

## 3. Authentication

**Decision**: API key only (no OAuth 2.0)

**Rationale**: The tool only reads public channel data (playlists and public
videos). API key authentication is sufficient for read-only public access,
far simpler than OAuth flows, and appropriate for a CI/CLI tool with no user
interaction.

**Alternatives considered**:
- **OAuth 2.0**: Required only for private/unlisted content or write
  operations. Adds complexity (token refresh, consent screen) with no
  benefit for public data access.

## 4. API Quota Budget

**Decision**: Accept the default 10,000 units/day quota. No need to request
an increase.

**Rationale**: Estimated cost per full sync for current channel
(5 playlists, ~100 videos):
- 1 `playlists.list` call = 1 unit
- ~10 `playlistItems.list` calls (paginated) = 10 units
- 2 `videos.list` calls (batched 50 IDs each) = 2 units
- **Total: ~13 units per sync**

Even at 500 videos (SC-004 target): ~20 units per sync. This allows ~500
syncs/day — far more than the daily schedule + occasional manual runs.

## 5. Configuration Format

**Decision**: `sync-config.json` at repository root

**Rationale**: JSON matches the existing Hugo data file format convention.
Simple to parse in Node.js without additional dependencies. Separate from
`hugo.toml` to avoid coupling the sync tool to Hugo's config structure.

**File structure**:
```json
{
  "channelId": "UCxxxxxxxxxxxxxxxxx",
  "blocklist": [],
  "schedule": "daily"
}
```

API key is NOT in this file — it comes from the `YOUTUBE_API_KEY` environment
variable (GitHub secret in CI, local env var for developers).

**Alternatives considered**:
- **YAML**: Requires a parser dependency.
- **TOML**: Would match `hugo.toml` but requires a parser dependency.
- **Environment variables for everything**: Channel ID rarely changes and is
  not secret, so a config file is more appropriate and version-controllable.

## 6. Merge Strategy

**Decision**: YouTube-native fields overwrite on every sync; manual-only
fields are preserved by key (YouTube video ID).

**YouTube-native fields** (always overwritten):
- `title`, `description`, `thumbnailUrl`, `duration`, `publishedAt`

**Manual-only fields** (preserved if present, never set by sync):
- `popularity`, `tags`, `notes`, any custom editorial fields

**Merge algorithm**:
1. Load existing `episodes.json` into a Map keyed by video ID (`id` field)
2. For each video fetched from YouTube, check if it exists in the Map
3. If exists: overwrite YouTube-native fields, keep manual-only fields
4. If new: create entry with YouTube fields, manual-only fields empty/default
5. Remove entries whose video IDs are no longer in any non-blocklisted playlist
6. Write merged result back to `episodes.json`

**Rationale**: Simple, deterministic, and aligns with the clarified spec
decision (YouTube always wins for native fields).

## 7. Episodes Page Content Update

**Decision**: Parse `content/episodes.md` as text, match section headings
(`## <playlist name>`) to playlist IDs via a heading-to-playlist mapping,
and rewrite headings when playlist names change.

**Rationale**: Hugo Markdown files are simple enough to process with string
matching. A regex-based approach (`## ` lines) is sufficient — no Markdown
AST parser needed. The tool knows the expected section order from the
playlist data.

**Edge case — new playlists**: When a new playlist is discovered, the tool
appends a new section to `episodes.md` with the playlist name as the heading,
a placeholder description, and the `episodes` shortcode filtered by category.

## 8. Rankings Update Strategy

**Decision**: Use YouTube playlist video ordering as the source of truth for
rankings. The position of a video in a YouTube playlist determines its rank.

**Algorithm**:
1. For each ranking type (seasonal, alltime), identify the source playlist
2. Read the current video order from `playlistItems.list` (already fetched)
3. Build new ranking entries using video IDs and positions
4. Preserve manual-only fields (`note`, `addedAt`) from existing entries
5. Remove entries referencing deleted/missing videos; log warnings
6. Write updated `toptastings.json`

**Rationale**: This is the most automated approach — the podcast hosts
manage rankings by reordering videos in YouTube playlists, and the sync tool
reflects that order on the site.

## 9. CI Integration

**Decision**: Two workflows:
1. **Modified `deploy.yml`**: Add a sync step before `hugo --minify` that
   runs the tool, so every deploy gets fresh data.
2. **New `sync.yml`**: Scheduled workflow (daily via cron) that runs the
   sync tool, commits changes if any, and triggers a deploy.

**Rationale**: Separating the scheduled sync into its own workflow keeps
the deploy workflow simple. The deploy workflow's sync step is a pre-build
data refresh; the scheduled workflow handles autonomous daily updates.

**Concurrency**: Both workflows use the existing `concurrency: group: 'pages'`
setting, preventing simultaneous runs.
