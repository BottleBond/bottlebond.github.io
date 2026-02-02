import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

// Mock the hosts data module
jest.mock('@/lib/data/hosts', () => ({
  getPrimaryHost: jest.fn(() => ({
    id: 'host_001',
    name: 'James Morrison',
    role: 'host',
    bio: 'Bourbon enthusiast and podcast host with years of experience.',
    photoUrl: '/images/hosts/james.jpg',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/jamesmorrison' },
      { platform: 'instagram', url: 'https://instagram.com/jamesmorrison' },
    ],
    order: 1,
  })),
  getCohosts: jest.fn(() => [
    {
      id: 'cohost_001',
      name: 'Sarah Chen',
      role: 'cohost',
      bio: 'Whiskey sommelier and co-host extraordinaire.',
      photoUrl: '/images/hosts/sarah.jpg',
      socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/sarachen' }],
      order: 2,
    },
  ]),
  getFeaturedGuests: jest.fn(() => [
    {
      id: 'guest_001',
      name: 'Mike Williams',
      role: 'guest',
      bio: 'Master distiller with 20 years of experience.',
      photoUrl: '/images/guests/mike.jpg',
      featured: true,
      order: 1,
    },
    {
      id: 'guest_002',
      name: 'Emily Davis',
      role: 'guest',
      bio: 'Bourbon historian and author.',
      photoUrl: '/images/guests/emily.jpg',
      featured: true,
      order: 2,
    },
  ]),
}));

describe('About Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the about page without crashing', () => {
    render(<AboutPage />);
    expect(document.body).toBeDefined();
  });

  it('displays the page title', () => {
    render(<AboutPage />);
    const heading = screen.queryByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });

  it('renders the host section', () => {
    render(<AboutPage />);
    const hostName = screen.queryByText('James Morrison');
    expect(hostName).toBeTruthy();
  });

  it('displays host bio', () => {
    render(<AboutPage />);
    const bio = screen.queryByText(/Bourbon enthusiast/i);
    expect(bio).toBeTruthy();
  });

  it('renders the cohost section', () => {
    render(<AboutPage />);
    const cohostName = screen.queryByText('Sarah Chen');
    expect(cohostName).toBeTruthy();
  });

  it('renders the recurring guests section', () => {
    render(<AboutPage />);
    const guestName = screen.queryByText('Mike Williams');
    expect(guestName).toBeTruthy();
  });

  it('displays social links for hosts', () => {
    render(<AboutPage />);
    const socialLinks = screen.queryAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('shows multiple guests in the grid', () => {
    render(<AboutPage />);
    const mike = screen.queryByText('Mike Williams');
    const emily = screen.queryByText('Emily Davis');
    expect(mike).toBeTruthy();
    expect(emily).toBeTruthy();
  });
});
