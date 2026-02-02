import type { Episode, EpisodesData, PlaylistCategory } from '@/types';
import episodesData from '@/content/episodes.json';

const data = episodesData as EpisodesData;

/**
 * Get all episodes
 */
export function getEpisodes(): Episode[] {
  return data.episodes;
}

/**
 * Get episode by ID
 */
export function getEpisodeById(id: string): Episode | undefined {
  return data.episodes.find((episode) => episode.id === id);
}

/**
 * Get episodes by playlist ID
 */
export function getEpisodesByPlaylist(playlistId: string): Episode[] {
  return data.episodes.filter((episode) => episode.playlistId === playlistId);
}

/**
 * Get episodes by playlist category
 */
export function getEpisodesByCategory(category: PlaylistCategory): Episode[] {
  return data.episodes.filter((episode) => episode.playlistId === category);
}

/**
 * Get popular episodes by playlist, sorted by popularity (descending)
 */
export function getPopularEpisodesByPlaylist(
  playlistId: string,
  limit: number = 3
): Episode[] {
  return getEpisodesByPlaylist(playlistId)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);
}

/**
 * Get a random featured episode from the main playlist
 */
export function getRandomFeaturedEpisode(): Episode | null {
  const mainEpisodes = getEpisodesByPlaylist('main');
  if (mainEpisodes.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * mainEpisodes.length);
  return mainEpisodes[randomIndex] ?? null;
}

/**
 * Get recent episodes sorted by publish date
 */
export function getRecentEpisodes(limit: number = 5): Episode[] {
  return [...data.episodes]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

/**
 * Search episodes by title or description
 */
export function searchEpisodes(query: string): Episode[] {
  const lowerQuery = query.toLowerCase();
  return data.episodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(lowerQuery) ||
      episode.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get episodes by tag
 */
export function getEpisodesByTag(tag: string): Episode[] {
  return data.episodes.filter((episode) =>
    episode.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}
