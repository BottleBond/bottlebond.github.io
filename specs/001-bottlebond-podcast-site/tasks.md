# Tasks: BottleBond Podcast Website

**Input**: Design documents from `/specs/001-bottlebond-podcast-site/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/types.ts (complete)

**Tests**: Unit/integration tests with Jest + React Testing Library; E2E tests with Playwright as specified in plan.md

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1-US8)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and Next.js configuration for GitHub Pages

- [x] T001 Initialize Next.js 14+ project with TypeScript in repository root
- [x] T002 Configure `next.config.js` with `output: 'export'` and `trailingSlash: true` for GitHub Pages
- [x] T003 [P] Install and configure Tailwind CSS with custom earth tone theme in `tailwind.config.ts`
- [x] T004 [P] Configure TypeScript with strict mode in `tsconfig.json`
- [x] T005 [P] Install dependencies: gray-matter, remark, rehype, rehype-raw, rehype-slug in `package.json`
- [x] T006 [P] Create project directory structure per plan.md (`src/app/`, `src/components/`, `src/lib/`, `src/content/`)
- [x] T007 [P] Configure ESLint and Prettier for code quality
- [x] T008 [P] Setup Jest and React Testing Library in `jest.config.js`
- [x] T009 [P] Setup Playwright for E2E testing in `playwright.config.ts`
- [x] T010 Copy TypeScript contracts from `specs/001-bottlebond-podcast-site/contracts/types.ts` to `src/types/index.ts`
- [x] T011 [P] Configure custom fonts (Cormorant Garamond, Inter) in `src/app/layout.tsx`
- [x] T012 [P] Create GitHub Actions workflow for static export and Pages deployment in `.github/workflows/deploy.yml`

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Global Styles

- [x] T013 Create global CSS with Tailwind base, components, and utilities in `src/styles/globals.css`
- [x] T014 [P] Define CSS custom properties for color palette (burnt sienna, deep brown, gold, cream, charcoal) in `src/styles/globals.css`

### Layout Components

- [x] T015 Create root layout with metadata and font configuration in `src/app/layout.tsx`
- [x] T016 [P] Create Header component with logo and navigation in `src/components/layout/Header.tsx`
- [x] T017 [P] Create Navigation component with responsive mobile menu in `src/components/layout/Navigation.tsx`
- [x] T018 [P] Create Footer component with social links in `src/components/layout/Footer.tsx`
- [x] T019 Integrate Header, Navigation, and Footer into root layout

### UI Primitives

- [x] T020 [P] Create Button component with warm hover states in `src/components/ui/Button.tsx`
- [x] T021 [P] Create Card component with shadow and rounded corners in `src/components/ui/Card.tsx`
- [x] T022 [P] Create Section component for page sections in `src/components/ui/Section.tsx`
- [x] T023 [P] Create Skeleton loader component for lazy loading in `src/components/ui/Skeleton.tsx`

### Data Layer

- [x] T024 Create mock episodes data file with sample episodes in `src/content/episodes.json`
- [x] T025 [P] Create mock playlists data file in `src/content/playlists.json`
- [x] T026 [P] Create mock hosts data file with host/cohost/guest data in `src/content/hosts.json`
- [x] T027 [P] Create mock FAQs data file in `src/content/faqs.json`
- [x] T028 [P] Create mock top-tastings data file in `src/content/top-tastings.json`
- [x] T029 Create episodes data utility functions (getEpisodes, getEpisodeById, getEpisodesByPlaylist) in `src/lib/data/episodes.ts`
- [x] T030 [P] Create playlists data utility functions in `src/lib/data/playlists.ts`
- [x] T031 [P] Create hosts data utility functions (getHosts, getGuests) in `src/lib/data/hosts.ts`
- [x] T032 [P] Create top-tastings data utility functions in `src/lib/data/top-tastings.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 2.5: Content Migration (WordPress to Static)

**Purpose**: Migrate all content and assets from the existing bottle.bond WordPress site to the new static site format

**Note**: This phase can run in parallel with user story implementation. Content files are needed before final testing.

### Image Assets Migration

- [ ] CM01 [P] Create image directory structure in `public/images/` (hosts/, guests/, blog/, logo/, icons/)
- [ ] CM02 [P] Download and optimize host photos from bottle.bond About page to `public/images/hosts/`
- [ ] CM03 [P] Download and optimize guest photos from bottle.bond to `public/images/guests/`
- [ ] CM04 [P] Download and optimize site logo (SVG preferred) to `public/images/logo/`
- [ ] CM05 [P] Create/download social media icons to `public/images/icons/`

