# Feature Specification: YouTube Playlist Sync

**Feature Branch**: `002-youtube-playlist-sync`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "A small tool that runs on every deployment and on a schedule via GitHub Actions. It rebuilds the episode inventory from YouTube playlists, ensures site sections match playlist names, ensures top spots per playlist are properly linked, and reads the YouTube channel from a config file."

## Clarifications

### Session 2026-02-19

- Q: Should the tool sync all playlists on the channel, only a whitelist, or all with a blocklist? → A: Auto-discover all playlists on the channel, with a configurable blocklist in the config file to exclude specific playlists.
- Q: Should episode IDs be YouTube video IDs or custom generated IDs? → A: Use the YouTube video ID as the canonical episode ID. Existing custom IDs (e.g., `ep_main_001`) will be migrated to YouTube video IDs on first sync.
- Q: When a field exists in both YouTube data and the local file, which source wins? → A: YouTube always wins for YouTube-native fields (title, description, thumbnail, duration, publish date). Manual-only fields (popularity, tags, editorial notes) are preserved because YouTube never provides them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sync Episode Inventory from YouTube (Priority: P1)

As a site maintainer, I want the tool to automatically fetch all videos from
each YouTube playlist on the channel (excluding any blocklisted playlists) and
rebuild the episode data file so that the website always reflects the current
state of our YouTube content without manual data entry.

**Why this priority**: This is the core purpose of the tool. Without episode
sync, the remaining stories have nothing to operate on.

**Independent Test**: Run the tool once, then verify that the output episode
data file contains every video present in the non-blocklisted YouTube
playlists, with correct titles, descriptions, YouTube video IDs, durations,
thumbnails, and publish dates.

**Acceptance Scenarios**:

1. **Given** the YouTube channel has 5 playlists with a combined 12 videos and
   no playlists are blocklisted,
   **When** the sync tool runs,
   **Then** the episode data file contains exactly 12 episode entries, each
   associated with its correct playlist.

2. **Given** a new video was added to the "History & Education" playlist on
   YouTube since the last sync,
   **When** the sync tool runs,
   **Then** the new video appears in the episode data with the correct playlist
   association and metadata.

3. **Given** a video was removed from a YouTube playlist since the last sync,
   **When** the sync tool runs,
   **Then** the removed video no longer appears in the episode data under that
   playlist.

4. **Given** a video's title or description was updated on YouTube,
   **When** the sync tool runs,
   **Then** the episode data reflects the updated metadata.

5. **Given** a playlist is listed in the blocklist in the config file,
   **When** the sync tool runs,
   **Then** that playlist is skipped entirely and none of its videos appear in
   the episode data.

---

### User Story 2 - Align Site Sections with Playlist Names (Priority: P2)

As a site maintainer, I want the tool to ensure that each section on the
episodes page uses the display name from the corresponding playlist definition,
so that naming stays consistent between YouTube and the website without manual
upkeep.

**Why this priority**: Consistency between YouTube and the site prevents
confusion for visitors navigating between the two. Depends on US1 having
current playlist data.

**Independent Test**: Change a playlist's display name in the playlist data,
run the tool, and verify the episodes page section heading matches the new name.

**Acceptance Scenarios**:

1. **Given** the playlist data defines a playlist named "History & Education",
   **When** the sync tool runs,
   **Then** the corresponding section heading on the episodes page reads
   "History & Education".

2. **Given** a playlist was renamed from "Tastings" to "Tastings & Reviews" in
   the playlist data (as updated from YouTube),
   **When** the sync tool runs,
   **Then** the episodes page section heading updates to "Tastings & Reviews".

3. **Given** a new playlist is discovered on YouTube that is not blocklisted
   and does not yet have a corresponding section on the episodes page,
   **When** the sync tool runs,
   **Then** the tool reports the new playlist and adds a section for it on the
   episodes page.

---

### User Story 3 - Validate Top Spots per Playlist (Priority: P3)

