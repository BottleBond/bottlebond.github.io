import type { Episode } from '@/types';
import Card from '@/components/ui/Card';

export interface EpisodeCardProps {
  episode: Episode;
  showDescription?: boolean;
  compact?: boolean;
}

export default function EpisodeCard({
  episode,
  showDescription = false,
  compact = false,
}: EpisodeCardProps) {
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${episode.youtubeId}`;

  return (
    <Card variant="elevated" className="group overflow-hidden">
      <a
        href={youtubeWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Watch ${episode.title} on YouTube`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={episode.thumbnailUrl}
            alt={`Thumbnail for ${episode.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Duration badge */}
          <span className="absolute bottom-2 right-2 rounded bg-charcoal/80 px-2 py-0.5 text-xs font-medium text-cream">
            {episode.duration}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/40">
            <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-burnt-sienna text-cream transition-transform duration-300 group-hover:scale-100">
              <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 ${compact ? 'p-3' : 'p-4'}`}>
          <h3
            className={`font-serif text-deep-brown transition-colors group-hover:text-burnt-sienna ${
              compact ? 'text-base' : 'text-lg'
            } line-clamp-2`}
          >
            {episode.title}
          </h3>

          {showDescription && episode.description && (
            <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
              {episode.description}
            </p>
          )}

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && !compact && (
            <div className="mt-3 flex flex-wrap gap-1">
              {episode.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-cream/50 px-2 py-0.5 text-xs text-charcoal/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}
