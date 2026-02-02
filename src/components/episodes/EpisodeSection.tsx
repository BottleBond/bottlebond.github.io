import type { Episode } from '@/types';
import EpisodeCard from './EpisodeCard';
import Section from '@/components/ui/Section';

export interface EpisodeSectionProps {
  title: string;
  description?: string;
  episodes: Episode[];
  viewAllUrl?: string;
  viewAllLabel?: string;
  variant?: 'default' | 'alternate' | 'dark';
  showDescriptions?: boolean;
  emptyMessage?: string;
}

export default function EpisodeSection({
  title,
  description,
  episodes,
  viewAllUrl,
  viewAllLabel = 'View All',
  variant = 'default',
  showDescriptions = false,
  emptyMessage = 'No episodes available yet. Check back soon!',
}: EpisodeSectionProps) {
  return (
    <Section variant={variant} padding="lg">
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl text-deep-brown md:text-3xl">{title}</h2>
          {description && (
            <p className="mt-2 max-w-2xl text-charcoal/70">{description}</p>
          )}
        </div>
        {viewAllUrl && (
          <a
            href={viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-burnt-sienna transition-colors hover:text-deep-brown"
          >
            {viewAllLabel}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      {/* Episodes Grid */}
      {episodes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              showDescription={showDescriptions}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-cream bg-cream/30 p-8 text-center">
          <p className="text-charcoal/70">{emptyMessage}</p>
        </div>
      )}
    </Section>
  );
}
