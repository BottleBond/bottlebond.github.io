#!/usr/bin/env node

/**
 * Generates Hugo content stubs for each bottle in data/tasterlist.json.
 * Creates content/taster-list/{bottle-id}.md with front matter.
 * Idempotent — only creates files that don't exist.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const dataPath = join(repoRoot, 'data', 'tasterlist.json');
const contentDir = join(repoRoot, 'content', 'taster-list');

// Ensure content directory exists
if (!existsSync(contentDir)) {
  mkdirSync(contentDir, { recursive: true });
}

const bottles = JSON.parse(readFileSync(dataPath, 'utf-8'));
let created = 0;
let skipped = 0;

for (const bottle of bottles) {
  const filePath = join(contentDir, `${bottle.id}.md`);

  if (existsSync(filePath)) {
    skipped++;
    continue;
  }

  const grades = bottle.scores.map(s => `${s.host}: ${s.grade}`).join(', ');
  const description = `${bottle.name} by ${bottle.distillery} — ${grades}. ${bottle.flavorNotes.join(', ')}.`;

  const frontmatter = [
    '---',
    `title: "${bottle.name}"`,
    `bottle_id: "${bottle.id}"`,
    `description: "${description}"`,
    `type: "taster-list"`,
    '---',
    ''
  ].join('\n');

  writeFileSync(filePath, frontmatter);
  created++;
  console.log(`  Created: ${bottle.id}.md`);
}

console.log(`\nTaster List pages: ${created} created, ${skipped} skipped (already exist).`);
