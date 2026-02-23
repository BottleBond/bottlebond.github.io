import { describe, it, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { writeFileSync, readFileSync, mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { updateEpisodesPage } from '../lib/content.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a temp directory and return a helper for writing markdown files. */
function makeTempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'content-test-'));
  const files = [];

  return {
    dir,
    /** Write a markdown file into the temp dir and return its path. */
    write(name, content) {
      const p = join(dir, name);
      writeFileSync(p, content, 'utf-8');
      files.push(p);
      return p;
    },
    /** Read a file back from the temp dir. */
    read(name) {
      return readFileSync(join(dir, name), 'utf-8');
    },
    /** Remove all created files and the temp directory. */
    cleanup() {
      for (const f of files) {
        try { unlinkSync(f); } catch { /* ignore */ }
      }
      try { rmdirSync(dir); } catch { /* ignore */ }
    },
  };
}

const BASIC_MARKDOWN = `---
title: "Episodes"
type: "page"
---

## Old Education Name

Some description.

{{< episodes category="education" limit="3" >}}

---

## Tastings & Reviews

Expert tasting notes.

{{< episodes category="tastings" limit="3" >}}
`;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('updateEpisodesPage', () => {
  let tmp;

  afterEach(() => {
    if (tmp) {
      tmp.cleanup();
      tmp = null;
    }
  });

  // -----------------------------------------------------------------------
  // 1. Heading renamed when playlist name changes
  // -----------------------------------------------------------------------
  it('renames a heading when the playlist name differs from the existing heading', () => {
    tmp = makeTempDir();
    const filePath = tmp.write('episodes.md', BASIC_MARKDOWN);

    const playlists = [
      { id: 'education', name: 'Bourbon Education', slug: 'bourbon-education', youtubePlaylistId: 'PLxxx', description: 'Learn about bourbon.', category: 'education' },
      { id: 'tastings', name: 'Tastings & Reviews', slug: 'tastings-reviews', youtubePlaylistId: 'PLyyy', description: 'Expert tasting notes.', category: 'tastings' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    assert.equal(result.renamed, 1, 'should rename one heading');
    assert.equal(result.added, 0);
    assert.equal(result.removed, 0);

    const updated = tmp.read('episodes.md');
    assert.ok(updated.includes('## Bourbon Education'), 'heading should be updated to new playlist name');
    assert.ok(!updated.includes('## Old Education Name'), 'old heading should be gone');
    // The other section should remain untouched
    assert.ok(updated.includes('## Tastings & Reviews'));
  });

  // -----------------------------------------------------------------------
  // 2. New section appended for a new playlist
  // -----------------------------------------------------------------------
  it('appends a new section for a playlist with no matching section', () => {
    tmp = makeTempDir();
    const filePath = tmp.write('episodes.md', BASIC_MARKDOWN);

    const playlists = [
      { id: 'education', name: 'Old Education Name', slug: 'education', youtubePlaylistId: 'PLxxx', description: 'Some description.', category: 'education' },
      { id: 'tastings', name: 'Tastings & Reviews', slug: 'tastings', youtubePlaylistId: 'PLyyy', description: 'Expert tasting notes.', category: 'tastings' },
      { id: 'history', name: 'Bourbon History', slug: 'bourbon-history', youtubePlaylistId: 'PLzzz', description: 'The rich history of bourbon.', category: 'history' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    assert.equal(result.added, 1, 'should add one section');
    assert.equal(result.renamed, 0);
    assert.equal(result.removed, 0);

    const updated = tmp.read('episodes.md');
    assert.ok(updated.includes('## Bourbon History'), 'new section heading should be present');
    assert.ok(updated.includes('{{< episodes category="history" limit="3" >}}'), 'new section shortcode should be present');
    assert.ok(updated.includes('The rich history of bourbon.'), 'new section description should be present');
  });

  // -----------------------------------------------------------------------
  // 3. Section removed for a category not in any playlist
  // -----------------------------------------------------------------------
  it('removes a section whose category does not match any playlist', () => {
    tmp = makeTempDir();
    const filePath = tmp.write('episodes.md', BASIC_MARKDOWN);

    // Only provide the education playlist; tastings is "removed"
    const playlists = [
      { id: 'education', name: 'Old Education Name', slug: 'education', youtubePlaylistId: 'PLxxx', description: 'Some description.', category: 'education' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    assert.equal(result.removed, 1, 'should remove one section');
    assert.equal(result.renamed, 0);
    assert.equal(result.added, 0);
    assert.ok(result.warnings.length > 0, 'should have a warning about the removed section');
    assert.ok(result.warnings[0].includes('Tastings & Reviews'), 'warning should mention removed heading');

    const updated = tmp.read('episodes.md');
    assert.ok(!updated.includes('## Tastings & Reviews'), 'removed section heading should be gone');
    assert.ok(!updated.includes('category="tastings"'), 'removed section shortcode should be gone');
  });

  // -----------------------------------------------------------------------
  // 4. Dry run doesn't modify the file
  // -----------------------------------------------------------------------
  it('does not write the file when dryRun is true', () => {
    tmp = makeTempDir();
    const filePath = tmp.write('episodes.md', BASIC_MARKDOWN);

    const playlists = [
      { id: 'education', name: 'Renamed Education', slug: 'education', youtubePlaylistId: 'PLxxx', description: 'Some description.', category: 'education' },
      { id: 'tastings', name: 'Tastings & Reviews', slug: 'tastings', youtubePlaylistId: 'PLyyy', description: 'Expert tasting notes.', category: 'tastings' },
    ];

    const result = updateEpisodesPage(playlists, filePath, true);

    assert.equal(result.renamed, 1, 'should still report a rename');

    const onDisk = tmp.read('episodes.md');
    assert.ok(onDisk.includes('## Old Education Name'), 'original heading should still be on disk');
    assert.ok(!onDisk.includes('## Renamed Education'), 'renamed heading should NOT be on disk');
  });

  // -----------------------------------------------------------------------
  // 5. Shortcode mapping: top-tastings type="alltime" maps to top10 category
  // -----------------------------------------------------------------------
  it('maps top-tastings type="alltime" shortcode to the top10 category', () => {
    tmp = makeTempDir();

    const markdown = `---
title: "Episodes"
type: "page"
---

## All-Time Top 10

Our all-time favorite pours.

{{< top-tastings type="alltime" >}}

---

## Seasonal Picks

What we are drinking this season.

{{< top-tastings type="seasonal" >}}
`;

    const filePath = tmp.write('episodes.md', markdown);

    const playlists = [
      { id: 'top10', name: 'Top 10 of All Time', slug: 'top-10', youtubePlaylistId: 'PLaaa', description: 'Our all-time favorites.', category: 'top10' },
      { id: 'seasonal', name: 'Seasonal Picks', slug: 'seasonal', youtubePlaylistId: 'PLbbb', description: 'Current season picks.', category: 'seasonal' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    // "All-Time Top 10" -> "Top 10 of All Time" because playlist name differs
    assert.equal(result.renamed, 1, 'should rename the alltime heading to playlist name');
    assert.equal(result.removed, 0);
    assert.equal(result.added, 0);

    const updated = tmp.read('episodes.md');
    assert.ok(updated.includes('## Top 10 of All Time'), 'heading should be renamed to playlist name');
    assert.ok(!updated.includes('## All-Time Top 10'), 'old heading should be replaced');
    // Seasonal heading should remain unchanged since names match
    assert.ok(updated.includes('## Seasonal Picks'));
  });

  // -----------------------------------------------------------------------
  // 6. Frontmatter preserved after update
  // -----------------------------------------------------------------------
  it('preserves frontmatter and intro content after update', () => {
    tmp = makeTempDir();

    const markdown = `---
title: "Episodes"
type: "page"
description: "All our episodes in one place."
---

Welcome to our episodes page! Browse by category below.

## Education

Some description.

{{< episodes category="education" limit="3" >}}
`;

    const filePath = tmp.write('episodes.md', markdown);

    const playlists = [
      { id: 'education', name: 'Bourbon School', slug: 'bourbon-school', youtubePlaylistId: 'PLxxx', description: 'Some description.', category: 'education' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    assert.equal(result.renamed, 1);

    const updated = tmp.read('episodes.md');

    // Frontmatter should be fully intact
    assert.ok(updated.includes('---\ntitle: "Episodes"'), 'frontmatter opening should be preserved');
    assert.ok(updated.includes('type: "page"'), 'frontmatter type field should be preserved');
    assert.ok(updated.includes('description: "All our episodes in one place."'), 'frontmatter description should be preserved');
    // Intro text between frontmatter and first heading should be preserved
    assert.ok(updated.includes('Welcome to our episodes page! Browse by category below.'), 'intro paragraph should be preserved');
    // Renamed heading should be present
    assert.ok(updated.includes('## Bourbon School'), 'renamed heading should be present');
  });

  // -----------------------------------------------------------------------
  // 7. Multiple operations in a single call
  // -----------------------------------------------------------------------
  it('handles rename, add, and remove in a single call', () => {
    tmp = makeTempDir();
    const filePath = tmp.write('episodes.md', BASIC_MARKDOWN);

    const playlists = [
      // education is renamed
      { id: 'education', name: 'Bourbon 101', slug: 'bourbon-101', youtubePlaylistId: 'PLxxx', description: 'Learn bourbon basics.', category: 'education' },
      // tastings is gone (removed)
      // interviews is new (added)
      { id: 'interviews', name: 'Distiller Interviews', slug: 'interviews', youtubePlaylistId: 'PLnew', description: 'Conversations with distillers.', category: 'interviews' },
    ];

    const result = updateEpisodesPage(playlists, filePath, false);

    assert.equal(result.renamed, 1, 'one section renamed');
    assert.equal(result.removed, 1, 'one section removed');
    assert.equal(result.added, 1, 'one section added');

    const updated = tmp.read('episodes.md');
    assert.ok(updated.includes('## Bourbon 101'), 'renamed heading present');
    assert.ok(!updated.includes('## Old Education Name'), 'old heading gone');
    assert.ok(!updated.includes('## Tastings & Reviews'), 'removed section gone');
    assert.ok(updated.includes('## Distiller Interviews'), 'new section appended');
    assert.ok(updated.includes('{{< episodes category="interviews" limit="3" >}}'), 'new shortcode present');
  });
});
