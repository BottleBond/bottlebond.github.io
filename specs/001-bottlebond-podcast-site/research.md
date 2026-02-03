# Research: Hugo Markdown Refactor

**Date**: 2026-02-02 | **Branch**: `001-bottlebond-podcast-site`

---

## 1. Hugo Shortcodes with JSON Data Files

### Decision: Use `.Site.Data` to access JSON files in the `data/` directory

### Rationale
Hugo provides direct access to data files through `.Site.Data.<filename>`. This is the standard approach for small to medium datasets that are frequently accessed during build time.

### Implementation Pattern

```html
<!-- layouts/shortcodes/hosts.html -->
{{ $role := .Get "role" | default "all" }}
{{ $hosts := .Site.Data.hosts.hosts }}

{{ if ne $role "all" }}
  {{ $hosts = where $hosts "role" $role }}
{{ end }}

{{ range $hosts }}
<div class="media">
  {{ with .photo }}
  <img src="{{ . }}" alt="{{ $.name }}" class="media-object">
  {{ end }}
  <div class="media-body">
    <h4 class="media-heading">{{ .name }}</h4>
    <p class="text-muted">{{ .role }}</p>
    <p>{{ .bio }}</p>
  </div>
</div>
{{ end }}
```

### Alternatives Considered
- `resources.Get` + `transform.Unmarshal` - More flexible but overkill for our use case
- Remote data sources - Not needed; all data is local
- Hardcoded HTML in markdown - Less maintainable

### Key Constraints
- Data files MUST be in the `data/` directory
- File extension determines parser (`.json` for JSON)
- Access pattern: `.Site.Data.<filename>.<key>`

---

## 2. Shortcode Design Best Practices

### Decision: Use named parameters with defaults; keep shortcodes simple and focused

### Rationale
Named parameters are self-documenting and easier to maintain. Each shortcode should do one thing well.

### Best Practices Applied

```html
<!-- Parameter validation pattern -->
{{ $category := .Get "category" | default "all" }}
{{ $limit := .Get "limit" | default 3 }}

<!-- Conditional rendering -->
{{ with .Get "title" }}
<h3>{{ . }}</h3>
{{ end }}

<!-- Range with limit -->
{{ range first $limit $items }}
  <!-- render item -->
{{ end }}
```

### Shortcode Calling Syntax

In markdown content:
```markdown
## Our Hosts

{{</* hosts role="host" */>}}

## Co-Hosts

{{</* hosts role="cohost" */>}}

## Episodes

{{</* episodes category="education" limit="3" */>}}
```

### Key Constraints
- Shortcodes MUST handle missing/empty data gracefully
- Use Bootstrap classes from hugo-universal-theme for consistent styling
- Keep logic minimal; complex transformations belong in data files

---

## 3. Content Markdown Structure for hugo-universal-theme

### Decision: Use `type: "page"` frontmatter; embed shortcodes for dynamic content

### Rationale
The hugo-universal-theme expects `type: "page"` for standard pages. Markdown content is rendered via `{{ .Content }}` in the theme's templates, with shortcodes expanding inline.

### Frontmatter Pattern

```yaml
---
title: "Page Title"
description: "SEO description for the page"
type: "page"
---

# Heading

Static markdown content here.

{{</* shortcode-for-dynamic-data */>}}

More markdown content...
```

### Theme-Specific Features

The theme's `layouts/page/single.html` has special handling:
- If frontmatter contains `id` parameter, it renders a partial with that name
- Otherwise, it renders `{{ .Content }}` in a full-width container

Example for contact page (uses theme partial):
```yaml
---
title: "Contact"
id: "contact"
type: "page"
---
```

### Content Guidelines
1. Use standard markdown headers (##, ###) for sections
2. Embed shortcodes inline where dynamic content is needed
3. Keep static text in markdown, dynamic data in shortcodes
4. Use HTML sparingly (only when markdown is insufficient)
5. Theme provides Bootstrap 3 classes for styling

---

## 4. Theme CSS Classes Reference

### Decision: Use existing theme classes; minimize custom CSS

### Bootstrap 3 Classes (from theme)
```
.container          - Standard Bootstrap container
.row, .col-md-*     - Grid system
.text-muted         - Muted text color
.text-uppercase     - Uppercase text
.text-center        - Center alignment
.btn, .btn-template-main - Button styles
.media, .media-body - Media object pattern (good for hosts)
.panel, .panel-body - Panel styling (good for FAQ)
```

### Theme Custom Classes
```
.heading            - Section headings
.box-image-text     - Image + text boxes (blog posts)
.bar                - Section bars
.background-white   - White background sections
```

---

## 5. Page Migration Strategy

### Decision: Migrate pages incrementally, starting with simplest

### Migration Order

| Priority | Page | Complexity | Approach |
|----------|------|------------|----------|
| 1 | Contact | Low | Markdown + mailto link |
| 2 | FAQ | Low | Markdown with ## headers |
| 3 | About | Medium | Markdown + hosts shortcode |
| 4 | Episodes | High | Markdown + episodes shortcode |
| 5 | Homepage | Theme | Configure via hugo.toml |

### Testing Checklist
- [ ] `hugo server` runs without errors
- [ ] Page renders with correct styling
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] Content matches requirements

---

## Summary: Hugo Markdown Refactor Decisions

| Area | Decision | Key Reason |
|------|----------|------------|
| Data Access | `.Site.Data` | Built-in Hugo feature, simple |
| Shortcodes | Named params with defaults | Self-documenting, maintainable |
| Frontmatter | `type: "page"` | Theme requirement |
| Styling | Bootstrap 3 classes | Theme provides them |
| Migration | Incremental by page | Reduce risk, validate approach |

---

## Sources

- [Hugo Data Sources Documentation](https://gohugo.io/content-management/data-sources/)
- [Using Data in Hugo - CloudCannon Tutorial](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/using-data-in-hugo/)
- [Data Shortcode for Hugo - Yury Zhauniarovich](https://zhauniarovich.com/post/2021/2021-09-data-shortcode-for-hugo/)
- [Hugo Shortcode Collection on GitHub](https://github.com/squidfingers/hugo-shortcodes)

---

## Next Steps

All research questions resolved. Proceed to Phase 1: Create shortcodes and update content files.
