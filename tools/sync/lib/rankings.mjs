/**
 * Validate and update rankings data against current episodes and YouTube
 * playlist ordering.
 *
 * Stale entries (referencing episode IDs that no longer exist) are removed.
 * Rank values are updated from YouTube playlist positions when a matching
 * playlist is available.  Manual-only fields (note, addedAt, season,
 * listType) are always preserved.
 *
 * @param {Map<string, Array<{videoId: string, position: number, title: string}>>} allPlaylistItems
 *   Map of YouTube playlist IDs to their items
 * @param {Array<{id: string, name: string, slug: string, youtubePlaylistId: string, description: string, category: string}>} playlists
 *   Merged playlist objects
 * @param {Array<object>} episodes
 *   Merged episode objects (used to build the valid-ID set)
 * @param {{currentSeason: string, allTime: Array<object>, seasonal: Array<object>}} existingRankings
 *   Current rankings from data/toptastings.json
 * @returns {{rankings: {currentSeason: string, allTime: Array<object>, seasonal: Array<object>}, staleRemoved: number, warnings: string[]}}
 */
export function validateRankings(
  allPlaylistItems,
  playlists,
  episodes,
  existingRankings
) {
  let staleRemoved = 0;
  const warnings = [];

  // 1. Build a Set of all valid episode IDs
  const validEpisodeIds = new Set();
  for (const ep of episodes) {
    validEpisodeIds.add(ep.id);
  }

  // 2. Process each ranking list
  const listConfigs = [
    {
      key: 'allTime',
      listType: 'alltime',
      matchPlaylist: (p) => p.category === 'top10' || p.id === 'top10',
    },
    {
      key: 'seasonal',
      listType: 'season',
      matchPlaylist: (p) => p.category === 'seasonal' || p.id === 'seasonal',
    },
  ];

  const rankings = {
    currentSeason: existingRankings.currentSeason,
    allTime: [],
    seasonal: [],
  };

  for (const config of listConfigs) {
    const existingList = existingRankings[config.key] || [];

    // 2a. Filter out stale entries
    const validEntries = [];
    for (const entry of existingList) {
      if (validEpisodeIds.has(entry.episodeId)) {
        validEntries.push({ ...entry });
      } else {
        staleRemoved++;
        warnings.push(
          `Removed stale ranking: ${entry.episodeId} from ${config.listType}`
        );
      }
    }

    // 2d. Try to update rank values from YouTube playlist ordering
    const matchingPlaylist = playlists.find(config.matchPlaylist);

    if (matchingPlaylist && allPlaylistItems.has(matchingPlaylist.youtubePlaylistId)) {
      const items = allPlaylistItems.get(matchingPlaylist.youtubePlaylistId);

      // Build a position map: videoId → position
      const positionMap = new Map();
      for (const item of items) {
        positionMap.set(item.videoId, item.position);
      }

      // Update ranks from playlist positions (0-based → 1-based)
      for (const entry of validEntries) {
        if (positionMap.has(entry.episodeId)) {
          entry.rank = positionMap.get(entry.episodeId) + 1;
        }
      }
    }

    // 2e. Sort by rank ascending
    validEntries.sort((a, b) => a.rank - b.rank);

    rankings[config.key] = validEntries;
  }

  return { rankings, staleRemoved, warnings };
}
