import type {
  TopTasting,
  TopTastingsData,
  TopTastingWithEpisode,
  Episode,
} from '@/types';
import topTastingsData from '@/content/top-tastings.json';
import { getEpisodeById } from './episodes';

const data = topTastingsData as TopTastingsData;

/**
 * Get current season name
 */
export function getCurrentSeason(): string {
  return data.currentSeason;
}

/**
 * Get all-time top tastings
 */
export function getAllTimeTopTastings(): TopTasting[] {
  return data.allTime.sort((a, b) => a.rank - b.rank);
}

/**
 * Get seasonal top tastings
 */
export function getSeasonalTopTastings(season?: string): TopTasting[] {
  const targetSeason = season ?? data.currentSeason;
  return data.seasonal
    .filter((item) => item.season === targetSeason)
    .sort((a, b) => a.rank - b.rank);
}

/**
 * Get all-time top tastings with episode data
 */
export function getAllTimeTopTastingsWithEpisodes(): TopTastingWithEpisode[] {
  return getAllTimeTopTastings()
    .map((tasting) => {
      const episode = getEpisodeById(tasting.episodeId);
      if (!episode) return null;
      return { ...tasting, episode };
    })
    .filter((item): item is TopTastingWithEpisode => item !== null);
}

/**
 * Get seasonal top tastings with episode data
 */
export function getSeasonalTopTastingsWithEpisodes(
  season?: string
): TopTastingWithEpisode[] {
  return getSeasonalTopTastings(season)
    .map((tasting) => {
      const episode = getEpisodeById(tasting.episodeId);
      if (!episode) return null;
      return { ...tasting, episode };
    })
    .filter((item): item is TopTastingWithEpisode => item !== null);
}

/**
 * Get top N all-time tastings with episodes
 */
export function getTopNAllTime(n: number = 10): TopTastingWithEpisode[] {
  return getAllTimeTopTastingsWithEpisodes().slice(0, n);
}

/**
 * Get top N seasonal tastings with episodes
 */
export function getTopNSeasonal(n: number = 5, season?: string): TopTastingWithEpisode[] {
  return getSeasonalTopTastingsWithEpisodes(season).slice(0, n);
}

/**
 * Check if an episode is in the all-time list
 */
export function isAllTimeTopTasting(episodeId: string): boolean {
  return data.allTime.some((item) => item.episodeId === episodeId);
}

/**
 * Check if an episode is in the current seasonal list
 */
export function isSeasonalTopTasting(episodeId: string, season?: string): boolean {
  const targetSeason = season ?? data.currentSeason;
  return data.seasonal.some(
    (item) => item.episodeId === episodeId && item.season === targetSeason
  );
}

/**
 * Get ranking of an episode in all-time list
 */
export function getAllTimeRank(episodeId: string): number | null {
  const item = data.allTime.find((i) => i.episodeId === episodeId);
  return item?.rank ?? null;
}

/**
 * Get ranking of an episode in seasonal list
 */
export function getSeasonalRank(episodeId: string, season?: string): number | null {
  const targetSeason = season ?? data.currentSeason;
  const item = data.seasonal.find(
    (i) => i.episodeId === episodeId && i.season === targetSeason
  );
  return item?.rank ?? null;
}
