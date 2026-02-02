import type { Episode } from '@/types';
import YouTubeEmbed from './YouTubeEmbed';
import Section from '@/components/ui/Section';

export interface FeaturedEpisodeProps {
  episode: Episode | null;
}

export default function FeaturedEpisode({ episode }: FeaturedEpisodeProps) {
  if (!episode) {
    return (
      <Section variant="alternate" padding="lg" data-testid="featured-episode">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-deep-brown md:text-3xl">
            Featured Episode
          </h2>
          <p className="mt-4 text-charcoal/70">
            Check back soon for our latest featured content.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="alternate" padding="lg" data-testid="featured-episode">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center md:mb-8">
          <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-deep-brown">
            Featured Episode
          </span>
        </div>

        <YouTubeEmbed
          videoId={episode.youtubeId}
          title={episode.title}
          thumbnailUrl={episode.thumbnailUrl}
          className="shadow-xl"
        />

        <div className="mt-6 text-center md:mt-8">
          <h2 className="font-serif text-2xl text-deep-brown md:text-3xl">
            {episode.title}
          </h2>
          {episode.description && (
            <p className="mx-auto mt-3 max-w-2xl text-charcoal/80">
              {episode.description}
            </p>
          )}
          {episode.duration && (
            <p className="mt-2 text-sm text-charcoal/60">
              Duration: {formatDuration(episode.duration)}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

/**
 * Convert ISO 8601 duration to human-readable format
 * e.g., "PT15M30S" -> "15:30"
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
