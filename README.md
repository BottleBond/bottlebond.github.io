# BottleBond Podcast Website

Premium bourbon and whiskey podcast website at **https://bottlebond.github.io/**

Built with [Hugo](https://gohugo.io/) and the [hugo-universal-theme](https://github.com/devcows/hugo-universal-theme), deployed automatically to GitHub Pages.

## Prerequisites

- **Hugo** (extended edition) — install via `brew install hugo` (macOS) or see [Hugo releases](https://github.com/gohugoio/hugo/releases)
- **Git** — for cloning and submodule management

## Quick Start

```bash
# Clone the repository (includes theme submodule)
git clone https://github.com/bottlebond/bottlebond.github.io.git
cd bottlebond.github.io
git submodule update --init --recursive

# Start the development server (drafts visible)
hugo server -D

# Open http://localhost:1313/ in your browser
```

## Project Structure

```
content/                   Markdown pages and blog posts
  _index.md                Homepage content (featured episode shortcode)
  about.md                 About page
  episodes.md              Episodes page (uses shortcodes)
  faq.md                   FAQ page
  contact.md               Contact page
  glass-room/              Blog section ("The Glass Room")
    _index.md              Blog landing page
    <era-folder>/          Era subsections (e.g., prohibition-era/)
      _index.md            Era landing page
      <post>.md            Individual blog posts

data/                      JSON data files
  episodes.json            Episode metadata (title, YouTube ID, popularity)
  hosts.json               Host and guest bios
  faqs.json                FAQ questions grouped by category
  toptastings.json         Seasonal + all-time bourbon rankings
  testimonials.json        Homepage host teaser data
  playlists.json           YouTube playlist IDs

layouts/                   Custom Hugo template overrides
  index.html               Homepage (renders .Content + theme widgets)
  glass-room/
    list.html              Blog listing (era TOC + all-posts view)
    single.html            Blog post template (breadcrumbs, tags, nav)
  partials/
    custom_headers.html    Loads bottlebond.css
    footer.html            Custom footer (nav, social, recent posts)
  shortcodes/              Reusable content components
    episodes.html          Episode grid from data/episodes.json
    faqs.html              Accordion FAQ from data/faqs.json
    featured-episode.html  Random featured episode
    hosts.html             Host/guest cards from data/hosts.json
    top-tastings.html      Seasonal + all-time rankings
    youtube.html           YouTube embed

static/
  css/bottlebond.css       Custom styles (design tokens, typography, components)
  js/featured-episode.js   Client-side random episode picker
  img/                     Images (carousel, hosts, etc.)

themes/hugo-universal-theme/  Theme (Git submodule — do not edit directly)
hugo.toml                     Site configuration, menus, widget settings
.github/workflows/deploy.yml  GitHub Actions deployment pipeline
```

## Publishing Content

### Add a New Blog Post

1. Pick the era folder (or create a new one — see below):
   ```
   content/glass-room/prohibition-era/
   content/glass-room/modern-craft/
   content/glass-room/homework/
   ```

2. Create a new Markdown file:
   ```bash
   touch content/glass-room/<era-folder>/my-new-post.md
   ```

3. Add frontmatter at the top of the file:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2026-02-15"
   era: "Era Display Name"
   author: "Author Name"
   description: "Short summary for listings and SEO."
   draft: true
   tags: ["topic1", "topic2"]
   ---
   ```

4. Write your content in Markdown below the frontmatter.

5. Preview locally with `hugo server -D` (the `-D` flag shows draft posts).

6. When ready to publish, set `draft: false` and push to the `main` branch. GitHub Actions will build and deploy automatically.

### Add a New Era Section

1. Create a folder under `content/glass-room/`:
   ```bash
   mkdir content/glass-room/new-era-name/
   ```

2. Create an `_index.md` inside it:
   ```yaml
   ---
   title: "New Era Name"
   description: "Brief description of this era."
   ---
   ```

3. Add blog posts as `.md` files in the new folder using the frontmatter format above.

The era will automatically appear in the Glass Room's "Browse by Era" navigation.

### Update Episode Data

Edit `data/episodes.json`. Each episode object needs:

| Field | Format | Description |
|-------|--------|-------------|
| `id` | String | Unique ID (e.g., `ep_edu_004`) |
| `title` | String | Episode title |
| `description` | String | Short description |
| `youtubeId` | String | YouTube video ID |
| `playlistId` | String | Category: `main`, `education`, `tastings`, `seasonal`, `top10` |
| `popularity` | Number | 0–100 score (drives Top 10 All Time ranking) |
| `duration` | String | Format `MM:SS` |

### Update Host or Guest Bios

Edit `data/hosts.json`. Hosts go in `.hosts[]`, guests in `.guests[]`.

### Update FAQs

Edit `data/faqs.json`. Each FAQ has a `category`, `question`, `answer`, and `order` field. Questions are grouped and displayed by category.

### Update Seasonal Rankings

Edit `data/toptastings.json`:
- Set `currentSeason` to the active season name
- Update `.seasonal[]` entries with `episodeId`, `rank`, `season`, and `listType: "season"`
- The all-time list is computed automatically from episode `popularity` scores

## Configuration

### Site Settings

All site-wide settings are in `hugo.toml`:

- **Menus**: `[[menu.main]]` for navigation, `[[menu.topbar]]` for social links
- **Homepage widgets**: `[params.carouselHomepage]`, `[params.features]`, `[params.testimonials]`, `[params.see_more]`, `[params.recent_posts]` — set `enable = true/false`
- **Footer**: `params.about_us`, `params.copyright`, `params.footer.recent_posts`
- **Style**: `params.style = "marsala"` (theme color scheme)
- **Contact**: `params.email` for the site-wide email address

### Logo

The site logo is configured in `hugo.toml`:

```toml
disabled_logo = false
logo = "img/BB_Gold.png"          # Desktop/tablet navbar logo
logo_small = "img/Icon - Gold.png" # Mobile navbar icon
logo_text = "BottleBond"           # Fallback text if images fail
```

Logo image files are in `static/img/`. Available variants: BB_Blue, BB_Gold, BB_White (full logos) and Icon - Black, Icon - Blue, Icon - Gold, Icon - White (compact icons). To change the logo color, update the `logo` and `logo_small` paths to a different variant.

### Custom Styling

Override styles in `static/css/bottlebond.css`. Design tokens are defined as CSS custom properties on `:root`:

| Token | Hex | Role |
|-------|-----|------|
| `--bb-navy` | `#2B4F73` | Primary accent: links, buttons, headings |
| `--bb-steel-blue` | `#35678A` | Hover states, secondary accent |
| `--bb-slate` | `#2C3E50` | Dark accents: borders, dark backgrounds |
| `--bb-light-steel` | `#B8C8D8` | Light backgrounds: pagination, highlights |
| `--bb-dusty-blue` | `#567490` | Medium decorative: navbar focus |
| `--bb-deep-brown` | `#654321` | Heading text color |
| `--bb-gold` | `#D4AF37` | Gold accents, nav hover, borders |
| `--bb-copper` | `#B87333` | Warm accent: icons, metadata |
| `--bb-brass` | `#C9AE5D` | Footer links, subtle warm accent |
| `--bb-cream` | `#F5F5F0` | Light backgrounds |
| `--bb-charcoal` | `#2C2C2C` | Body text, navbar/footer backgrounds |

To change the site's color palette, update the hex values in the `:root` block of `bottlebond.css`. The marsala theme's pink/red tones are also overridden in the same `:root` block via the `--primary-accent`, `--navbar-border-top`, `--button-border`, `--link-focus`, `--link-hover-bg`, `--pagination-bg`, and `--navbar-focus` variables.

## Building and Deploying

```bash
# Build for production (excludes drafts, minifies output)
hugo --minify
# Output goes to ./public/
```

Deployment is automated: pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds with Hugo and deploys to GitHub Pages. Pull requests trigger a build check only (no deploy).

## YouTube Playlist Sync

The sync tool (`tools/sync/`) automatically fetches YouTube playlist data and updates the site's episode inventory, section headings, and rankings.

### Prerequisites

- **Node.js 20+** — required for the sync tool
- **YouTube Data API v3 key** — set as the `YOUTUBE_API_KEY` environment variable

### Configuration

Edit `sync-config.json` at the repository root:

```json
{
  "channelId": "UCxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "blocklist": [],
  "schedule": "daily"
}
```

- `channelId`: Your YouTube channel ID (starts with `UC`, 24 characters)
- `blocklist`: Array of YouTube playlist IDs to exclude from sync
- `schedule`: Informational field for CI schedule reference

### Running Locally

```bash
# Install dependencies (first time only)
cd tools/sync && npm install && cd ../..

# Preview changes without modifying files
YOUTUBE_API_KEY=your-key node tools/sync/sync.mjs --dry-run

# Run sync and update data files
YOUTUBE_API_KEY=your-key node tools/sync/sync.mjs
```

### What It Does

1. **Fetches playlists** from the configured YouTube channel
2. **Merges episode data** into `data/episodes.json` — YouTube fields (title, description, thumbnail, duration) are overwritten; manual fields (popularity, tags) are preserved
3. **Updates playlists** in `data/playlists.json` — names and descriptions sync from YouTube; existing IDs are preserved
4. **Validates rankings** in `data/toptastings.json` — removes stale episode references, updates rank order from YouTube playlist positions
5. **Updates section headings** in `content/episodes.md` to match current playlist names

### CI Automation

- **On deploy** (`.github/workflows/deploy.yml`): Sync runs before Hugo build. Failures are non-blocking — the site deploys with existing data.
- **Daily schedule** (`.github/workflows/sync.yml`): Runs at 6:00 AM UTC. If data changed, commits and pushes to trigger a deploy.

Add your API key as a repository secret named `YOUTUBE_API_KEY` in GitHub Settings > Secrets and variables > Actions.

### Running Tests

```bash
cd tools/sync
YOUTUBE_API_KEY=test npm test
```

### Troubleshooting

- **"YOUTUBE_API_KEY environment variable is not set"**: Export the key before running: `export YOUTUBE_API_KEY=your-key`
- **"Invalid channelId format"**: Must start with `UC` and be exactly 24 characters
- **API quota errors**: The tool uses ~13 API units per sync (10,000/day quota). Unlikely to hit limits with daily syncs.
- **Sync fails in CI**: Check that the `YOUTUBE_API_KEY` secret is configured. Sync failures are non-blocking for deploys.

## Development Notes

- **Theme is a Git submodule** — do not edit files under `themes/` directly. Override templates by placing files with the same path under `layouts/`.
- **Shortcodes** in `layouts/shortcodes/` provide reusable components. Use them in content pages with `{{</* shortcode-name */>}}` syntax.
- **Data-driven content**: Episodes, hosts, FAQs, and rankings are stored as JSON in `data/` and rendered by shortcodes and templates. Edit the JSON files to update content.
- **Glass Room navigation** is generated automatically from the folder structure under `content/glass-room/`. Each subfolder with an `_index.md` becomes an era section.
