# Feature Specification: Notion Data Export

**Feature Branch**: `004-notion-data-export`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "We have a notion account. I'd like to extract 100% of the data from this account, and download it locally to this repo so that it can be merged in with other content at a later date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Notion Workspace Export (Priority: P1)

As a content manager, I want to export all content from our Notion workspace so that I have a complete local copy of all pages, databases, and assets stored in the repository for future content integration.

**Why this priority**: This is the core purpose of the feature — without a complete data extraction, nothing else matters. Having all Notion content locally ensures no data is lost and enables future content merging workflows.

**Independent Test**: Can be fully tested by running the export process against the Notion workspace and verifying that every page, database, and embedded asset is present in the local output directory.

**Acceptance Scenarios**:

1. **Given** valid Notion workspace credentials, **When** the export process runs, **Then** all pages (including nested subpages) are downloaded as individual files
2. **Given** a Notion workspace with databases, **When** the export process runs, **Then** all database entries and their properties are captured in a structured format
3. **Given** a Notion workspace with embedded images, files, and attachments, **When** the export process runs, **Then** all media assets are downloaded locally and references within content files point to the local copies
4. **Given** a Notion workspace with page and block comments, **When** the export process runs, **Then** all comments are captured alongside their parent pages
5. **Given** a Notion workspace with linked databases and synced blocks, **When** the export process runs, **Then** linked database references and synced block sources are preserved in the export

---

### User Story 2 - Organized Local Storage (Priority: P2)

As a content manager, I want the exported Notion data stored in an organized directory structure within the repository so that content can be easily browsed, reviewed, and selectively merged into the site later.

**Why this priority**: Without clear organization, the exported data becomes difficult to navigate and merge. A well-structured local layout directly enables the future content integration workflow.

**Independent Test**: Can be tested by examining the output directory structure after export and confirming it mirrors the Notion workspace hierarchy with clear naming conventions.

**Acceptance Scenarios**:

1. **Given** a completed export, **When** I browse the output directory, **Then** the folder structure reflects the Notion workspace hierarchy (workspaces, sections, pages, subpages)
2. **Given** exported content files, **When** I open any file, **Then** the content is in a human-readable format (Markdown) with metadata preserved
3. **Given** exported database content, **When** I review database files, **Then** each database is represented with its schema and all row data intact

---

### User Story 3 - Repeatable Export Process (Priority: P3)

As a content manager, I want to be able to re-run the export process at any time so that I can capture updates made in Notion since the last export.

**Why this priority**: Notion content evolves over time. Being able to re-export ensures the local copy stays current without manual effort.

**Independent Test**: Can be tested by running the export twice (with Notion content changes in between) and confirming the second run captures the updated content.

**Acceptance Scenarios**:

1. **Given** a previously completed export, **When** I run the export again, **Then** a new timestamped snapshot directory is created containing the full current state of the Notion workspace
2. **Given** multiple previous exports exist, **When** I browse the output directory, **Then** each snapshot is in its own dated subdirectory preserving a complete history of exports

---

### Edge Cases

- What happens when a Notion page contains unsupported block types (e.g., embedded third-party widgets)?
- How does the system handle pages with restricted permissions that the export credentials cannot access?
- What happens when embedded media files are externally hosted (e.g., linked images from other services)?
- How does the system handle very large databases (thousands of rows)?
- What happens if the Notion API rate limit is reached during export?
- What happens if the network connection is interrupted mid-export? → Any partial export is discarded; user re-runs the export from scratch.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept an integration token via three methods (in order of precedence): command-line argument, environment variable (`NOTION_TOKEN`), or a gitignored config file (e.g., `.notion-config.json`)
- **FR-002**: System MUST export all pages in the workspace, including all levels of nested subpages
- **FR-003**: System MUST export all databases, including their schemas (property names and types) and all row entries
- **FR-004**: System MUST convert Notion page content to Markdown format, preserving headings, lists, code blocks, tables, callouts, toggles, and other standard block types
- **FR-005**: System MUST download all embedded images and file attachments to a local assets directory
- **FR-006**: System MUST update content references (image URLs, file links) to point to the locally downloaded copies
- **FR-007**: System MUST preserve the Notion workspace hierarchy in the local directory structure
- **FR-008**: System MUST store Notion metadata (page ID, created time, last edited time, author) alongside each exported content file
- **FR-009**: System MUST handle rate limits gracefully by implementing appropriate retry and backoff behavior
- **FR-010**: System MUST store each export as a timestamped snapshot in a dedicated directory (e.g., `data/notion/YYYY-MM-DD-HHMMSS/`), preserving all previous exports
- **FR-011**: System MUST log progress during export so the user can monitor which pages and databases are being processed
- **FR-012**: System MUST handle unsupported block types by preserving them as descriptive placeholders rather than silently dropping content
- **FR-013**: System MUST export all page-level and block-level comments, associating them with their parent page in the output
- **FR-014**: System MUST export linked database references, recording the source database and any applied filters/sorts
- **FR-015**: System MUST export synced block sources, preserving the original content and noting the sync relationship
- **FR-016**: System MUST be invocable as a standalone script within the repository (e.g., `scripts/export-notion.js`), requiring no global installation

