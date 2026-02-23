import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Map a shortcode type/category value to the canonical playlist category.
 *
 * The `top-tastings` shortcode uses `type="alltime"` but the playlist category
 * is `top10`, so we need a translation layer.
 *
 * @param {string} shortcodeName  — "episodes" or "top-tastings"
 * @param {string} value          — the category="" or type="" value from the shortcode
 * @returns {string} canonical category key
 */
function shortcodeValueToCategory(shortcodeName, value) {
  if (shortcodeName === 'top-tastings') {
    if (value === 'alltime') return 'top10';
    // "seasonal" and anything else pass through as-is
    return value;
  }
  // For "episodes" shortcodes the category value is already canonical
  return value;
}

/**
 * Parse a markdown string into an intro (frontmatter + any content before the
 * first `## ` heading) and an array of sections. Each section contains:
 *   - heading: the heading text (without the `## ` prefix)
 *   - body: everything after the heading line up to (but not including) the next `## ` heading
 *   - raw: the full text of the section including the heading line
 *   - category: the resolved playlist category extracted from a shortcode, or null
 *
 * @param {string} content
 * @returns {{ intro: string, sections: Array<{ heading: string, body: string, raw: string, category: string|null }> }}
 */
function parseSections(content) {
  // Split on lines that start with `## ` (level-2 headings).
  // We use a regex that keeps the delimiter so we can reconstruct later.
  const parts = content.split(/^(?=## )/m);

  // The first part is everything before the first ## heading (frontmatter + intro)
  const intro = parts[0];

  const shortcodeRe = /\{\{<\s*(episodes|top-tastings)\s+(?:category|type)="([^"]+)"/;

  const sections = [];
  for (let i = 1; i < parts.length; i++) {
    const raw = parts[i];

    // Extract heading text: first line starts with "## "
    const newlineIdx = raw.indexOf('\n');
    const headingLine = newlineIdx === -1 ? raw : raw.slice(0, newlineIdx);
    const heading = headingLine.replace(/^## /, '').trim();
    const body = newlineIdx === -1 ? '' : raw.slice(newlineIdx + 1);

    // Try to find a shortcode in the body
    let category = null;
    const match = shortcodeRe.exec(body);
    if (match) {
      category = shortcodeValueToCategory(match[1], match[2]);
    }

    sections.push({ heading, body, raw, category });
  }

  return { intro, sections };
}

/**
 * Update the episodes.md Hugo content page so that section headings match the
 * current playlist names, new sections are appended for new playlists, and
 * sections for removed playlists are deleted.
 *
 * @param {Array<{ id: string, name: string, slug: string, youtubePlaylistId: string, description: string, category: string }>} playlists
 * @param {string} filePath  — Absolute path to content/episodes.md
 * @param {boolean} dryRun   — If true, do not write any files
 * @returns {{ renamed: number, added: number, removed: number, warnings: string[] }}
 */
export function updateEpisodesPage(playlists, filePath, dryRun) {
  const warnings = [];
  let renamed = 0;
  let added = 0;
  let removed = 0;

  // 1. Read the file
  const content = readFileSync(filePath, 'utf-8');

  // 2. Parse sections
  const { intro, sections } = parseSections(content);

  // 3. Build a lookup from category -> playlist
  const playlistByCategory = new Map();
  for (const pl of playlists) {
    // Index by both `id` and `category` so either field can match a shortcode
    playlistByCategory.set(pl.id, pl);
    if (pl.category && pl.category !== pl.id) {
      playlistByCategory.set(pl.category, pl);
    }
  }

  // Build a set of all playlist categories/ids for detecting removed sections
  const allPlaylistKeys = new Set();
  for (const pl of playlists) {
    allPlaylistKeys.add(pl.id);
    if (pl.category) allPlaylistKeys.add(pl.category);
  }

  // Track which playlists have a matching section (by id)
  const matchedPlaylistIds = new Set();

  // 4. Process existing sections: rename or remove
  const keptSections = [];

  for (const section of sections) {
    if (section.category === null) {
      // No shortcode found — keep section as-is (we can't map it)
      keptSections.push(section);
      continue;
    }

    if (!allPlaylistKeys.has(section.category)) {
      // Section's category doesn't match ANY playlist — remove it
      removed++;
      warnings.push(`Removed section: ${section.heading}`);
      continue;
    }

    // Section maps to a playlist — check if heading needs updating
    const playlist = playlistByCategory.get(section.category);
    if (playlist) {
      matchedPlaylistIds.add(playlist.id);

      if (section.heading !== playlist.name) {
        // Rename the heading
        const updatedRaw = section.raw.replace(
          /^## .+/m,
          `## ${playlist.name}`
        );
        keptSections.push({
          ...section,
          heading: playlist.name,
          raw: updatedRaw,
        });
        renamed++;
      } else {
        keptSections.push(section);
      }
    } else {
      keptSections.push(section);
    }
  }

  // 5. Append new sections for playlists that have no matching section
  const newSections = [];
  for (const pl of playlists) {
    if (!matchedPlaylistIds.has(pl.id)) {
      const sectionText =
        `## ${pl.name}\n` +
        `\n` +
        `${pl.description}\n` +
        `\n` +
        `{{< episodes category="${pl.id}" limit="3" >}}\n`;

      newSections.push({
        heading: pl.name,
        body: `\n${pl.description}\n\n{{< episodes category="${pl.id}" limit="3" >}}\n`,
        raw: sectionText,
        category: pl.id,
      });
      added++;
    }
  }

  // 6. Reassemble the file
  let output = intro;

  const allSections = [...keptSections, ...newSections];
  for (let i = 0; i < allSections.length; i++) {
    const section = allSections[i];
    let sectionText = section.raw;

    // For new sections (appended), prepend a horizontal rule separator
    if (i >= keptSections.length) {
      // Ensure there's a separator before the new section
      if (!output.endsWith('\n---\n\n') && !output.endsWith('\n---\n')) {
        if (!output.endsWith('\n')) {
          output += '\n';
        }
        output += '\n---\n\n';
      }
    }

    output += sectionText;
  }

  // 7. Write the file if not dry run and there were changes
  if (!dryRun && (renamed > 0 || added > 0 || removed > 0)) {
    writeFileSync(filePath, output, 'utf-8');
  }

  return { renamed, added, removed, warnings };
}
