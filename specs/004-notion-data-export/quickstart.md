# Quickstart: Notion Data Export

## Prerequisites

- Node.js 20 LTS or later
- A Notion integration token ([create one here](https://www.notion.so/my-integrations))
  - The integration must be added to the workspace (or individual pages) you want to export

## Setup

```bash
# Navigate to the export tool
cd tools/notion-export

# Install dependencies
npm install
```

## Configure Token

Choose one of three methods:

### Option 1: Environment variable (recommended for CI)
```bash
export NOTION_TOKEN=ntn_your_token_here
```

### Option 2: Config file (recommended for local dev)
Create `.notion-config.json` in the repo root (already gitignored):
```json
{
  "token": "ntn_your_token_here"
}
```

### Option 3: CLI argument
```bash
node tools/notion-export/export.mjs --token ntn_your_token_here
```

## Run Export

```bash
# From repo root
node tools/notion-export/export.mjs

# With verbose logging
node tools/notion-export/export.mjs --verbose

# Dry run (see what would be exported without downloading)
node tools/notion-export/export.mjs --dry-run
```

## Output

Each export creates a timestamped snapshot:

```
data/notion/2026-03-15-143022/
├── export-manifest.json        # Export summary
├── Page Title/
│   ├── index.md                # Page content as Markdown
│   ├── _comments.json          # Discussion comments
│   └── _assets/                # Downloaded images/files
└── Database Title/
    ├── _schema.json            # Database structure
    └── Row Title.md            # Each row as Markdown
```

## Re-running

Each run creates a new snapshot — previous exports are preserved:

```
data/notion/
├── 2026-03-15-143022/    # First export
├── 2026-03-16-090000/    # Second export
└── 2026-03-20-141500/    # Third export
```

## Running Tests

```bash
cd tools/notion-export
npm test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No Notion token found" | Set token via any of the 3 methods above |
| "Could not find page" | Ensure integration is added to the workspace/pages in Notion |
| Rate limit warnings | Normal for large workspaces; tool handles this automatically |
| Export takes very long | Expected for large workspaces (~3 req/s API limit); check verbose logs for progress |
