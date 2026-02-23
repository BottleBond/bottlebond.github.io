import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { slugify, mergePlaylists } from '../lib/playlists.mjs';

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

describe('slugify', () => {
  it('converts a simple string to a lowercase slug', () => {
    assert.equal(slugify('My Cool Playlist'), 'my-cool-playlist');
  });

  it('replaces special characters with hyphens', () => {
    assert.equal(slugify('Hello & Goodbye!'), 'hello-goodbye');
  });

  it('collapses consecutive spaces into a single hyphen', () => {
    assert.equal(slugify('too   many   spaces'), 'too-many-spaces');
  });

  it('removes leading and trailing hyphens', () => {
    assert.equal(slugify('--leading-and-trailing--'), 'leading-and-trailing');
  });

  it('handles mixed special characters and consecutive hyphens', () => {
    assert.equal(slugify('a!!!b???c'), 'a-b-c');
  });

  it('handles strings that reduce to empty after stripping', () => {
    assert.equal(slugify('!!!'), '');
  });

  it('preserves digits', () => {
    assert.equal(slugify('Episode 42 Review'), 'episode-42-review');
  });
});

// ---------------------------------------------------------------------------
// mergePlaylists
// ---------------------------------------------------------------------------

describe('mergePlaylists', () => {
  // -- helpers --------------------------------------------------------------

  /** Build a minimal YouTube playlist object. */
  function ytPlaylist(overrides = {}) {
    return {
      youtubePlaylistId: 'yt-1',
      name: 'Playlist One',
      description: 'Description one',
      itemCount: 5,
      ...overrides,
    };
  }

  /** Build a minimal existing playlist object. */
  function existingPlaylist(overrides = {}) {
    return {
      id: 'playlist-one',
      name: 'Playlist One',
      slug: 'playlist-one',
      youtubePlaylistId: 'yt-1',
      description: 'Description one',
      category: 'bourbon',
      ...overrides,
    };
  }

  // -- preserving existing fields ------------------------------------------

  describe('existing playlist matched by youtubePlaylistId', () => {
    it('preserves the existing id', () => {
      const yt = [ytPlaylist()];
      const existing = [existingPlaylist({ id: 'custom-id' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists.length, 1);
      assert.equal(result.playlists[0].id, 'custom-id');
    });

    it('preserves the existing category', () => {
      const yt = [ytPlaylist()];
      const existing = [existingPlaylist({ category: 'rye' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists[0].category, 'rye');
    });
  });

  // -- updating name and description ---------------------------------------

  describe('updating name and description from YouTube', () => {
    it('updates the name to the YouTube name', () => {
      const yt = [ytPlaylist({ name: 'New Name' })];
      const existing = [existingPlaylist({ name: 'Old Name' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists[0].name, 'New Name');
    });

    it('updates the description to the YouTube description', () => {
      const yt = [ytPlaylist({ description: 'Updated desc' })];
      const existing = [existingPlaylist({ description: 'Old desc' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists[0].description, 'Updated desc');
    });
  });

  // -- slug re-generation on name change -----------------------------------

  describe('slug re-generation', () => {
    it('re-slugifies the slug when the name changes', () => {
      const yt = [ytPlaylist({ name: 'Brand New Title' })];
      const existing = [existingPlaylist({ name: 'Old Title', slug: 'old-title' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists[0].slug, 'brand-new-title');
    });

    it('keeps the existing slug when the name has not changed', () => {
      const yt = [ytPlaylist({ name: 'Same Name' })];
      const existing = [existingPlaylist({ name: 'Same Name', slug: 'custom-slug' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists[0].slug, 'custom-slug');
    });
  });

  // -- new playlists -------------------------------------------------------

  describe('new playlists', () => {
    it('generates a slugified id for a new playlist', () => {
      const yt = [ytPlaylist({ youtubePlaylistId: 'yt-new', name: 'My Cool Playlist' })];

      const result = mergePlaylists(yt, [], []);

      assert.equal(result.playlists[0].id, 'my-cool-playlist');
    });

    it('sets category equal to the generated id', () => {
      const yt = [ytPlaylist({ youtubePlaylistId: 'yt-new', name: 'Fresh Series' })];

      const result = mergePlaylists(yt, [], []);

      assert.equal(result.playlists[0].category, 'fresh-series');
    });

    it('sets slug equal to the generated id', () => {
      const yt = [ytPlaylist({ youtubePlaylistId: 'yt-new', name: 'Fresh Series' })];

      const result = mergePlaylists(yt, [], []);

      assert.equal(result.playlists[0].slug, 'fresh-series');
    });

    it('increments the added counter', () => {
      const yt = [
        ytPlaylist({ youtubePlaylistId: 'yt-new-1', name: 'One' }),
        ytPlaylist({ youtubePlaylistId: 'yt-new-2', name: 'Two' }),
      ];

      const result = mergePlaylists(yt, [], []);

      assert.equal(result.added, 2);
    });
  });

  // -- blocklist -----------------------------------------------------------

  describe('blocklist', () => {
    it('excludes blocklisted playlists from the output', () => {
      const yt = [
        ytPlaylist({ youtubePlaylistId: 'yt-keep', name: 'Keep' }),
        ytPlaylist({ youtubePlaylistId: 'yt-block', name: 'Block' }),
      ];

      const result = mergePlaylists(yt, [], ['yt-block']);

      assert.equal(result.playlists.length, 1);
      assert.equal(result.playlists[0].name, 'Keep');
    });

    it('does not count a blocklisted playlist as removed', () => {
      const yt = [];
      const existing = [existingPlaylist({ youtubePlaylistId: 'yt-block' })];

      const result = mergePlaylists(yt, existing, ['yt-block']);

      assert.equal(result.removed, 0);
      assert.equal(result.warnings.length, 0);
    });
  });

  // -- removed playlists ---------------------------------------------------

  describe('removed playlists', () => {
    it('generates a warning when a playlist is removed', () => {
      const yt = [];
      const existing = [existingPlaylist({ name: 'Gone Playlist', youtubePlaylistId: 'yt-gone' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.removed, 1);
      assert.equal(result.warnings.length, 1);
      assert.ok(result.warnings[0].includes('Gone Playlist'));
      assert.ok(result.warnings[0].includes('yt-gone'));
    });

    it('does not include removed playlists in the output array', () => {
      const yt = [];
      const existing = [existingPlaylist({ youtubePlaylistId: 'yt-gone' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.playlists.length, 0);
    });
  });

  // -- renamed playlists ---------------------------------------------------

  describe('renamed playlists', () => {
    it('generates a warning with old and new name', () => {
      const yt = [ytPlaylist({ name: 'New Name' })];
      const existing = [existingPlaylist({ name: 'Old Name' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.renamed, 1);
      assert.equal(result.warnings.length, 1);
      assert.ok(result.warnings[0].includes('Old Name'));
      assert.ok(result.warnings[0].includes('New Name'));
    });

    it('does not generate a rename warning when the name is unchanged', () => {
      const yt = [ytPlaylist({ name: 'Same Name' })];
      const existing = [existingPlaylist({ name: 'Same Name' })];

      const result = mergePlaylists(yt, existing, []);

      assert.equal(result.renamed, 0);
      assert.equal(result.warnings.length, 0);
    });
  });

  // -- combined scenario ---------------------------------------------------

  describe('combined scenario', () => {
    it('handles a mix of matched, new, blocklisted, and removed playlists', () => {
      const yt = [
        ytPlaylist({ youtubePlaylistId: 'yt-1', name: 'Updated Name', description: 'New desc' }),
        ytPlaylist({ youtubePlaylistId: 'yt-new', name: 'Brand New' }),
        ytPlaylist({ youtubePlaylistId: 'yt-blocked', name: 'Blocked' }),
      ];

      const existing = [
        existingPlaylist({ youtubePlaylistId: 'yt-1', name: 'Original Name', id: 'original', category: 'bourbon' }),
        existingPlaylist({ youtubePlaylistId: 'yt-removed', name: 'Removed Playlist', id: 'removed', category: 'rye' }),
      ];

      const blocklist = ['yt-blocked'];

      const result = mergePlaylists(yt, existing, blocklist);

      // Two playlists in output: the matched one and the new one
      assert.equal(result.playlists.length, 2);

      // Matched playlist preserves id and category, updates name
      const matched = result.playlists.find((p) => p.youtubePlaylistId === 'yt-1');
      assert.equal(matched.id, 'original');
      assert.equal(matched.category, 'bourbon');
      assert.equal(matched.name, 'Updated Name');
      assert.equal(matched.description, 'New desc');
      assert.equal(matched.slug, 'updated-name');

      // New playlist gets slugified id
      const newPl = result.playlists.find((p) => p.youtubePlaylistId === 'yt-new');
      assert.equal(newPl.id, 'brand-new');
      assert.equal(newPl.category, 'brand-new');

      // Counters
      assert.equal(result.renamed, 1);
      assert.equal(result.added, 1);
      assert.equal(result.removed, 1);

      // Warnings: one rename + one removal
      assert.equal(result.warnings.length, 2);
    });
  });
});
