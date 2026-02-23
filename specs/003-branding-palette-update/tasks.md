# Tasks: Branding & Palette Update

**Input**: Design documents from `/specs/003-branding-palette-update/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Verify assets and current state before making changes

- [x] T001 Verify logo image assets exist (BB_Gold.png, Icon - Gold.png) in static/img/ and confirm they are valid PNG files

---

## Phase 2: Foundational (Blue Design Tokens)

**Purpose**: Define the new blue palette tokens and marsala overrides in the CSS `:root` block — MUST complete before user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Replace `--bb-burnt-sienna: #8B4513` with `--bb-navy: #2B4F73` and add 4 new blue tokens (`--bb-steel-blue: #35678A`, `--bb-slate: #2C3E50`, `--bb-light-steel: #B8C8D8`, `--bb-dusty-blue: #567490`) to the `:root` block in static/css/bottlebond.css
- [x] T003 Add 7 marsala theme CSS variable overrides to the `:root` block in static/css/bottlebond.css: `--primary-accent: #2B4F73`, `--navbar-border-top: #2C3E50`, `--button-border: #2C3E50`, `--link-focus: #2C3E50`, `--link-hover-bg: #2C3E50`, `--pagination-bg: #B8C8D8`, `--navbar-focus: #567490`

**Checkpoint**: Blue design tokens and marsala overrides defined — palette foundation ready

---

## Phase 3: User Story 1 - Replace Pink/Red Palette with Blues (Priority: P1) 🎯 MVP

**Goal**: Eliminate all pink, red, and marsala-toned colors from the site by replacing burnt-sienna accent with navy blue and updating coordinating hover states

**Independent Test**: Run `hugo server -D`, browse all pages (Home, Episodes, About, Glass Room, FAQ, Contact) and visually confirm no pink/red/marsala tones remain. Links and buttons should be navy blue; hover states should be steel blue.

### Implementation for User Story 1

- [x] T004 [US1] Replace all 9 `var(--bb-burnt-sienna)` references with `var(--bb-navy)` in static/css/bottlebond.css — selectors: `a`, `.faq-category h3`, `.btn-primary/.btn-template-main` (background-color), `.btn-primary:hover/.btn-template-main:hover` (border-color), `.btn-default/.btn-template-transparent-primary` (border-color + color), `.btn-default:hover/.btn-template-transparent-primary:hover` (background-color), `.glass-room-era h3`, `.glass-room-breadcrumb a`
- [x] T005 [US1] Update link hover states from `var(--bb-copper)` to `var(--bb-steel-blue)` in static/css/bottlebond.css — selectors: `a:hover`, `.episode-card h4 a:hover`, `#blog-homepage .post-entry h2 a:hover`, `.host-social a:hover`, `.glass-room-toc a:hover`
- [x] T006 [US1] Update button hover backgrounds and borders to use navy/steel-blue in static/css/bottlebond.css — `.btn-primary:hover/.btn-template-main:hover` background to `var(--bb-steel-blue)`, `.btn-default:hover/.btn-template-transparent-primary:hover` border to `var(--bb-navy)`

**Checkpoint**: All pages render with blue palette, no pink/red/marsala tones visible

---

## Phase 4: User Story 2 - Integrate New Logos (Priority: P2)

**Goal**: Display BB_Gold logo in the navigation bar on desktop/tablet and Icon - Gold on mobile, replacing text-only branding

**Independent Test**: Run `hugo server -D`, verify logo image appears in navbar at desktop width. Resize browser below 768px and verify compact icon appears. Click logo to confirm it navigates to homepage.

### Implementation for User Story 2

- [x] T007 [US2] Update hugo.toml to enable logo rendering: set `disabled_logo = false`, `logo = "img/BB_Gold.png"`, `logo_small = "img/Icon - Gold.png"`, and keep `logo_text = "BottleBond"` as fallback
- [x] T008 [US2] Add logo image sizing and navbar-brand styling to static/css/bottlebond.css — ensure logo fits within navbar height, add alt text fallback styling for graceful degradation when images fail to load

**Checkpoint**: Logo renders correctly at desktop, tablet, and mobile widths; clicking navigates to homepage

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Build verification and documentation updates

- [x] T009 Run Hugo build verification with `hugo --minify` to confirm site builds without errors after all changes
- [x] T010 Update README.md with branding/palette documentation: document the blue design token palette, logo configuration, and how to change colors or logos in the future

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — tokens must be defined first
- **US2 (Phase 4)**: Depends on US1 (Phase 3) — palette should be updated before logo integration for color coordination
- **Polish (Phase 5)**: Depends on US1 and US2 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 completion — logo colors must coordinate with updated palette

### Within Each User Story

- T004 and T005 can run in sequence (both modify same file)
- T007 and T008 modify different files and can run in parallel

### Parallel Opportunities

- T002 and T003 both modify the same `:root` block so should run sequentially
- T007 [US2] (hugo.toml) and T008 [US2] (bottlebond.css) modify different files — can run in parallel
- T009 and T010 modify different files — can run in parallel

---

## Parallel Example: User Story 2

```bash
# These modify different files and can run in parallel:
Task: "Update hugo.toml logo config"          # T007 → hugo.toml
Task: "Add logo CSS styling"                  # T008 → static/css/bottlebond.css
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify assets)
2. Complete Phase 2: Foundational (define blue tokens + marsala overrides)
3. Complete Phase 3: User Story 1 (replace all burnt-sienna + update hovers)
4. **STOP and VALIDATE**: Run `hugo server -D`, browse all pages, confirm no pink/red/marsala tones
5. MVP delivers the core palette change — site is fully blue-themed

### Incremental Delivery

1. Complete Setup + Foundational → Token foundation ready
2. Add User Story 1 → Blue palette live → Test independently → MVP!
3. Add User Story 2 → Logo integrated → Test independently → Full feature
4. Polish → Build verification + documentation → Complete

---

## Notes

- All CSS changes go to a single file: `static/css/bottlebond.css`
- Theme files (`themes/hugo-universal-theme/`) MUST NOT be edited
- The marsala override strategy covers ~100 theme CSS rules with just 7 custom property overrides
- Logo integration uses Hugo's native config — no template override needed
- Blue palette hex values are from research.md with verified WCAG 2.1 AA contrast ratios
