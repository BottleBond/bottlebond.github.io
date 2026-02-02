import Section from '@/components/ui/Section';
import BlogCard from '@/components/blog/BlogCard';
import TableOfContents from '@/components/blog/TableOfContents';
import { getPostsByEra, getAllPostsMeta } from '@/lib/data/posts';
import { ERA_ORDER } from '@/types';

export const metadata = {
  title: 'The Glass Room | BottleBond',
  description: 'Explore bourbon history through the ages in our curated collection of articles and stories.',
};

export default function GlassRoomPage() {
  const postsByEra = getPostsByEra();
  const allPosts = getAllPostsMeta();

  // Get ordered eras that have posts
  const orderedEras = ERA_ORDER.filter((era) => (postsByEra[era]?.length ?? 0) > 0);
  const customEras = Object.keys(postsByEra).filter(
    (era) => !ERA_ORDER.includes(era as typeof ERA_ORDER[number])
  );
  const allEras = [...orderedEras, ...customEras];

  return (
    <main>
      {/* Page Header */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl">
            The Glass Room
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Step into our curated collection of bourbon history, stories, and insights.
            From the earliest days of American distilling to the modern craft revolution,
            explore the rich tapestry of whiskey culture.
          </p>
        </div>
      </Section>

      {/* Content */}
      {allPosts.length > 0 ? (
        <Section variant="default" padding="lg">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Table of Contents - Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <TableOfContents postsByEra={postsByEra} />
              </div>
            </aside>

            {/* Posts by Era */}
            <div className="lg:col-span-3">
              {allEras.map((era) => (
                <section
                  key={era}
                  id={era.toLowerCase().replace(/\s+/g, '-')}
                  className="mb-12 scroll-mt-4"
                >
                  <h2 className="mb-6 border-b border-cream pb-2 font-serif text-2xl text-deep-brown">
                    {era}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {(postsByEra[era] ?? []).map((post) => (
                      <BlogCard key={post.slug} post={post} showEra={false} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Section>
      ) : (
        <Section variant="default" padding="lg">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
              <svg className="h-8 w-8 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-deep-brown">Coming Soon</h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal/70">
              We&apos;re crafting our first articles. Check back soon for stories from
              the rich history of American whiskey.
            </p>
          </div>
        </Section>
      )}
    </main>
  );
}
