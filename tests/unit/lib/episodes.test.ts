import {
  getEpisodes,
  getEpisodeById,
  getEpisodesByPlaylist,
  getRandomFeaturedEpisode,
  getRecentEpisodes,
  getPopularEpisodesByPlaylist,
  searchEpisodes,
} from '@/lib/data/episodes';

describe('Episodes Data Functions', () => {
  describe('getEpisodes', () => {
    it('returns all episodes', () => {
      const episodes = getEpisodes();
      expect(Array.isArray(episodes)).toBe(true);
      expect(episodes.length).toBeGreaterThan(0);
    });

    it('returns episodes with required fields', () => {
      const episodes = getEpisodes();
      episodes.forEach((episode) => {
        expect(episode).toHaveProperty('id');
        expect(episode).toHaveProperty('youtubeId');
        expect(episode).toHaveProperty('title');
        expect(episode).toHaveProperty('playlistId');
        expect(episode).toHaveProperty('publishedAt');
      });
    });
  });

  describe('getEpisodeById', () => {
    it('returns episode when found', () => {
      const episodes = getEpisodes();
      const firstEpisode = episodes[0];
      const found = getEpisodeById(firstEpisode.id);
      expect(found).toEqual(firstEpisode);
    });

    it('returns undefined when not found', () => {
      const found = getEpisodeById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getEpisodesByPlaylist', () => {
    it('returns episodes for main playlist', () => {
      const mainEpisodes = getEpisodesByPlaylist('main');
      expect(Array.isArray(mainEpisodes)).toBe(true);
      mainEpisodes.forEach((episode) => {
        expect(episode.playlistId).toBe('main');
      });
    });

    it('returns empty array for non-existent playlist', () => {
      const episodes = getEpisodesByPlaylist('non-existent');
      expect(episodes).toEqual([]);
    });
  });

  describe('getRandomFeaturedEpisode', () => {
    it('returns an episode from the main playlist', () => {
      const featured = getRandomFeaturedEpisode();
      expect(featured).not.toBeNull();
      if (featured) {
        expect(featured.playlistId).toBe('main');
      }
    });

    it('returns an episode with required fields', () => {
      const featured = getRandomFeaturedEpisode();
      expect(featured).not.toBeNull();
      if (featured) {
        expect(featured).toHaveProperty('id');
        expect(featured).toHaveProperty('youtubeId');
        expect(featured).toHaveProperty('title');
      }
    });

    it('returns different episodes on multiple calls (randomness test)', () => {
      const results = new Set<string>();
      // Call multiple times to test randomness
      for (let i = 0; i < 20; i++) {
        const featured = getRandomFeaturedEpisode();
        if (featured) {
          results.add(featured.id);
        }
      }
      // With enough calls, we should see at least 2 different episodes
      // (assuming there are multiple main episodes)
      const mainEpisodes = getEpisodesByPlaylist('main');
      if (mainEpisodes.length > 1) {
        expect(results.size).toBeGreaterThan(1);
      }
    });
  });

  describe('getRecentEpisodes', () => {
    it('returns episodes sorted by date descending', () => {
      const recent = getRecentEpisodes(5);
      expect(recent.length).toBeLessThanOrEqual(5);
      for (let i = 1; i < recent.length; i++) {
        const prev = new Date(recent[i - 1].publishedAt).getTime();
        const curr = new Date(recent[i].publishedAt).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });

    it('respects the limit parameter', () => {
      const recent3 = getRecentEpisodes(3);
      expect(recent3.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getPopularEpisodesByPlaylist', () => {
    it('returns episodes sorted by popularity descending', () => {
      const popular = getPopularEpisodesByPlaylist('main', 3);
      expect(popular.length).toBeLessThanOrEqual(3);
      for (let i = 1; i < popular.length; i++) {
        const prev = popular[i - 1].popularity ?? 0;
        const curr = popular[i].popularity ?? 0;
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });
  });

  describe('searchEpisodes', () => {
    it('finds episodes by title', () => {
      const episodes = getEpisodes();
      if (episodes.length > 0) {
        const firstWord = episodes[0].title.split(' ')[0];
        const results = searchEpisodes(firstWord);
        expect(results.length).toBeGreaterThan(0);
      }
    });

    it('is case insensitive', () => {
      const episodes = getEpisodes();
      if (episodes.length > 0) {
        const title = episodes[0].title;
        const upperResults = searchEpisodes(title.toUpperCase());
        const lowerResults = searchEpisodes(title.toLowerCase());
        expect(upperResults.length).toBe(lowerResults.length);
      }
    });

    it('returns empty array for no matches', () => {
      const results = searchEpisodes('xyznonexistentquery123');
      expect(results).toEqual([]);
    });
  });
});
