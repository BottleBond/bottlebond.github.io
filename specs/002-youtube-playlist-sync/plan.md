# Implementation Plan: YouTube Playlist Sync

**Branch**: `002-youtube-playlist-sync` | **Date**: 2026-02-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-youtube-playlist-sync/spec.md`

## Summary

Build a Node.js CLI tool that syncs episode data from YouTube playlists into
the Hugo site's JSON data files. The tool auto-discovers playlists from a
configured YouTube channel (with blocklist support), fetches video metadata via
the YouTube Data API v3, merges it with existing local data (preserving
manual-only fields), updates the episodes page section headings to match
playlist names, and validates ranking references. It runs locally, as a
pre-build step in CI, and on a daily GitHub Actions schedule.

## Technical Context

**Language/Version**: Node.js 20 LTS
**Primary Dependencies**: `googleapis` (Google APIs Node.js client for YouTube
Data API v3)
**Storage**: JSON files in Hugo `data/` directory (`episodes.json`,
`playlists.json`, `toptastings.json`); Markdown in `content/episodes.md`
**Testing**: Node.js built-in test runner (`node --test`)
**Target Platform**: macOS/Linux CLI + GitHub Actions (ubuntu-latest)
**Project Type**: Single CLI tool within existing Hugo project
**Performance Goals**: Full sync under 60 seconds for 500 videos (SC-004)
**Constraints**: YouTube Data API daily quota of 10,000 units; ~15-20 units
per sync run for current channel size (~5 playlists, ~100 videos)
**Scale/Scope**: Single YouTube channel, up to 500 videos across all playlists

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Dynamic Content First | PASS | Tool syncs structured data (JSON) from external API, separated from presentation (Hugo templates). |
| II. Security By Default | PASS | API key stored as GitHub secret / env var, never in config file or source control. Config file contains only channel ID and blocklist. |
| III. Testable & Continuous Delivery | PASS | Unit tests for merge logic, integration test for API calls (mockable), CI runs on every push. Tool runs in CI as pre-build step. |
| IV. Observability & Error Handling | PASS | FR-009/FR-013 require structured logging of all changes and warnings. FR-011 defines exit codes. FR-014 requires graceful API failure. |
| V. Accessibility & Performance | N/A | CLI tool, no user interface. Performance addressed by SC-004 (60s budget). |
| VI. Documentation Accompaniment | PASS | Quickstart.md and README updates planned. Tool includes `--help` flag. |

**Post-design re-check**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-youtube-playlist-sync/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
tools/
└── sync/
    ├── package.json         # Dependencies (googleapis)
    ├── sync.mjs             # Main entry point / CLI
    ├── lib/
    │   ├── config.mjs       # Load & validate sync config
    │   ├── youtube.mjs      # YouTube API client (playlists, videos)
    │   ├── episodes.mjs     # Episode data merge logic
    │   ├── playlists.mjs    # Playlist data merge logic
    │   ├── rankings.mjs     # Rankings validation & update logic
    │   └── content.mjs      # Episodes page section heading updater
    └── test/
        ├── config.test.mjs
        ├── episodes.test.mjs
        ├── playlists.test.mjs
        ├── rankings.test.mjs
        └── content.test.mjs

data/
├── episodes.json            # Updated by sync tool (existing)
├── playlists.json           # Updated by sync tool (existing)
└── toptastings.json         # Updated by sync tool (existing)

content/
└── episodes.md              # Section headings updated by sync tool (existing)

sync-config.json             # YouTube channel ID + blocklist (new)

.github/workflows/
├── deploy.yml               # Modified: add sync step before build
└── sync.yml                 # New: scheduled daily sync workflow
```

**Structure Decision**: Single tool directory (`tools/sync/`) with its own
`package.json` to isolate dependencies from the Hugo project root. The tool
writes to existing Hugo `data/` and `content/` paths. ESM modules (`.mjs`)
used throughout for modern JavaScript.

## Complexity Tracking

No constitution violations to justify.
