# Quickstart: Branding & Palette Update Verification

**Feature**: 003-branding-palette-update

## Prerequisites

- Hugo installed (`hugo version`)
- Repository cloned and on branch `003-branding-palette-update`

## Build & Run

```bash
hugo server -D
```

Open `http://localhost:1313` in a browser.

## Verification Checklist

### US1: Blue Palette (P1)

1. **Homepage** — Confirm no pink, red, or marsala tones visible:
   - [ ] Navigation bar border is blue-toned (not red/brown)
   - [ ] Section heading underlines are blue
   - [ ] Feature icons use blue/copper accents (no marsala)
   - [ ] "See More" / CTA buttons use navy blue background
   - [ ] Default button outlines are navy blue
   - [ ] Links throughout the page are navy blue (#2B4F73)
   - [ ] Link hover states transition to steel blue (#35678A)

2. **Episodes page** — `/episodes/`:
   - [ ] Episode card title hover is copper (retained) or steel blue
   - [ ] Any buttons use navy/steel blue palette

3. **FAQ page** — `/faq/`:
   - [ ] FAQ category headings are navy blue (not burnt-sienna)
   - [ ] Accordion panels have blue-accented borders

4. **Glass Room** — `/glass-room/`:
   - [ ] Era section headings are navy blue (not burnt-sienna)
   - [ ] Breadcrumb links are navy blue
   - [ ] Blog post title hover uses steel blue or copper

5. **About page** — `/about/`:
   - [ ] Host social links hover to copper (retained warm accent)
   - [ ] No marsala tones visible

6. **Contact page** — `/contact/`:
   - [ ] No marsala tones visible
   - [ ] Buttons use navy blue palette

7. **Footer** (all pages):
   - [ ] Footer links are brass/gold (unchanged)
   - [ ] Copyright bar unchanged

8. **Contrast check**: Use browser DevTools or a WCAG checker to verify:
   - [ ] Navy (#2B4F73) on cream (#F5F5F0): ≥4.5:1
   - [ ] Steel blue (#35678A) on cream (#F5F5F0): ≥4.5:1

### US2: Logo Integration (P2)

1. **Desktop** (≥768px width):
   - [ ] BB_Gold.png logo visible in navbar (not text "BottleBond")
   - [ ] Logo is appropriately sized (≤42px height)
   - [ ] Clicking logo navigates to homepage

2. **Mobile** (<768px width):
   - [ ] Icon - Gold.png compact logo visible
   - [ ] Full logo hidden
   - [ ] Clicking icon navigates to homepage

3. **Fallback test**: Temporarily rename `BB_Gold.png` to verify behavior when image is missing:
   - [ ] Alt text or fallback is displayed gracefully

### Build Verification

```bash
hugo --minify
```

- [ ] Build completes without errors
- [ ] No warnings related to missing images or broken references
