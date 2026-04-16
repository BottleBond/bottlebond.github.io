# Tasks: Notion Data Export

**Input**: Design documents from `/specs/004-notion-data-export/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included per Constitution Principle III (Testable & Continuous Delivery).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Tool directory**: `tools/notion-export/` (isolated package, following `tools/sync/` pattern)
- **Library modules**: `tools/notion-export/lib/`
- **Tests**: `tools/notion-export/test/`
- **Output**: `data/notion/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [ ] T001 Create project directory structure: `tools/notion-export/`, `tools/notion-export/lib/`, `tools/notion-export/test/`
- [ ] T002 Initialize `tools/notion-export/package.json` with ESM type, Node 20 engine, dependencies (`@notionhq/client`, `notion-to-md`, `p-limit`), and test/export scripts
- [ ] T003 Add `.notion-config.json` to root `.gitignore` and add `data/notion/` to `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure modules shared by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Implement logger module in `tools/notion-export/lib/logger.mjs` — createLogger with info/warn/error/debug methods, verbose toggle, `[INFO]`/`[WARN]`/`[ERROR]`/`[DEBUG]` prefixes per CLI contract
- [ ] T005 [P] Implement config module in `tools/notion-export/lib/config.mjs` — resolveConfig with three-source token resolution (CLI arg > `NOTION_TOKEN` env > `.notion-config.json` file), outputDir default to `data/notion`
- [ ] T006 [P] Implement filesystem module in `tools/notion-export/lib/filesystem.mjs` — sanitizeFilename (strip unsafe chars, handle unicode, truncate long names), createSnapshotDir, writeManifest, cleanupFailedExport
- [ ] T007 Implement client module in `tools/notion-export/lib/client.mjs` — createClient wrapping `@notionhq/client` with `p-limit` throttle at 3 concurrent requests for rate limiting per research Decision 5
- [ ] T008 [P] Write unit test for config module in `tools/notion-export/test/config.test.mjs` — test all three token sources and precedence order
- [ ] T009 [P] Write unit test for filesystem module in `tools/notion-export/test/filesystem.test.mjs` — test sanitizeFilename with special chars, unicode, empty strings, long titles; test createSnapshotDir creates timestamped directory

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Full Notion Workspace Export (Priority: P1) 🎯 MVP

**Goal**: Export all pages, databases, assets, comments, linked databases, and synced blocks from the Notion workspace to local files

**Independent Test**: Run the export against a Notion workspace and verify that the count of exported pages/databases matches the workspace, all assets are downloaded, and comments are captured

### Tests for User Story 1

- [ ] T010 [P] [US1] Write unit test for discovery module in `tools/notion-export/test/discovery.test.mjs` — mock search API pagination, verify all pages and databases returned, test buildHierarchy with nested parent-child relationships
- [ ] T011 [P] [US1] Write unit test for markdown module in `tools/notion-export/test/markdown.test.mjs` — test custom transformers for synced_block, column_list, equation, embed, audio/video/pdf/file block types; test unsupported block placeholder output
- [ ] T012 [P] [US1] Write unit test for assets module in `tools/notion-export/test/assets.test.mjs` — test downloadAsset with Notion-hosted and external URLs, test rewriteAssetUrls replacing remote URLs with local paths
- [ ] T013 [P] [US1] Write unit test for comments module in `tools/notion-export/test/comments.test.mjs` — test fetchComments pagination, test writeComments JSON output format matching data-model Comment entity
- [ ] T014 [P] [US1] Write unit test for pages module in `tools/notion-export/test/pages.test.mjs` — test exportPage produces Markdown with YAML frontmatter containing all metadata fields (notion_id, title, timestamps, parent info, notion_url)
- [ ] T015 [P] [US1] Write unit test for databases module in `tools/notion-export/test/databases.test.mjs` — test exportDatabase produces _schema.json and per-row Markdown files with property values as frontmatter

### Implementation for User Story 1

- [ ] T016 [P] [US1] Implement discovery module in `tools/notion-export/lib/discovery.mjs` — discoverWorkspace using paginated `POST /v1/search`, buildHierarchy to create parent-child tree from flat page list
- [ ] T017 [P] [US1] Implement markdown module in `tools/notion-export/lib/markdown.mjs` — createMarkdownConverter configuring `notion-to-md` with custom transformers for column_list (sequential output), synced_block (resolve via `synced_from`), equation (LaTeX), embed/audio/video/pdf/file (HTML tags/links), child_page/child_database (title + link); unsupported blocks output `[Unsupported: {block_type}]` per FR-012
- [ ] T018 [P] [US1] Implement assets module in `tools/notion-export/lib/assets.mjs` — downloadAsset handling both Notion-hosted (expiring) and external URLs with fetch, saving to `_assets/` directory with blockId-based deduplication; rewriteAssetUrls replacing remote URLs with relative local paths in Markdown content; write `_assets/_manifest.json` per data-model
- [ ] T019 [P] [US1] Implement comments module in `tools/notion-export/lib/comments.mjs` — fetchComments using paginated `GET /v1/comments` per page, writeComments serializing to `_comments.json` with id, parent_block_id, author, created_time, text fields per data-model
- [ ] T020 [US1] Implement pages module in `tools/notion-export/lib/pages.mjs` — exportPage that fetches page metadata via `GET /v1/pages/{id}`, converts blocks to Markdown via markdown.mjs, downloads assets inline during conversion (per research Decision 4 — URLs expire in 1 hour), writes index.md with YAML frontmatter (notion_id, title, parent_id, parent_type, timestamps, notion_url per data-model), calls fetchComments and writeComments
- [ ] T021 [US1] Implement databases module in `tools/notion-export/lib/databases.mjs` — exportDatabase that fetches schema via `GET /v1/databases/{id}`, writes `_schema.json` per data-model, queries all rows via paginated `POST /v1/databases/{id}/query`, exports each row as a Markdown file with database properties as frontmatter
- [ ] T022 [US1] Implement CLI entry point in `tools/notion-export/export.mjs` — parse CLI arguments (--token, --output, --dry-run, --verbose, --help per CLI contract), resolve config, create client, run discovery, export all pages and databases with progress logging per FR-011, handle errors with exit codes (1=auth, 2=network, 3=filesystem per CLI contract), cleanup partial export on failure
- [ ] T023 [US1] Add progress logging to export orchestration in `tools/notion-export/export.mjs` — log page/database counts after discovery, log per-item progress `(N/total) Title`, log final summary with counts and duration per CLI contract output format

**Checkpoint**: Core export pipeline works — can export all Notion content to local files

---

## Phase 4: User Story 2 — Organized Local Storage (Priority: P2)

**Goal**: Output a well-organized directory structure that mirrors the Notion workspace hierarchy with human-readable Markdown and rich metadata

**Independent Test**: Run export and verify directory structure mirrors Notion hierarchy, Markdown files are human-readable with metadata, and database schemas are intact

### Implementation for User Story 2

- [ ] T024 [US2] Enhance buildHierarchy in `tools/notion-export/lib/discovery.mjs` — ensure hierarchy correctly handles workspace-level pages, nested subpages at arbitrary depth, and databases as children of pages; output ordered tree for directory creation
- [ ] T025 [US2] Enhance exportPage in `tools/notion-export/lib/pages.mjs` — create nested subdirectories for child pages matching Notion hierarchy (Page Title/Subpage Title/index.md), use sanitizeFilename for directory names, handle duplicate titles by appending page ID suffix
- [ ] T026 [US2] Enhance exportDatabase in `tools/notion-export/lib/databases.mjs` — place database directory within parent page's directory per hierarchy, name row files using sanitized title property, handle linked database references per FR-014 by recording source database ID and filters in the page Markdown
- [ ] T027 [US2] Add synced block resolution in `tools/notion-export/lib/markdown.mjs` — when a synced_block has `synced_from` reference, fetch the original block's children and inline them with a metadata comment noting the sync relationship per FR-015
- [ ] T028 [US2] Add users lookup in `tools/notion-export/export.mjs` — fetch workspace users via `GET /v1/users` at start of export, write `_users.json` to snapshot root, resolve user IDs to names in page metadata (created_by, last_edited_by) and comment authors

**Checkpoint**: Export output is well-organized with hierarchy, rich metadata, and human-readable files

---

## Phase 5: User Story 3 — Repeatable Export Process (Priority: P3)

**Goal**: Enable re-running the export at any time, creating timestamped snapshots that preserve export history

**Independent Test**: Run export twice, verify two separate timestamped snapshot directories exist with independent complete copies

### Implementation for User Story 3

- [ ] T029 [US3] Implement timestamped snapshot creation in `tools/notion-export/export.mjs` — use createSnapshotDir to generate `YYYY-MM-DD-HHMMSS` directory under output base, write all export output into snapshot directory
- [ ] T030 [US3] Implement export manifest in `tools/notion-export/export.mjs` — write `export-manifest.json` to snapshot root at export completion with timestamp, workspaceId, pageCount, databaseCount, assetCount, status per data-model ExportSnapshot entity
- [ ] T031 [US3] Implement failed export cleanup in `tools/notion-export/export.mjs` — on unrecoverable error (network failure, auth failure), call cleanupFailedExport to remove the partial snapshot directory per clarification (restart from scratch, discard partial)
- [ ] T032 [US3] Implement dry-run mode in `tools/notion-export/export.mjs` — when `--dry-run` flag is set, run discovery and log workspace contents (page/database titles and counts) without creating snapshot directory or downloading any content

**Checkpoint**: Export is fully repeatable with timestamped snapshots and safe failure handling

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, edge cases, and integration improvements

- [ ] T033 [P] Update root `README.md` with Notion export tool section — add tool description, quickstart reference, and `node tools/notion-export/export.mjs` usage example (per Constitution Principle VI)
- [ ] T034 [P] Add edge case handling across modules — handle inaccessible pages (log warning, skip, continue per edge case), handle externally hosted media that fails to download (preserve original URL as placeholder per assumption), handle very large databases with paginated query (already via SDK pagination helpers)
- [ ] T035 Run `tools/notion-export/test/` full test suite with `node --test` and fix any failures
- [ ] T036 Run quickstart.md validation — follow quickstart steps end-to-end against a real Notion workspace to verify instructions are accurate and complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on US1 core modules existing (enhances them)
- **User Story 3 (Phase 5)**: Depends on US1 core export pipeline
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Enhances US1 modules — can start after US1 core implementation (T016-T023) is complete
- **User Story 3 (P3)**: Wraps US1 export pipeline — can start after US1 is complete; can run in parallel with US2

### Within Each Phase

- Tests MUST be written and FAIL before implementation (within US1)
- Foundation modules (config, filesystem, logger) before client
- Discovery before pages/databases (needs workspace content list)
- Markdown converter before pages (pages depend on conversion)
- Assets module before pages (pages download assets inline)
- Pages and databases before CLI orchestration

### Parallel Opportunities

**Phase 2 (Foundational)**: T004, T005, T006 can all run in parallel (different files, no dependencies). T008, T009 can run in parallel with each other.

**Phase 3 US1 Tests**: T010–T015 can ALL run in parallel (different test files).

**Phase 3 US1 Implementation**: T016, T017, T018, T019 can all run in parallel (different lib modules). T020 and T021 depend on earlier modules. T022 depends on all modules.

**Phase 5 + Phase 4**: US3 (T029–T032) can run in parallel with US2 (T024–T028) since they modify different aspects.

**Phase 6**: T033 and T034 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together (all different files):
Task: T010 "Unit test for discovery in test/discovery.test.mjs"
Task: T011 "Unit test for markdown in test/markdown.test.mjs"
Task: T012 "Unit test for assets in test/assets.test.mjs"
Task: T013 "Unit test for comments in test/comments.test.mjs"
Task: T014 "Unit test for pages in test/pages.test.mjs"
Task: T015 "Unit test for databases in test/databases.test.mjs"

# Launch independent implementation modules together:
Task: T016 "Discovery module in lib/discovery.mjs"
Task: T017 "Markdown module in lib/markdown.mjs"
Task: T018 "Assets module in lib/assets.mjs"
Task: T019 "Comments module in lib/comments.mjs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T009)
3. Complete Phase 3: User Story 1 (T010–T023)
4. **STOP and VALIDATE**: Run export against real Notion workspace, verify page/database counts match
5. Deploy/demo if ready — core export works

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test with real workspace → MVP complete
3. Add User Story 2 → Verify organized hierarchy → Enhanced output
4. Add User Story 3 → Verify timestamped snapshots → Full feature
5. Polish → Documentation, edge cases → Production-ready

### Parallel Strategy

With US1 complete:
- Developer A: User Story 2 (hierarchy/formatting enhancements)
- Developer B: User Story 3 (snapshots/repeatability)
- Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constitution Principle III requires tests — included in US1 phase
- Critical: Assets must be downloaded inline during block traversal (URLs expire in 1 hour)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
