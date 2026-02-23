# Quickstart: YouTube Playlist Sync Tool

**Date**: 2026-02-19 | **Branch**: `002-youtube-playlist-sync`

## Prerequisites

- **Node.js 20+**: Install via `brew install node` (macOS) or
  [nodejs.org](https://nodejs.org/)
- **YouTube Data API key**: Create one at
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  with YouTube Data API v3 enabled
- **Git**: For repository management

## Setup (One-Time)

```bash
# Clone the repository
git clone https://github.com/bottlebond/bottlebond.github.io.git
cd bottlebond.github.io

# Initialize Hugo theme submodule
git submodule update --init --recursive

# Install sync tool dependencies
cd tools/sync
npm install
cd ../..

# Set your YouTube API key
export YOUTUBE_API_KEY="your-api-key-here"
```

## Configuration

The sync tool reads from `sync-config.json` at the repository root:

```json
{
  "channelId": "UCxxxxxxxxxxxxxxxxx",
  "blocklist": [],
  "schedule": "daily"
}
```

- **channelId**: Your YouTube channel ID (found in channel URL or YouTube
  Studio settings)
- **blocklist**: Array of YouTube playlist IDs to exclude from sync
- **schedule**: Informational field for the GitHub Actions cron schedule

## Running the Sync Tool

### Full Sync

```bash
# Run a full sync (fetches from YouTube, updates data files)
node tools/sync/sync.mjs
```

### Dry Run (Preview Changes)

```bash
# See what would change without writing any files
node tools/sync/sync.mjs --dry-run
```

### Expected Output

```
YouTube Playlist Sync
=====================
Channel: UCxxxxxxxxxxxxxxxxx
Playlists found: 5 (0 blocklisted)

Syncing playlists...
  ✓ All Episodes (12 videos)
  ✓ History & Education (3 videos)
  ✓ Tastings (3 videos)
  ✓ Top Tastings of the Season (1 video)
  ✓ Top 10 of All Time (2 videos)

Summary:
  Episodes added: 0
  Episodes removed: 0
  Episodes updated: 12
  Playlists renamed: 0
  Rankings validated: ✓ (0 broken references)

Files updated:
  data/episodes.json
  data/playlists.json
  data/toptastings.json
  content/episodes.md
```

## Verifying Results

After running the sync tool:

```bash
# Start Hugo dev server to preview changes
hugo server -D

# Open http://localhost:1313/episodes/ to verify:
# - Section headings match YouTube playlist names
# - Episode cards show current YouTube metadata
# - Top Tastings show correct rankings
```

## Common Tasks

### Exclude a Playlist from Sync

Add its YouTube playlist ID to the blocklist in `sync-config.json`:

```json
{
  "channelId": "UCxxxxxxxxxxxxxxxxx",
  "blocklist": ["PLxxxxxxxxxxxxxxxxxx"]
}
```

### Set Manual Episode Metadata

After syncing, edit `data/episodes.json` to set manual-only fields:

```json
{
  "id": "dQw4w9WgXcQ",
  "popularity": 95,
  "tags": ["bourbon", "basics"]
}
```

These fields are preserved on subsequent syncs. YouTube-native fields
(title, description, thumbnail, duration, publishedAt) will be overwritten.

### Run in CI

The sync tool runs automatically:
- **On every deploy**: As a pre-build step in `deploy.yml`
- **Daily**: Via the `sync.yml` scheduled workflow

To trigger a manual sync via GitHub Actions:
1. Go to Actions tab in the repository
2. Select "YouTube Playlist Sync" workflow
3. Click "Run workflow"

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `YOUTUBE_API_KEY not set` | Set the environment variable: `export YOUTUBE_API_KEY="..."` |
| `Invalid channel ID` | Verify `channelId` in `sync-config.json` starts with `UC` |
| `API quota exceeded` | Wait until midnight PT for quota reset (10,000 units/day) |
| `No playlists found` | Check that the channel has public playlists |
| `Sync completed but no changes` | Data is already up to date — no files modified |
