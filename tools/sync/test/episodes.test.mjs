import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { mergeEpisodes } from '../lib/episodes.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal YouTube video object. */
function makeVideo(overrides = {}) {
  return {
    id: 'vid1',
    youtubeId: 'yt-vid1',
    title: 'Episode 1',
    description: 'Desc 1',
    thumbnailUrl: 'https://img.youtube.com/vid1.jpg',
    duration: 'PT30M',
    publishedAt: '2025-06-01T00:00:00Z',
    playlistId: 'PL-main',
    ...overrides,
  };
}

/** Build an existing episode (video + manual fields). */
function makeExisting(overrides = {}) {
  return {
    ...makeVideo(),
    popularity: 42,
    tags: ['bourbon', 'review'],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('mergeEpisodes', () => {
  // 1. New episodes are added with correct defaults
  describe('new episodes', () => {
    it('adds new episodes with popularity 0 and empty tags', () => {
      const video = makeVideo();
      const result = mergeEpisodes([video], []);

      assert.equal(result.added, 1);
      assert.equal(result.episodes.length, 1);

      const ep = result.episodes[0];
      assert.equal(ep.popularity, 0);
      assert.deepEqual(ep.tags, []);
      assert.equal(ep.id, video.id);
      assert.equal(ep.youtubeId, video.youtubeId);
      assert.equal(ep.title, video.title);
      assert.equal(ep.description, video.description);
      assert.equal(ep.thumbnailUrl, video.thumbnailUrl);
      assert.equal(ep.duration, video.duration);
      assert.equal(ep.publishedAt, video.publishedAt);
      assert.equal(ep.playlistId, video.playlistId);
    });

    it('increments added counter for each new episode', () => {
      const videos = [
        makeVideo({ id: 'v1', youtubeId: 'yt1' }),
        makeVideo({ id: 'v2', youtubeId: 'yt2' }),
        makeVideo({ id: 'v3', youtubeId: 'yt3' }),
      ];
      const result = mergeEpisodes(videos, []);
      assert.equal(result.added, 3);
      assert.equal(result.episodes.length, 3);
    });
  });

  // 2. Removed episodes are deleted and generate warnings
  describe('removed episodes', () => {
    it('removes episodes no longer in YouTube and emits warnings', () => {
      const existing = makeExisting({ id: 'gone', youtubeId: 'yt-gone', title: 'Gone Episode' });
      const result = mergeEpisodes([], [existing]);

      assert.equal(result.removed, 1);
      assert.equal(result.episodes.length, 0);
      assert.equal(result.warnings.length, 1);
      assert.ok(result.warnings[0].includes('Gone Episode'));
      assert.ok(result.warnings[0].includes('gone'));
      assert.ok(result.warnings[0].includes(existing.playlistId));
    });

    it('generates one warning per removed episode', () => {
      const existing = [
        makeExisting({ id: 'a', title: 'Episode A' }),
        makeExisting({ id: 'b', title: 'Episode B' }),
      ];
      const result = mergeEpisodes([], existing);

      assert.equal(result.removed, 2);
      assert.equal(result.warnings.length, 2);
    });
  });

  // 3. YouTube fields are overwritten when changed
  describe('YouTube field updates', () => {
    it('overwrites YouTube-native fields and increments updated counter', () => {
      const existing = makeExisting({ title: 'Old Title', description: 'Old desc' });
      const video = makeVideo({ title: 'New Title', description: 'New desc' });

      const result = mergeEpisodes([video], [existing]);

      assert.equal(result.updated, 1);
      assert.equal(result.added, 0);
      assert.equal(result.removed, 0);

      const ep = result.episodes[0];
      assert.equal(ep.title, 'New Title');
      assert.equal(ep.description, 'New desc');
    });

    it('detects changes in any YouTube-native field', () => {
      // Change only thumbnailUrl
      const existing = makeExisting();
      const video = makeVideo({ thumbnailUrl: 'https://img.youtube.com/new-thumb.jpg' });

      const result = mergeEpisodes([video], [existing]);
      assert.equal(result.updated, 1);
      assert.equal(result.episodes[0].thumbnailUrl, 'https://img.youtube.com/new-thumb.jpg');
    });
  });

  // 4. Manual fields are preserved when YouTube fields change
  describe('manual field preservation', () => {
    it('preserves popularity and tags when YouTube fields are overwritten', () => {
      const existing = makeExisting({
        popularity: 99,
        tags: ['rye', 'top-shelf'],
        title: 'Old Title',
      });
      const video = makeVideo({ title: 'Updated Title' });

      const result = mergeEpisodes([video], [existing]);

      const ep = result.episodes[0];
      assert.equal(ep.title, 'Updated Title');
      assert.equal(ep.popularity, 99);
      assert.deepEqual(ep.tags, ['rye', 'top-shelf']);
    });

    it('preserves arbitrary custom fields added manually', () => {
      const existing = makeExisting({
        customNote: 'Great guest appearance',
        rating: 5,
        title: 'Old Title',
      });
      const video = makeVideo({ title: 'Updated Title' });

      const result = mergeEpisodes([video], [existing]);

      const ep = result.episodes[0];
      assert.equal(ep.customNote, 'Great guest appearance');
      assert.equal(ep.rating, 5);
    });
  });

  // 5. A video in multiple playlists creates separate entries
  describe('multiple playlists (composite key)', () => {
    it('creates separate entries for same video in different playlists', () => {
      const videos = [
        makeVideo({ id: 'vid1', playlistId: 'PL-main' }),
        makeVideo({ id: 'vid1', playlistId: 'PL-bonus' }),
      ];

      const result = mergeEpisodes(videos, []);

      assert.equal(result.episodes.length, 2);
      assert.equal(result.added, 2);

      const playlists = result.episodes.map((ep) => ep.playlistId);
      assert.ok(playlists.includes('PL-main'));
      assert.ok(playlists.includes('PL-bonus'));
    });

    it('preserves manual fields independently per playlist entry', () => {
      const existing = [
        makeExisting({ id: 'vid1', playlistId: 'PL-main', popularity: 10, tags: ['main'] }),
        makeExisting({ id: 'vid1', playlistId: 'PL-bonus', popularity: 5, tags: ['bonus'] }),
      ];
      const videos = [
        makeVideo({ id: 'vid1', playlistId: 'PL-main', title: 'Updated' }),
        makeVideo({ id: 'vid1', playlistId: 'PL-bonus', title: 'Updated' }),
      ];

      const result = mergeEpisodes(videos, existing);

      const mainEp = result.episodes.find((ep) => ep.playlistId === 'PL-main');
      const bonusEp = result.episodes.find((ep) => ep.playlistId === 'PL-bonus');

      assert.equal(mainEp.popularity, 10);
      assert.deepEqual(mainEp.tags, ['main']);
      assert.equal(bonusEp.popularity, 5);
      assert.deepEqual(bonusEp.tags, ['bonus']);
    });

    it('removes only the playlist entry that was dropped, not the other', () => {
      const existing = [
        makeExisting({ id: 'vid1', playlistId: 'PL-main' }),
        makeExisting({ id: 'vid1', playlistId: 'PL-bonus' }),
      ];
      // Video remains only in PL-main
      const videos = [makeVideo({ id: 'vid1', playlistId: 'PL-main' })];

      const result = mergeEpisodes(videos, existing);

      assert.equal(result.episodes.length, 1);
      assert.equal(result.episodes[0].playlistId, 'PL-main');
      assert.equal(result.removed, 1);
      assert.equal(result.warnings.length, 1);
      assert.ok(result.warnings[0].includes('PL-bonus'));
    });
  });

  // 6. Unchanged episodes don't increment the updated counter
  describe('unchanged episodes', () => {
    it('does not increment updated when no YouTube fields changed', () => {
      const existing = makeExisting();
      const video = makeVideo(); // identical YouTube fields

      const result = mergeEpisodes([video], [existing]);

      assert.equal(result.updated, 0);
      assert.equal(result.added, 0);
      assert.equal(result.removed, 0);
      assert.equal(result.episodes.length, 1);
    });

    it('does not count manual-field-only differences as updates', () => {
      // Existing has manual fields that differ, but YouTube fields are the same
      const existing = makeExisting({ popularity: 100, tags: ['special'] });
      const video = makeVideo();

      const result = mergeEpisodes([video], [existing]);

      assert.equal(result.updated, 0);
      // Manual fields should still be preserved
      assert.equal(result.episodes[0].popularity, 100);
      assert.deepEqual(result.episodes[0].tags, ['special']);
    });
  });

  // 7. Result is sorted by publishedAt descending
  describe('sorting', () => {
    it('sorts episodes by publishedAt descending (newest first)', () => {
      const videos = [
        makeVideo({ id: 'old', publishedAt: '2024-01-01T00:00:00Z' }),
        makeVideo({ id: 'new', publishedAt: '2026-01-01T00:00:00Z' }),
        makeVideo({ id: 'mid', publishedAt: '2025-06-15T00:00:00Z' }),
      ];

      const result = mergeEpisodes(videos, []);

      assert.equal(result.episodes[0].id, 'new');
      assert.equal(result.episodes[1].id, 'mid');
      assert.equal(result.episodes[2].id, 'old');
    });

    it('maintains descending order with a mix of new and existing episodes', () => {
      const existing = [
        makeExisting({ id: 'existing', publishedAt: '2025-03-01T00:00:00Z', popularity: 50 }),
      ];
      const videos = [
        makeVideo({ id: 'existing', publishedAt: '2025-03-01T00:00:00Z' }),
        makeVideo({ id: 'newer', publishedAt: '2025-09-01T00:00:00Z' }),
        makeVideo({ id: 'oldest', publishedAt: '2024-12-01T00:00:00Z' }),
      ];

      const result = mergeEpisodes(videos, existing);

      assert.equal(result.episodes[0].id, 'newer');
      assert.equal(result.episodes[1].id, 'existing');
      assert.equal(result.episodes[2].id, 'oldest');
    });
  });

  // 8. Empty inputs
  describe('empty inputs', () => {
    it('returns empty results when both inputs are empty', () => {
      const result = mergeEpisodes([], []);

      assert.deepEqual(result.episodes, []);
      assert.equal(result.added, 0);
      assert.equal(result.removed, 0);
      assert.equal(result.updated, 0);
      assert.deepEqual(result.warnings, []);
    });

    it('handles empty YouTube array with existing episodes (all removed)', () => {
      const existing = [
        makeExisting({ id: 'a', title: 'Ep A' }),
        makeExisting({ id: 'b', title: 'Ep B' }),
      ];

      const result = mergeEpisodes([], existing);

      assert.equal(result.episodes.length, 0);
      assert.equal(result.removed, 2);
      assert.equal(result.added, 0);
      assert.equal(result.warnings.length, 2);
    });

    it('handles empty existing array with YouTube videos (all added)', () => {
      const videos = [
        makeVideo({ id: 'x' }),
        makeVideo({ id: 'y' }),
      ];

      const result = mergeEpisodes(videos, []);

      assert.equal(result.episodes.length, 2);
      assert.equal(result.added, 2);
      assert.equal(result.removed, 0);
      assert.equal(result.updated, 0);
      assert.deepEqual(result.warnings, []);
    });
  });
});