As a site maintainer, I want the tool to verify that the featured/top episodes
for each playlist reference valid, currently-published videos and that their
rankings reflect the playlist order on YouTube, so that visitors always see
accurate recommendations.

**Why this priority**: Broken or stale top-episode links degrade user trust.
This depends on US1 providing the current episode inventory.

**Independent Test**: Intentionally reference a non-existent episode ID in the
rankings data, run the tool, and confirm it reports the broken reference and
replaces it with the correct top-ranked episode from the playlist.

**Acceptance Scenarios**:

1. **Given** the rankings data references episode IDs that all exist in the
   current episode inventory,
   **When** the sync tool runs,
   **Then** the tool reports all links valid with no changes needed.

2. **Given** the rankings data references an episode ID that no longer exists
   in the episode inventory (video was removed from YouTube),
   **When** the sync tool runs,
   **Then** the tool removes the stale entry, promotes the next-ranked episode,
   and logs a warning.

3. **Given** the order of videos in a YouTube playlist has changed,
   **When** the sync tool runs,
   **Then** the rankings data for that playlist updates to reflect the new
   YouTube playlist order.

---

### User Story 4 - Run on Deployment and on Schedule (Priority: P4)

As a site maintainer, I want the sync tool to run automatically on every deploy
and also on a configurable schedule via GitHub Actions so that episode data
stays current without manual intervention.

**Why this priority**: Automation is what turns the tool from a manual utility
into a hands-off workflow. Lower priority because the tool must work correctly
before it can be automated.

**Independent Test**: Trigger the GitHub Actions workflow manually and confirm
it runs the sync tool, commits any data changes, and triggers a site rebuild.

**Acceptance Scenarios**:

1. **Given** the GitHub Actions workflow is configured with a daily schedule,
   **When** the schedule triggers,
   **Then** the sync tool runs, updates data files if needed, commits changes,
   and triggers a site deployment.

2. **Given** the site is being deployed (push to main),
   **When** the deployment pipeline runs,
   **Then** the sync tool runs as a pre-build step and the site is built with
   the freshly synced data.

3. **Given** the sync tool runs but no data has changed since the last sync,
   **When** the workflow completes,
   **Then** no commit is created and the deployment proceeds with existing data.

---

### Edge Cases

- What happens when the YouTube API is temporarily unavailable? The tool MUST
  fail gracefully and preserve existing data files unchanged. The deployment
  MUST proceed with stale data rather than failing entirely.
- What happens when a YouTube API quota is exceeded? The tool MUST log the
  quota error and skip the sync, preserving existing data.
- What happens when a playlist is empty on YouTube? The tool MUST write an
  empty episode list for that playlist and log a warning.
- What happens when a video appears in multiple playlists? The tool MUST create
  one episode entry per playlist association (a video can belong to multiple
  sections).
- What happens when the config file is missing or has an invalid channel ID?
  The tool MUST exit with a clear error message and non-zero exit code before
  attempting any API calls.
- What happens when a previously synced playlist is added to the blocklist?
  The tool MUST remove episodes that belong only to the blocklisted playlist
  and remove its section from the episodes page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The tool MUST read the YouTube channel identifier and playlist
  blocklist from a dedicated configuration file stored in the repository.
- **FR-002**: The tool MUST auto-discover all playlists for the configured
  YouTube channel, then exclude any playlists matching entries in the
  blocklist before syncing.
- **FR-003**: The tool MUST fetch all videos from each non-blocklisted
  playlist, including title, description, video ID, thumbnail URL, duration,
  and publish date.
- **FR-004**: The tool MUST write the fetched episode data to the site's
  episode data file in a format compatible with the existing Hugo data
  structure.
- **FR-005**: The tool MUST update the playlist data file with current playlist
  names and metadata from YouTube (excluding blocklisted playlists).
- **FR-006**: The tool MUST update the episodes page content so that each
  section heading matches the display name of its corresponding playlist.
