#!/usr/bin/env node

/**
 * import.mjs — Notion export to local Markdown archive
 *
 * Unzips a Notion workspace export (handles nested ZIPs), cleans filenames,
 * converts Notion metadata to YAML front matter, and organizes everything
 * into notion-archive/ at the project root.
 *
 * Usage:
 *   node tools/notion/import.mjs ~/Downloads/notion-export.zip
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import { basename, join, resolve, dirname, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..', '..');
const ARCHIVE_DIR = join(PROJECT_ROOT, 'notion-archive');
const TEMP_DIR = join(PROJECT_ROOT, '.notion-import-tmp');

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const { values, positionals } = parseArgs({
  options: {
    help: { type: 'boolean', short: 'h', default: false },
  },
  allowPositionals: true,
});

if (values.help || positionals.length === 0) {
  console.log(`
Usage: node tools/notion/import.mjs [options] <notion-export.zip>

Options:
  --help, -h    Show this help message

Example:
  node tools/notion/import.mjs ~/Downloads/notion-export.zip
`);
  process.exit(values.help ? 0 : 1);
}

const zipPath = resolve(positionals[0]);

if (!existsSync(zipPath)) {
  console.error(`Error: File not found: ${zipPath}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Strip Notion UUID suffix from a name. e.g. "My Page abc123def456" → "My Page" */
function stripNotionId(name) {
  // Notion appends a 32-char hex ID (sometimes with hyphens) at the end
  return name.replace(/\s+[a-f0-9]{8,}(?:-[a-f0-9]{4,})*$/i, '').trim();
}

/** Clean a filename: strip UUID, slugify, preserve extension */
function cleanFilename(filename) {
  const ext = extname(filename);
  const base = basename(filename, ext);
  const stripped = stripNotionId(base);

  // For "Untitled" files, keep a short hash to avoid collisions
  if (/^untitled$/i.test(stripped)) {
    const idMatch = base.match(/([a-f0-9]{6})[a-f0-9]*$/i);
    const shortHash = idMatch ? `-${idMatch[1]}` : '';
    return `untitled${shortHash}${ext}`;
  }

  return slugify(stripped) + ext;
}

/** Check if a string is a pure Notion UUID (should be skipped as a directory) */
function isPureUuid(name) {
  return /^[a-f0-9]{8,}(?:-[a-f0-9]{4,})*$/i.test(name.trim());
}

/** Clean a directory name: strip UUID, slugify. Returns null for pure-UUID dirs */
function cleanDirName(dirName) {
  if (isPureUuid(dirName)) return null; // collapse this directory
  const stripped = stripNotionId(dirName);
  return slugify(stripped);
}

/** Parse Notion metadata from the top of a markdown file */
function parseNotionMetadata(content) {
  const lines = content.split('\n');
  let title = '';
  let metadataLines = [];
  let bodyStartIndex = 0;

  // First line should be a heading
  if (lines[0] && lines[0].startsWith('# ')) {
    title = lines[0].replace(/^#\s+/, '').trim();
    bodyStartIndex = 1;

    // Skip blank line after heading
    if (lines[bodyStartIndex] === '') bodyStartIndex++;

    // Collect metadata lines (Key: Value format)
    while (bodyStartIndex < lines.length) {
      const line = lines[bodyStartIndex];
      const match = line.match(/^([A-Za-z][A-Za-z /]+):\s+(.+)$/);
      if (match) {
        metadataLines.push({ key: match[1].trim(), value: match[2].trim() });
        bodyStartIndex++;
      } else {
        break;
      }
    }
  }

  const body = lines.slice(bodyStartIndex).join('\n').replace(/^\n+/, '');
  return { title, metadata: metadataLines, body };
}

/** Convert a Notion date string to ISO date */
function parseNotionDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
  } catch { /* ignore */ }
  return dateStr;
}

/** Build YAML front matter from parsed metadata */
function buildFrontMatter(title, metadata) {
  const lines = ['---'];
  if (title) lines.push(`title: "${escapeYaml(title)}"`);

  for (const { key, value } of metadata) {
    const yamlKey = slugify(key).replace(/-/g, '_');
    let yamlValue = value;

    if (/date|created/i.test(key)) {
      yamlValue = parseNotionDate(value);
    }

    lines.push(`${yamlKey}: "${escapeYaml(yamlValue)}"`);
  }

  lines.push('source: "notion"');
  lines.push('---');
  return lines.join('\n');
}

