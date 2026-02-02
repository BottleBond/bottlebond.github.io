import Section from '@/components/ui/Section';
import HostSection from '@/components/about/HostSection';
import GuestGrid from '@/components/about/GuestGrid';
import { getPrimaryHost, getCohosts, getFeaturedGuests } from '@/lib/data/hosts';

export const metadata = {
  title: 'About | BottleBond',
  description: 'Meet the hosts and recurring guests of the BottleBond Podcast.',
};

export default function AboutPage() {
  const primaryHost = getPrimaryHost();
  const cohosts = getCohosts();
  const featuredGuests = getFeaturedGuests();

  return (
    <main>
      {/* Page Header */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Meet the passionate bourbon enthusiasts behind BottleBond. We&apos;re dedicated to
            sharing our love of American whiskey through education, tastings, and great conversations.
          </p>
        </div>
      </Section>

      {/* Primary Host Section */}
      {primaryHost && (
        <HostSection host={primaryHost} title="About Me" variant="default" />
      )}

      {/* Cohost Section(s) */}
      {cohosts.map((cohost, index) => (
        <HostSection
          key={cohost.id}
          host={cohost}
          title={cohosts.length > 1 ? `My Co-Host: ${cohost.name}` : 'My Co-Host'}
          variant={index % 2 === 0 ? 'alternate' : 'default'}
        />
      ))}

      {/* Featured Guests Section */}
      <GuestGrid
        guests={featuredGuests}
        title="Recurring Guests"
        description="These talented individuals have graced our show with their expertise and passion for bourbon."
        variant={cohosts.length % 2 === 0 ? 'alternate' : 'default'}
      />

      {/* Call to Action */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-cream md:text-3xl">
            Want to Be a Guest?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            We&apos;re always looking for passionate bourbon enthusiasts, distillers, and industry
            experts to join us on the show.
          </p>
          <div className="mt-6">
            <a href="/contact" className="btn-primary">
              Get in Touch
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
