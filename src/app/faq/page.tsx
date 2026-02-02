import Section from '@/components/ui/Section';
import FAQCategory from '@/components/faq/FAQCategory';
import { getFAQsGroupedByCategory, getAllFAQs } from '@/lib/data/faqs';

export const metadata = {
  title: 'FAQ | BottleBond',
  description: 'Frequently asked questions about bourbon, whiskey, and the BottleBond Podcast.',
};

// Define the preferred category order
const CATEGORY_ORDER = ['Basics', 'Production', 'Tasting', 'Podcast', 'General'];

export default function FAQPage() {
  const faqsByCategory = getFAQsGroupedByCategory();
  const allFAQs = getAllFAQs();

  // Sort categories by preferred order
  const sortedCategories = Object.keys(faqsByCategory).sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <main>
      {/* Page Header */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Got questions about bourbon, whiskey, or our podcast? We&apos;ve got answers.
            Browse our FAQ or reach out if you don&apos;t find what you&apos;re looking for.
          </p>
        </div>
      </Section>

      {/* FAQ Content */}
      {allFAQs.length > 0 ? (
        <Section variant="default" padding="lg">
          <div className="mx-auto max-w-3xl">
            {sortedCategories.map((category) => {
              const categoryFAQs = faqsByCategory[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              return (
                <FAQCategory
                  key={category}
                  category={category}
                  faqs={categoryFAQs}
                />
              );
            })}
          </div>
        </Section>
      ) : (
        <Section variant="default" padding="lg">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
              <svg className="h-8 w-8 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-deep-brown">Coming Soon</h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal/70">
              We&apos;re compiling our most frequently asked questions.
              Check back soon or contact us directly.
            </p>
            <div className="mt-6">
              <a href="/contact" className="btn-primary">
                Contact Us
              </a>
            </div>
          </div>
        </Section>
      )}

      {/* Contact CTA */}
      {allFAQs.length > 0 && (
        <Section variant="alternate" padding="lg">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-deep-brown">
              Still Have Questions?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal/70">
              Can&apos;t find what you&apos;re looking for? We&apos;d love to hear from you.
            </p>
            <div className="mt-6">
              <a href="/contact" className="btn-primary">
                Get in Touch
              </a>
            </div>
          </div>
        </Section>
      )}
    </main>
  );
}
