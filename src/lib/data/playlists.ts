import type { Playlist, PlaylistsData, PlaylistCategory } from '@/types';
import playlistsData from '@/content/playlists.json';

const data = playlistsData as PlaylistsData;

/**
 * Get all playlists
 */
export function getPlaylists(): Playlist[] {
  return data.playlists;
}

/**
 * Get playlist by ID
 */
export function getPlaylistById(id: string): Playlist | undefined {
  return data.playlists.find((playlist) => playlist.id === id);
}

/**
 * Get playlist by slug
 */
export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return data.playlists.find((playlist) => playlist.slug === slug);
}

/**
 * Get playlists by category
 */
export function getPlaylistsByCategory(category: PlaylistCategory): Playlist[] {
  return data.playlists.filter((playlist) => playlist.category === category);
}

/**
 * Get the main playlist
 */
export function getMainPlaylist(): Playlist | undefined {
  return data.playlists.find((playlist) => playlist.category === 'main');
}

/**
 * Get all content playlists (excludes main)
 */
export function getContentPlaylists(): Playlist[] {
  return data.playlists.filter((playlist) => playlist.category !== 'main');
}

/**
 * Get YouTube playlist URL
 */
export function getYouTubePlaylistUrl(playlistId: string): string {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) {
    return '#';
  }
  return `https://www.youtube.com/playlist?list=${playlist.youtubePlaylistId}`;
}
