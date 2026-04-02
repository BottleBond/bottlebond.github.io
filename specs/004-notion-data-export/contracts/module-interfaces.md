# Module Interfaces: Notion Export Tool

**Feature Branch**: `004-notion-data-export`
**Date**: 2026-03-15

## Module Overview

```
tools/notion-export/
├── export.mjs              # CLI entry point (argument parsing, orchestration)
├── lib/
│   ├── config.mjs          # Token resolution and configuration loading
│   ├── client.mjs          # Notion API client wrapper with throttling
│   ├── discovery.mjs       # Workspace content discovery (search/enumerate)
│   ├── pages.mjs           # Page export (blocks, markdown conversion, metadata)
│   ├── databases.mjs       # Database export (schema, rows)
│   ├── comments.mjs        # Comment retrieval per page
│   ├── assets.mjs          # Asset download and URL rewriting
│   ├── markdown.mjs        # Notion-to-Markdown conversion with custom transformers
│   ├── filesystem.mjs      # Directory creation, file writing, path sanitization
│   └── logger.mjs          # Structured logging (info, warn, error, debug)
└── test/
    ├── config.test.mjs
    ├── discovery.test.mjs
    ├── pages.test.mjs
    ├── databases.test.mjs
    ├── comments.test.mjs
    ├── assets.test.mjs
    ├── markdown.test.mjs
    └── filesystem.test.mjs
```

## Module Contracts

### config.mjs

```javascript
/**
 * Resolve Notion token from CLI arg > env var > config file.
 * @param {object} options - CLI options
 * @param {string} [options.token] - Token from CLI argument
 * @returns {{ token: string, outputDir: string }}
 * @throws {Error} If no token found from any source
 */
export function resolveConfig(options) {}
```

### client.mjs

```javascript
/**
 * Create a throttled Notion API client.
 * Wraps @notionhq/client with rate limiting (~3 req/s).
 * @param {string} token - Notion integration token
 * @returns {NotionClient} Configured client with throttled methods
 */
export function createClient(token) {}
```

### discovery.mjs

```javascript
/**
 * Discover all pages and databases in the workspace.
 * Uses POST /v1/search with pagination.
 * @param {NotionClient} client
 * @returns {Promise<{ pages: PageRef[], databases: DatabaseRef[] }>}
 */
export async function discoverWorkspace(client) {}

/**
 * Build parent-child hierarchy from flat list of pages.
 * @param {PageRef[]} pages
 * @returns {TreeNode[]} Nested tree structure
 */
export function buildHierarchy(pages) {}
```

### pages.mjs

```javascript
/**
 * Export a single page: fetch blocks, convert to markdown, write file.
 * @param {NotionClient} client
 * @param {string} pageId
 * @param {string} outputPath - Directory to write page files
 * @param {object} options - { verbose: boolean }
 * @returns {Promise<PageExportResult>} Metadata about exported page
 */
export async function exportPage(client, pageId, outputPath, options) {}
```

### databases.mjs

```javascript
/**
 * Export a database: schema + all rows as individual pages.
 * @param {NotionClient} client
 * @param {string} databaseId
 * @param {string} outputPath
 * @param {object} options
 * @returns {Promise<DatabaseExportResult>}
 */
export async function exportDatabase(client, databaseId, outputPath, options) {}
```

### comments.mjs

```javascript
/**
 * Fetch all comments for a page.
 * @param {NotionClient} client
 * @param {string} pageId
 * @returns {Promise<Comment[]>}
 */
export async function fetchComments(client, pageId) {}

/**
 * Write comments to a JSON companion file.
 * @param {Comment[]} comments
 * @param {string} outputPath - Directory containing the page's index.md
 */
export async function writeComments(comments, outputPath) {}
```

### assets.mjs

```javascript
/**
 * Download an asset and return the local path.
 * Handles both Notion-hosted (expiring) and external URLs.
 * @param {string} url - Source URL
 * @param {string} assetDir - Local directory for assets
 * @param {string} blockId - Block ID (used for deduplication)
 * @returns {Promise<{ localPath: string, filename: string }>}
 */
export async function downloadAsset(url, assetDir, blockId) {}

/**
 * Rewrite asset URLs in markdown content to local paths.
 * @param {string} markdown - Markdown content with remote URLs
 * @param {Map<string, string>} urlMap - Remote URL -> local path mapping
 * @returns {string} Markdown with local asset paths
 */
export function rewriteAssetUrls(markdown, urlMap) {}
```

### markdown.mjs

```javascript
/**
 * Configure notion-to-md with custom transformers for complex block types.
 * @param {NotionClient} client
 * @returns {NotionToMarkdown} Configured converter
 */
export function createMarkdownConverter(client) {}

/**
 * Convert a page's blocks to markdown string.
 * @param {NotionToMarkdown} converter
 * @param {string} pageId
 * @returns {Promise<string>} Markdown content
 */
export async function convertPageToMarkdown(converter, pageId) {}
```

### filesystem.mjs

```javascript
/**
 * Create a timestamped snapshot directory.
 * @param {string} baseDir - Base output directory (e.g., "data/notion")
 * @returns {string} Full path to created snapshot directory
 */
export function createSnapshotDir(baseDir) {}

/**
 * Sanitize a Notion page title for use as a directory/file name.
 * @param {string} title
 * @returns {string} Safe filename
 */
export function sanitizeFilename(title) {}

/**
 * Write the export manifest JSON.
 * @param {string} snapshotDir
 * @param {ExportManifest} manifest
 */
export async function writeManifest(snapshotDir, manifest) {}

/**
 * Clean up a partial/failed export directory.
 * @param {string} snapshotDir
 */
export async function cleanupFailedExport(snapshotDir) {}
```

### logger.mjs

```javascript
/**
 * Create a logger with optional verbose mode.
 * @param {object} options - { verbose: boolean }
 * @returns {{ info, warn, error, debug }} Logger methods
 */
export function createLogger(options) {}
```
