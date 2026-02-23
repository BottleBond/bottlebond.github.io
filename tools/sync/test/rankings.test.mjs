import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { validateRankings } from '../lib/rankings.mjs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal episodes array from a list of IDs. */
function makeEpisodes(...ids) {
  return ids.map((id) => ({ id }));
}

/** Build a playlists array with a single top10 playlist. */
function makeTop10Playlist(youtubePlaylistId = 'YT_TOP10') {
  return [
    {
      id: 'top10',
      name: 'Top 10 All Time',
      slug: 'top-10',
      youtubePlaylistId,
      description: '',
      category: 'top10',
    },
  ];
}

/** Build a playlists array with a single seasonal playlist. */
function makeSeasonalPlaylist(youtubePlaylistId = 'YT_SEASONAL') {
  return [
    {
      id: 'seasonal',
      name: 'Seasonal',
      slug: 'seasonal',
      youtubePlaylistId,
      description: '',
      category: 'seasonal',
    },
  ];
}

/** Build allPlaylistItems Map from a plain object { ytPlaylistId: items[] }. */
function makePlaylistItems(obj) {
  return new Map(Object.entries(obj));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('validateRankings', () => {
  // 1. Valid references pass through unchanged
  describe('valid references', () => {
    it('should pass through entries whose episodeId exists in episodes', () => {
      const episodes = makeEpisodes('ep1', 'ep2');
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 1 },
          { episodeId: 'ep2', rank: 2 },
        ],
        seasonal: [],
      };
      const playlists = [];
      const allPlaylistItems = new Map();

      const { rankings, staleRemoved, warnings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      assert.equal(rankings.allTime.length, 2);
      assert.equal(rankings.allTime[0].episodeId, 'ep1');
      assert.equal(rankings.allTime[1].episodeId, 'ep2');
      assert.equal(staleRemoved, 0);
      assert.equal(warnings.length, 0);
    });
  });

  // 2. Stale episodeId removed with warning message
  describe('stale entry removal', () => {
    it('should remove entries whose episodeId is not in episodes', () => {
      const episodes = makeEpisodes('ep1');
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 1 },
          { episodeId: 'ep_gone', rank: 2 },
        ],
        seasonal: [{ episodeId: 'ep_also_gone', rank: 1 }],
      };
      const playlists = [];
      const allPlaylistItems = new Map();

      const { rankings, staleRemoved, warnings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      assert.equal(rankings.allTime.length, 1);
      assert.equal(rankings.allTime[0].episodeId, 'ep1');
      assert.equal(rankings.seasonal.length, 0);
      assert.equal(staleRemoved, 2);
      assert.equal(warnings.length, 2);
      assert.ok(warnings[0].includes('ep_gone'));
      assert.ok(warnings[1].includes('ep_also_gone'));
    });

    it('should include list type in the warning message', () => {
      const episodes = makeEpisodes();
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [{ episodeId: 'gone1', rank: 1 }],
        seasonal: [{ episodeId: 'gone2', rank: 1 }],
      };

      const { warnings } = validateRankings(new Map(), [], episodes, existingRankings);

      assert.ok(warnings.some((w) => w.includes('alltime')));
      assert.ok(warnings.some((w) => w.includes('season')));
    });
  });

  // 3. Rank order updated from playlist position (position 0 -> rank 1)
  describe('rank update from playlist position', () => {
    it('should set rank = position + 1 (0-based to 1-based)', () => {
      const episodes = makeEpisodes('ep1', 'ep2', 'ep3');
      const playlists = makeTop10Playlist('YT_TOP10');
      const allPlaylistItems = makePlaylistItems({
        YT_TOP10: [
          { videoId: 'ep1', position: 0, title: 'Episode 1' },
          { videoId: 'ep2', position: 1, title: 'Episode 2' },
          { videoId: 'ep3', position: 2, title: 'Episode 3' },
        ],
      });
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 99 },
          { episodeId: 'ep2', rank: 98 },
          { episodeId: 'ep3', rank: 97 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      assert.equal(rankings.allTime[0].rank, 1);
      assert.equal(rankings.allTime[0].episodeId, 'ep1');
      assert.equal(rankings.allTime[1].rank, 2);
      assert.equal(rankings.allTime[1].episodeId, 'ep2');
      assert.equal(rankings.allTime[2].rank, 3);
      assert.equal(rankings.allTime[2].episodeId, 'ep3');
    });

    it('should update seasonal ranks from the seasonal playlist', () => {
      const episodes = makeEpisodes('epA', 'epB');
      const playlists = makeSeasonalPlaylist('YT_SEASONAL');
      const allPlaylistItems = makePlaylistItems({
        YT_SEASONAL: [
          { videoId: 'epB', position: 0, title: 'B first' },
          { videoId: 'epA', position: 1, title: 'A second' },
        ],
      });
      const existingRankings = {
        currentSeason: 'S2',
        allTime: [],
        seasonal: [
          { episodeId: 'epA', rank: 1 },
          { episodeId: 'epB', rank: 2 },
        ],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      // epB was position 0 -> rank 1, epA was position 1 -> rank 2
      assert.equal(rankings.seasonal[0].episodeId, 'epB');
      assert.equal(rankings.seasonal[0].rank, 1);
      assert.equal(rankings.seasonal[1].episodeId, 'epA');
      assert.equal(rankings.seasonal[1].rank, 2);
    });
  });

  // 4. Manual fields (note, addedAt, season) preserved after rank update
  describe('manual field preservation', () => {
    it('should preserve note, addedAt, season, and listType after rank update', () => {
      const episodes = makeEpisodes('ep1');
      const playlists = makeTop10Playlist('YT_TOP10');
      const allPlaylistItems = makePlaylistItems({
        YT_TOP10: [{ videoId: 'ep1', position: 4, title: 'Episode 1' }],
      });
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          {
            episodeId: 'ep1',
            rank: 1,
            note: 'Amazing bourbon',
            addedAt: '2025-06-15',
            season: 'S1',
            listType: 'alltime',
          },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      const entry = rankings.allTime[0];
      assert.equal(entry.rank, 5); // position 4 -> rank 5
      assert.equal(entry.note, 'Amazing bourbon');
      assert.equal(entry.addedAt, '2025-06-15');
      assert.equal(entry.season, 'S1');
      assert.equal(entry.listType, 'alltime');
      assert.equal(entry.episodeId, 'ep1');
    });
  });

  // 5. currentSeason preserved in output
  describe('currentSeason preservation', () => {
    it('should carry currentSeason from existing rankings to output', () => {
      const existingRankings = {
        currentSeason: 'Season 3',
        allTime: [],
        seasonal: [],
      };

      const { rankings } = validateRankings(new Map(), [], [], existingRankings);

      assert.equal(rankings.currentSeason, 'Season 3');
    });

    it('should preserve currentSeason even when rankings are modified', () => {
      const episodes = makeEpisodes('ep1');
      const existingRankings = {
        currentSeason: 'S5',
        allTime: [
          { episodeId: 'ep1', rank: 1 },
          { episodeId: 'stale', rank: 2 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(new Map(), [], episodes, existingRankings);

      assert.equal(rankings.currentSeason, 'S5');
    });
  });

  // 6. Rankings sorted by rank ascending after update
  describe('sort order', () => {
    it('should sort entries by rank ascending after playlist update', () => {
      const episodes = makeEpisodes('ep1', 'ep2', 'ep3');
      const playlists = makeTop10Playlist('YT_TOP10');
      // Playlist has them in reverse order compared to existing ranks
      const allPlaylistItems = makePlaylistItems({
        YT_TOP10: [
          { videoId: 'ep3', position: 0, title: 'Ep3' },
          { videoId: 'ep1', position: 1, title: 'Ep1' },
          { videoId: 'ep2', position: 2, title: 'Ep2' },
        ],
      });
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 1 },
          { episodeId: 'ep2', rank: 2 },
          { episodeId: 'ep3', rank: 3 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      // After update: ep3=rank1, ep1=rank2, ep2=rank3 -> sorted ascending
      assert.equal(rankings.allTime[0].rank, 1);
      assert.equal(rankings.allTime[0].episodeId, 'ep3');
      assert.equal(rankings.allTime[1].rank, 2);
      assert.equal(rankings.allTime[1].episodeId, 'ep1');
      assert.equal(rankings.allTime[2].rank, 3);
      assert.equal(rankings.allTime[2].episodeId, 'ep2');
    });

    it('should maintain ascending sort when no playlist update occurs', () => {
      const episodes = makeEpisodes('ep1', 'ep2', 'ep3');
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep3', rank: 3 },
          { episodeId: 'ep1', rank: 1 },
          { episodeId: 'ep2', rank: 2 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(new Map(), [], episodes, existingRankings);

      assert.equal(rankings.allTime[0].rank, 1);
      assert.equal(rankings.allTime[1].rank, 2);
      assert.equal(rankings.allTime[2].rank, 3);
    });
  });

  // 7. Missing playlist items gracefully handled (existing ranks kept)
  describe('missing playlist items', () => {
    it('should keep existing ranks when no matching playlist is found', () => {
      const episodes = makeEpisodes('ep1', 'ep2');
      const playlists = []; // no playlists at all
      const allPlaylistItems = new Map();
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 5 },
          { episodeId: 'ep2', rank: 10 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      assert.equal(rankings.allTime[0].rank, 5);
      assert.equal(rankings.allTime[1].rank, 10);
    });

    it('should keep existing rank when playlist exists but has no items for the entry', () => {
      const episodes = makeEpisodes('ep1', 'ep2');
      const playlists = makeTop10Playlist('YT_TOP10');
      // Playlist only has ep1, not ep2
      const allPlaylistItems = makePlaylistItems({
        YT_TOP10: [{ videoId: 'ep1', position: 0, title: 'Ep1' }],
      });
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [
          { episodeId: 'ep1', rank: 7 },
          { episodeId: 'ep2', rank: 3 },
        ],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      // ep1 updated from playlist, ep2 keeps original rank
      const ep1 = rankings.allTime.find((e) => e.episodeId === 'ep1');
      const ep2 = rankings.allTime.find((e) => e.episodeId === 'ep2');
      assert.equal(ep1.rank, 1); // position 0 -> rank 1
      assert.equal(ep2.rank, 3); // unchanged
    });

    it('should keep existing ranks when playlist matched but allPlaylistItems has no key', () => {
      const episodes = makeEpisodes('ep1');
      const playlists = makeTop10Playlist('YT_TOP10');
      const allPlaylistItems = new Map(); // empty map, no YT_TOP10 key
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [{ episodeId: 'ep1', rank: 4 }],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      assert.equal(rankings.allTime[0].rank, 4);
    });
  });

  // 8. Empty rankings handled correctly
  describe('empty rankings', () => {
    it('should handle empty allTime and seasonal lists', () => {
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [],
        seasonal: [],
      };

      const { rankings, staleRemoved, warnings } = validateRankings(
        new Map(),
        [],
        [],
        existingRankings
      );

      assert.deepEqual(rankings.allTime, []);
      assert.deepEqual(rankings.seasonal, []);
      assert.equal(rankings.currentSeason, 'S1');
      assert.equal(staleRemoved, 0);
      assert.equal(warnings.length, 0);
    });

    it('should handle missing allTime/seasonal keys in existingRankings gracefully', () => {
      const existingRankings = {
        currentSeason: 'S1',
        // allTime and seasonal are missing entirely
      };

      const { rankings, staleRemoved, warnings } = validateRankings(
        new Map(),
        [],
        [],
        existingRankings
      );

      assert.deepEqual(rankings.allTime, []);
      assert.deepEqual(rankings.seasonal, []);
      assert.equal(staleRemoved, 0);
      assert.equal(warnings.length, 0);
    });

    it('should return empty arrays with valid episodes but no rankings', () => {
      const episodes = makeEpisodes('ep1', 'ep2', 'ep3');
      const existingRankings = {
        currentSeason: 'S2',
        allTime: [],
        seasonal: [],
      };

      const { rankings } = validateRankings(new Map(), [], episodes, existingRankings);

      assert.deepEqual(rankings.allTime, []);
      assert.deepEqual(rankings.seasonal, []);
    });
  });

  // Additional edge case: entries are not mutated in the original input
  describe('immutability', () => {
    it('should not mutate the original existingRankings entries', () => {
      const episodes = makeEpisodes('ep1');
      const playlists = makeTop10Playlist('YT_TOP10');
      const allPlaylistItems = makePlaylistItems({
        YT_TOP10: [{ videoId: 'ep1', position: 5, title: 'Ep1' }],
      });
      const originalEntry = { episodeId: 'ep1', rank: 1, note: 'Original' };
      const existingRankings = {
        currentSeason: 'S1',
        allTime: [originalEntry],
        seasonal: [],
      };

      const { rankings } = validateRankings(
        allPlaylistItems,
        playlists,
        episodes,
        existingRankings
      );

      // The returned entry should have updated rank
      assert.equal(rankings.allTime[0].rank, 6);
      // The original entry should be untouched
      assert.equal(originalEntry.rank, 1);
    });
  });
});
