/**
 * Slugify a string into a URL-friendly slug.
 * - Lowercase
 * - Replace spaces and non-alphanumeric characters with hyphens
 * - Remove consecutive hyphens
 * - Trim leading/trailing hyphens
 *
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Merge YouTube playlist data with existing playlist data.
 *
 * @param {Array<{youtubePlaylistId: string, name: string, description: string, itemCount: number}>} youtubePlaylists
 *   Playlists fetched from the YouTube API.
 * @param {Array<{id: string, name: string, slug: string, youtubePlaylistId: string, description: string, category: string}>} existingPlaylists
 *   Playlists from data/playlists.json.
 * @param {string[]} blocklist
 *   YouTube playlist IDs to exclude.
 * @returns {{ playlists: object[], renamed: number, added: number, removed: number, warnings: string[] }}
 */
export function mergePlaylists(youtubePlaylists, existingPlaylists, blocklist) {
  const blockSet = new Set(blocklist);
  const warnings = [];
  let renamed = 0;
  let added = 0;
  let removed = 0;

  // 1. Build a Map of existing playlists keyed by youtubePlaylistId
  const existingMap = new Map();
  for (const pl of existingPlaylists) {
    existingMap.set(pl.youtubePlaylistId, pl);
  }

  // 2. Filter out blocklisted YouTube playlists
  const filtered = youtubePlaylists.filter(
    (pl) => !blockSet.has(pl.youtubePlaylistId)
  );

  // 3. Build the set of YouTube playlist IDs that are active (after filtering)
  const activeYouTubeIds = new Set(filtered.map((pl) => pl.youtubePlaylistId));

  // 4. Merge each YouTube playlist
  const playlists = [];

  for (const ytPl of filtered) {
    const existing = existingMap.get(ytPl.youtubePlaylistId);

    if (existing) {
      // Existing playlist — preserve id and category, update name/description/slug
      const nameChanged = existing.name !== ytPl.name;

      const merged = {
        id: existing.id,
        name: ytPl.name,
        slug: nameChanged ? slugify(ytPl.name) : existing.slug,
        youtubePlaylistId: ytPl.youtubePlaylistId,
        description: ytPl.description,
        category: existing.category,
      };

      if (nameChanged) {
        renamed++;
        warnings.push(`Playlist renamed: ${existing.name} \u2192 ${ytPl.name}`);
      }

      playlists.push(merged);
    } else {
      // New playlist
      const id = slugify(ytPl.name);

      playlists.push({
        id,
        name: ytPl.name,
        slug: id,
        youtubePlaylistId: ytPl.youtubePlaylistId,
        description: ytPl.description,
        category: id,
      });

      added++;
    }
  }

  // 5. Detect removed playlists (existing playlists not in YouTube and not blocklisted)
  for (const existing of existingPlaylists) {
    if (
      !activeYouTubeIds.has(existing.youtubePlaylistId) &&
      !blockSet.has(existing.youtubePlaylistId)
    ) {
      removed++;
      warnings.push(
        `Playlist removed: ${existing.name} (${existing.youtubePlaylistId})`
      );
    }
  }

  return { playlists, renamed, added, removed, warnings };
}
