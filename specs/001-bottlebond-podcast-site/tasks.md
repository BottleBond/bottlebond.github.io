# Tasks: BottleBond Podcast Website (Hugo)

**Input**: Design documents from `/specs/001-bottlebond-podcast-site/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), quickstart.md (complete)

**Tech Stack**: Hugo with hugo-universal-theme, deployed to GitHub Pages
**Tests**: Build validation via `hugo build`; manual verification via `hugo server`; optional Playwright E2E

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1-US8)
- Exact file paths included in descriptions

---

## Phase 1: Hugo Setup ✅ COMPLETE

**Purpose**: Hugo project initialization with theme configuration

- [x] T001 Install Hugo and verify version (v0.115.0+)
- [x] T002 Initialize Hugo project structure in repository root
- [x] T003 [P] Add hugo-universal-theme to `themes/` directory
- [x] T004 [P] Configure `hugo.toml` with site metadata, menu, and theme settings
- [x] T005 [P] Configure social links in hugo.toml (YouTube, Instagram, Facebook, Patreon)
- [x] T006 [P] Create GitHub Actions workflow for Hugo build and Pages deployment in `.github/workflows/deploy.yml`

---

## Phase 2: Content Structure ✅ COMPLETE

**Purpose**: Create data files and content structure for all pages

### Data Files

- [x] T007 Create episodes data file in `data/episodes.json` with episode metadata schema
- [x] T008 [P] Create playlists data file in `data/playlists.json` with YouTube playlist IDs
- [x] T009 [P] Create hosts data file with host/cohost/guest structure in `data/hosts.json`
- [x] T010 [P] Create FAQs data file in `data/faqs.json` with question/answer/category schema
- [x] T011 [P] Create top-tastings data file in `data/toptastings.json` with seasonal and all-time selections

### Content Pages

- [x] T012 Create homepage content in `content/_index.md` with frontmatter
- [x] T013 [P] Create about page content in `content/about.md` with frontmatter
- [x] T014 [P] Create episodes page content in `content/episodes.md` with frontmatter
- [x] T015 [P] Create FAQ page content in `content/faq.md` with frontmatter
- [x] T016 [P] Create contact page content in `content/contact.md` with frontmatter
- [x] T017 [P] Create Glass Room section index in `content/glass-room/_index.md`

**Checkpoint**: All content files created with proper frontmatter

---

## Phase 2.5: Content Migration (WordPress to Static)

**Purpose**: Migrate content and assets from bottle.bond WordPress site

### Image Assets Migration

- [ ] CM01 [P] Create image directory structure in `static/images/` (hosts/, guests/, blog/, logo/)
- [ ] CM02 [P] Download and optimize host photos from bottle.bond to `static/images/hosts/`
- [ ] CM03 [P] Download and optimize guest photos from bottle.bond to `static/images/guests/`
- [ ] CM04 [P] Download and optimize site logo (SVG preferred) to `static/images/logo/`

### Content Data Migration

- [ ] CM05 Extract host bios from bottle.bond About page and populate `data/hosts.json`
- [ ] CM06 [P] Extract cohost bio and populate `data/hosts.json`
- [ ] CM07 [P] Extract recurring guest bios and populate `data/hosts.json`
- [ ] CM08 Extract FAQ content from bottle.bond FAQ page and populate `data/faqs.json`
- [ ] CM09 Fetch episode metadata from YouTube playlists and populate `data/episodes.json`
- [ ] CM10 [P] Configure playlist metadata in `data/playlists.json` with YouTube playlist IDs
- [ ] CM11 [P] Curate and populate `data/toptastings.json` with seasonal and all-time selections

### Blog Content Migration

- [ ] CM12 Identify existing blog posts on bottle.bond for migration
- [ ] CM13 [P] Convert blog posts to Markdown format with proper frontmatter (title, date)
- [ ] CM14 [P] Download and optimize blog post images to `static/images/blog/`
- [ ] CM15 Place converted blog posts in appropriate era folders under `content/glass-room/`

### Validation

- [ ] CM16 Verify all JSON files are valid and data loads in templates
- [ ] CM17 [P] Verify all image paths are correct and images load properly
- [ ] CM18 Run `hugo build` to ensure all content integrates correctly

**Checkpoint**: All content migrated and validated

---

## Phase 3: Shortcodes for Dynamic Content ✅ COMPLETE

**Purpose**: Create Hugo shortcodes to render data from JSON files

- [x] T018 Create YouTube embed shortcode with privacy-enhanced mode in `layouts/shortcodes/youtube.html`
- [x] T019 [P] Create episodes shortcode with category/limit filters in `layouts/shortcodes/episodes.html`
- [x] T020 [P] Create hosts shortcode with role filter in `layouts/shortcodes/hosts.html`

**Checkpoint**: Shortcodes render data correctly in markdown content

---

## Phase 4: User Story 1 - Featured Episode on Homepage (Priority: P1) ✅ COMPLETE

**Goal**: New visitor sees engaging featured episode with embedded player on homepage

**Independent Test**: Homepage loads with featured episode section; theme renders correctly

### Implementation for User Story 1

- [x] T021 [US1] Configure hugo.toml params for homepage featured content and carousel settings
- [x] T022 [US1] Add hero section content to `content/_index.md` with featured episode reference
- [x] T023 [US1] Create client-side JavaScript for random episode selection in `static/js/featured-episode.js`
- [x] T024 [US1] Enable recent_posts section in hugo.toml for Glass Room preview
- [x] T025 [US1] Verify homepage renders with theme styling via `hugo server`

**Checkpoint**: Homepage displays with theme layout and featured content with randomization

---

## Phase 5: User Story 2 & 3 - Episodes Page (Priority: P1) ✅ COMPLETE

**Goal**: Listener browses History & Education and Tastings sections

**Independent Test**: Episodes page loads with all 4 episode sections

### Implementation for User Stories 2 & 3

- [x] T026 [US2] Update `content/episodes.md` with History & Education section using episodes shortcode
- [x] T027 [US2] Add Tastings section to episodes page using episodes shortcode with category="tastings"
- [x] T028 [US3] Add "Top Tastings of the Season" section with 5 episodes from toptastings data
- [x] T029 [US3] Add "Top 10 of All Time" section using toptastings data
- [x] T030 [US2] Add YouTube playlist link for "View All Episodes" below each section
- [x] T031 [US2] Verify episodes page renders correctly via `hugo server`

**Checkpoint**: Episodes page shows all 4 sections with episode cards

---

## Phase 6: User Story 4 - About the Hosts (Priority: P2) ✅ COMPLETE

**Goal**: Visitor learns about hosts and recurring guests on About page

**Independent Test**: About page displays host, cohost, and guest sections with photos and bios

### Implementation for User Story 4

- [x] T032 [US4] Update `content/about.md` with host section using hosts shortcode with role="host"
- [x] T033 [US4] Add cohost section using hosts shortcode with role="cohost"
- [x] T034 [US4] Add recurring guests section using hosts shortcode with role="guest"
- [x] T035 [US4] Verify about page renders correctly with photos and bios

**Checkpoint**: About page shows all host/guest sections

---

## Phase 7: User Story 5 - The Glass Room Blog (Priority: P2) ✅ COMPLETE

**Goal**: Reader explores era-organized blog posts

**Independent Test**: Glass Room page loads with posts grouped by era folder

### Implementation for User Story 5

- [x] T036 [US5] Create era folder structure: `content/glass-room/prohibition-era/`, `content/glass-room/modern-craft/`, `content/glass-room/homework/`
- [x] T037 [US5] Create sample blog post in `content/glass-room/prohibition-era/` with proper frontmatter
- [x] T038 [US5] Create sample blog post in `content/glass-room/modern-craft/` with proper frontmatter
- [x] T039 [US5] Create sample blog post in `content/glass-room/homework/` with proper frontmatter
- [x] T040 [US5] Verify Glass Room listing shows posts from all eras
- [x] T041 [US5] Verify individual blog post pages render correctly with YouTube embeds
- [x] T042 [US5] Add placeholder content when no blog posts exist

**Checkpoint**: Glass Room displays posts organized by era folders

---

## Phase 8: User Story 6 - FAQ Page (Priority: P2) ✅ COMPLETE

**Goal**: Visitor finds organized Q&A content

**Independent Test**: FAQ page loads with questions and answers that expand/collapse

### Implementation for User Story 6

- [x] T043 [US6] Create FAQ shortcode for rendering FAQs from data in `layouts/shortcodes/faqs.html`
- [x] T044 [US6] Update `content/faq.md` with FAQ shortcode to render questions from `data/faqs.json`
- [x] T045 [US6] Add at least 5 Q&A pairs in `data/faqs.json` covering Basics, Production, Tasting categories
- [x] T046 [US6] Verify FAQ page renders correctly with theme styling and expand/collapse

**Checkpoint**: FAQ page displays organized Q&As with interaction

---

## Phase 9: User Story 7 - Contact via Email (Priority: P2) ✅ COMPLETE

**Goal**: Visitor can contact hosts via email

**Independent Test**: Contact page displays mailto link; clicking opens email client

### Implementation for User Story 7

- [x] T047 [US7] Update `content/contact.md` with mailto link to `website@bottle.bond`
- [x] T048 [US7] Add clear instructions for reaching hosts via email
- [x] T049 [US7] Add email address as copyable text fallback for email client unavailable edge case
- [x] T050 [US7] Verify contact page renders correctly with mailto link

**Checkpoint**: Contact page displays mailto link and instructions

---

## Phase 10: User Story 8 - Content Editor Updates Blog (Priority: P3) ✅ COMPLETE

**Goal**: Content editor updates blog via markdown files

**Independent Test**: Edited markdown file rebuilds correctly with updated content

### Implementation for User Story 8

- [x] T051 [US8] Verify quickstart.md documents blog editing workflow
- [x] T052 [US8] Test full workflow: edit markdown -> `hugo build` -> verify output
- [x] T053 [US8] Verify frontmatter changes (title, date) propagate to rendered page

**Checkpoint**: Blog editing workflow documented and validated

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

### Accessibility

- [ ] T054 [P] Verify alt text on all images across the site
- [ ] T055 [P] Verify keyboard navigation works on interactive elements
- [ ] T056 [P] Test with screen reader for basic accessibility

### Performance

- [ ] T057 [P] Run `hugo --minify` for production build
- [ ] T058 [P] Verify <2s page load on throttled connection
- [ ] T059 [P] Optimize any large images in `static/images/`

### Final Testing

- [ ] T060 Cross-browser testing (Chrome, Firefox, Safari)
- [ ] T061 [P] Mobile responsive testing (320px-1920px viewports)
- [ ] T062 Verify all internal links work correctly

### Deployment

- [ ] T063 Verify GitHub Actions workflow deploys successfully
- [ ] T064 [P] Configure custom domain for GitHub Pages (if applicable)
- [ ] T065 Run quickstart.md validation to ensure developer setup works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Content Structure)**: Depends on Phase 1
- **Phase 2.5 (Content Migration)**: Can run in parallel with Phases 3-10
- **Phase 3 (Shortcodes)**: Depends on Phase 2; BLOCKS user stories needing dynamic data
- **Phases 4-10 (User Stories)**: Depend on Phase 3 for shortcodes
- **Phase 11 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Homepage)**: Requires theme configuration, client-side JS for randomization
- **US2-US3 (Episodes)**: Requires episodes shortcode (T019), episodes data from CM09
- **US4 (About)**: Requires hosts shortcode (T020), host photos from CM02-CM03
- **US5 (Blog)**: Requires blog posts from CM12-CM15
- **US6 (FAQ)**: Requires FAQ shortcode (T043), FAQ content from CM08
- **US7 (Contact)**: Independent (mailto only)
- **US8 (Editor)**: Depends on US5 (blog implementation)

### Parallel Opportunities

- All Phase 2 data files (T007-T011) can run in parallel
- All Phase 2 content files (T012-T017) can run in parallel
- All Content Migration tasks marked [P] can run in parallel
- Phase 3 shortcodes (T019, T020) can run in parallel after T018
- User stories US4, US6, US7 can run in parallel after shortcodes complete
- All Phase 11 tasks marked [P] can run in parallel

---

## Parallel Example: Phase 2 Content Structure

```bash
# Launch all data files together:
Task: "Create episodes data file in data/episodes.json"
Task: "Create playlists data file in data/playlists.json"
Task: "Create hosts data file in data/hosts.json"
Task: "Create FAQs data file in data/faqs.json"
Task: "Create top-tastings data file in data/toptastings.json"