### Content Data Migration

- [ ] CM06 Extract host bios from bottle.bond About page and populate `src/content/hosts.json`
- [ ] CM07 [P] Extract cohost bio and populate `src/content/hosts.json`
- [ ] CM08 [P] Extract recurring guest bios and populate `src/content/hosts.json`
- [ ] CM09 Extract FAQ content from bottle.bond FAQ page and populate `src/content/faqs.json`
- [ ] CM10 Fetch episode metadata from YouTube playlists and populate `src/content/episodes.json`
- [ ] CM11 [P] Configure playlist metadata in `src/content/playlists.json` with YouTube playlist IDs
- [ ] CM12 [P] Curate and populate `src/content/top-tastings.json` with seasonal and all-time selections

### Blog Content Migration

- [ ] CM13 Identify existing blog posts on bottle.bond for migration
- [ ] CM14 [P] Convert blog posts to Markdown format with proper frontmatter (title, date, era, author)
- [ ] CM15 [P] Download and optimize blog post images to `public/images/blog/{post-slug}/`
- [ ] CM16 Place converted blog posts in appropriate era folders under `src/content/glass-room/`

### Validation

- [ ] CM17 Validate all JSON files against TypeScript contracts in `src/types/index.ts`
- [ ] CM18 [P] Verify all image paths are correct and images load properly
- [ ] CM19 [P] Verify blog post frontmatter matches BlogPostFrontmatter interface
- [ ] CM20 Run build to ensure all content integrates correctly

**Checkpoint**: All content migrated and validated - ready for final testing with real data

---

## Phase 3: User Story 1 - Featured Episode on Landing Page (Priority: P1) ✅ COMPLETE

**Goal**: New visitor sees engaging featured episode with embedded player on homepage

**Independent Test**: Homepage loads with randomly selected featured episode; embed player functions and opens in new window

### Tests for User Story 1

- [x] T033 [P] [US1] Unit test for random episode selection logic in `tests/unit/lib/episodes.test.ts`
- [x] T034 [P] [US1] Integration test for homepage rendering with featured episode in `tests/integration/homepage.test.tsx`
- [x] T035 [P] [US1] E2E test for featured episode play and open-in-new-window in `tests/e2e/homepage.spec.ts`

### Implementation for User Story 1

- [x] T036 [US1] Create YouTubeEmbed facade component with privacy-enhanced mode in `src/components/episodes/YouTubeEmbed.tsx`
- [x] T037 [US1] Implement click-to-play facade with thumbnail placeholder in YouTubeEmbed
- [x] T038 [US1] Add open-in-new-window button to YouTubeEmbed component
- [x] T039 [US1] Implement getRandomFeaturedEpisode function in `src/lib/data/episodes.ts`
- [x] T040 [US1] Create FeaturedEpisode section component in `src/components/episodes/FeaturedEpisode.tsx`
- [x] T041 [US1] Create homepage with featured episode section in `src/app/page.tsx`
- [x] T042 [US1] Add hero section with site introduction and call-to-action on homepage
- [x] T043 [US1] Implement graceful fallback when no featured episode available

**Checkpoint**: Homepage displays random featured episode with working embed player

---

## Phase 4: User Story 2 - Educational Episodes (Priority: P1) ✅ COMPLETE

**Goal**: Listener browses History & Education section on Episodes page

**Independent Test**: Episodes page loads with History & Education section showing 3 popular episodes

### Tests for User Story 2

- [x] T044 [P] [US2] Unit test for getPopularEpisodesByCategory function in `tests/unit/lib/episodes.test.ts`
- [x] T045 [P] [US2] Integration test for Education section rendering in `tests/integration/episodes-page.test.tsx`

### Implementation for User Story 2

- [x] T046 [US2] Create EpisodeCard component with title, thumbnail, duration in `src/components/episodes/EpisodeCard.tsx`
- [x] T047 [US2] Create EpisodeSection component for displaying episode groups in `src/components/episodes/EpisodeSection.tsx`
- [x] T048 [US2] Implement getPopularEpisodesByPlaylist function in `src/lib/data/episodes.ts`
- [x] T049 [US2] Create Episodes page structure in `src/app/episodes/page.tsx`
- [x] T050 [US2] Add History & Education section to Episodes page with 3 popular episodes
- [x] T051 [US2] Implement placeholder content for graceful degradation when no videos load

