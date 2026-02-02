# Research: BottleBond Podcast Website

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## 1. Next.js Static Export for GitHub Pages

### Decision: Standard Next.js 14+ with `output: 'export'`

### Configuration

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,  // Cleaner URLs on static hosts
  images: {
    unoptimized: true,  // Required for static export
  },
}

module.exports = nextConfig
```

### Rationale
- For user/organization sites (bottlebond.github.io), **no basePath needed**
- `trailingSlash: true` ensures consistent routing on static hosts
- `images.unoptimized: true` is required since Image Optimization API needs a Node.js server

### GitHub Actions Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Alternatives Considered
- **Astro**: More opinionated, less React ecosystem integration
- **Hugo**: Fast but requires learning Go templates
- **Gatsby**: Heavier, more complex for this use case

### Key Constraints
- All dynamic routes MUST use `generateStaticParams()`
- No server-side API routes (static export only)
- No Incremental Static Regeneration
- No Server Actions

---

## 2. YouTube Embed Implementation

### Decision: Custom YouTubeEmbed component with facade pattern

### Rationale
- **Facade pattern** saves ~500-800KB per embed until user clicks
- **Privacy-enhanced mode** via youtube-nocookie.com for GDPR compliance
- **Responsive sizing** using `aspect-ratio: 16/9` CSS

### Key Implementation Details

```tsx
// Privacy-enhanced embed URL
const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

// Responsive container
<div style={{ aspectRatio: '16/9', position: 'relative' }}>
  {/* Facade or iframe */}
</div>
```

### Accessibility Requirements
- `title` attribute on iframe (screen reader description)
- `aria-label` on facade button
- Keyboard activation (Enter/Space)
- Visible focus indicators

### External Link Pattern
```tsx
<a
  href={`https://www.youtube.com/watch?v=${videoId}`}
  target="_blank"
  rel="noopener noreferrer"
>
  Watch on YouTube
</a>
```

### Alternatives Considered
- **react-player**: Too heavy for simple embeds
- **lite-youtube-embed**: Good but less customizable
- **Direct iframe**: No performance optimization

---

## 3. Markdown Blog Implementation

### Decision: Custom gray-matter + remark/rehype approach

### Rationale
1. **Maximum flexibility** for era-based categorization
2. **Future-proof** - core libraries are industry standards
3. **No abandoned dependencies** (Contentlayer is abandoned)
4. **Optimal bundle size** - only include what's needed
5. **Full control** over frontmatter schema and TOC generation

### Dependencies
```json
{
  "gray-matter": "^4.0.3",
  "unified": "^11.0.4",
  "remark-parse": "^11.0.0",
  "remark-gfm": "^4.0.0",
  "remark-rehype": "^11.1.0",
  "rehype-slug": "^6.0.0",
  "rehype-stringify": "^10.0.0"
}
```

### Frontmatter Schema
```yaml
---
title: "The History of Bourbon"
date: "2026-01-15"
era: "Prohibition"
author: "Host Name"
description: "Explore the origins..."
featured: false
tags:
  - history
  - bourbon
---
```

### Era-Based Grouping
```typescript
const ERA_ORDER = [
  'Colonial Era',
  'Early American',
  'Prohibition Era',
  'Post-War Revival',
  'Modern Craft',
  'Contemporary',
];
```

### Alternatives Considered
- **Contentlayer**: Abandoned, breaking with Next.js 14+
- **next-mdx-remote**: Good but more setup for MDX features we don't need
- **@next/mdx**: Too limited for blog with dynamic listings

---

## 4. Tailwind CSS Luxury Theme

### Decision: Custom Tailwind theme with earth tones

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Sienna (primary) | #8B4513 | Buttons, accents |
| Brown (primary) | #654321 | Backgrounds, borders |
| Gold (primary) | #D4AF37 | Hover states, highlights |
| Terracotta | #CD5C5C | Accent color |
| Slate (secondary) | #708090 | Muted accents |
| Cream (neutral) | #F5F5F0 | Page backgrounds |
| Charcoal (neutral) | #2C2C2C | Text, dark sections |

### Typography
- **Headings**: Cormorant Garamond (serif, elegant)
- **Body**: Inter (sans-serif, readable)
- **Line height**: 1.6+ for comfortable reading

### Component Styling
- Border radius: 8-12px (`rounded-luxury`)
- Shadows: Warm-tinted with sienna undertones
- Hover states: Gold shift with glow effect
- Transitions: 200-300ms with ease-luxury timing

### Key CSS Utilities
```css
.shadow-warm-md { box-shadow: 0 4px 6px -1px rgba(139, 69, 19, 0.1); }
.shadow-gold-glow { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
.transition-luxury { transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1); }
```

---

## 5. Contact Form Solution

### Decision: Web3Forms

### Rationale
1. **Generous free tier** - 250 submissions/month (plenty for low-volume podcast site)
2. **No branding** - Professional appearance
3. **No account required** - Just an access key
4. **Built-in spam protection** - Invisible honeypot + optional hCaptcha
5. **AJAX support** - Perfect for React integration

### Implementation Approach
- React component with TypeScript
- Client-side validation
- Honeypot field for spam prevention
- Success/error state handling
- Accessible form labels and error messages

### Setup Steps
1. Visit web3forms.com
2. Enter email to receive access key
3. Use access key in form component
4. Submit to `https://api.web3forms.com/submit`

### Alternatives Considered
| Service | Free Limit | Pros | Cons |
|---------|------------|------|------|
| Formspree | 50/mo | Well-established | Lower free limit |
| FormSubmit | Unlimited | No account | No dashboard |
| Getform | 50/mo | Good integrations | Lower free limit |
| **Web3Forms** | **250/mo** | **Best balance** | Newer service |

---

## Summary: Technology Decisions

| Area | Decision | Key Reason |
|------|----------|------------|
| Framework | Next.js 14+ (App Router) | Best React DX, static export support |
| Hosting | GitHub Pages | Free, version-controlled content |
| Styling | Tailwind CSS | Rapid development, design system |
| Blog | gray-matter + remark/rehype | Stable, flexible, future-proof |
| YouTube | Custom facade component | Performance, privacy |
| Forms | Web3Forms | Best free tier, no branding |
| Images | Pre-optimized (unoptimized mode) | Static export requirement |

---

## Next Steps

All research questions resolved. Proceed to Phase 1: Design & Contracts.
