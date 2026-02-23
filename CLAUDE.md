# BottleBond Podcast Website

## Project Overview
Premium bourbon and whiskey podcast website built with Hugo and the hugo-universal-theme, deployed to GitHub Pages at https://bottle.bond.

## Tech Stack
- **Static Site Generator**: Hugo
- **Theme**: hugo-universal-theme (in `themes/`)
- **Hosting**: GitHub Pages
- **Content**: Markdown files + JSON data files
- **Config**: `hugo.toml`

## Project Structure
- `content/` — Hugo content pages (episodes, about, glass-room, faq, contact)
- `data/` — JSON data files (episodes, hosts, guests, FAQs)
- `layouts/` — Custom Hugo template overrides
- `static/` — Static assets (images, CSS, JS)
- `themes/` — Hugo theme (hugo-universal-theme)
- `specs/` — SpecKit feature specifications
- `.specify/` — SpecKit templates, scripts, and memory
- `.claude/commands/` — SpecKit slash commands for spec-driven development

## SpecKit Workflow
This project uses spec-driven development via SpecKit. Available commands:
- `/speckit.specify` — Create or update a feature specification
- `/speckit.clarify` — Clarify spec requirements
- `/speckit.plan` — Generate an implementation plan from a spec
- `/speckit.tasks` — Break a plan into tasks
- `/speckit.implement` — Execute tasks from the plan
- `/speckit.checklist` — Create a validation checklist
- `/speckit.analyze` — Analyze the current spec/plan
- `/speckit.constitution` — Update the project constitution
- `/speckit.taskstoissues` — Convert tasks to GitHub issues

Specs live in `specs/<NNN>-<feature-name>/` with spec.md, plan.md, tasks.md, and supporting files.

## Development
```bash
# Run local dev server
hugo server -D

# Build for production
hugo --minify
```

## Key Conventions
- Blog posts go in `content/glass-room/<era>/` with era-based folder organization
- Episode data is in `data/` as JSON; episodes reference YouTube video IDs
- Contact is mailto-based (website@bottle.bond), no form backend
- Design: vintage distillery aesthetic with earthy warm tones, copper/brass accents

## Active Technologies
- Hugo (Go-based static site generator); HTML templates (Go template language); CSS; JavaScript (vanilla ES6) + Hugo (extended edition, latest via GitHub Actions); hugo-universal-theme (Git submodule); Font Awesome (icons, bundled with theme) (001-bottlebond-podcast-site)
- Filesystem — JSON data files (`data/`), Markdown content files (`content/`), static assets (`static/`) (001-bottlebond-podcast-site)
- Node.js 20 LTS + `googleapis` (Google APIs Node.js client for YouTube (002-youtube-playlist-sync)
- JSON files in Hugo `data/` directory (`episodes.json`, (002-youtube-playlist-sync)
- Hugo (Go templates), CSS3 + hugo-universal-theme (marsala color variant) (003-branding-palette-update)
- Static files (CSS, PNG images) (003-branding-palette-update)

## Recent Changes
- 001-bottlebond-podcast-site: Added Hugo (Go-based static site generator); HTML templates (Go template language); CSS; JavaScript (vanilla ES6) + Hugo (extended edition, latest via GitHub Actions); hugo-universal-theme (Git submodule); Font Awesome (icons, bundled with theme)