**Checkpoint**: Episodes page shows History & Education section with 3 episodes

---

## Phase 5: User Story 3 - Tasting Episodes (Priority: P1) ✅ COMPLETE

**Goal**: Listener discovers Tastings section and curated Top Tastings on Episodes page

**Independent Test**: Tastings section loads with 3 popular episodes; Top 5 of Season and Top 10 All Time display

### Tests for User Story 3

- [x] T052 [P] [US3] Unit test for top tastings data functions in `tests/unit/lib/top-tastings.test.ts`
- [x] T053 [P] [US3] Integration test for all episode sections rendering in `tests/integration/episodes-page.test.tsx`

### Implementation for User Story 3

- [x] T054 [US3] Add Tastings section to Episodes page with 3 popular episodes
- [x] T055 [US3] Create TopTastingCard component with rank display in `src/components/episodes/TopTastingCard.tsx`
- [x] T056 [US3] Implement getSeasonalTopTastings function in `src/lib/data/top-tastings.ts`
- [x] T057 [US3] Implement getAllTimeTopTastings function in `src/lib/data/top-tastings.ts`
- [x] T058 [US3] Add "Top Tastings of the Season" section (5 episodes) to Episodes page
- [x] T059 [US3] Add "Top 10 of All Time" section to Episodes page
- [x] T060 [US3] Add YouTube playlist link for "View All Episodes"

**Checkpoint**: Episodes page shows all 4 sections (Education, Tastings, Seasonal Top 5, All Time Top 10)

---

## Phase 6: User Story 4 - About the Hosts (Priority: P2) ✅ COMPLETE

**Goal**: Visitor learns about hosts and recurring guests on About page

**Independent Test**: About page displays sections for host, cohost, and guests with photos and bios

### Tests for User Story 4

- [x] T061 [P] [US4] Unit test for hosts data functions in `tests/unit/lib/hosts.test.ts`
- [x] T062 [P] [US4] Integration test for About page rendering in `tests/integration/about-page.test.tsx`

### Implementation for User Story 4

- [x] T063 [US4] Create PersonCard component with photo, name, role, bio in `src/components/about/PersonCard.tsx`
- [x] T064 [US4] Create HostSection component for featured host display in `src/components/about/HostSection.tsx`
- [x] T065 [US4] Create GuestGrid component for recurring guests in `src/components/about/GuestGrid.tsx`
- [x] T066 [US4] Add social links display to PersonCard component
- [x] T067 [US4] Create About page with "About Me", "My Cohost", "Recurring Guests" sections in `src/app/about/page.tsx`
- [x] T068 [US4] Implement mobile-responsive layout for About page (320px-1920px)

**Checkpoint**: About page shows all host/guest sections with photos and bios

---

## Phase 7: User Story 5 - The Glass Room Blog (Priority: P2) ✅ COMPLETE

**Goal**: Reader explores era-organized blog posts with table of contents

**Independent Test**: Glass Room page loads with TOC; posts group by era from folder structure

### Tests for User Story 5

- [x] T069 [P] [US5] Unit test for markdown parsing and frontmatter extraction in `tests/unit/lib/posts.test.ts`
- [x] T070 [P] [US5] Unit test for era detection from folder path in `tests/unit/lib/posts.test.ts`
- [x] T071 [P] [US5] Integration test for Glass Room listing page in `tests/integration/glass-room.test.tsx`
- [x] T072 [P] [US5] Integration test for individual blog post rendering in `tests/integration/blog-post.test.tsx`

### Implementation for User Story 5

- [x] T073 [US5] Create markdown processing utilities (frontmatter parsing, HTML conversion) in `src/lib/utils/markdown.ts`
- [x] T074 [US5] Create blog posts data functions (getAllPosts, getPostBySlug, getPostsByEra) in `src/lib/data/posts.ts`
- [x] T075 [US5] Implement era detection from folder structure (e.g., `/glass-room/prohibition/`)
- [x] T076 [US5] Create sample blog posts in era folders under `src/content/glass-room/`
- [x] T077 [US5] Create BlogCard component for post previews in `src/components/blog/BlogCard.tsx`
- [x] T078 [US5] Create TableOfContents component with era groupings in `src/components/blog/TableOfContents.tsx`
- [x] T079 [US5] Create MarkdownRenderer component for blog content in `src/components/blog/MarkdownRenderer.tsx`
- [x] T080 [US5] Create Glass Room listing page with TOC in `src/app/glass-room/page.tsx`
- [x] T081 [US5] Create dynamic blog post page with slug routing in `src/app/glass-room/[slug]/page.tsx`
- [x] T082 [US5] Implement generateStaticParams for static export of blog post pages
- [x] T083 [US5] Implement oldest-first date sorting (configurable)
- [x] T084 [US5] Add placeholder content when no blog posts exist

