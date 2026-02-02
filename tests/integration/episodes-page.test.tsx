import { render, screen } from '@testing-library/react';
import EpisodesPage from '@/app/episodes/page';

// Mock the data modules
jest.mock('@/lib/data/episodes', () => ({
  getPopularEpisodesByPlaylist: jest.fn((playlistId: string) => {
    if (playlistId === 'education') {
      return [
        {
          id: 'ep_edu_001',
          youtubeId: 'hist001abc',
          title: 'The History of American Whiskey',
          description: 'Journey through time...',
          playlistId: 'education',
          thumbnailUrl: 'https://i.ytimg.com/vi/hist001abc/maxresdefault.jpg',
          duration: '48:22',
          publishedAt: '2025-12-15T10:00:00Z',
          popularity: 94,
        },
        {
          id: 'ep_edu_002',
          youtubeId: 'mash002def',
          title: 'Understanding Mash Bills',
          description: 'Deep dive into mash bill composition...',
          playlistId: 'education',
          thumbnailUrl: 'https://i.ytimg.com/vi/mash002def/maxresdefault.jpg',
          duration: '35:45',
          publishedAt: '2025-12-08T10:00:00Z',
          popularity: 89,
        },
        {
          id: 'ep_edu_003',
          youtubeId: 'barrel003ghi',
          title: 'The Science of Barrel Aging',
          description: 'Explore the chemistry behind barrel aging...',
          playlistId: 'education',
          thumbnailUrl: 'https://i.ytimg.com/vi/barrel003ghi/maxresdefault.jpg',
          duration: '42:18',
          publishedAt: '2025-12-01T10:00:00Z',
          popularity: 86,
        },
      ];
    }
    if (playlistId === 'tastings') {
      return [
        {
          id: 'ep_tst_001',
          youtubeId: 'tast001jkl',
          title: 'Blind Tasting: Buffalo Trace vs Four Roses',
          description: 'Head-to-head comparison...',
          playlistId: 'tastings',
          thumbnailUrl: 'https://i.ytimg.com/vi/tast001jkl/maxresdefault.jpg',
          duration: '28:35',
          publishedAt: '2025-11-20T10:00:00Z',
          popularity: 91,
        },
      ];
    }
    return [];
  }),
}));

jest.mock('@/lib/data/top-tastings', () => ({
  getTopNAllTime: jest.fn(() => []),
  getTopNSeasonal: jest.fn(() => []),
  getCurrentSeason: jest.fn(() => 'Winter 2026'),
}));

jest.mock('@/lib/data/playlists', () => ({
  getYouTubePlaylistUrl: jest.fn(() => 'https://www.youtube.com/playlist?list=test'),
}));

describe('Episodes Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the episodes page without crashing', () => {
    render(<EpisodesPage />);
    expect(document.body).toBeDefined();
  });

  it('displays the page title', () => {
    render(<EpisodesPage />);
    const heading = screen.queryByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });

  it('renders the History & Education section', () => {
    render(<EpisodesPage />);
    const educationSection = screen.queryByText(/history.*education/i) || screen.queryByText(/education/i);
    expect(educationSection).toBeTruthy();
  });

  it('displays education episode cards', () => {
    render(<EpisodesPage />);
    const episodeTitle = screen.queryByText('The History of American Whiskey');
    expect(episodeTitle).toBeTruthy();
  });

  it('shows episode thumbnails', () => {
    render(<EpisodesPage />);
    const images = screen.queryAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('displays episode durations', () => {
    render(<EpisodesPage />);
    const duration = screen.queryByText(/48:22/) || screen.queryByText(/48 min/);
    expect(duration).toBeTruthy();
  });

  describe('Tastings Section', () => {
    it('renders the Tastings section', () => {
      render(<EpisodesPage />);
      const tastingsSection = screen.queryByText(/tasting/i);
      expect(tastingsSection).toBeTruthy();
    });
  });
});
