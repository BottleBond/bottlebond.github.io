# Tasks: BottleBond Podcast Website

**Input**: Design documents from `/specs/001-bottlebond-podcast-site/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No automated tests requested in spec. Verification tasks use `hugo server -D` and `hugo --minify` to confirm rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install theme and configure CI/CD for submodule checkout

- [x] T001 Install hugo-universal-theme as a Git submodule at themes/hugo-universal-theme/ by running `git submodule add https://github.com/devcows/hugo-universal-theme.git themes/hugo-universal-theme`
- [x] T002 [P] Add `submodules: true` to the `actions/checkout@v4` step in .github/workflows/deploy.yml so CI fetches the theme during builds
- [x] T003 Verify Hugo builds successfully with the installed theme by running `hugo --minify` and confirming zero errors

---

## Phase 2: Foundational (Styling & Base Templates)

**Purpose**: Custom CSS and template infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create static/css/bottlebond.css with: CSS custom properties (design tokens: `--bb-burnt-sienna: #8B4513`, `--bb-deep-brown: #654321`, `--bb-gold: #D4AF37`, `--bb-copper: #B87333`, `--bb-brass: #C9AE5D`, `--bb-cream: #F5F5F0`, `--bb-charcoal: #2C2C2C`, `--bb-radius: 8px`, `--bb-shadow: 0 4px 6px rgba(0,0,0,0.1)`, `--bb-transition: 200ms ease`), Google Fonts imports (Playfair Display for headings, Lora for body), typography rules (serif headings, line-height 1.6+), and component styles for episode cards, host cards, FAQ accordion panels, top-tasting cards, navigation bar, and footer; apply vintage distillery aesthetic with CSS-only textures/gradients, warm hover states (shift toward gold), rounded corners (8px), and subtle shadows
- [x] T005 [P] Create layouts/partials/custom_headers.html to include `<link>` to /css/bottlebond.css so custom styles load on all pages (hugo-universal-theme supports this partial hook)
- [x] T006 Verify theme renders with custom vintage distillery styling by running `hugo server -D` and confirming design tokens, typography, and component styles apply correctly

**Checkpoint**: Foundation ready — all pages render with theme + custom styling

---

## Phase 3: User Story 1 — Visitor Discovers Featured Episode on Landing Page (Priority: P1) 🎯 MVP

**Goal**: Homepage displays full showcase: randomly selected featured episode, carousel hero, content features, latest Glass Room post, host teaser, social links, and newsletter CTA

**Independent Test**: Homepage loads at `/` with all 7 showcase sections rendering; featured episode changes across page reloads

### Implementation for User Story 1

- [x] T007 [US1] Configure homepage widgets in hugo.toml: enable `[params.testimonials]` with host/cohost entries (name, tagline, photo from data/hosts.json) for the host teaser section; enable `[params.see_more]` with newsletter CTA placeholder text, icon, and subtitle (integration deferred per FR-003d)
- [x] T008 [US1] Verify complete homepage showcase by running `hugo server -D` and confirming: (1) carousel hero banner renders, (2) featured episode loads with random selection and YouTube embed, (3) features section shows 3 content category highlights, (4) recent Glass Room post preview appears, (5) host teaser section shows host photos and taglines, (6) newsletter CTA placeholder displays, (7) social links visible in topbar

**Checkpoint**: Homepage fully functional with all showcase sections

---

## Phase 4: User Story 2 — Listener Browses Educational Episodes (Priority: P1)

**Goal**: Episodes page displays History & Education section with 3 most popular education episodes, plus correctly computed Top 10 of All Time

**Independent Test**: Episodes page loads with education section showing 3 episodes sorted by popularity; Top 10 section shows 10 episodes computed from popularity scores

### Implementation for User Story 2

- [x] T009 [US2] Update layouts/shortcodes/top-tastings.html: when `type="alltime"`, compute the ranked list by sorting ALL episodes from `site.Data.episodes.episodes` by `popularity` descending and taking the top N, instead of reading from `$toptastings.allTime`; assign rank dynamically (1-based index); preserve existing seasonal behavior unchanged (FR-005b)
- [x] T010 [US2] Verify Episodes page History & Education section renders 3 popular episodes with title, thumbnail, duration, and YouTube link by running `hugo server -D` and loading /episodes/

**Checkpoint**: Education episodes display correctly; Top 10 computed from popularity

---

## Phase 5: User Story 3 — Listener Discovers Tasting Episodes (Priority: P1)

**Goal**: Episodes page displays Tastings section with 3 popular tasting episodes, Top Tastings of the Season (5 curated), and Top 10 of All Time (10 computed)

