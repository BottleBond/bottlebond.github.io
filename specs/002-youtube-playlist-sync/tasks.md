# Tasks: YouTube Playlist Sync

**Input**: Design documents from `/specs/002-youtube-playlist-sync/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Included — Constitution Principle III requires unit tests for logic.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Tool source: `tools/sync/`
- Tool libraries: `tools/sync/lib/`
- Tool tests: `tools/sync/test/`
- Hugo data files: `data/`
- Hugo content: `content/`
- Config: `sync-config.json` (repo root)
- CI workflows: `.github/workflows/`

---

## Phase 1: Setup

**Purpose**: Initialize the sync tool project structure and dependencies

- [x] T001 Create tools/sync/ directory with package.json containing `googleapis` dependency (`"type": "module"` for ESM) in tools/sync/package.json
- [x] T002 Create sync-config.json at repository root with channelId placeholder, empty blocklist array, and schedule field per research.md section 5
- [x] T003 Run `npm install` in tools/sync/ and verify googleapis installs successfully

**Checkpoint**: Project structure exists, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Implement config loader in tools/sync/lib/config.mjs — read sync-config.json, validate channelId format (starts with UC, 24 chars), read YOUTUBE_API_KEY from env var, validate blocklist is an array, export loadConfig() that returns { channelId, apiKey, blocklist } or throws with clear error message (FR-001, FR-011)
- [x] T005 [P] Implement YouTube API client in tools/sync/lib/youtube.mjs — initialize googleapis client with API key, export fetchPlaylists(channelId) using playlists.list with part=snippet,contentDetails and maxResults=50 with pagination, export fetchPlaylistItems(playlistId) using playlistItems.list with part=snippet and maxResults=50 with pagination, export fetchVideoDetails(videoIds) using videos.list with part=snippet,contentDetails batching up to 50 IDs per request. Convert ISO 8601 duration (PT15M51S) to MM:SS format. Handle API errors (quota exceeded, network failure) by throwing typed errors (FR-002, FR-003, FR-014)
- [x] T006 Create CLI entry point skeleton in tools/sync/sync.mjs — parse --dry-run and --help flags, import loadConfig from lib/config.mjs, wrap main logic in try/catch that exits 1 on config errors and exits 0 on success, print banner with channel ID (FR-011, FR-012)

**Checkpoint**: Foundation ready — `node tools/sync/sync.mjs` loads config and connects to YouTube API

---

## Phase 3: User Story 1 — Sync Episode Inventory (Priority: P1)

**Goal**: Fetch all videos from non-blocklisted YouTube playlists and rebuild
episodes.json and playlists.json with merged data.

**Independent Test**: Run the tool, verify data/episodes.json contains all
YouTube videos with correct metadata, and data/playlists.json reflects
current YouTube playlists.

- [x] T007 [P] [US1] Implement episode merge logic in tools/sync/lib/episodes.mjs — export mergeEpisodes(youtubeVideos, existingEpisodes) that: builds Map of existing episodes keyed by id+playlistId, for each YouTube video overwrites YouTube-native fields (title, description, youtubeId, thumbnailUrl, duration, publishedAt, playlistId), preserves manual-only fields (popularity, tags), creates new entries for new videos with empty manual fields, removes entries for videos no longer in any non-blocklisted playlist, returns { episodes, added, removed, updated } counts (FR-004, FR-010)
- [x] T008 [P] [US1] Implement playlist merge logic in tools/sync/lib/playlists.mjs — export mergePlaylists(youtubePlaylists, existingPlaylists, blocklist) that: preserves existing playlist `id` and `category` fields for known playlists, updates name/description/youtubePlaylistId from YouTube, generates slugified `id` for newly discovered playlists, excludes blocklisted playlists, returns { playlists, renamed, added, removed } counts (FR-005)
- [x] T009 [US1] Wire episode and playlist sync into tools/sync/sync.mjs — after loading config, call fetchPlaylists, filter by blocklist, call fetchPlaylistItems for each playlist, call fetchVideoDetails for all video IDs, call mergePlaylists and mergeEpisodes, write data/playlists.json and data/episodes.json (skip writes if --dry-run), log summary of changes (FR-004, FR-005, FR-009, FR-014, FR-015)

**Checkpoint**: `node tools/sync/sync.mjs` fetches from YouTube and writes merged episodes.json + playlists.json

---

## Phase 4: User Story 2 — Align Site Sections (Priority: P2)

**Goal**: Update episodes page section headings to match current playlist
display names from YouTube.

**Independent Test**: Rename a playlist on YouTube, run sync, verify
content/episodes.md section headings match.

- [x] T010 [US2] Implement content updater in tools/sync/lib/content.mjs — export updateEpisodesPage(playlists, filePath) that: reads content/episodes.md, matches `## ` headings to playlists by category ID mapping, rewrites headings when playlist name changed, appends new section with heading + placeholder description + episodes shortcode for newly discovered playlists, removes sections for blocklisted/deleted playlists, returns { renamed, added, removed } counts (FR-006)
- [x] T011 [US2] Wire content sync into tools/sync/sync.mjs — after episode/playlist sync, call updateEpisodesPage with merged playlists and path to content/episodes.md, include content changes in summary output, skip writes if --dry-run (FR-006, FR-009)

