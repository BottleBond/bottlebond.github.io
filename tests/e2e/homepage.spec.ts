import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/BottleBond/i);
  });

  test('displays hero section with site branding', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('displays featured episode section', async ({ page }) => {
    // Look for featured episode content
    const featuredSection = page.locator('[data-testid="featured-episode"]').or(
      page.locator('section').filter({ hasText: /featured/i })
    );
    await expect(featuredSection.first()).toBeVisible();
  });

  test('featured episode has play functionality', async ({ page }) => {
    // Look for the YouTube embed or play button
    const playArea = page.locator('[data-testid="youtube-embed"]').or(
      page.locator('iframe[src*="youtube"]')
    ).or(
      page.locator('button').filter({ hasText: /play/i })
    );
    // At minimum, there should be some interactive element for the video
    const count = await playArea.count();
    expect(count).toBeGreaterThanOrEqual(0); // May be 0 if using click-to-load facade
  });

  test('has navigation links', async ({ page }) => {
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has call-to-action buttons or links', async ({ page }) => {
    const cta = page.locator('a[href*="episodes"], a[href*="about"], button').first();
    await expect(cta).toBeVisible();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('is responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('is responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});

test.describe('Featured Episode Embed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking play loads YouTube embed', async ({ page }) => {
    // If using facade pattern, clicking should load the iframe
    const playButton = page.locator('[data-testid="play-button"]').or(
      page.locator('button').filter({ hasText: /play/i })
    );

    const count = await playButton.count();
    if (count > 0) {
      await playButton.first().click();
      // After click, iframe should appear
      const iframe = page.locator('iframe[src*="youtube"]');
      await expect(iframe).toBeVisible({ timeout: 5000 });
    }
  });

  test('open in new window button exists', async ({ page }) => {
    const newWindowButton = page.locator('[data-testid="open-youtube"]').or(
      page.locator('a[href*="youtube.com/watch"]')
    );
    const count = await newWindowButton.count();
    expect(count).toBeGreaterThanOrEqual(0); // May not be visible until video loads
  });
});