**Independent Test**: All 4 episode sections render on /episodes/ with correct data and YouTube links

### Implementation for User Story 3

- [x] T011 [US3] Verify Episodes page renders all 4 sections: History & Education (3 episodes), Tastings (3 episodes), Top Tastings of the Season (5 curated from toptastings.json seasonal), and Top 10 of All Time (10 computed from episodes.json popularity) by loading /episodes/ in `hugo server -D`

**Checkpoint**: Full episodes page functional with all sections

---

## Phase 6: User Story 4 — Visitor Learns About the Hosts (Priority: P2)

**Goal**: About page displays distinct sections for host, cohost, and recurring guests with photos, names, roles, and bios

**Independent Test**: About page loads at /about/ with 3 sections populated from data/hosts.json

### Implementation for User Story 4

- [x] T012 [US4] Verify About page renders host section (1 host), cohost section (1 cohost), and recurring guests section (3 guests) with photos, names, roles, bios, and social links from data/hosts.json by loading /about/ in `hugo server -D`

**Checkpoint**: About page fully functional with all host/guest data

---

## Phase 7: User Story 5 — Reader Discovers Blog Posts in "The Glass Room" (Priority: P2)

**Goal**: Glass Room section provides two-tier navigation: top-level TOC listing all posts across eras, era landing pages with focused TOC and back-link, and individual blog post pages

**Independent Test**: /glass-room/ shows all-posts TOC grouped by era; /glass-room/prohibition-era/ shows era posts with back-link; /glass-room/prohibition-era/the-whiskey-rebellion/ renders full blog post

### Implementation for User Story 5

- [x] T013 [P] [US5] Create content/glass-room/prohibition-era/_index.md with frontmatter: title "Prohibition Era", description of the era covering whiskey during Prohibition (1920–1933)
- [x] T014 [P] [US5] Create content/glass-room/modern-craft/_index.md with frontmatter: title "Modern Craft", description of the modern craft distilling movement
- [x] T015 [P] [US5] Create content/glass-room/homework/_index.md with frontmatter: title "Homework", description of educational deep-dives and research topics
- [x] T016 [US5] Create layouts/glass-room/list.html template that handles two-tier navigation: at top-level depth (section = glass-room), display all era sections via `.Sections` with links to era landing pages, then list ALL posts across eras via `.RegularPagesRecursive` sorted by date; at era depth, display era title and description, list posts within that era via `.RegularPages` sorted by date, and include a back-link to /glass-room/ (use depth check: `eq .CurrentSection.Title "The Glass Room"` or `.Parent` comparison)
- [x] T017 [P] [US5] Create layouts/glass-room/single.html template for individual blog post pages displaying: post title, date (formatted per hugo.toml date_format), era label (from frontmatter), author name, full markdown content, and breadcrumb navigation back to era landing page and top-level Glass Room
- [x] T018 [US5] Update content/glass-room/_index.md to remove the static "Browse by Era" text and let the new list.html template generate the dynamic TOC from section hierarchy

**Checkpoint**: Two-tier Glass Room navigation fully functional with era landing pages and individual posts

---

## Phase 8: User Story 6 — Visitor Finds Answers in FAQ Page (Priority: P2)

**Goal**: FAQ page displays organized Q&A sections grouped by category with expand/collapse accordion

**Independent Test**: FAQ page loads at /faq/ with 10 FAQs across 5 categories; clicking questions expands answers

### Implementation for User Story 6

- [x] T019 [US6] Verify FAQ page renders all 10 FAQs grouped by category (Basics, Production, Tasting, Podcast, General) with collapsible accordion from data/faqs.json by loading /faq/ in `hugo server -D`; confirm first FAQ in each category is expanded by default and chevron icon rotates on toggle

**Checkpoint**: FAQ page fully functional with accordion interaction

---

## Phase 9: User Story 7 — Visitor Reaches Out via Email (Priority: P2)

**Goal**: Contact page displays mailto link to website@bottle.bond with clear instructions

**Independent Test**: Contact page loads at /contact/ with functional mailto link and social media links

### Implementation for User Story 7

- [x] T020 [US7] Verify Contact page renders mailto link to website@bottle.bond, email copy fallback text, contact instructions, and social media links by loading /contact/ in `hugo server -D`; confirm mailto link opens email client

**Checkpoint**: Contact page fully functional with mailto and social links

---

## Phase 10: User Story 8 — Content Editor Updates Blog Post (Priority: P3)

**Goal**: Blog post markdown files have complete frontmatter supporting Hugo's draft system; edits render correctly after rebuild

