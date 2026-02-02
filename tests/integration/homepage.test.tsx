import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock the episodes data module
jest.mock('@/lib/data/episodes', () => ({
  getRandomFeaturedEpisode: jest.fn(() => ({
    id: 'ep_test_001',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Test Featured Episode',
    description: 'A test episode for integration testing',
    playlistId: 'main',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: '2024-01-15T12:00:00Z',
    duration: 'PT15M30S',
    popularity: 95,
  })),
  getRecentEpisodes: jest.fn(() => []),
}));

describe('Homepage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the homepage without crashing', () => {
    render(<HomePage />);
    expect(document.body).toBeDefined();
  });

  it('displays the site title or hero section', () => {
    render(<HomePage />);
    // Check for BottleBond branding
    const heading = screen.queryByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });

  it('renders the featured episode section', () => {
    render(<HomePage />);
    // Look for featured episode content
    const featuredSection = screen.queryByText(/featured/i) || screen.queryByText(/Test Featured Episode/i);
    expect(featuredSection).toBeTruthy();
  });

  it('displays episode title in featured section', () => {
    render(<HomePage />);
    const episodeTitle = screen.queryByText('Test Featured Episode');
    expect(episodeTitle).toBeTruthy();
  });

  it('includes a call-to-action', () => {
    render(<HomePage />);
    // Look for CTA links or buttons
    const ctaElements = screen.queryAllByRole('link');
    expect(ctaElements.length).toBeGreaterThan(0);
  });

  describe('when no featured episode is available', () => {
    beforeEach(() => {
      const { getRandomFeaturedEpisode } = require('@/lib/data/episodes');
      getRandomFeaturedEpisode.mockReturnValue(null);
    });

    it('renders graceful fallback content', () => {
      render(<HomePage />);
      // Page should still render without crashing
      expect(document.body).toBeDefined();
    });
  });
});
