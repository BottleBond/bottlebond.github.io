import fs from 'fs';
import path from 'path';
import type { BlogPost, BlogPostMeta, PostsByEra } from '@/types';
import { ERA_ORDER } from '@/types';
import { parseFrontmatter, markdownToHtml } from '@/lib/utils/markdown';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/glass-room');

/**
 * Get era from folder path
 */
function getEraFromPath(filePath: string): string {
  const relativePath = path.relative(POSTS_DIRECTORY, filePath);
  const parts = relativePath.split(path.sep);
  const folderName = parts[0];

  if (parts.length > 1 && folderName) {
    // Convert folder name to era name
    const eraMap: Record<string, string> = {
      'colonial-era': 'Colonial Era',
      'early-american': 'Early American',
      'prohibition-era': 'Prohibition Era',
      'post-war-revival': 'Post-War Revival',
      'modern-craft': 'Modern Craft',
      'contemporary': 'Contemporary',
      'homework': 'Homework',
    };
    return eraMap[folderName] ?? folderName;
  }

  return 'Contemporary';
}

/**
 * Get all markdown files recursively
 */
function getAllMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Get all blog post metadata (without content)
 */
export function getAllPostsMeta(): BlogPostMeta[] {
  const files = getAllMarkdownFiles(POSTS_DIRECTORY);

  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(fileContent);
    const fileName = path.basename(filePath, '.md');
    const era = frontmatter.era || getEraFromPath(filePath);

    return {
      ...frontmatter,
      era,
      slug: fileName,
    };
  });

  // Sort by date (oldest first by default for historical content)
  return posts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Get posts sorted newest first
 */
export function getRecentPosts(limit?: number): BlogPostMeta[] {
  const posts = getAllPostsMeta().reverse();
  return limit ? posts.slice(0, limit) : posts;
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const files = getAllMarkdownFiles(POSTS_DIRECTORY);

  for (const filePath of files) {
    const fileName = path.basename(filePath, '.md');
    if (fileName === slug) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, content } = parseFrontmatter(fileContent);
      const htmlContent = await markdownToHtml(content);
      const era = frontmatter.era || getEraFromPath(filePath);

      return {
        ...frontmatter,
        era,
        slug,
        content: htmlContent,
      };
    }
  }

  return null;
}

/**
 * Get posts grouped by era
 */
export function getPostsByEra(): PostsByEra {
  const posts = getAllPostsMeta();
  const grouped: PostsByEra = {};

  // Initialize with empty arrays for each era in order
  for (const era of ERA_ORDER) {
    grouped[era] = [];
  }

  // Group posts by era
  for (const post of posts) {
    const era = post.era;
    if (!grouped[era]) {
      grouped[era] = [];
    }
    const eraArray = grouped[era];
    if (eraArray) {
      eraArray.push(post);
    }
  }

  // Remove empty eras
  for (const era of Object.keys(grouped)) {
    const eraArray = grouped[era];
    if (eraArray && eraArray.length === 0) {
      delete grouped[era];
    }
  }

  return grouped;
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  const files = getAllMarkdownFiles(POSTS_DIRECTORY);
  return files.map((filePath) => path.basename(filePath, '.md'));
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(limit?: number): BlogPostMeta[] {
  const featured = getAllPostsMeta().filter((post) => post.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Search posts by title or description
 */
export function searchPosts(query: string): BlogPostMeta[] {
  const lowerQuery = query.toLowerCase();
  return getAllPostsMeta().filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description?.toLowerCase().includes(lowerQuery)
  );
}
