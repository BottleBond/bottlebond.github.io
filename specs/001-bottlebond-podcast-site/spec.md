# Feature Specification: BottleBond Podcast Website

**Feature Branch**: `001-bottlebond-podcast-site`
**Created**: 2026-01-29
**Status**: In Progress
**Input**: Modern podcast website for Bourbon & Whisky-focused audio/video content with luxury lounge aesthetic; migrating content from previous WordPress site (https://bottle.bond)
**Tech Stack**: Hugo with hugo-universal-theme for GitHub Pages hosting

## Overview

BottleBond is a premium podcast website showcasing bourbon and whiskey education and tasting episodes. The site features a minimalist, elegant design with earthy warm tones and modern luxury aesthetics (fireplace ambiance, overstuffed lounge chair comfort). All content is dynamically rendered from mocked data sources with future CMS integration planned. This project will eventually replace the current bottle.bond website.

---

## Clarifications

### Session 2026-02-02

- Q: How should era categorization work for Glass Room blog posts? → A: Era determined by folder structure (`/glass-room/prohibition/`, `/glass-room/modern-era/`, etc.) — no hashtags needed in content
- Q: How many episodes should "Top Tastings of the Season" display? → A: 5 episodes (Top 5)
- Q: How should episode popularity be determined for "most popular" sections? → A: Use display order in YouTube playlist — first 3 videos in each playlist are considered most popular. Offloads curation to YouTube playlist management.
- Q: What is the YouTube playlist ID for the Tastings section? → A: No dedicated playlist exists. Use manually curated individual video IDs in episodes.json (e.g., `DLLu3lj4TYE` from https://youtu.be/DLLu3lj4TYE).
- Q: What unique visual elements should distinguish BottleBond? → A: Vintage Distillery Aesthetic — aged paper textures, copper/brass accent colors, vintage typography flourishes, barrel-wood grain patterns.
- Q: What are the valid era categories for Glass Room blog content? → A: Flexible/open system — any folder name becomes an era. Initial suggested eras: Prohibition (1920-1933), Post-Prohibition (1933-1960), Bourbon Renaissance (1960-2000), Craft Era (2000-present).
- Q: What backend service should handle contact form submissions? → A: Replace contact form with mailto link popup to `website@bottle.bond`. No form backend needed.
- Q: What social media links should be included? → A: YouTube, Instagram, Facebook, and Patreon (no Twitter).

### Session 2026-02-15

- Q: Should the homepage include additional content sections beyond the featured episode? → A: Full showcase — featured episode + latest Glass Room blog post preview + host teaser + social links + newsletter CTA
- Q: How should Glass Room blog post navigation work? → A: Individual post pages with unique URLs. Two-tier TOC: top-level `/glass-room/` lists ALL posts across eras; each era has its own landing page (e.g., `/glass-room/prohibition/`) with a focused TOC and a link back to the top-level Glass Room page.
- Q: What content should appear in the site footer? → A: Standard footer — social media icons (YouTube, Instagram, Facebook, Patreon) + key navigation links (Home, About, Episodes, Contact) + copyright notice.
- Q: How are "Top 10 of All Time" and "Top Tastings of the Season" episode lists curated? → A: Hybrid — "Top Tastings of the Season" is manually curated (editor picks and ranks in data file); "Top 10 of All Time" is computed from popularity scores across all episodes.
- Q: How should blog post draft/publish status be managed? → A: Use Hugo's built-in draft system (`draft: true` in frontmatter; visible locally with `hugo server -D`, hidden in production builds).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Discovers Featured Episode on Landing Page (Priority: P1)

A new visitor lands on the homepage and immediately sees an engaging featured episode from the main YouTube feed. They can either watch embedded or open in a new window, creating an immediate entry point to content.

**Why this priority**: Homepage discovery is critical for first impressions and initial engagement; drives traffic to full episode library.

**Independent Test**: Homepage loads with randomly selected featured episode; embed player functions and link opens new window.

**Acceptance Scenarios**:

1. **Given** user visits homepage, **When** page loads, **Then** one random featured episode displays with title and thumbnail
2. **Given** featured episode displays, **When** user clicks embedded player, **Then** video plays inline
3. **Given** featured episode displays, **When** user clicks "open in new window", **Then** YouTube video opens in new tab
4. **Given** user reloads homepage 3+ times, **When** page loads, **Then** different featured episodes appear (randomized)

---

### User Story 2 - Listener Browses Educational Episodes (Priority: P1)

A listener navigates to the Episodes page and discovers the "History & Education" section, browsing 3 of the most popular episodes from the educational playlist to learn about bourbon/whiskey production and history.

**Why this priority**: Core content discovery path; education is primary brand value.

**Independent Test**: Episodes page loads with History & Education section showing 3 popular episodes; each episode links to YouTube playlist.

**Acceptance Scenarios**:

1. **Given** Episodes page loads, **When** page displays, **Then** History & Education section shows 3 popular episodes (mocked data)
2. **Given** episode card displays, **When** user clicks episode, **Then** YouTube video opens
3. **Given** History & Education section displays, **When** no videos load, **Then** placeholder content shows gracefully

---

### User Story 3 - Listener Discovers Tasting Episodes (Priority: P1)

A listener interested in tastings navigates to the Episodes page and finds the "Tastings" section showcasing 3 of the most popular tasting episodes, allowing them to explore guided tasting content.

**Why this priority**: Tastings are core content category; creates distinct content paths for different audience segments.

**Independent Test**: Tastings section loads on Episodes page with 3 popular episodes from tastings playlist.

**Acceptance Scenarios**:

1. **Given** Episodes page loads, **When** page displays, **Then** Tastings section shows 3 popular episodes
2. **Given** tasting episode card displays, **When** user clicks episode, **Then** YouTube video opens
3. **Given** episode card displays, **When** mocked data available, **Then** title, thumbnail, and duration render correctly

---

### User Story 4 - Visitor Learns About the Hosts (Priority: P2)

A visitor wants to know more about the hosts and recurring guests, navigating to the About page to build trust and connection with the podcast team.

**Why this priority**: Builds audience relationship and credibility; secondary to content consumption but important for community building.

**Independent Test**: About page displays sections for primary host, cohost, and recurring guests with photos and bios.

**Acceptance Scenarios**:

1. **Given** About page loads, **When** page displays, **Then** 3+ distinct sections appear: "About Me", "My Cohost", "Recurring Guests"
2. **Given** host section displays, **When** section loads, **Then** photo, name, and bio text render correctly
3. **Given** guest section displays, **When** multiple guests listed, **Then** each guest has individual card with photo and brief bio

---

### User Story 5 - Reader Discovers Blog Posts in "The Glass Room" (Priority: P2)

A reader interested in deeper content explores "The Glass Room" section, browsing blog-style posts ordered by era or publication date. They can filter or sort posts to find topics of interest via table of contents.

**Why this priority**: Blog content extends engagement beyond video; creates evergreen SEO value and thought leadership.

**Independent Test**: Glass Room page loads with table of contents; posts display with era tags or dates; oldest posts appear first (configurable).

**Acceptance Scenarios**:

1. **Given** The Glass Room page loads, **When** page displays, **Then** table of contents appears with post list
2. **Given** posts display, **When** era folders exist, **Then** posts group by era (derived from folder path, e.g., `/glass-room/prohibition/`)
3. **Given** posts displayed, **When** sort by date, **Then** oldest posts appear first
4. **Given** post title clicked in TOC, **When** user selects post, **Then** page scrolls/navigates to full blog post content

---

### User Story 6 - Visitor Finds Answers in FAQ Page (Priority: P2)

A visitor has questions about the podcast, hosts, or tasting topics and navigates to the FAQ page to find quick answers without leaving the site.

**Why this priority**: Reduces support burden; improves user experience and engagement; builds credibility.

**Independent Test**: FAQ page loads with organized questions and answers; search/filter by category if multiple FAQs present.

**Acceptance Scenarios**:

1. **Given** FAQ page loads, **When** page displays, **Then** organized Q&A sections appear (grouped by category if applicable)
2. **Given** FAQ question displayed, **When** user clicks question, **Then** answer expands/reveals in readable format
3. **Given** multiple FAQs present, **When** user scrolls, **Then** all Q&As are accessible without horizontal scroll

---

### User Story 7 - Visitor Reaches Out via Email (Priority: P2)

A listener wants to contact the hosts—to suggest a topic, propose a guest, or provide feedback—and uses the Contact page to initiate an email.

**Why this priority**: Enables community engagement; allows business development; supports feedback loop.

**Independent Test**: Contact page loads with mailto link; clicking link opens user's email client.

**Acceptance Scenarios**:

1. **Given** Contact page loads, **When** page displays, **Then** mailto link to `website@bottle.bond` is prominently displayed
2. **Given** mailto link displays, **When** user clicks link, **Then** user's default email client opens with pre-filled recipient
3. **Given** Contact page loads, **When** page displays, **Then** clear instructions explain how to reach hosts via email

---

### User Story 8 - Content Editor Updates Blog Post (Priority: P3)

A content editor updates an existing blog post in The Glass Room with new information, schedule, or revised insights by editing the markdown file directly in the repository. Changes are published on the next site deployment.

**Why this priority**: Supports content lifecycle; enables blog maintenance and freshness post-launch; leverages version control for blog content.

**Independent Test**: Markdown file is edited, site rebuilds, and updated blog post content appears on Glass Room page with correct metadata (date, era, author).

**Acceptance Scenarios**:

1. **Given** blog post markdown file exists in `glass-room/` directory, **When** content editor edits the `.md` file, **Then** changes are tracked in git
2. **Given** markdown file is modified, **When** site deployment/build runs, **Then** blog post renders with updated content and frontmatter
3. **Given** post updated, **When** site rebuilds and deploys, **Then** Glass Room displays updated post with correct title, date, era, and author metadata

---

### Edge Cases

- **No featured episode available**: Homepage displays placeholder with site introduction or call-to-action
- **YouTube API unavailable**: Episode sections show cached thumbnails/titles; gracefully degrade to links
- **No blog posts published**: Glass Room shows welcome message and placeholder for first post
- **Network latency**: Skeleton loaders appear while content fetches; no content flashing
- **Mobile viewport**: All sections remain readable; embedded players scale responsively; mailto links remain functional
- **Email client unavailable**: Contact page displays email address as copyable text fallback
- **Empty FAQ section**: FAQ page shows "Coming soon" message or placeholder

---

## Requirements *(mandatory)*

### Functional Requirements

**Homepage:**
- **FR-001**: System MUST render landing page with one randomly selected featured episode from main YouTube feed (https://www.youtube.com/playlist?list=PLkEG2GQlU7uGJGHwexf0AwoUju_INoubZ)
- **FR-002**: Featured episode MUST include embedded YouTube player inline with option to open in new window
- **FR-003**: Featured episode selection MUST randomize on each page load; at least 3 distinct episodes appear across multiple reloads
- **FR-003a**: Homepage MUST display a preview of the latest Glass Room blog post (title, excerpt, link to full post)
- **FR-003b**: Homepage MUST include a brief "About the Hosts" teaser section with host photos and short tagline, linking to the About page
- **FR-003c**: Homepage MUST display social media links (YouTube, Instagram, Facebook, Patreon)
- **FR-003d**: Homepage MUST include a newsletter signup CTA section (visual placeholder; integration deferred to future feature)

**Episodes Page:**
- **FR-004**: System MUST display Episodes page with "History & Education" section showing 3 most popular episodes from educational playlist (https://www.youtube.com/playlist?list=PLkEG2GQlU7uFYy3tRx_YZ5CXg79I5bnhi)
- **FR-005**: System MUST display Episodes page with "Tastings" section showing 3 most popular episodes from tastings playlist
- **FR-005a**: System MUST display "Top Tastings of the Season" section featuring 5 manually curated seasonal tasting highlights (editor picks and ranks episodes with explicit `rank` and `season` fields in data file)
- **FR-005b**: System MUST display "Top 10 of All Time" section computed by sorting all episodes by `popularity` score descending and selecting the top 10
- **FR-006**: Each episode card MUST display title, thumbnail, duration, and link to YouTube
- **FR-006a**: Episode cards MUST include embedded YouTube player with click-to-open-in-new-window functionality

**About Page:**
- **FR-007**: System MUST provide About page with distinct sections for primary host, cohost, and recurring guests
- **FR-008**: Each host/guest section MUST display photo, name, role, and biographical text

**The Glass Room (Blog):**
- **FR-009**: System MUST support The Glass Room blog section by reading static markdown files from repository
- **FR-009a**: Each blog post MUST have its own individual page with a unique URL (e.g., `/glass-room/prohibition/the-history-of-bourbon/`)
- **FR-010**: System MUST order Glass Room posts by era (derived from folder structure) or publication date (oldest first, configurable)
- **FR-011**: Top-level Glass Room page (`/glass-room/`) MUST display a table of contents listing ALL posts across all eras
- **FR-011a**: Each era MUST have its own landing page (e.g., `/glass-room/prohibition/`) with a focused table of contents listing only posts in that era
- **FR-011b**: Era landing pages MUST include a navigation link back to the top-level Glass Room page
- **FR-012**: Blog post MUST support formatted text (markdown), images, and era hashtags
- **FR-012a**: System MUST parse blog post frontmatter (metadata: title, date, era, author, draft) from markdown files; draft posts use Hugo's built-in `draft: true` mechanism (hidden in production, visible with `hugo server -D`)

**FAQ Page:**
- **FR-013**: System MUST provide FAQ page with organized questions and answers
- **FR-014**: FAQ questions MUST expand/collapse or reveal answers on interaction

**Contact Page:**
- **FR-015**: System MUST provide Contact page with mailto link to `website@bottle.bond`
- **FR-016**: Mailto link MUST open user's default email client with pre-filled recipient address
- **FR-017**: Contact page MUST display clear instructions for reaching hosts via email

**General:**
- **FR-018**: System MUST render all content dynamically from data sources (mocked initially, APIs later)
- **FR-019**: System MUST apply consistent, minimalist design across all pages with earthy warm tones
- **FR-020**: System MUST support mobile-responsive design; all pages render correctly on viewport widths 320px–1920px
- **FR-021**: System MUST implement graceful error handling when data unavailable (show placeholders, fallback text)
- **FR-022**: System MUST include navigation menu/header linking to all pages (Home, About, Episodes, FAQ, Contact, The Glass Room)
- **FR-022a**: System MUST include a site footer on every page containing: social media icons (YouTube, Instagram, Facebook, Patreon), key navigation links (Home, About, Episodes, Contact), and a copyright notice
- **FR-023**: Initial content pull: System MAY reference existing bottle.bond website (https://bottle.bond) for biographical and FAQ content to seed mocked data

### Key Entities

- **Episode**: Title, description, YouTube video ID, playlist category (main, education, tastings, seasonal, top10), popularity score, thumbnail URL, duration, rank (for curated lists), season (for seasonal content)
- **Person**: Name, role (host, cohost, guest), bio, photo URL, social links (optional)
- **BlogPost**: Title, content, era (derived from folder path), publication date, author, last edited date, draft (boolean; Hugo built-in `draft: true` hides from production, visible with `-D` flag)
- **Playlist**: Name, YouTube ID, description, category (main, education, tastings, seasonal, top10)
- **FAQ**: Question, answer, category (optional)
- **Contact**: Email address for host communication (website@bottle.bond)

### Design & Styling Requirements

- **Color Palette**: 
  - Primary: Earthy warm tones (burnt sienna #8B4513, deep brown #654321, gold #D4AF37, dark orange #CD5C5C)
  - Secondary: Compatible blue accent (muted, e.g., slate blue #708090) used sparingly for highlights
  - Neutral: Off-white/cream (#F5F5F0), charcoal (#2C2C2C) for text/backgrounds
- **Aesthetic**: Minimalist, modern luxury; inspired by fireplace warmth (amber glows), overstuffed lounge chairs (comfortable spacing, rounded corners, soft shadows)
- **Typography**: Elegant serif (e.g., Georgia, Garamond) for headings; sophisticated sans-serif (e.g., Inter, Helvetica) for body; generous whitespace (line-height 1.6+); readable at all viewport sizes
- **Components**: Smooth transitions (200–300ms), subtle shadows (0 4px 6px rgba), warm hover states (slight color shift toward gold), rounded corners (8–12px)
- **Unique Visual Elements**: Vintage Distillery Aesthetic — aged paper textures, copper/brass accent colors, vintage typography flourishes, barrel-wood grain patterns

### Technical Requirements (Constitution-Aligned)

- **Dynamic Content**: All user-facing content rendered from structured data (mocked initially); architecture separates content from presentation
- **Security**: HTTPS enforced; static site with no user input processing; no secrets in source control
- **Performance**: Lazy-load blog posts; cache episode thumbnails; target <2s first-contentful-paint on 3G; <500ms page navigation
- **Accessibility**: WCAG 2.1 AA compliance; semantic HTML; alt text on all images; keyboard navigation support; form labels associated with inputs
- **Testing**: Unit tests for data transformations; integration tests for page loads; end-to-end test for featured episode display, blog post rendering, mailto link functionality
- **Data Source Attribution**: Initial content pulled from https://bottle.bond (hosts, FAQs, some episode metadata) for seamless transition

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Featured episode loads and plays within 3 seconds on 3G connection
- **SC-002**: Episodes page displays all 4 sections (education, tastings, seasonal top 5, top 10 all-time) without layout shift
- **SC-003**: About page renders all host/guest sections with images and text correctly on mobile (viewport 320px)
- **SC-004**: Glass Room loads table of contents in under 1 second; blog posts render with full formatting and era tags
- **SC-005**: FAQ page displays 5+ Q&As; all expand/collapse interactions work without delay
- **SC-006**: Contact page loads within 1 second; mailto link functions correctly across browsers
- **SC-007**: All pages pass WCAG 2.1 AA accessibility audit (no critical issues)
- **SC-008**: Site returns valid JSON from all mocked data endpoints; no console errors on page load
- **SC-009**: Navigation between pages completes in under 500ms; smooth, no flashing
- **SC-010**: Featured episode randomization verified across 10+ page reloads (different episodes appear)
- **SC-011**: Design is recognized as unique and visually distinct (subjective; verify through stakeholder review)

---

## Site Map & Page Structure

```
/ (Home/Landing)
  ├─ Featured Episode Section (randomly selected, embedded player)
  ├─ Latest Glass Room Blog Post Preview (title, excerpt, link)
  ├─ About the Hosts Teaser (photos, tagline, link to /about)
  ├─ Social Media Links (YouTube, Instagram, Facebook, Patreon)
  ├─ Newsletter Signup CTA (placeholder for future integration)
  ├─ Call-to-action to Episodes page

/about
  ├─ About Me (host bio + photo)
  ├─ My Cohost (cohost bio + photo)
  ├─ Recurring Guests (guest cards: name, role, bio, photo)

/episodes
  ├─ History & Education (3 popular episodes)
  ├─ Tastings (3 popular episodes)
  ├─ Top Tastings of the Season (curated seasonal highlights)
  ├─ Top 10 of All Time (best episodes across all categories)
  ├─ [Optional] View all episodes / playlist link

/glass-room (Blog)
  ├─ Top-Level Table of Contents (ALL posts across all eras, listed by era or date)
  ├─ /glass-room/<era>/ (Era Landing Pages)
  │   ├─ Focused Table of Contents (posts in this era only)
  │   ├─ Back-link to /glass-room/
  ├─ /glass-room/<era>/<post-slug>/ (Individual Post Pages)
  │   ├─ Full post content (rendered from markdown)

/faq
  ├─ Organized Q&A sections (collapsible)

/contact
  ├─ Mailto link (website@bottle.bond)
  ├─ Contact instructions

[Header/Nav]
  ├─ Logo
  ├─ Navigation menu (Home, About, Episodes, FAQ, Contact, The Glass Room)

[Footer] (all pages)
  ├─ Social media icons (YouTube, Instagram, Facebook, Patreon)
  ├─ Key navigation links (Home, About, Episodes, Contact)
  ├─ Copyright notice
```

---

## Data Model (Mocked)

### Initial Mock Data Structure

```json
{
  "featuredEpisode": {
    "id": "ep_001",
    "title": "Bourbon 101: The Basics",
    "youtubeId": "dQw4w9WgXcQ",
    "category": "education",
    "thumbnail": "https://...",
    "duration": "45:32",
    "description": "Learn the fundamentals of bourbon production and tasting notes."
  },
  "educationEpisodes": [
    { "id": "ep_edu_001", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 95 },
    { "id": "ep_edu_002", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 87 },
    { "id": "ep_edu_003", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 82 }
  ],
  "tastingEpisodes": [
    { "id": "ep_tst_001", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 91 },
    { "id": "ep_tst_002", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 88 },
    { "id": "ep_tst_003", "title": "...", "youtubeId": "...", "duration": "...", "popularity": 75 }
  ],
  "topTastingsOfSeason": [
    { "id": "ep_season_001", "title": "...", "youtubeId": "...", "duration": "...", "season": "Winter 2026", "rank": 1 },
    { "id": "ep_season_002", "title": "...", "youtubeId": "...", "duration": "...", "season": "Winter 2026", "rank": 2 },
    { "id": "ep_season_003", "title": "...", "youtubeId": "...", "duration": "...", "season": "Winter 2026", "rank": 3 }
  ],
  "top10AllTime": [
    { "id": "ep_top_001", "title": "...", "youtubeId": "...", "duration": "...", "rank": 1, "category": "education" },
    { "id": "ep_top_002", "title": "...", "youtubeId": "...", "duration": "...", "rank": 2, "category": "tastings" }
  ],
  "hosts": [
    { "id": "host_001", "name": "Host Name", "role": "Host", "bio": "...", "photo": "https://..." },
    { "id": "host_002", "name": "Cohost Name", "role": "Cohost", "bio": "...", "photo": "https://..." }
  ],
  "guests": [
    { "id": "guest_001", "name": "Guest Name", "role": "Recurring Guest", "bio": "...", "photo": "https://..." }
  ],
  "blogPosts": [
    {
      "id": "post_001",
      "title": "The History of Bourbon",
      "filename": "the-history-of-bourbon.md",
      "path": "glass-room/prohibition/the-history-of-bourbon.md",
      "era": "Prohibition",
      "date": "2026-01-15",
      "author": "Host Name",
      "summary": "Explore the origins and development of bourbon during the Prohibition era..."
    }
  ],
  "faqs": [
    { "id": "faq_001", "question": "What is bourbon?", "answer": "...", "category": "Basics" },
    { "id": "faq_002", "question": "How is bourbon made?", "answer": "...", "category": "Production" }
  ],
  "contact": {
    "email": "website@bottle.bond"
  }
}
```

---

## Implementation Notes

- **Data Source**: 
  - Episodes & metadata: Mocked in JSON or JavaScript objects; future YouTube API integration
  - Blog posts: Static markdown files stored in repository (`glass-room/` directory with era-based subfolders)
  - Hosts/guests: Mocked in JSON; future CMS or database integration
  - FAQs: Mocked in JSON; future integration with bottle.bond or dedicated CMS
- **Content Migration**: Initial seed data sourced from https://bottle.bond (hosts, FAQs, episode metadata) to ensure continuity during site transition
- **Blog File Structure**: 
  ```
  glass-room/
  ├── prohibition/
  │   ├── the-history-of-bourbon.md
  │   └── pre-war-bourbon.md
  ├── modern-era/
  │   └── craft-distilleries.md
  └── ...other-eras/
  ```
  Each markdown file includes frontmatter with title, date, era, author metadata.
- **Randomization**: Featured episode selected via client-side JavaScript random selection on page load
- **Blog Editing**: Edit markdown files directly in repository; changes auto-sync to site on deployment (CI/CD build)
- **Contact**: Mailto link opens user's default email client; no server-side form processing required
- **Deployment**: Hugo with hugo-universal-theme deployed to GitHub Pages via GitHub Actions; build-time markdown parsing for blog posts; no CDN required initially
- **Analytics**: Track featured episode selection distribution; monitor blog post engagement (view counts, time on page); track contact page visits

---

**Version**: 1.0.0 | **Last Updated**: 2026-01-29 | **Next Review**: When feature development begins
