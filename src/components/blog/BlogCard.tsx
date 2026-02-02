import type { BlogPostMeta } from '@/types';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils/markdown';

export interface BlogCardProps {
  post: BlogPostMeta;
  showEra?: boolean;
  showDescription?: boolean;
}

export default function BlogCard({
  post,
  showEra = true,
  showDescription = true,
}: BlogCardProps) {
  return (
    <Card variant="default" className="group overflow-hidden">
      <a href={`/glass-room/${post.slug}`} className="block p-6">
        {/* Era badge */}
        {showEra && (
          <span className="inline-block rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-deep-brown">
            {post.era}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-3 font-serif text-xl text-deep-brown transition-colors group-hover:text-burnt-sienna">
          {post.title}
        </h3>

        {/* Description */}
        {showDescription && post.description && (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
            {post.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-charcoal/60">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-cream px-2 py-0.5 text-xs text-charcoal/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </a>
    </Card>
  );
}
