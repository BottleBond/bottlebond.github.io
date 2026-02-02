import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { getPostBySlug, getAllPostSlugs } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils/markdown';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | BottleBond',
    };
  }

  return {
    title: `${post.title} | The Glass Room | BottleBond`,
    description: post.description || `Read "${post.title}" on The Glass Room`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      {/* Header */}
      <Section variant="dark" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cream/80">
            {post.era}
          </span>
          <h1 className="mt-4 font-serif text-3xl text-cream md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-cream/70">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-cream/10 px-2 py-0.5 text-xs text-cream/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Content */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl">
          <MarkdownRenderer content={post.content} />

          {/* Back link */}
          <div className="mt-12 border-t border-cream pt-8">
            <a
              href="/glass-room"
              className="inline-flex items-center gap-2 text-burnt-sienna hover:text-deep-brown"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to The Glass Room
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