### Key Entities

- **Page**: A Notion page with title, content blocks, metadata (ID, timestamps, parent), and optional child pages
- **Database**: A Notion database with a schema (property definitions) and rows (page entries with property values)
- **Asset**: An embedded image, file, or attachment with a source URL, local file path, and parent page reference
- **Comment**: A page-level or block-level comment with author, timestamp, content, and parent reference
- **Linked Database**: A database view referencing a source database, with optional filters and sort configuration
- **Synced Block**: A block whose content originates from another page, with a reference to the source block
- **Workspace**: The top-level Notion workspace containing all pages, databases, comments, and synced content, represented as the root of the export directory

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of accessible Notion pages are exported — the count of locally exported pages matches the count of pages in the Notion workspace
- **SC-002**: 100% of database entries are captured — row counts in local database files match Notion source databases
- **SC-003**: All embedded images and file attachments are downloaded — no broken or missing asset references in exported content
- **SC-004**: Exported Markdown files are human-readable and preserve the structural formatting of the original Notion content
- **SC-005**: The export process can be re-run successfully, capturing any content changes made since the previous export
- **SC-006**: The export completes for the full workspace without manual intervention (handles rate limits and retries automatically)

## Clarifications

### Session 2026-03-15

- Q: When re-running the export, should it overwrite previous data, write in-place, or create timestamped snapshots? → A: Timestamped snapshots — each export goes into a dated subdirectory, preserving all history locally.
- Q: Which Notion content types are in scope beyond pages and databases? → A: Everything possible — pages, databases, comments, linked database references, and synced block sources.
- Q: How should the integration token be provided? → A: All three methods — environment variable, config file (gitignored), and command-line argument. Precedence: CLI arg > env var > config file.
- Q: How should the system handle network failures mid-export? → A: Restart from scratch — any interrupted export is discarded and user re-runs from the beginning.
- Q: How should users invoke the export? → A: Standalone script in the repo (e.g., `scripts/export-notion.js`) run directly with `node`.

## Assumptions

- The Notion workspace is accessible via the Notion API using an integration token provided via CLI argument, environment variable, or gitignored config file (user sets up the Notion integration)
- The integration token has read access to all pages and databases intended for export
- Content will be exported as Markdown, which is the most compatible format for future Hugo content integration
- Database entries will be exported as individual Markdown files with frontmatter containing property values, plus a schema file per database
- Each export creates a new timestamped snapshot directory under `data/notion/` (e.g., `data/notion/2026-03-15-143022/`), preserving all previous exports for historical comparison
- Rate limit handling will use exponential backoff as recommended by the Notion API documentation
- Externally hosted media (not uploaded to Notion) will be downloaded where possible; if inaccessible, a placeholder with the original URL will be preserved

## Scope

### In Scope

- Full export of all pages, databases, comments, linked databases, synced blocks, and assets from the Notion workspace
- Conversion of Notion content to Markdown format
- Local download of all embedded media and file attachments
- Organized directory structure mirroring Notion workspace hierarchy
- Metadata preservation (page IDs, timestamps)
- Repeatable export process

### Out of Scope

- Real-time synchronization between Notion and the repository
- Automatic merging of exported content into Hugo site structure
- Two-way sync (pushing local changes back to Notion)
- Export of Notion workspace settings, permissions, or user management data
- Incremental/differential exports (each run is a full export)