**Checkpoint**: Glass Room displays era-grouped posts with working navigation to individual posts

---

## Phase 8: User Story 6 - FAQ Page (Priority: P2) ✅ COMPLETE

**Goal**: Visitor finds organized Q&A content with expandable answers

**Independent Test**: FAQ page loads with categorized questions; answers expand on click

### Tests for User Story 6

- [x] T085 [P] [US6] Unit test for FAQ data functions in `tests/unit/lib/faqs.test.ts`
- [x] T086 [P] [US6] Integration test for FAQ page interactions in `tests/integration/faq-page.test.tsx`

### Implementation for User Story 6

- [x] T087 [US6] Create FAQ data functions (getAllFAQs, getFAQsByCategory) in `src/lib/data/faqs.ts`
- [x] T088 [US6] Create FAQItem component with expand/collapse functionality in `src/components/faq/FAQItem.tsx`
- [x] T089 [US6] Create FAQCategory component for grouped display in `src/components/faq/FAQCategory.tsx`
- [x] T090 [US6] Create FAQ page with categorized Q&A sections in `src/app/faq/page.tsx`
- [x] T091 [US6] Implement keyboard accessibility for FAQ expand/collapse
- [x] T092 [US6] Add "Coming soon" placeholder when FAQ section is empty

**Checkpoint**: FAQ page displays organized, expandable Q&As by category

---

## Phase 9: User Story 7 - Contact Form (Priority: P2) ✅ COMPLETE

**Goal**: Visitor submits message via contact form with validation

**Independent Test**: Contact form validates fields; submission shows success message

### Tests for User Story 7

- [x] T093 [P] [US7] Unit test for form validation logic in `tests/unit/components/ContactForm.test.tsx`
- [x] T094 [P] [US7] Integration test for contact form submission in `tests/integration/contact-page.test.tsx`
- [x] T095 [P] [US7] E2E test for full contact form flow in `tests/e2e/contact.spec.ts`

### Implementation for User Story 7

- [x] T096 [US7] Create ContactForm component with name, email, subject, message fields in `src/components/forms/ContactForm.tsx`
- [x] T097 [US7] Implement form validation (required fields, email format)
- [x] T098 [US7] Integrate Web3Forms for serverless form submission
- [x] T099 [US7] Create success/error message states in ContactForm
- [x] T100 [US7] Create Contact page with form in `src/app/contact/page.tsx`
- [x] T101 [US7] Add input sanitization for security
- [x] T102 [US7] Implement accessible form labels and error announcements

**Checkpoint**: Contact form validates, submits to Web3Forms, and displays success/error

---

## Phase 10: User Story 8 - Content Editor Updates Blog (Priority: P3) ✅ COMPLETE

**Goal**: Content editor updates blog via markdown files; changes deploy automatically

**Independent Test**: Edited markdown file rebuilds correctly with updated content and metadata

### Tests for User Story 8

- [x] T103 [P] [US8] Integration test for frontmatter updates in blog posts in `tests/integration/blog-post.test.tsx`

### Implementation for User Story 8

- [x] T104 [US8] Document blog post markdown format and frontmatter schema in `specs/001-bottlebond-podcast-site/quickstart.md`
- [x] T105 [US8] Add build-time validation for blog post frontmatter
- [x] T106 [US8] Ensure generateStaticParams rebuilds all blog posts on deployment
- [x] T107 [US8] Test full workflow: edit markdown -> build -> verify rendered content

**Checkpoint**: Blog post editing workflow documented and validated

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

### Accessibility

- [ ] T108 [P] Audit all pages for WCAG 2.1 AA compliance
- [ ] T109 [P] Add alt text to all images across the site
- [ ] T110 [P] Verify keyboard navigation works on all interactive elements
- [ ] T111 [P] Add ARIA labels where needed

### Performance

