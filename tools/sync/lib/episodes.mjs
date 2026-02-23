/**
 * Merge YouTube video data with existing episode data.
 *
 * YouTube-native fields are overwritten from the API; manual-only fields
 * (popularity, tags, and any other custom fields) are preserved from the
 * existing entry.  Episodes that no longer appear in any YouTube playlist
 * are removed and a warning is emitted for each.
 *
 * @param {Array<object>} youtubeVideos  - Videos from the YouTube API
 * @param {Array<object>} existingEpisodes - Existing episodes from data/episodes.json
 * @returns {{ episodes: object[], added: number, removed: number, updated: number, warnings: string[] }}
 */
export function mergeEpisodes(youtubeVideos, existingEpisodes) {
  const YOUTUBE_NATIVE_FIELDS = [
    'id',
    'title',
    'description',
    'youtubeId',
    'thumbnailUrl',
    'duration',
    'publishedAt',
    'playlistId',
  ];

  let added = 0;
  let removed = 0;
  let updated = 0;
  const warnings = [];

  // 1. Build a Map of existing episodes keyed by composite key id+playlistId
  const existingMap = new Map();
  for (const ep of existingEpisodes) {
    const key = `${ep.id}+${ep.playlistId}`;
    existingMap.set(key, ep);
  }

  // 2. Build a Set of composite keys from YouTube videos
  const youtubeKeySet = new Set();
  for (const video of youtubeVideos) {
    const key = `${video.id}+${video.playlistId}`;
    youtubeKeySet.add(key);
  }

  // 3. Process each YouTube video
  const episodes = [];

  for (const video of youtubeVideos) {
    const key = `${video.id}+${video.playlistId}`;

    if (existingMap.has(key)) {
      // Existing episode — preserve manual fields, overwrite YouTube-native fields
      const existing = existingMap.get(key);

      // Check whether any YouTube-native field actually changed
      let changed = false;
      for (const field of YOUTUBE_NATIVE_FIELDS) {
        if (existing[field] !== video[field]) {
          changed = true;
          break;
        }
      }

      // Spread existing (preserves popularity, tags, and any other manual fields)
      // then overwrite with YouTube-native data
      const merged = {
        ...existing,
        id: video.id,
        youtubeId: video.youtubeId,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        publishedAt: video.publishedAt,
        playlistId: video.playlistId,
      };

      episodes.push(merged);

      if (changed) {
        updated++;
      }
    } else {
      // New episode — create with YouTube fields + empty manual fields
      episodes.push({
        id: video.id,
        youtubeId: video.youtubeId,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        publishedAt: video.publishedAt,
        playlistId: video.playlistId,
        popularity: 0,
        tags: [],
      });

      added++;
    }
  }

  // 4. Detect removed episodes
  for (const [key, ep] of existingMap) {
    if (!youtubeKeySet.has(key)) {
      removed++;
      warnings.push(
        `Removed episode: ${ep.title} (${ep.id}) from playlist ${ep.playlistId}`
      );
    }
  }

  // 5. Sort by publishedAt descending (newest first)
  episodes.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB - dateA;
  });

  return { episodes, added, removed, updated, warnings };
}
