#!/usr/bin/env node

/**
 * curate.mjs — Notion-to-Hugo content curation script
 *
 * Reads a Markdown file from notion-inbox/, adds Hugo front matter,
 * and moves it to the appropriate content/glass-room/ subdirectory.
 *
 * Usage:
 *   node tools/notion/curate.mjs --content-type guide notion-inbox/my-article.md
 *   node tools/notion/curate.mjs --content-type how-to notion-inbox/my-article.md
 *   node tools/notion/curate.mjs --content-type era notion-inbox/my-article.md
 *   node tools/notion/curate.mjs --content-type glossary notion-inbox/my-article.md
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve, dirname } from 'node:path';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONTENT_TYPE_DIRS = {
  era: 'content/glass-room/homework',
  guide: 'content/glass-room/guides',
  glossary: 'content/glass-room/glossary',
  'how-to': 'content/glass-room/how-to',
};

const VALID_TYPES = Object.keys(CONTENT_TYPE_DIRS);

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const { values, positionals } = parseArgs({
  options: {
    'content-type': { type: 'string', short: 't' },
    author: { type: 'string', short: 'a', default: 'BottleBond Team' },
    help: { type: 'boolean', short: 'h', default: false },
  },
  allowPositionals: true,
});

if (values.help || positionals.length === 0) {
  console.log(`
Usage: node tools/notion/curate.mjs [options] <file.md>

Options:
  --content-type, -t   Content type: ${VALID_TYPES.join(', ')} (required)
  --author, -a         Author name (default: "BottleBond Team")
  --help, -h           Show this help message

Example:
  node tools/notion/curate.mjs --content-type guide notion-inbox/bourbon-history.md
`);
  process.exit(values.help ? 0 : 1);
}

const contentType = values['content-type'];
const author = values.author || 'BottleBond Team';
const inputPath = positionals[0];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

if (!contentType || !VALID_TYPES.includes(contentType)) {
  console.error(
    `Error: --content-type must be one of: ${VALID_TYPES.join(', ')}\n` +
    `Got: ${contentType || '(none)'}`
  );
  process.exit(1);
}

if (!existsSync(inputPath)) {
  console.error(`Error: File not found: ${inputPath}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------

const projectRoot = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
const raw = readFileSync(inputPath, 'utf-8');

// Auto-detect title from first heading
const headingMatch = raw.match(/^#\s+(.+)$/m);
const title = headingMatch ? headingMatch[1].trim() : slugToTitle(basename(inputPath, '.md'));

// Generate slug from filename
const slug = slugify(basename(inputPath, '.md'));

// Today's date in YYYY-MM-DD format
const today = new Date().toISOString().slice(0, 10);

// Build front matter
const frontMatter = [
  '---',
  `title: "${escapeYaml(title)}"`,
  `date: "${today}"`,
  `content_type: "${contentType}"`,
  `author: "${escapeYaml(author)}"`,
  `description: ""`,
  `tags: []`,
  `draft: true`,
  '---',
  '',
].join('\n');

// Strip the first heading if we extracted it (avoid duplicate)
let body = raw;
if (headingMatch) {
  body = raw.replace(/^#\s+.+\n*/, '');
}

const output = frontMatter + body;

// Determine target directory and write
const targetDir = join(projectRoot, CONTENT_TYPE_DIRS[contentType]);
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

const targetPath = join(targetDir, `${slug}.md`);

if (existsSync(targetPath)) {
  console.error(`Warning: Target file already exists: ${targetPath}`);
  console.error('Overwriting...');
}

writeFileSync(targetPath, output, 'utf-8');

// Remove the source file from notion-inbox/
unlinkSync(inputPath);

console.log(`Curated: ${inputPath}`);
console.log(`  Title:        ${title}`);
console.log(`  Content type: ${contentType}`);
console.log(`  Author:       ${author}`);
console.log(`  Output:       ${targetPath}`);
console.log(`  Draft:        true (edit front matter to publish)`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugToTitle(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeYaml(str) {
  return str.replace(/"/g, '\\"');
}