**Checkpoint**: Section headings in content/episodes.md match YouTube playlist names

---

## Phase 5: User Story 3 — Validate Top Spots (Priority: P3)

**Goal**: Verify rankings in toptastings.json reference valid episodes and
reflect YouTube playlist ordering.

**Independent Test**: Add a stale episode ID to toptastings.json, run sync,
verify it's removed and warning logged.

- [x] T012 [US3] Implement rankings validator in tools/sync/lib/rankings.mjs — export validateRankings(playlistItems, episodes, existingRankings) that: for each ranking type (alltime, seasonal), validates all episodeId references exist in current episodes, removes stale entries and logs warnings, updates rank values from YouTube playlist video position order, preserves manual fields (note, addedAt, season, currentSeason), returns { validated, staleRemoved, reordered } counts (FR-007, FR-008)
- [x] T013 [US3] Wire rankings validation into tools/sync/sync.mjs — after episode sync, call validateRankings with playlist items and merged episodes, write data/toptastings.json (skip if --dry-run), include rankings changes in summary output (FR-007, FR-008, FR-009)

**Checkpoint**: toptastings.json contains only valid episode references with correct rank order

---

## Phase 6: User Story 4 — CI Automation (Priority: P4)

**Goal**: Run sync tool automatically on deploy and on a daily schedule.

**Independent Test**: Trigger sync.yml workflow manually from GitHub Actions
UI and verify it runs sync, commits changes, and triggers deploy.

- [x] T014 [P] [US4] Add sync pre-build step to .github/workflows/deploy.yml — add Node.js setup step (actions/setup-node@v4 with node-version 20), add npm install step (working-directory: tools/sync), add sync step that runs `node tools/sync/sync.mjs` with YOUTUBE_API_KEY secret, place before the Hugo build step, allow sync failure to be non-blocking (continue-on-error: true) so deploy proceeds with stale data (FR-012, FR-014)
- [x] T015 [P] [US4] Create .github/workflows/sync.yml — scheduled workflow with daily cron (0 6 * * *), workflow_dispatch for manual triggers, checkout with submodules, setup Node.js 20, npm install in tools/sync, run sync tool with YOUTUBE_API_KEY secret, git diff check for changes, if changes: git add data/ content/episodes.md && git commit && git push to trigger deploy, use concurrency group 'pages' to prevent conflicts (FR-012)

**Checkpoint**: Sync runs on deploy and on daily schedule via GitHub Actions

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: CLI UX, testing, documentation