**Independent Test**: Edit a blog post markdown file, run `hugo server -D`, verify updated content renders with correct metadata

### Implementation for User Story 8

- [x] T021 [US8] Review all blog post markdown files in content/glass-room/*/ and ensure each has complete frontmatter fields: title, date, era, author, description, tags, and draft (set to `false` for published posts); add any missing fields per the BlogPost entity in data-model.md

**Checkpoint**: All blog posts have complete frontmatter and draft system works

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, footer verification, production build validation, accessibility

- [x] T022 [P] Add responsive CSS media queries to static/css/bottlebond.css for mobile (max-width: 768px), tablet (max-width: 1024px), and desktop viewports (up to 1920px); ensure episode cards stack vertically on mobile, host photos scale appropriately, and all text remains readable at 320px viewport width
- [x] T023 [P] Verify site footer renders on all pages with social media icons (YouTube, Instagram, Facebook, Patreon), key navigation links, and copyright notice (FR-022a); if theme footer does not include explicit page nav links, create layouts/partials/footer-custom.html override to add them
- [x] T024 Validate production build by running `hugo --minify`; confirm zero errors, all pages generate to public/ directory, and draft posts are excluded from output
- [x] T025 Run quickstart.md validation: start `hugo server -D`, verify all 6 pages load (/, /episodes/, /about/, /glass-room/, /faq/, /contact/), verify data-driven content renders from JSON files, verify Glass Room two-tier navigation works end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (theme must be installed first) — BLOCKS all user stories
- **User Stories (Phases 3–10)**: All depend on Foundational phase completion
  - US1, US2, US3, US4, US5, US6, US7, US8 can then proceed in parallel
  - Recommended sequential order: US1 → US2 → US3 → US5 → US4 → US6 → US7 → US8
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — homepage widgets configured in hugo.toml
- **US2 (P1)**: No dependencies on other stories — requires top-tastings.html shortcode update (T009)
- **US3 (P1)**: Depends on US2's T009 (top-tastings shortcode update) for correct all-time computation
- **US4 (P2)**: No dependencies on other stories — About page uses existing hosts.html shortcode
- **US5 (P2)**: No dependencies on other stories — creates new templates and _index.md files
- **US6 (P2)**: No dependencies on other stories — FAQ page uses existing faqs.html shortcode
- **US7 (P2)**: No dependencies on other stories — Contact page already complete
- **US8 (P3)**: Depends on US5 (Glass Room templates must exist for blog post rendering)

### Within Each User Story

- Configuration/data tasks before template/layout tasks
- Template creation before content updates
- Implementation before verification

### Parallel Opportunities

- **Setup**: T001 and T002 can run in parallel (different files)
- **Foundational**: T004 and T005 can run in parallel (CSS vs. partial template)
- **US5 (Glass Room)**: T013, T014, T015 all parallel (different _index.md files); T016 and T017 parallel (list vs. single template)
- **Polish**: T022 and T023 can run in parallel
- **Cross-story**: Once Foundational completes, US1–US4 and US6–US7 can all start in parallel (independent pages)

---

## Parallel Example: User Story 5 (Glass Room)

```bash
# Launch all era _index.md files together (different files, no deps):
Task: "Create content/glass-room/prohibition-era/_index.md"
Task: "Create content/glass-room/modern-craft/_index.md"
Task: "Create content/glass-room/homework/_index.md"

# Launch both templates together (different files, no deps):
Task: "Create layouts/glass-room/list.html"
Task: "Create layouts/glass-room/single.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install theme, update CI)
2. Complete Phase 2: Foundational (CSS, head partial)
3. Complete Phase 3: User Story 1 (homepage showcase)
4. **STOP and VALIDATE**: Test homepage with `hugo server -D`
5. Deploy/demo if ready — homepage is the primary landing experience

### Incremental Delivery

1. Setup + Foundational → Theme renders with custom styling
2. US1 (Homepage) → Full showcase landing page (MVP!)
3. US2 + US3 (Episodes) → Complete episodes browsing experience
4. US5 (Glass Room) → Two-tier blog navigation
5. US4 + US6 + US7 (About, FAQ, Contact) → Supporting pages
6. US8 (Draft system) → Content editing workflow
7. Polish → Responsive design, footer, production validation

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Most content pages and shortcodes already exist — primary work is theme installation, CSS, Glass Room templates, and Top 10 computation fix
- Existing shortcodes (episodes, hosts, faqs, featured-episode, top-tastings, youtube) are reused as-is except T009 (top-tastings all-time computation)
- All 5 JSON data files (episodes, hosts, faqs, playlists, toptastings) are complete and require no modifications
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
