# Notion Content Pipeline

This directory receives Markdown files exported from Notion for curation into the BottleBond Hugo site.

## Manual Markdown Drop Workflow

1. **Export from Notion**: Use Notion's "Export" feature to save pages as Markdown (.md) files.
2. **Drop files here**: Place the exported `.md` files into this `notion-inbox/` directory.
3. **Run the curation script**: Use the `tools/notion/curate.mjs` script to process files:

```bash
# Process a file as a guide
node tools/notion/curate.mjs --content-type guide notion-inbox/my-article.md

# Process a file as a how-to
node tools/notion/curate.mjs --content-type how-to notion-inbox/my-article.md

# Process a file as an era article
node tools/notion/curate.mjs --content-type era notion-inbox/my-article.md

# Process a file as a glossary entry
node tools/notion/curate.mjs --content-type glossary notion-inbox/my-article.md
```

4. **Review**: The script adds Hugo front matter and moves the file to the appropriate `content/glass-room/` subdirectory. Review the generated front matter and edit as needed.
5. **Build**: Run `hugo server -D` to preview, then `hugo --minify` for production.

## Directory Mapping

| `--content-type` | Target directory |
|---|---|
| `era` | `content/glass-room/homework/` (default era) |
| `guide` | `content/glass-room/guides/` |
| `glossary` | `content/glass-room/glossary/` |
| `how-to` | `content/glass-room/how-to/` |

## Notes

- The curation script auto-detects the title from the first `#` heading in the Markdown file.
- If no heading is found, the filename (without extension) is used as the title.
- Files are slugified for Hugo-friendly URLs.
- Binary assets (images) referenced in Notion exports should be placed in `static/img/notion/` and paths updated manually.
