import type { PostsByEra } from '@/types';
import { ERA_ORDER } from '@/types';

export interface TableOfContentsProps {
  postsByEra: PostsByEra;
}

export default function TableOfContents({ postsByEra }: TableOfContentsProps) {
  // Get eras in the correct order
  const orderedEras = ERA_ORDER.filter((era) => (postsByEra[era]?.length ?? 0) > 0);

  // Also include any custom eras not in ERA_ORDER
  const customEras = Object.keys(postsByEra).filter(
    (era) => !ERA_ORDER.includes(era as typeof ERA_ORDER[number])
  );

  const allEras = [...orderedEras, ...customEras];

  if (allEras.length === 0) {
    return null;
  }

  return (
    <nav className="rounded-lg border border-cream bg-cream/30 p-6" aria-label="Table of contents">
      <h2 className="mb-4 font-serif text-lg text-deep-brown">Table of Contents</h2>
      <ul className="space-y-4">
        {allEras.map((era) => (
          <li key={era}>
            <a
              href={`#${era.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-medium text-burnt-sienna hover:text-deep-brown"
            >
              {era}
            </a>
            <ul className="ml-4 mt-2 space-y-1">
              {(postsByEra[era] ?? []).map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/glass-room/${post.slug}`}
                    className="text-sm text-charcoal/70 hover:text-burnt-sienna"
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
