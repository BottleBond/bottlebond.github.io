# CLI Interface Contract: Notion Export Tool

**Feature Branch**: `004-notion-data-export`
**Date**: 2026-03-15

## Invocation

```bash
# Basic usage (token from environment or config)
node tools/notion-export/export.mjs

# With token as CLI argument
node tools/notion-export/export.mjs --token ntn_xxxxxxxxxxxx

# With custom output directory
node tools/notion-export/export.mjs --output data/notion

# Dry run (list content without downloading)
node tools/notion-export/export.mjs --dry-run
```

## CLI Arguments

| Argument | Short | Required | Default | Description |
|----------|-------|----------|---------|-------------|
| `--token` | `-t` | No* | — | Notion integration token |
| `--output` | `-o` | No | `data/notion` | Base output directory |
| `--dry-run` | `-d` | No | `false` | List workspace contents without exporting |
| `--verbose` | `-v` | No | `false` | Enable verbose logging |
| `--help` | `-h` | No | — | Show usage information |

*Token is required but can be provided via `NOTION_TOKEN` env var or `.notion-config.json`.

## Token Resolution (precedence order)

1. `--token` CLI argument
2. `NOTION_TOKEN` environment variable
3. `.notion-config.json` file in repo root (gitignored)

## Config File Format

```json
{
  "token": "ntn_xxxxxxxxxxxx"
}
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Export completed successfully |
| 1 | Authentication error (invalid or missing token) |
| 2 | Network error (connection failed, unrecoverable) |
| 3 | Filesystem error (cannot write to output directory) |

## Output

### Console Output (stdout)

```
[INFO] Starting Notion export...
[INFO] Authenticated as: Workspace Name
[INFO] Discovering workspace content...
[INFO] Found 45 pages, 8 databases
[INFO] Exporting pages... (1/45) Episode Planning
[INFO] Exporting pages... (2/45) Guest Tracker Notes
...
[INFO] Exporting databases... (1/8) Guest Tracker
[INFO] Downloading assets... (1/23) image.png
...
[INFO] Export complete: data/notion/2026-03-15-143022/
[INFO] Pages: 45 | Databases: 8 | Assets: 23 | Duration: 4m 32s
```

### Verbose Output (with --verbose)

Additional detail per item:
```
[DEBUG] Fetching blocks for page abc123 (3 levels deep)
[DEBUG] Rate limit: sleeping 350ms before next request
[DEBUG] Downloading asset: https://... -> _assets/image1.png (245 KB)
[WARN] Unsupported block type 'column_list' in page abc123 — using sequential layout
[WARN] Skipping inaccessible page def456 — insufficient permissions
```

### Error Output (stderr)

```
[ERROR] No Notion token found. Provide via --token, NOTION_TOKEN env var, or .notion-config.json
[ERROR] Export failed: Network connection lost. Re-run to start a fresh export.
```
