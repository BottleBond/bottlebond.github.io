import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { BlogPostFrontmatter, TOCItem } from '@/types';

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} {
  const { data, content: markdownContent } = matter(content);

  const frontmatter: BlogPostFrontmatter = {
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    era: data.era || 'Contemporary',
    author: data.author || 'BottleBond Team',
    description: data.description,
    featured: data.featured ?? false,
    tags: data.tags || [],
  };

  return { frontmatter, content: markdownContent };
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

/**
 * Extract table of contents from HTML content
 */
export function extractTOC(htmlContent: string): TOCItem[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/gi;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = match[1];
    const id = match[2];
    const text = match[3];
    if (level && id && text) {
      toc.push({
        level: parseInt(level, 10),
        id,
        text,
      });
    }
  }

  return toc;
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
