# Quickstart: BottleBond Podcast Website

**Date**: 2026-02-15 | **Branch**: `001-bottlebond-podcast-site`

---

## Prerequisites

- **Hugo** (extended edition): Install via `brew install hugo` (macOS) or [Hugo releases](https://github.com/gohugoio/hugo/releases)
- **Git**: For submodule management
- **Node.js**: Not required (pure Hugo site)

## Setup

```bash
# Clone the repository
git clone https://github.com/bottlebond/bottlebond.github.io.git
cd bottlebond.github.io

# Initialize and fetch the theme submodule
git submodule update --init --recursive

# Verify Hugo is installed
hugo version
```

## Local Development

```bash
# Start development server (includes draft posts)
hugo server -D

# Access the site at http://localhost:1313/
```

The development server provides:
- Live reload on file changes
- Draft blog posts visible (`-D` flag)
- All shortcodes and data files rendered

## Build for Production

```bash
# Build static site (excludes drafts, minifies output)
hugo --minify

# Output goes to ./public/
```

## Project Layout

| Directory | Purpose |
|-----------|---------|
| `content/` | Pages and blog posts (Markdown) |
| `data/` | JSON data files (episodes, hosts, FAQs, playlists, rankings) |
| `layouts/shortcodes/` | Custom Hugo shortcodes (episodes, FAQs, hosts, featured-episode, top-tastings, youtube) |
| `layouts/` | Template overrides for the theme |
| `static/` | Static assets (CSS, JS, images) |
| `themes/hugo-universal-theme/` | Theme (Git submodule — do not edit directly) |
| `specs/` | SpecKit feature specifications |

## Key Files

| File | What It Does |
|------|-------------|
| `hugo.toml` | Hugo configuration, menu structure, widget settings, social links |
| `data/episodes.json` | All episode data (12 episodes with YouTube IDs, popularity scores) |
| `data/hosts.json` | Host and guest bios, photos, social links |
| `data/faqs.json` | FAQ questions and answers grouped by category |
| `data/toptastings.json` | Seasonal (manual) and all-time rankings |
| `static/js/featured-episode.js` | Client-side random episode selection |

## Common Tasks

### Add a New Blog Post

1. Create a Markdown file in the appropriate era folder:
   ```bash
   content/glass-room/<era-folder>/my-new-post.md
   ```

2. Add frontmatter:
   ```yaml
   ---
   title: "My New Post Title"
   date: "2026-02-15"
   era: "Era Display Name"
   author: "Author Name"
   description: "Short summary of the post."
   draft: true  # Set to false when ready to publish
   tags: ["topic1", "topic2"]
   ---
   ```

3. Write content in Markdown below the frontmatter.

4. Preview locally: `hugo server -D`

5. Publish: Set `draft: false` and push to main.

### Add a New Era Section

1. Create a folder under `content/glass-room/`:
   ```bash
   mkdir content/glass-room/new-era-name/
   ```

2. Create `_index.md` for the era landing page:
   ```yaml
   ---
   title: "New Era Name"
   description: "Description of this era."
   ---
   ```

3. Add blog posts as Markdown files in the new folder.

### Update Episode Data

Edit `data/episodes.json`. Each episode needs:
- `id`: Unique string (e.g., `ep_edu_004`)
- `title`, `description`: Display text
- `youtubeId`: YouTube video ID
- `playlistId`: Category (`main`, `education`, `tastings`, `seasonal`, `top10`)
- `popularity`: Score 0–100 (affects Top 10 All Time ranking)
- `duration`: Format `MM:SS`

### Update Host/Guest Data

Edit `data/hosts.json`. Hosts go in `.hosts[]`, guests in `.guests[]`.

### Update FAQs

Edit `data/faqs.json`. Group by `category`, set `order` within each category.

### Update Seasonal Rankings

Edit `data/toptastings.json` → `.seasonal[]`. Set the `currentSeason` field and update the ranked entries. Seasonal entries require `episodeId`, `rank`, `season`, and `listType: "season"`.

## Deployment

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. Push to `main` branch triggers build
2. Hugo builds with `--minify`
3. Output deployed to GitHub Pages

Pull requests trigger a build check (no deploy).

## Customization

### Styling
- Theme base style: `marsala` (configured in `hugo.toml` → `params.style`)
- Custom overrides: `static/css/bottlebond.css`
- Color tokens defined as CSS custom properties

### Homepage Widgets
- Configured in `hugo.toml` under `[params.carouselHomepage]`, `[params.features]`, `[params.recent_posts]`, etc.
- Enable/disable by setting `enable = true/false`

### Navigation
- Main menu: `[[menu.main]]` entries in `hugo.toml`
- Social links: `[[menu.topbar]]` entries in `hugo.toml`
- Footer: Configured via `params.about_us`, `params.copyright`, `params.footer.recent_posts`
