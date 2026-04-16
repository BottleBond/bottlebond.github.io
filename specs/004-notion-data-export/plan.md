# Implementation Plan: Notion Data Export

**Branch**: `004-notion-data-export` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-notion-data-export/spec.md`

## Summary

Build a standalone Node.js CLI tool that exports 100% of a Notion workspace — pages, databases, comments, linked databases, synced blocks, and assets — to local Markdown files with metadata. Each export creates a timestamped snapshot under `data/notion/`. The tool follows the established `tools/` project pattern from the YouTube sync feature, using `@notionhq/client` for API access and `notion-to-md` for Markdown conversion.

## Technical Context

**Language/Version**: Node.js 20 LTS (ESM modules, .mjs)
**Primary Dependencies**: `@notionhq/client` (official Notion SDK), `notion-to-md` (Markdown conversion), `p-limit` (concurrency control)
**Storage**: Filesystem — Markdown files, JSON metadata, binary assets under `data/notion/`
**Testing**: Node.js built-in test runner (`node --test`)
**Target Platform**: macOS/Linux CLI (developer workstation)
**Project Type**: Single CLI tool (isolated under `tools/notion-export/`)
**Performance Goals**: Complete full workspace export within API rate limits (~3 req/s); no real-time requirements
**Constraints**: Notion API rate limit of 3 requests/second; Notion-hosted file URLs expire after 1 hour (must download inline)
**Scale/Scope**: Full workspace — potentially hundreds to thousands of pages and databases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applies? | Status | Notes |
|-----------|----------|--------|-------|
| I. Dynamic Content First | No | N/A | CLI export tool, not user-facing content rendering |
| II. Security By Default | Yes | PASS | Token stored outside repo (env var, gitignored config, or CLI arg per FR-001). No secrets in source control. |
| III. Testable & CD | Yes | PASS | Unit tests per module using Node.js test runner. Integration test with mock Notion responses. |
| IV. Observability & Error Handling | Yes | PASS | Structured logging per FR-011. User-friendly error messages with exit codes. No internal details leaked. |
| V. Accessibility & Performance | No | N/A | CLI tool, no UI |
| VI. Documentation Accompaniment | Yes | PASS | Quickstart guide provided. README update required in implementation. |

**Post-Phase 1 re-check**: All gates still pass. The design uses isolated `package.json` (no repo-level dependency changes), environment-based secrets, and comprehensive test structure.

## Project Structure

### Documentation (this feature)

```text
specs/004-notion-data-export/
├── plan.md              # This file
├── research.md          # Phase 0: technology research and decisions
├── data-model.md        # Phase 1: entity definitions and output format
├── quickstart.md        # Phase 1: setup and usage guide
├── contracts/
│   ├── cli-interface.md # CLI arguments, exit codes, output format
│   └── module-interfaces.md # Module function signatures
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
tools/notion-export/
├── package.json              # Isolated dependencies
├── export.mjs                # CLI entry point
├── lib/
│   ├── config.mjs            # Token resolution (CLI > env > config file)
│   ├── client.mjs            # Throttled Notion API client wrapper
│   ├── discovery.mjs         # Workspace content enumeration via search
│   ├── pages.mjs             # Page export (blocks → markdown + metadata)
│   ├── databases.mjs         # Database export (schema + rows)
│   ├── comments.mjs          # Comment retrieval and serialization
│   ├── assets.mjs            # Asset download and URL rewriting
│   ├── markdown.mjs          # notion-to-md with custom transformers
│   ├── filesystem.mjs        # Directory/file operations, path sanitization
│   └── logger.mjs            # Structured console logging
└── test/
    ├── config.test.mjs
    ├── discovery.test.mjs
    ├── pages.test.mjs
    ├── databases.test.mjs
    ├── comments.test.mjs
    ├── assets.test.mjs
    ├── markdown.test.mjs
    └── filesystem.test.mjs

data/notion/                   # Export output (timestamped snapshots)
└── YYYY-MM-DD-HHMMSS/
    ├── export-manifest.json
    └── ... (pages, databases, assets)
```

**Structure Decision**: Follows the established `tools/` pattern from `tools/sync/` (YouTube playlist sync). Isolated `package.json` with ESM modules (.mjs). Lib directory for modular components, test directory using Node.js built-in test runner. Output goes to `data/notion/` alongside existing `data/` JSON files.

## Complexity Tracking

No constitution violations to justify. The design uses a single-project CLI structure with standard patterns.