- [x] T016 Add summary output formatter to tools/sync/sync.mjs — collect all change counts from episodes, playlists, content, and rankings modules, format and print structured summary listing episodes added/removed/updated, playlists renamed/added/blocklisted, rankings validated/stale-removed, and any warnings (FR-013)
- [x] T017 [P] Write unit tests for config loader in tools/sync/test/config.test.mjs — test valid config loads correctly, test missing config file throws error, test missing YOUTUBE_API_KEY throws error, test invalid channelId format throws error, test blocklist validation
- [x] T018 [P] Write unit tests for episode merge in tools/sync/test/episodes.test.mjs — test new episodes added, test removed episodes deleted, test YouTube fields overwritten, test manual fields (popularity, tags) preserved, test multi-playlist video creates separate entries
- [x] T019 [P] Write unit tests for playlist merge in tools/sync/test/playlists.test.mjs — test existing playlist IDs preserved, test name/description updated from YouTube, test new playlist gets slugified ID, test blocklisted playlist excluded
- [x] T020 [P] Write unit tests for rankings validator in tools/sync/test/rankings.test.mjs — test valid references pass, test stale episodeId removed with warning, test rank order updated from playlist position, test manual fields (note, addedAt) preserved
- [x] T021 [P] Write unit tests for content updater in tools/sync/test/content.test.mjs — test heading renamed when playlist name changes, test new section appended for new playlist, test section removed for blocklisted playlist
- [x] T022 Update README.md with sync tool section — add "YouTube Playlist Sync" section covering: prerequisites (Node.js, API key), sync-config.json setup, running the tool locally, dry-run mode, CI automation overview, and troubleshooting per Constitution Principle VI
- [x] T023 Run full build verification — run `node tools/sync/sync.mjs --dry-run` then `hugo --minify` to verify the sync tool and Hugo build work together without errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — core sync pipeline
- **US2 (Phase 4)**: Depends on US1 (needs merged playlist data)
- **US3 (Phase 5)**: Depends on US1 (needs merged episode inventory)
- **US4 (Phase 6)**: Depends on US1 (tool must work before automating)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependencies on other stories
- **US2 (P2)**: Depends on US1 output (merged playlists) — must run after US1
- **US3 (P3)**: Depends on US1 output (merged episodes) — can run parallel with US2
- **US4 (P4)**: Depends on working sync tool — must run after US1 (can parallel with US2/US3)

### Within Each User Story

- Lib modules before sync.mjs wiring
- Data operations before content operations
- Core implementation before CI integration

### Parallel Opportunities

- T004 + T005 (config loader + YouTube client — different files)
- T007 + T008 (episode merge + playlist merge — different files)
- T010 can start after T008 completes (needs playlist data flow)
- T012 can start after T007 completes (needs episode data flow)
- T014 + T015 (deploy.yml + sync.yml — different files)
- T017–T021 (all test files — fully parallel)

---

## Parallel Example: User Story 1

```bash
# Launch episode and playlist merge modules in parallel:
Task: "Implement episode merge logic in tools/sync/lib/episodes.mjs"
Task: "Implement playlist merge logic in tools/sync/lib/playlists.mjs"

# Then wire them together (depends on both):
Task: "Wire episode and playlist sync into tools/sync/sync.mjs"
```

## Parallel Example: Polish Phase Tests

```bash
# Launch all test files in parallel:
Task: "Write unit tests for config loader in tools/sync/test/config.test.mjs"
Task: "Write unit tests for episode merge in tools/sync/test/episodes.test.mjs"
Task: "Write unit tests for playlist merge in tools/sync/test/playlists.test.mjs"
Task: "Write unit tests for rankings validator in tools/sync/test/rankings.test.mjs"
Task: "Write unit tests for content updater in tools/sync/test/content.test.mjs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (config + YouTube client)
3. Complete Phase 3: US1 (episode + playlist sync)
4. **STOP and VALIDATE**: Run sync tool, verify episodes.json + playlists.json
5. This delivers the core value — automated episode inventory rebuild

### Incremental Delivery

1. Setup + Foundational → Tool skeleton ready
2. Add US1 → Episode sync works → Test independently (MVP!)
3. Add US2 → Section headings stay in sync → Test independently
4. Add US3 → Rankings validated → Test independently
5. Add US4 → Full CI automation → Test independently
6. Polish → Tests + docs + build verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tool uses ESM modules (.mjs) throughout — no CommonJS
- YouTube API key comes from YOUTUBE_API_KEY env var, never from config file
- Existing data files (episodes.json, playlists.json, toptastings.json) are merge targets, not overwrite targets
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
