# Research: Notion Data Export

**Feature Branch**: `004-notion-data-export`
**Date**: 2026-03-15

## Decision 1: API Client Library

**Decision**: Use `@notionhq/client` (official Notion SDK for Node.js)

**Rationale**: Official SDK with full TypeScript types, built-in pagination helpers (`iteratePaginatedAPI`, `collectPaginatedAPI`), automatic retry with exponential backoff + jitter (default 2 retries), and type guards (`isFullPage`, `isFullBlock`). Covers all endpoints needed: pages, databases, blocks, comments, search, users. Requires Node 18+.

**Alternatives considered**:
- Raw HTTP requests: More control but reinvents pagination, retry, and typing
- Community SDKs: Less maintained and incomplete

## Decision 2: Markdown Conversion Library

**Decision**: Use `notion-to-md` with custom transformers for unsupported block types

**Rationale**: Covers ~80% of block types out of the box (headings, paragraphs, lists, code, quotes, callouts, images, tables, dividers, embeds, bookmarks, files, toggles). Extensible via `setCustomTransformer(blockType, fn)` for gaps. Returns structured `{ parent, children }` objects preserving hierarchy.

**Alternatives considered**:
- `@tryfabric/martian`: Wrong direction — converts Markdown TO Notion blocks, not FROM
- Custom converter from scratch: High effort, reinvents what `notion-to-md` already handles

## Decision 3: Workspace Traversal Strategy

**Decision**: Use `POST /v1/search` (paginated) to discover all pages and databases, then recursively fetch blocks via `GET /v1/blocks/{id}/children`

**Rationale**: Search is the only way to discover all content shared with the integration. Blocks endpoint returns only immediate children, so recursive traversal is required (check `has_children` on each block). Comments require a separate `GET /v1/comments` call per page.

**Key endpoints**:
| Endpoint | Purpose |
|----------|---------|
| `POST /v1/search` | Discover all pages and databases |
| `GET /v1/pages/{id}` | Page metadata and properties |
| `GET /v1/blocks/{id}/children` | Page content (recursive) |
| `POST /v1/databases/{id}/query` | Database rows |
| `GET /v1/databases/{id}` | Database schema |
| `GET /v1/comments` | Page/block comments |
| `GET /v1/users` | Resolve user mentions |

## Decision 4: Asset Download Strategy

**Decision**: Download assets inline during block traversal (not in a separate pass)

**Rationale**: Notion-hosted file URLs expire after 1 hour (signed URLs with `expiry_time`). If assets are collected first and downloaded later, early URLs may have expired. External URLs are permanent and safe to defer, but for simplicity, download everything inline.

**File types**:
| Source | URL Lifetime | Strategy |
|--------|-------------|----------|
| Notion-hosted (`type: "file"`) | 1 hour | Download immediately |
| External (`type: "external"`) | Permanent | Download inline for consistency |

## Decision 5: Rate Limiting Strategy

**Decision**: SDK built-in retry + custom request throttle targeting ~3 req/s

**Rationale**: Notion API rate limit is 3 requests/second average per integration. The SDK handles 429 responses automatically with retry. Adding a custom throttle (e.g., via `p-limit` with concurrency 3) prevents hitting 429s in the first place.

**Expected performance**: A workspace with 1,000 pages, each requiring ~3-5 API calls, means 3,000-5,000 calls at ~3/s = 15-30 minutes.

**Constraints**:
- Max 100 items per paginated response
- Max 1,000 blocks per payload
- Rich text per property: 2,000 characters

## Decision 6: Project Structure Pattern

**Decision**: Follow established `tools/` pattern as `tools/notion-export/` with isolated `package.json`

**Rationale**: The 002-youtube-playlist-sync feature established the pattern of isolated tool directories under `tools/` with their own `package.json` and ESM modules (.mjs). Following the same pattern maintains consistency and avoids dependency conflicts.

**Alternatives considered**:
- Root-level `scripts/` directory: Inconsistent with existing project structure
- Global `package.json` at repo root: Would couple unrelated tools

## Decision 7: Block Type Handling

**Decision**: Use `notion-to-md` defaults for standard blocks, custom transformers for complex types, and placeholder markers for unsupported types

**Well-supported** (notion-to-md handles directly): paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, to_do, code, quote, divider, image, bookmark, table/table_row, toggle, callout

**Custom transformers needed**:
| Block Type | Approach |
|-----------|----------|
| column_list/column | Sequential output (no side-by-side in Markdown) |
| synced_block | Resolve to original block's children via `synced_from` reference |
| equation | Convert to LaTeX `$...$` or `$$...$$` |
| embed | Output as link or iframe HTML |
| audio/video/pdf/file | HTML tags or download links |
| child_page/child_database | Title with link to separate exported file |

**Unsupported blocks**: Output `[Unsupported: {block_type}]` placeholder per FR-012.

## Decision 8: Comment Export Format

**Decision**: Store comments as a separate section at the bottom of each page's Markdown file, or as a companion `_comments.json` file

**Rationale**: Comments are metadata/discussion, not content. Keeping them in a structured JSON companion file preserves author, timestamp, and threading information that would be lossy in Markdown. The Markdown file stays clean for future Hugo content merging.

## Decision 9: Configuration and Token Management

**Decision**: Support three token input methods with precedence: CLI argument > environment variable (`NOTION_TOKEN`) > gitignored config file (`.notion-config.json`)

**Rationale**: Per clarification session. Follows established pattern from YouTube sync which uses environment variables for API keys. Config file adds convenience for local development.