function escapeYaml(str) {
  return str.replace(/"/g, '\\"');
}

/** Recursively walk a directory */
function walkDir(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(`Importing Notion export: ${zipPath}`);

// Clean up previous runs
if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true });
mkdirSync(TEMP_DIR, { recursive: true });

// Step 1: Unzip outer archive
console.log('Unzipping outer archive...');
execFileSync('unzip', ['-o', '-q', zipPath, '-d', TEMP_DIR]);

// Step 2: Check for nested ZIP (Notion wraps exports in a double ZIP)
const tempFiles = readdirSync(TEMP_DIR);
const innerZip = tempFiles.find(f => f.endsWith('.zip'));
let exportRoot = TEMP_DIR;

if (innerZip) {
  console.log('Found nested ZIP, extracting...');
  const innerZipPath = join(TEMP_DIR, innerZip);
  const innerDir = join(TEMP_DIR, 'inner');
  mkdirSync(innerDir, { recursive: true });
  // Use Python for nested ZIP to handle unicode filenames
  const pyScript = `
import zipfile, sys
zf = zipfile.ZipFile(sys.argv[1])
zf.extractall(sys.argv[2])
zf.close()
`;
  execFileSync('python3', ['-c', pyScript, innerZipPath, innerDir]);
  exportRoot = innerDir;
}

// Step 3: Find the export root directory (Notion uses Export-<uuid>/)
const exportDirs = readdirSync(exportRoot).filter(f =>
  statSync(join(exportRoot, f)).isDirectory()
);

if (exportDirs.length === 1) {
  exportRoot = join(exportRoot, exportDirs[0]);
} else if (exportDirs.length > 1) {
  // Look for the Export-* directory
  const notionDir = exportDirs.find(d => d.startsWith('Export-'));
  if (notionDir) exportRoot = join(exportRoot, notionDir);
}

console.log(`Export root: ${exportRoot}`);

// Step 4: Clear previous archive
if (existsSync(ARCHIVE_DIR)) {
  console.log('Clearing previous archive...');
  rmSync(ARCHIVE_DIR, { recursive: true });
}
mkdirSync(ARCHIVE_DIR, { recursive: true });

// Step 5: Process all files
const allFiles = walkDir(exportRoot);
const mdExt = ['.md'];
const csvExt = ['.csv'];
const skipFiles = ['index.html'];

let mdCount = 0;
let csvCount = 0;
let assetCount = 0;

for (const filePath of allFiles) {
  const relativePath = filePath.slice(exportRoot.length + 1);
  const filename = basename(filePath);

  // Skip Notion's index.html
  if (skipFiles.includes(filename)) continue;

  // Build clean output path
  const parts = relativePath.split('/');
  const cleanParts = parts.reduce((acc, part, i) => {
    if (i === parts.length - 1) {
      // Last part is the filename
      const ext = extname(part);
      if (mdExt.includes(ext) || csvExt.includes(ext)) {
        acc.push(cleanFilename(part));
      } else {
        // Binary assets keep original filename
        acc.push(part);
      }
    } else {
      // Directory parts — skip pure UUID directories
      const cleaned = cleanDirName(part);
      if (cleaned !== null) acc.push(cleaned);
    }
    return acc;
  }, []);

  const outputPath = join(ARCHIVE_DIR, ...cleanParts);
  const outputDir = dirname(outputPath);
  mkdirSync(outputDir, { recursive: true });

  const ext = extname(filePath);

  if (mdExt.includes(ext)) {
    // Process markdown: add front matter
    const raw = readFileSync(filePath, 'utf-8');
    const { title, metadata, body } = parseNotionMetadata(raw);
    const frontMatter = buildFrontMatter(title, metadata);
    const output = frontMatter + '\n\n' + body;
    writeFileSync(outputPath, output, 'utf-8');
    mdCount++;
  } else if (csvExt.includes(ext)) {
    // Copy CSV as-is
    copyFileSync(filePath, outputPath);
    csvCount++;
  } else {
    // Copy binary assets
    copyFileSync(filePath, outputPath);
    assetCount++;
  }
}

// Step 6: Clean up temp directory
rmSync(TEMP_DIR, { recursive: true });

// Summary
console.log('');
console.log('Import complete!');
console.log(`  Markdown files: ${mdCount}`);
console.log(`  CSV files:      ${csvCount}`);
console.log(`  Assets:         ${assetCount}`);
console.log(`  Output:         ${ARCHIVE_DIR}`);
