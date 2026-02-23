# Feature Specification: Branding & Palette Update

**Feature Branch**: `003-branding-palette-update`
**Created**: 2026-02-22
**Status**: Draft
**Input**: User description: "I have added some logos and banners into the img directory. Additionally I want to remove the pink and red tones from the site pallet and replace with blues."

## User Scenarios & Testing

### User Story 1 - Replace Pink/Red Palette with Blues (Priority: P1)

A site visitor browses BottleBond and sees a cohesive blue color scheme throughout the site instead of the current pink, red, and marsala tones. Buttons, links, hover states, and accent colors all use blue tones that complement the existing gold, charcoal, and cream palette.

**Why this priority**: The color palette defines the entire visual identity. Pink/red tones inherited from the marsala theme conflict with the desired brand direction. Replacing them with blues is the highest-impact visual change and affects every page.

**Independent Test**: Open the site in a browser and visually confirm that no pink, red, or marsala-toned elements remain. All accent colors, buttons, links, and hover states should use blue tones. The gold, charcoal, and cream neutral colors should remain unchanged.

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** a visitor views any page, **Then** no pink, red, or marsala-toned colors are visible in buttons, links, navigation, accents, or backgrounds
2. **Given** the marsala theme base stylesheet, **When** the site renders, **Then** the custom stylesheet overrides all marsala pink/red CSS variables with blue equivalents
3. **Given** the existing gold, charcoal, and cream colors, **When** the blue palette is applied, **Then** all color combinations meet WCAG 2.1 AA contrast requirements for text readability
4. **Given** a visitor hovers over a link or button, **When** the hover state activates, **Then** the hover color is a coordinating blue shade (not pink/red)

---

### User Story 2 - Integrate New Logos and Banners (Priority: P2)

The site administrator has added brand logo images (full logos and icon variants in Blue, Gold, White, and Black) to the image directory. The site should use these logo images in the navigation bar and other appropriate locations instead of the current text-only branding.

**Why this priority**: Displaying the actual brand logos elevates the site's professional appearance and reinforces brand identity. This depends on the palette being updated first so the logo colors coordinate.

**Independent Test**: Load the homepage and verify the logo image appears in the navigation bar. Resize the browser to confirm a compact logo variant appears on smaller screens. Verify the logo links to the homepage.

**Acceptance Scenarios**:

1. **Given** the site navigation bar, **When** a visitor views any page, **Then** the BottleBond logo image is displayed instead of text-only branding
2. **Given** a visitor on a mobile device, **When** the navigation collapses, **Then** a compact icon version of the logo is displayed
3. **Given** the logo in the navigation bar, **When** a visitor clicks the logo, **Then** they are navigated to the homepage
4. **Given** the BB_Gold logo variant displayed against the dark charcoal navigation bar, **When** the logo renders, **Then** the gold logo has sufficient contrast and visibility against the #2C2C2C background

---

### Edge Cases

- What happens if a logo image file fails to load? The site should fall back to the existing text-based branding ("BottleBond").
- What happens on pages where the theme applies inline marsala colors not covered by CSS variable overrides? All such occurrences must be identified and overridden.
- What happens when the browser does not support CSS custom properties? The site should degrade gracefully with hardcoded blue fallback values.

## Clarifications

### Session 2026-02-22

- Q: Which warm brown tones should be replaced with blue — only burnt-sienna, burnt-sienna + copper, or all three (burnt-sienna, copper, deep-brown)? → A: Replace burnt-sienna (#8B4513) with a similar-toned blue only. Copper (#B87333) and deep-brown (#654321) remain unchanged.
- Q: Which logo variant should be displayed on the dark charcoal navigation bar? → A: BB_Gold — the gold logo, coordinating with the existing gold accent theme for a cohesive premium look.

## Requirements

### Functional Requirements

- **FR-001**: The site MUST NOT display any pink, red, or marsala-toned colors (#955251, #532e2d, #6d3c3b, #633736, #d2adad, #74403f, #c08c8c, or similar hues) on any page
- **FR-002**: The site MUST replace all marsala theme accent colors with blue equivalents that harmonize with the existing gold (#D4AF37), charcoal (#2C2C2C), and cream (#F5F5F0) palette
- **FR-003**: The burnt-sienna tone (#8B4513) used as a link and button color MUST be replaced with a similar-toned blue; copper (#B87333) MUST be retained as-is
- **FR-004**: All text-on-background color combinations MUST meet WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text)
- **FR-005**: The navigation bar MUST display the BB_Gold logo image instead of text-only branding
- **FR-006**: The site MUST display the Icon - Gold compact variant on small screens (below 768px width)
- **FR-007**: The logo MUST link to the homepage
- **FR-008**: If a logo image fails to load, the site MUST fall back to displaying the text "BottleBond"
- **FR-009**: The site color palette MUST be defined using design tokens (CSS custom properties) so that future palette changes require updating only the token definitions
- **FR-010**: The blue palette MUST be applied consistently across all site components: navigation, buttons, links, hover states, FAQ accordion, episode cards, Glass Room breadcrumbs, footer accents, and page content headings

### Key Entities

- **Color Token**: A named design variable (e.g., `--bb-navy`, `--bb-steel-blue`) mapping to a specific hex color value, used consistently across the stylesheet
- **Logo Variant**: A brand image file in a specific color treatment (Blue, Gold, White, Black) and format (full logo or icon), stored in the site's image directory

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of pages render without any visible pink, red, or marsala tones — verified by visual inspection of all main sections (Home, Episodes, About, Glass Room, FAQ, Contact)
- **SC-002**: All text-on-background color combinations achieve at least 4.5:1 contrast ratio as measured by a WCAG contrast checker
- **SC-003**: The logo image is visible and correctly sized in the navigation bar at 3 viewport widths: desktop (1200px+), tablet (768px-1199px), and mobile (below 768px)
- **SC-004**: The site builds and deploys without errors after all branding and palette changes are applied

## Assumptions

- The existing logo image files in the image directory (BB_Blue, BB_Gold, BB_White, Icon variants) are production-ready and do not require further design work
- The gold, brass, copper, deep-brown, charcoal, and cream colors will be retained — only the pink/red/marsala tones and burnt-sienna are being replaced with blues
- The theme's marsala base stylesheet will not be edited directly; all overrides will be applied through the custom stylesheet
- The blue tones selected should evoke a premium, sophisticated feel consistent with the bourbon/whiskey brand identity
- "Blues" encompasses a range of navy, steel blue, and slate tones — not bright or neon blues

## Out of Scope

- Redesigning page layouts or component structure
- Creating new logo or banner image files
- Changing fonts or typography
- Updating the theme version or switching themes
- Modifying the carousel hero background images
