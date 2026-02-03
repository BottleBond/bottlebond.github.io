# Quickstart: BottleBond Hugo Site

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## Prerequisites

- Hugo v0.115.0 or higher (extended edition recommended)
- Git

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/bottlebond/bottlebond.github.io.git
cd bottlebond.github.io

# Switch to the feature branch
git checkout 001-bottlebond-podcast-site

# Verify Hugo is installed
hugo version
```

### 2. Start Development Server

```bash
# Start Hugo server with live reload
hugo server -D
```

The site will be available at `http://localhost:1313`

---

## Project Structure

```
bottlebond.github.io/
├── content/                    # Markdown content files
│   ├── _index.md              # Homepage content
│   ├── about.md               # About page
│   ├── contact.md             # Contact page
│   ├── episodes.md            # Episodes page
│   ├── faq.md                 # FAQ page
│   └── glass-room/            # Blog section
│       ├── _index.md          # Blog listing
│       └── [era]/             # Era-based folders
│           └── [post].md      # Individual posts
├── data/                       # JSON data files
│   ├── episodes.json          # Episode metadata
│   ├── hosts.json             # Host/guest info
│   ├── faqs.json              # FAQ questions
│   └── playlists.json         # YouTube playlists
├── layouts/                    # Custom templates (override theme)
│   └── shortcodes/            # Custom shortcodes
│       ├── hosts.html         # Render hosts
│       └── episodes.html      # Render episodes
├── static/                     # Static assets
│   └── images/                # Images
├── themes/
│   └── hugo-universal-theme/  # Theme files
├── hugo.toml                   # Site configuration
└── public/                     # Generated output (gitignored)
```

---

## Content Management

### Editing a Page

Each page is a markdown file in `content/`. Edit the file and Hugo will hot-reload.

**Example: Editing the About Page**

```bash
# Edit content/about.md
```

```markdown
---
title: "About"
description: "Meet the BottleBond team"
type: "page"
---

# About BottleBond

Welcome to BottleBond, your premier podcast for bourbon and whiskey education.

## Our Host

{{< hosts role="host" >}}

## Co-Host

{{< hosts role="cohost" >}}

## Recurring Guests

{{< hosts role="guest" >}}
```

### Adding a Blog Post

1. Create a folder for the era if it doesn't exist:

```bash
mkdir -p content/glass-room/modern-craft
```

2. Create a new markdown file:

```bash
touch content/glass-room/modern-craft/my-new-post.md
```

3. Add frontmatter and content:

```markdown
---
title: "My New Post Title"
date: 2026-02-02
description: "A brief description"
---

Your post content here...
```

4. The post will appear at `/glass-room/modern-craft/my-new-post/`

### Updating Host Information

Edit `data/hosts.json`:

```json
{
  "hosts": [
    {
      "name": "Adam Lathers",
      "role": "host",
      "bio": "Host bio here...",
      "photo": "/images/hosts/adam.jpg"
    }
  ],
  "guests": [
    {
      "name": "Guest Name",
      "role": "guest",
      "bio": "Guest bio here...",
      "photo": "/images/hosts/guest.jpg"
    }
  ]
}
```

### Updating FAQ

Edit `data/faqs.json`:

```json
{
  "faqs": [
    {
      "question": "What is bourbon?",
      "answer": "Bourbon is an American whiskey...",
      "category": "Basics"
    }
  ]
}
```

Or write FAQs directly in markdown in `content/faq.md`:

```markdown
## What is bourbon?

Bourbon is an American whiskey made from at least 51% corn...

## How is bourbon made?

Bourbon production begins with...
```

---

## Available Shortcodes

### `{{< hosts >}}`

Renders hosts from `data/hosts.json`.

```markdown
{{< hosts role="host" >}}     # Show only hosts
{{< hosts role="cohost" >}}   # Show only co-hosts
{{< hosts role="guest" >}}    # Show only guests
{{< hosts >}}                  # Show all
```

### `{{< episodes >}}`

Renders episodes from `data/episodes.json`.

```markdown
{{< episodes category="education" limit="3" >}}
{{< episodes category="tastings" limit="3" >}}
```

### `{{< youtube >}}`

Embeds a YouTube video.

```markdown
{{< youtube id="dQw4w9WgXcQ" >}}
```

---

## Development Commands

```bash
# Start development server (includes drafts)
hugo server -D

# Build for production
hugo --minify

# Build and serve locally
hugo server --minify

# Check for broken links/references
hugo --gc

# Clean and rebuild
rm -rf public && hugo --gc --cleanDestinationDir
```

---

## Configuration

### Site Settings (`hugo.toml`)

Key settings you might want to change:

```toml
# Site title
title = "BottleBond - Premium Bourbon & Whiskey Podcast"

# Theme style (options: default, blue, green, marsala, pink, red, turquoise, violet)
[params]
  style = "marsala"

# Social links
[params.social]
  youtube = "https://www.youtube.com/@BottleBond"
  instagram = "https://instagram.com/bottlebond"
```

### Navigation Menu

Edit the `[[menu.main]]` sections in `hugo.toml`:

```toml
[[menu.main]]
  name = "Home"
  url = "/"
  weight = 10
```

---

## Deployment

### Automatic Deployment (GitHub Actions)

Push to `main` branch triggers deployment:

```bash
git checkout main
git merge 001-bottlebond-podcast-site
git push origin main
```

The site deploys to `https://bottlebond.github.io`

### Manual Deployment

```bash
# Build the site
hugo --minify

# The /public directory contains the static site
# Upload to any static hosting provider
```

---

## Troubleshooting

### Build Errors

**"Page not found" after adding content**
- Check frontmatter syntax (YAML format)
- Ensure `type: "page"` is set for standalone pages
- Restart Hugo server

**Shortcode not working**
- Verify shortcode file exists in `layouts/shortcodes/`
- Check shortcode syntax: `{{< shortcode >}}` not `{{ shortcode }}`

**Styles not appearing**
- Ensure theme is set in `hugo.toml`: `theme = "hugo-universal-theme"`
- Check that `themes/hugo-universal-theme/` directory exists

### Content Issues

**Blog post not appearing in list**
- Check that frontmatter has required fields (title, date)
- Ensure file is in correct directory structure
- Remove `draft: true` if present

**Data not loading**
- Verify JSON syntax in `data/*.json` files
- Check file names match expected patterns

---

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Universal Theme](https://github.com/devcows/hugo-universal-theme)
- [Hugo Shortcodes Guide](https://gohugo.io/content-management/shortcodes/)
- [GitHub Pages with Hugo](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