- [ ] T112 [P] Implement lazy loading for episode thumbnails
- [ ] T113 [P] Optimize images with Next.js Image component
- [ ] T114 [P] Verify <2s FCP on simulated 3G connection
- [ ] T115 [P] Verify <500ms page navigation

### Final Testing

- [ ] T116 Run full E2E test suite with Playwright
- [ ] T117 [P] Verify Core Web Vitals metrics
- [ ] T118 [P] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] T119 Mobile responsive testing across viewport sizes (320px-1920px)

### Deployment

- [ ] T120 Configure custom domain for GitHub Pages (if applicable)
- [ ] T121 Verify GitHub Actions deploys successfully on push to main
- [ ] T122 Run quickstart.md validation to ensure developer setup works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **Content Migration (Phase 2.5)**: Can start after Setup; runs in PARALLEL with Foundational and User Stories
  - Image assets (CM01-CM05) should complete before US4 (About page needs host photos)
  - Content data (CM06-CM12) should complete before final testing
  - Blog migration (CM13-CM16) should complete before US5 (Glass Room)
- **User Stories (Phases 3-10)**: All depend on Foundational phase completion
  - P1 stories (US1-US3) should complete first
  - P2 stories (US4-US7) can proceed after P1 or in parallel if staffed
  - P3 story (US8) is documentation/workflow validation
- **Polish (Phase 11)**: Depends on all user stories AND content migration being complete

### User Story Dependencies

- **US1 (Homepage)**: Requires YouTubeEmbed component - foundational for episode display
- **US2 (Education)**: Reuses EpisodeCard, can run parallel to US1
- **US3 (Tastings)**: Reuses EpisodeCard and EpisodeSection from US2
- **US4 (About)**: Requires host/guest photos from CM02-CM03, bios from CM06-CM08
- **US5 (Blog)**: Requires blog content from CM13-CM16
- **US6 (FAQ)**: Requires FAQ content from CM09
- **US7 (Contact)**: Independent, can run parallel
- **US8 (Editor)**: Depends on US5 (blog implementation)

### Content Migration Dependencies

- **CM01**: No dependencies - creates directory structure
- **CM02-CM05**: Depend on CM01 (directories exist)
- **CM06-CM12**: Can run in parallel, depend on Setup completion
- **CM13-CM16**: Blog migration depends on era folder structure being defined
- **CM17-CM20**: Validation depends on all content being migrated

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational data layer tasks (T024-T032) marked [P] can run in parallel
- UI primitives (T020-T023) can run in parallel
- **Content Migration tasks marked [P] can run in parallel with user story development**
- Tests within each user story marked [P] can run in parallel
- After Foundational phase, US1-US4 can start in parallel
- US5-US7 can run in parallel with each other and with US1-US4

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. **Start Phase 2.5: Content Migration in parallel** (CM01-CM12 for episodes/hosts)
4. Complete Phase 3: US1 - Featured Episode Homepage
5. Complete Phase 4: US2 - Educational Episodes
6. Complete Phase 5: US3 - Tasting Episodes
7. **STOP and VALIDATE**: Test all P1 stories with real migrated content
8. Deploy to GitHub Pages for MVP review

### Incremental Delivery

1. Setup + Foundational -> Foundation ready
2. **Content Migration starts (parallel track)**
3. US1 (Homepage) + Episode content migration -> Test -> Deploy (MVP v0.1)
4. US2 + US3 (Episodes) -> Test -> Deploy (MVP v0.2)
5. US4 (About) + Host/guest content migration -> Test -> Deploy
6. US5 (Blog) + Blog content migration -> Test -> Deploy
7. US6 (FAQ) + FAQ content migration -> Test -> Deploy
8. US7 (Contact) -> Test -> Deploy
9. US8 + Polish + Final content validation -> Final release

### Content Migration Parallel Track

Content migration (Phase 2.5) runs alongside development:

| Development Phase    | Content Migration Tasks                            |
| -------------------- | -------------------------------------------------- |
| Phase 2 (Foundation) | CM01 (directories), CM10-CM11 (episodes/playlists) |
| Phase 3-5 (P1)       | CM06-CM08 (hosts/guests), CM09 (FAQs)              |
| Phase 6 (About)      | CM02-CM05 (images), validate host content          |
| Phase 7 (Blog)       | CM13-CM16 (blog posts/images)                      |
| Phase 11 (Polish)    | CM17-CM20 (validation)                             |

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Web3Forms access key should be stored as environment variable (not in source)