# Launch all content pages together:
Task: "Create about page content in content/about.md"
Task: "Create episodes page content in content/episodes.md"
Task: "Create FAQ page content in content/faq.md"
Task: "Create contact page content in content/contact.md"
Task: "Create Glass Room section index in content/glass-room/_index.md"
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Hugo Setup
2. Complete Phase 2: Content Structure
3. Complete Phase 3: Shortcodes (T018-T020)
4. Complete Phase 4: US1 - Homepage
5. Complete Phase 5: US2-US3 - Episodes Page
6. **STOP and VALIDATE**: Test with `hugo server`
7. Deploy to GitHub Pages for MVP review

### Incremental Delivery

1. Setup + Content Structure -> Foundation ready
2. Shortcodes -> Dynamic content working
3. US1 (Homepage) -> Deploy (MVP v0.1)
4. US2-US3 (Episodes) -> Deploy (MVP v0.2)
5. US4 (About) + Content Migration -> Deploy
6. US5 (Blog) + Blog Migration -> Deploy
7. US6 (FAQ) + FAQ Migration -> Deploy
8. US7 (Contact) -> Deploy
9. US8 + Polish -> Final release

---

## Notes

- Hugo builds are fast (<1s); iterate quickly with `hugo server`
- Theme provides Bootstrap 3 styling - leverage existing classes
- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Client-side JavaScript handles featured episode randomization (per spec clarification)
