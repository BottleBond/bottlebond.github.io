/**
 * BottleBond Podcast Website - TypeScript Type Contracts
 *
 * These interfaces define the data structures used throughout the application.
 * Generated from the data model specification.
 */

// =============================================================================
// ENUMS
// =============================================================================

export type PlaylistCategory = 'main' | 'education' | 'tastings' | 'seasonal' | 'top10';

export type PersonRole = 'host' | 'cohost' | 'guest';

export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'website';

export type TopTastingListType = 'season' | 'alltime';

export type ContactMessageStatus = 'new' | 'read' | 'replied';

export type FAQCategory = 'Basics' | 'Production' | 'Tasting' | 'Podcast' | 'General';

// Era categories ordered from oldest to newest (plus special categories)
export const ERA_ORDER = [
  'Colonial Era',
  'Early American',
  'Prohibition Era',
  'Post-War Revival',
  'Modern Craft',
  'Contemporary',
  'Homework',
] as const;

export type Era = (typeof ERA_ORDER)[number];

// =============================================================================
// CORE ENTITIES
// =============================================================================

/**
 * Represents a single podcast episode from YouTube
 */
export interface Episode {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  playlistId: string;
  thumbnailUrl: string;
  duration: string; // Format: "MM:SS" or "HH:MM:SS"
  publishedAt: string; // ISO 8601 date
  popularity?: number; // 0-100
  tags?: string[];
}

/**
 * Categorizes episodes by content type
 */
export interface Playlist {
  id: string;
  name: string;
  slug: string;
  youtubePlaylistId: string;
  description?: string;
  category: PlaylistCategory;
}

/**
 * Social media link for a person
 */
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

/**
 * Represents hosts, co-hosts, and recurring guests
 */
export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  bio: string;
  photoUrl: string;
  socialLinks?: SocialLink[];
  featured?: boolean;
  order?: number;
}

/**
 * Frontmatter for blog posts (The Glass Room)
 */
export interface BlogPostFrontmatter {
  title: string;
  date: string; // ISO 8601 date
  era: Era | string; // Allow custom eras
  author: string;
  description?: string;
  featured?: boolean;
  tags?: string[];
}

/**
 * Full blog post with content
 */
export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string; // HTML content (processed from Markdown)
}

/**
 * Blog post metadata (without content, for listings)
 */
export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string;
}

/**
 * Table of contents item for blog posts
 */
export interface TOCItem {
  id: string;
  text: string;
  level: number; // 1-6 for h1-h6
}

/**
 * Represents a curated top-rated episode
 */
export interface TopTasting {
  episodeId: string;
  rank: number; // 1-10 for alltime, 1-5 for season
  listType: TopTastingListType;
  season?: string; // e.g., "Winter 2026"
  addedAt: string; // ISO 8601 date
  note?: string;
}

/**
 * Represents a frequently asked question
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string; // Supports Markdown
  category?: FAQCategory | string;
  order?: number;
}

/**
 * Represents a submitted contact form (for reference)
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string; // ISO 8601 date
  status: ContactMessageStatus;
}

// =============================================================================
// AGGREGATES & VIEW MODELS
// =============================================================================

/**
 * Episode with resolved relations
 */
export interface EpisodeWithPlaylist extends Episode {
  playlist: Playlist;
}

/**
 * Top tasting with resolved episode data
 */
export interface TopTastingWithEpisode extends TopTasting {
  episode: Episode;
}

/**
 * Blog posts grouped by era
 */
export type PostsByEra = Record<string, BlogPostMeta[]>;

/**
 * FAQs grouped by category
 */
export type FAQsByCategory = Record<string, FAQ[]>;

/**
 * Site navigation structure
 */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// =============================================================================
// DATA FILES STRUCTURE
// =============================================================================

/**
 * Structure of episodes.json
 */
export interface EpisodesData {
  episodes: Episode[];
}

/**
 * Structure of playlists.json
 */
export interface PlaylistsData {
  playlists: Playlist[];
}

/**
 * Structure of hosts.json
 */
export interface HostsData {
  hosts: Person[];
  guests: Person[];
}

/**
 * Structure of faqs.json
 */
export interface FAQsData {
  faqs: FAQ[];
}

/**
 * Structure of top-tastings.json
 */
export interface TopTastingsData {
  allTime: TopTasting[];
  seasonal: TopTasting[];
  currentSeason: string; // e.g., "Winter 2026"
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for EpisodeCard component
 */
export interface EpisodeCardProps {
  episode: Episode;
  showPlaylist?: boolean;
  showDescription?: boolean;
}

/**
 * Props for YouTubeEmbed component
 */
export interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  useFacade?: boolean;
  showExternalLink?: boolean;
  aspectRatio?: number;
  onPlay?: () => void;
}

/**
 * Props for PersonCard component
 */
export interface PersonCardProps {
  person: Person;
  variant?: 'full' | 'compact';
}

/**
 * Props for BlogPostCard component
 */
export interface BlogPostCardProps {
  post: BlogPostMeta;
  showEra?: boolean;
  showDescription?: boolean;
}

/**
 * Props for FAQItem component
 */
export interface FAQItemProps {
  faq: FAQ;
  defaultOpen?: boolean;
}

/**
 * Props for ContactForm component
 */
export interface ContactFormProps {
  accessKey: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Generic async data state
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
