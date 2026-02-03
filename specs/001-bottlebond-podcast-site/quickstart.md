# Quickstart: BottleBond Podcast Website

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
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

# Install dependencies
npm install
```

### 2. Create Next.js Project (if starting fresh)

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Install additional dependencies
npm install gray-matter unified remark-parse remark-gfm remark-rehype rehype-slug rehype-stringify
```

### 3. Configure Next.js

Create or update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 4. Add Google Fonts

Add to `src/app/layout.tsx`:

```tsx
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Project Structure

```
bottlebond.github.io/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── about/
│   │   ├── episodes/
│   │   ├── glass-room/
│   │   │   ├── page.tsx        # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual post
│   │   ├── faq/
│   │   └── contact/
│   ├── components/
│   │   ├── ui/                 # Reusable primitives
│   │   ├── layout/             # Header, Footer, Nav
│   │   ├── episodes/           # Episode-related components
│   │   ├── blog/               # Blog-related components
│   │   └── forms/              # Form components
│   ├── lib/
│   │   ├── data/               # Data fetching utilities
│   │   └── utils/              # Helper functions
│   ├── content/
│   │   ├── episodes.json
│   │   ├── playlists.json
│   │   ├── hosts.json
│   │   ├── faqs.json
│   │   ├── top-tastings.json
│   │   └── glass-room/         # Blog posts (Markdown)
│   └── styles/
│       └── globals.css
├── public/
│   ├── images/
│   └── fonts/
├── tests/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (generates /out directory)
npm run build

# Serve production build locally
npx serve out

# Run linting
npm run lint

# Run tests
npm test
```

---

## Content Management

### Adding a Blog Post

1. Create a new Markdown file in `src/content/glass-room/`:

```bash
touch src/content/glass-room/my-new-post.md
```

2. Add frontmatter:

```markdown
---
title: "My New Post Title"
date: "2026-02-02"
era: "Modern Craft"
author: "Host Name"
description: "A brief description of the post"
featured: false
tags:
  - bourbon
  - tasting
---

Your post content here...
```

3. The post will appear at `/glass-room/my-new-post`

### Adding an Episode

Edit `src/content/episodes.json`:

```json
{
  "episodes": [
    {
      "id": "ep_new",
      "title": "New Episode Title",
      "youtubeId": "xxxxxxxxxxx",
      "playlistId": "main",
      "thumbnailUrl": "https://i.ytimg.com/vi/xxxxxxxxxxx/hqdefault.jpg",
      "duration": "45:30",
      "publishedAt": "2026-02-02",
      "popularity": 85
    }
  ]
}
```

### Updating Top Tastings

Edit `src/content/top-tastings.json`:

```json
{
  "currentSeason": "Winter 2026",
  "allTime": [
    { "episodeId": "ep_001", "rank": 1, "listType": "alltime", "addedAt": "2026-01-01" }
  ],
  "seasonal": [
    { "episodeId": "ep_002", "rank": 1, "listType": "season", "season": "Winter 2026", "addedAt": "2026-01-01" }
  ]
}
```

---

## Environment Variables

Create `.env.local` for local development:

```bash
# Web3Forms access key for contact form
NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note:** For production, add these as GitHub repository secrets.

---

## Deployment

### Automatic Deployment (Recommended)

Push to `main` branch triggers GitHub Actions:

```bash
git checkout main
git merge 001-bottlebond-podcast-site
git push origin main
```

The site will deploy to `https://bottlebond.github.io`

### Manual Deployment

```bash
# Build the site
npm run build

# The /out directory contains the static site
# Upload to any static hosting provider
```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Under "Build and deployment", select **GitHub Actions**
3. The workflow file `.github/workflows/deploy.yml` handles the rest

---

## Tailwind Theme Reference

### Colors

| Name | CSS Variable | Usage |
|------|--------------|-------|
| sienna-500 | `#8B4513` | Primary buttons |
| gold-500 | `#D4AF37` | Hover states |
| cream-200 | `#F5F5F0` | Page backgrounds |
| charcoal-800 | `#2C2C2C` | Text |

### Typography

```html
<!-- Headings (serif) -->
<h1 class="font-serif text-5xl tracking-luxury-tight">Heading</h1>

<!-- Body (sans-serif) -->
<p class="font-sans text-base leading-relaxed">Body text</p>
```

### Components

```html
<!-- Primary Button -->
<button class="btn-primary">Click Me</button>

<!-- Luxury Card -->
<div class="card-luxury">
  <div class="card-luxury-body">Content</div>
</div>

<!-- Warm Shadow -->
<div class="shadow-warm-md">Elevated content</div>
```

---

## Testing

### Run Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test File Locations

```
tests/
├── unit/           # Unit tests for utilities
├── integration/    # Component integration tests
└── e2e/            # Playwright E2E tests
```

---

## Troubleshooting

### Build Errors

**"generateStaticParams is missing"**
- All dynamic routes (`[slug]`) must export `generateStaticParams()`

**"Image optimization unavailable"**
- Ensure `images.unoptimized: true` in `next.config.js`

### Development Issues

**Hot reload not working**
- Check that `src/content/` files are saved
- Restart dev server: `npm run dev`

**Styles not applying**
- Verify Tailwind content paths in `tailwind.config.js`
- Check for CSS purging issues

---

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Web3Forms Documentation](https://web3forms.com/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