- **FR-007**: The tool MUST validate that every episode ID referenced in the
  rankings data exists in the current episode inventory.
- **FR-008**: The tool MUST update rankings to reflect the current video order
  within each YouTube playlist.
- **FR-009**: The tool MUST log removed episodes, renamed playlists, new
  playlists, blocklisted playlists skipped, and broken ranking references as
  warnings.
- **FR-010**: YouTube-native fields (title, description, thumbnail URL,
  duration, publish date) MUST always be overwritten from YouTube on each
  sync. Manual-only fields not sourced from YouTube (e.g., `popularity`,
  `tags`, editorial `note`) MUST be preserved across syncs.
- **FR-011**: The tool MUST exit with a non-zero code on configuration errors
  (missing config, invalid channel) and exit with zero on successful sync
  (even if no changes were needed).
- **FR-012**: The tool MUST be runnable both locally from the command line and
  within a GitHub Actions workflow.
- **FR-013**: The tool MUST produce a summary output listing: episodes added,
  episodes removed, playlists renamed, playlists blocklisted, rankings
  updated, and any warnings.
- **FR-014**: The tool MUST not modify data files when the YouTube API is
  unreachable; existing data MUST be preserved.
- **FR-015**: The tool MUST support a dry-run mode that reports what changes
  would be made without writing any files.

### Key Entities

- **Episode**: A single video identified by its YouTube video ID (the
  canonical episode ID), with title, description, thumbnail URL, duration,
  publish date, playlist association, and optional editorial metadata
  (popularity score, notes).
- **Playlist**: A named collection of episodes with a YouTube playlist ID,
  display name, slug, description, and category identifier.
- **Rankings**: Ordered list of episode references per ranking type (seasonal
  and all-time), each with rank position, episode ID, date added, and
  optional editorial note.
- **Sync Configuration**: YouTube channel identifier, playlist blocklist,
  API credentials reference, and any tool-specific settings (e.g., schedule,
  dry-run default).

## Assumptions

- The YouTube Data API v3 is used for fetching channel, playlist, and video
  data. An API key is required and will be stored as a repository secret (not
  in the config file).
- The existing data file formats (`episodes.json`, `playlists.json`,
  `toptastings.json`) are the output targets. The tool merges YouTube data
  with existing files on each run: YouTube-native fields are overwritten,
  manual-only fields are preserved.
- Episode identity: The YouTube video ID is the canonical episode ID. The
  first sync will migrate existing custom IDs (e.g., `ep_main_001`) to
  YouTube video IDs. All rankings and cross-references will be updated to
  use video IDs.
- Playlist-to-section mapping uses the playlist `id` field (e.g., `main`,
  `education`, `tastings`) as the key linking playlist data to episode page
  sections.
- The "top spots" per playlist are determined by the video ordering within
  each YouTube playlist — the first N videos in a playlist are considered the
  top-ranked episodes for that playlist.
- The tool runs in the repository root directory and expects Hugo's `data/`
  and `content/` directories at their standard locations.
- Playlists are auto-discovered from the YouTube channel. The config file
  contains an optional blocklist of YouTube playlist IDs to exclude from
  sync. Any playlist not in the blocklist is synced.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a sync run, 100% of videos currently in the channel's
  non-blocklisted YouTube playlists are represented in the site's episode data.
- **SC-002**: After a sync run, every section heading on the episodes page
  matches its corresponding playlist display name exactly.
- **SC-003**: After a sync run, 0 episode IDs in the rankings data reference
  videos that do not exist in the episode inventory.
- **SC-004**: The sync tool completes a full run (fetch, merge, write) in
  under 60 seconds for a channel with up to 500 videos across all playlists.
- **SC-005**: When the YouTube API is unavailable, the tool preserves all
  existing data files with zero modifications and the site deploys
  successfully.
- **SC-006**: A new contributor can run the sync tool locally within 5 minutes
  of reading the setup instructions, given a valid API key.
