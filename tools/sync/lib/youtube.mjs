import { google } from 'googleapis';

/**
 * Create a YouTube API client.
 * @param {string} apiKey
 * @returns {object} YouTube API methods
 */
export function createYouTubeClient(apiKey) {
  const youtube = google.youtube({ version: 'v3', auth: apiKey });

  return {
    fetchPlaylists: (channelId) => fetchPlaylists(youtube, channelId),
    fetchPlaylistItems: (playlistId) => fetchPlaylistItems(youtube, playlistId),
    fetchVideoDetails: (videoIds) => fetchVideoDetails(youtube, videoIds),
  };
}

/**
 * Fetch all playlists for a channel (paginated).
 */
async function fetchPlaylists(youtube, channelId) {
  const playlists = [];
  let pageToken;

  do {
    const res = await youtube.playlists.list({
      channelId,
      part: ['snippet', 'contentDetails'],
      maxResults: 50,
      pageToken,
    });

    for (const item of res.data.items || []) {
      playlists.push({
        youtubePlaylistId: item.id,
        name: item.snippet.title,
        description: item.snippet.description || '',
        itemCount: item.contentDetails?.itemCount || 0,
      });
    }

    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return playlists;
}

/**
 * Fetch all video IDs and positions in a playlist (paginated).
 */
async function fetchPlaylistItems(youtube, playlistId) {
  const items = [];
  let pageToken;

  do {
    const res = await youtube.playlistItems.list({
      playlistId,
      part: ['snippet'],
      maxResults: 50,
      pageToken,
    });

    for (const item of res.data.items || []) {
      const videoId = item.snippet?.resourceId?.videoId;
      if (videoId) {
        items.push({
          videoId,
          position: item.snippet.position,
          title: item.snippet.title,
        });
      }
    }

    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return items;
}

/**
 * Fetch full video details, batching up to 50 IDs per request.
 */
async function fetchVideoDetails(youtube, videoIds) {
  const videos = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    const res = await youtube.videos.list({
      id: batch,
      part: ['snippet', 'contentDetails'],
    });

    for (const item of res.data.items || []) {
      videos.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnailUrl: pickThumbnail(item.snippet.thumbnails),
        duration: parseDuration(item.contentDetails?.duration),
        publishedAt: item.snippet.publishedAt,
      });
    }
  }

  return videos;
}

/**
 * Pick the best available thumbnail URL.
 */
function pickThumbnail(thumbnails) {
  if (!thumbnails) return '';
  return (
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ''
  );
}

/**
 * Convert ISO 8601 duration (PT1H2M3S) to MM:SS or H:MM:SS format.
 */
export function parseDuration(iso) {
  if (!iso) return '0:00';

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const mm = String(minutes).padStart(2, '0');
    return `${hours}:${mm}:${ss}`;
  }

  return `${minutes}:${ss}`;
}
