import Section from '@/components/ui/Section';
import FeaturedEpisode from '@/components/episodes/FeaturedEpisode';
import { getRandomFeaturedEpisode } from '@/lib/data/episodes';

export default function Home() {
  const featuredEpisode = getRandomFeaturedEpisode();

  return (
    <main>
      {/* Hero Section */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl lg:text-6xl">
            Welcome to <span className="text-gold">BottleBond</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream/80 md:text-xl">
            Your premium destination for bourbon and whiskey education. Join us as we explore the rich
            history, craftsmanship, and tasting notes of America&apos;s finest spirits.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/episodes" className="btn-primary">
              Explore Episodes
            </a>
            <a href="/glass-room" className="btn-outline">
              Visit The Glass Room
            </a>
          </div>
        </div>
      </Section>

      {/* Featured Episode Section */}
      <FeaturedEpisode episode={featuredEpisode} />

      {/* About Teaser Section */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-deep-brown md:text-4xl">
            Discover the Art of Bourbon
          </h2>
          <p className="mt-4 text-charcoal/80">
            Whether you&apos;re a seasoned connoisseur or just beginning your bourbon journey,
            BottleBond offers curated content to deepen your appreciation. From blind tastings
            to historical deep dives, we&apos;re here to guide you through the world of American whiskey.
          </p>
          <div className="mt-8">
            <a href="/about" className="btn-secondary">
              Meet Your Hosts
            </a>
          </div>
        </div>
      </Section>

      {/* Quick Links Section */}
      <Section variant="alternate" padding="md">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-burnt-sienna/10">
              <svg className="h-6 w-6 text-burnt-sienna" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-deep-brown">History &amp; Education</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Explore the rich heritage of American whiskey making.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <svg className="h-6 w-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-deep-brown">Blind Tastings</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Put your palate to the test with our tasting sessions.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-deep-brown/10">
              <svg className="h-6 w-6 text-deep-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-deep-brown">The Glass Room</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Deep dive articles and bourbon stories from our blog.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
