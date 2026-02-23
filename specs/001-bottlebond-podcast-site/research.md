# Research: BottleBond Podcast Website

**Date**: 2026-02-15 | **Branch**: `001-bottlebond-podcast-site`

---

## 1. Hugo Theme Installation

**Decision**: Install hugo-universal-theme as a Git submodule at `themes/hugo-universal-theme/`

**Rationale**: The theme directory exists but is empty (no `.gitmodules` file). Git submodules are the standard Hugo theme installation method, keep theme code separate, and allow pinning to a specific commit. The CI workflow uses `actions/checkout@v4` which supports `submodules: true`.

**Alternatives considered**:
- Hugo Modules (go mod): Adds Go dependency complexity; theme doesn't officially support it
- Direct copy: Bloats repo and makes updates harder

**Action**: `git submodule add https://github.com/devcows/hugo-universal-theme.git themes/hugo-universal-theme` + update `deploy.yml` with `submodules: true`

## 2. Theme Widget System for Homepage

**Decision**: Leverage theme's built-in widget system + repurpose disabled widgets for new homepage sections

**Rationale**: The hugo-universal-theme provides homepage widgets controlled via `hugo.toml`:

| Widget | Current State | Use For |
|--------|---------------|---------|
| `carouselHomepage` | Enabled | Hero banner / welcome |
| `features` | Enabled | Content category highlights (Education, Tastings, Glass Room) |
| `recent_posts` | Enabled | Latest Glass Room blog post preview |
| `testimonials` | Disabled | **Repurpose** for host teaser section |
| `see_more` | Disabled | **Repurpose** for newsletter CTA |
| `clients` | Disabled | Not needed |

Additional homepage content (featured episode) already handled by existing shortcode in `content/_index.md`.

**Alternatives considered**:
- Custom homepage template from scratch: More work, loses theme's responsive grid system
- Only shortcodes in markdown: Limits layout control

## 3. Glass Room Two-Tier Navigation

**Decision**: Hugo nested sections with `_index.md` at each level + `.RegularPagesRecursive`

**Rationale**: Hugo natively supports nested content sections:
- `/content/glass-room/_index.md` → top-level listing ALL posts via `.RegularPagesRecursive`
- `/content/glass-room/<era>/_index.md` → era listing via `.RegularPages`
- `/content/glass-room/<era>/post.md` → individual post pages

**Template strategy**:
- `layouts/glass-room/list.html` — handles both levels; detects top-level vs. era via `.CurrentSection` / `.IsHome` / depth check
- `.Sections` provides era index for top-level page
- Breadcrumb navigation via `.Ancestors` for era → Glass Room back-link

**Alternatives considered**:
- Taxonomy-based eras: Less intuitive folder structure, separate taxonomy templates needed
- Single flat list with frontmatter filtering: Loses Hugo's section hierarchy benefits

## 4. Vintage Distillery CSS

**Decision**: `static/css/bottlebond.css` with CSS custom properties, Google Fonts, CSS-only textures — layered on marsala theme

**Rationale**: Marsala theme base provides warm tones. Custom CSS adds:

**Design tokens**:
```css
:root {
  --bb-burnt-sienna: #8B4513;
  --bb-deep-brown: #654321;
  --bb-gold: #D4AF37;
  --bb-copper: #B87333;
  --bb-brass: #C9AE5D;
  --bb-cream: #F5F5F0;
  --bb-charcoal: #2C2C2C;
  --bb-radius: 8px;
  --bb-shadow: 0 4px 6px rgba(0,0,0,0.1);
  --bb-transition: 200ms ease;
}
```

**Typography**: Playfair Display (headings) + Lora (body) via Google Fonts
**Textures**: CSS-only patterns/gradients — no large image files (preserves <2s FCP)

**Alternatives considered**:
- Full theme fork: Maintenance burden
- Heavy texture images: Hurts mobile performance

## 5. Featured Episode Randomization

**Decision**: Keep existing client-side JavaScript approach (already implemented)

**Rationale**: Current implementation (`featured-episode.html` + `featured-episode.js`) correctly: passes episode data as JSON data attribute, uses `Math.random()` per page load, includes `<noscript>` fallback. Satisfies FR-003.

## 6. Top 10 Computation

**Decision**: Hybrid — seasonal from `toptastings.json` (manual); all-time computed from `episodes.json` popularity in template

**Rationale**: Per spec clarification. Update `top-tastings.html` shortcode: for `type="alltime"`, sort all episodes by `popularity` descending, take top 10 (ignore `toptastings.json` all-time list).

## 7. Draft System

**Decision**: Hugo's built-in `draft: true` frontmatter

**Rationale**: Zero custom code. Hugo excludes drafts from production builds; `hugo server -D` shows them locally.

## 8. CI/CD

**Decision**: Add `submodules: true` to checkout step in `deploy.yml`

**Rationale**: Required for fetching theme submodule during GitHub Actions build.

## 9. Footer

**Decision**: Use theme's built-in footer with existing `hugo.toml` configuration

**Rationale**: Theme footer renders social links (from `topbar` menu), `about_us` blurb, `copyright`, and `recent_posts`. All are already configured in `hugo.toml`. Override footer partial only if explicit page navigation links are needed beyond what the theme provides.

## 10. Content Data Strategy

**Decision**: Existing JSON data files (`data/`) are well-structured and match the spec entities

**Rationale**: Reviewed all 5 data files. They already contain:
- `episodes.json`: 12 episodes with all required fields (id, title, youtubeId, playlistId, popularity, duration, etc.)
- `hosts.json`: 2 hosts + 3 guests with bios, photos, social links, ordering
- `faqs.json`: 10 FAQs across 5 categories with ordering
- `playlists.json`: 5 playlist definitions with YouTube IDs
- `toptastings.json`: 10 all-time + 5 seasonal rankings with curator notes

All entities have canonical IDs and timestamps per constitution requirements. No data model changes needed — the existing data files satisfy the spec.
