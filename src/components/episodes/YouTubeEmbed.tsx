'use client';

import { useState, useCallback } from 'react';

export interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function YouTubeEmbed({
  videoId,
  title,
  thumbnailUrl,
  className = '',
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnail = thumbnailUrl || getYouTubeThumbnailUrl(videoId);

  // Privacy-enhanced embed URL (youtube-nocookie.com)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div
      className={`youtube-embed relative aspect-video w-full overflow-hidden rounded-lg bg-charcoal ${className}`}
      data-testid="youtube-embed"
    >
      {!isLoaded ? (
        // Facade - thumbnail with play button
        <button
          onClick={handlePlay}
          className="youtube-facade group relative h-full w-full cursor-pointer border-0 p-0"
          aria-label={`Play video: ${title}`}
          data-testid="play-button"
        >
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={`Thumbnail for ${title}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-burnt-sienna/90 text-cream shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-burnt-sienna md:h-20 md:w-20">
              <svg
                className="ml-1 h-8 w-8 md:h-10 md:w-10"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-left font-serif text-lg text-cream drop-shadow-lg md:text-xl">
              {title}
            </p>
          </div>
        </button>
      ) : (
        // Actual YouTube iframe (privacy-enhanced mode)
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
        />
      )}

      {/* Open in new window button */}
      <a
        href={youtubeWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-2 top-2 flex items-center gap-1 rounded bg-charcoal/80 px-2 py-1 text-xs text-cream opacity-0 transition-opacity hover:bg-charcoal hover:text-gold focus:opacity-100 group-hover:opacity-100 md:px-3 md:py-1.5 md:text-sm"
        style={{ opacity: isLoaded ? 1 : undefined }}
        aria-label={`Open "${title}" on YouTube in a new window`}
        data-testid="open-youtube"
      >
        <svg
          className="h-3 w-3 md:h-4 md:w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        <span className="hidden sm:inline">YouTube</span>
      </a>
    </div>
  );
}
