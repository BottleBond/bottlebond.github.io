import Section from '@/components/ui/Section';
import EpisodeSection from '@/components/episodes/EpisodeSection';
import { getPopularEpisodesByPlaylist } from '@/lib/data/episodes';
import { getTopNAllTime, getTopNSeasonal, getCurrentSeason } from '@/lib/data/top-tastings';
import { getYouTubePlaylistUrl } from '@/lib/data/playlists';

export const metadata = {
  title: 'Episodes | BottleBond',
  description: 'Explore our collection of bourbon and whiskey episodes, from educational content to blind tastings.',
};

export default function EpisodesPage() {
  // Get popular episodes for each section
  const educationEpisodes = getPopularEpisodesByPlaylist('education', 3);
  const tastingEpisodes = getPopularEpisodesByPlaylist('tastings', 3);

  // Get top tastings
  const seasonalTop = getTopNSeasonal(5);
  const allTimeTop = getTopNAllTime(10);
  const currentSeason = getCurrentSeason();

  // Get YouTube playlist URLs
  const educationPlaylistUrl = getYouTubePlaylistUrl('education');
  const tastingsPlaylistUrl = getYouTubePlaylistUrl('tastings');

  return (
    <main>
      {/* Page Header */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl">
            Episodes
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Discover our curated collection of bourbon and whiskey content. From educational deep dives
            to exciting blind tastings, there&apos;s something for every whiskey enthusiast.
          </p>
        </div>
      </Section>

      {/* History & Education Section */}
      <EpisodeSection
        title="History & Education"
        description="Deepen your knowledge of bourbon's rich heritage and production techniques."
        episodes={educationEpisodes}
        viewAllUrl={educationPlaylistUrl}
        viewAllLabel="View All on YouTube"
        variant="default"
        showDescriptions={true}
        emptyMessage="Educational episodes coming soon! Subscribe to be notified."
      />

      {/* Tastings Section */}
      <EpisodeSection
        title="Blind Tastings"
        description="Put your palate to the test with our blind tasting series."
        episodes={tastingEpisodes}
        viewAllUrl={tastingsPlaylistUrl}
        viewAllLabel="View All on YouTube"
        variant="alternate"
        showDescriptions={true}
        emptyMessage="Tasting episodes coming soon! Subscribe to be notified."
      />

      {/* Top Tastings of the Season */}
      {seasonalTop.length > 0 && (
        <Section variant="default" padding="lg">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-deep-brown">
              {currentSeason}
            </span>
            <h2 className="mt-4 font-serif text-2xl text-deep-brown md:text-3xl">
              Top Tastings of the Season
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-charcoal/70">
              Our hand-picked favorite episodes from this season.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {seasonalTop.map((item, index) => (
              <div key={item.episodeId} className="relative">
                {/* Rank badge */}
                <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-deep-brown shadow-md">
                  {index + 1}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${item.episode.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.episode.thumbnailUrl}
                      alt={item.episode.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium text-deep-brown group-hover:text-burnt-sienna">
                      {item.episode.title}
                    </h3>
                    {item.note && (
                      <p className="mt-1 line-clamp-2 text-xs text-charcoal/60">
                        {item.note}
                      </p>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Top 10 All Time */}
      {allTimeTop.length > 0 && (
        <Section variant="dark" padding="lg">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl text-cream md:text-3xl">
              Top 10 of All Time
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-cream/70">
              Our definitive list of must-watch bourbon episodes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {allTimeTop.map((item, index) => (
              <div key={item.episodeId} className="relative">
                {/* Rank badge */}
                <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-burnt-sienna text-sm font-bold text-cream shadow-md">
                  {index + 1}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${item.episode.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-lg bg-charcoal/50 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.episode.thumbnailUrl}
                      alt={item.episode.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium text-cream group-hover:text-gold">
                      {item.episode.title}
                    </h3>
                    {item.note && (
                      <p className="mt-1 line-clamp-2 text-xs text-cream/60">
                        {item.note}
                      </p>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
