#!/usr/bin/env node

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './lib/config.mjs';
import { createYouTubeClient } from './lib/youtube.mjs';
import { mergeEpisodes } from './lib/episodes.mjs';
import { mergePlaylists } from './lib/playlists.mjs';
import { updateEpisodesPage } from './lib/content.mjs';
import { validateRankings } from './lib/rankings.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    help: args.includes('--help') || args.includes('-h'),
  };
}

function printHelp() {
  console.log(`
YouTube Playlist Sync — BottleBond
===================================

Usage: node sync.mjs [options]

Options:
  --dry-run   Preview changes without writing any files
  --help, -h  Show this help message

Environment:
  YOUTUBE_API_KEY  Required. YouTube Data API v3 key.

Config:
  sync-config.json at repository root with:
    { "channelId": "UC...", "blocklist": [], "schedule": "daily" }
`);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, data, dryRun) {
  if (dryRun) return;
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function main() {
  const { dryRun, help } = parseArgs(process.argv);

  if (help) {
    printHelp();
    process.exit(0);
  }

  // Resolve repo root (two levels up from tools/sync/)
  const repoRoot = resolve(__dirname, '../..');

  console.log('YouTube Playlist Sync');
  console.log('=====================');
  if (dryRun) console.log('DRY RUN — no files will be modified\n');

  // 1. Load config
  let config;
  try {
    config = loadConfig(repoRoot);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    process.exit(1);
  }

  console.log(`Channel: ${config.channelId}`);
  if (config.blocklist.length > 0) {
    console.log(`Blocklist: ${config.blocklist.length} playlist(s)`);
  }
  console.log();

  // 2. Fetch from YouTube
  const yt = createYouTubeClient(config.apiKey);

  let ytPlaylists;
  try {
    ytPlaylists = await yt.fetchPlaylists(config.channelId);
  } catch (err) {
    console.error(`WARNING: YouTube API error — preserving existing data`);
    console.error(`  ${err.message}`);
    process.exit(0);
  }

  // Filter blocklist
  const activePlaylists = ytPlaylists.filter(
    (p) => !config.blocklist.includes(p.youtubePlaylistId)
  );
  const blockedCount = ytPlaylists.length - activePlaylists.length;

  console.log(
    `Playlists found: ${ytPlaylists.length}` +
    (blockedCount > 0 ? ` (${blockedCount} blocklisted)` : '')
  );
  console.log();

  // 3. Fetch playlist items and video details
  console.log('Syncing playlists...');
  const allPlaylistItems = new Map();
  const allVideoIds = new Set();

  for (const pl of activePlaylists) {
    try {
      const items = await yt.fetchPlaylistItems(pl.youtubePlaylistId);
      allPlaylistItems.set(pl.youtubePlaylistId, items);
      for (const item of items) {
        allVideoIds.add(item.videoId);
      }
      console.log(`  ✓ ${pl.name} (${items.length} videos)`);
    } catch (err) {
      console.error(`  ✗ ${pl.name}: ${err.message}`);
      console.error('WARNING: YouTube API error — preserving existing data');
      process.exit(0);
    }
  }

  let videoDetails;
  try {
    videoDetails = await yt.fetchVideoDetails([...allVideoIds]);
  } catch (err) {
    console.error(`WARNING: YouTube API error fetching video details — preserving existing data`);
    console.error(`  ${err.message}`);
    process.exit(0);
  }

  // Build video detail map
  const videoMap = new Map(videoDetails.map((v) => [v.id, v]));

  // 4. Load existing data
  const episodesPath = resolve(repoRoot, 'data/episodes.json');
  const playlistsPath = resolve(repoRoot, 'data/playlists.json');
  const rankingsPath = resolve(repoRoot, 'data/toptastings.json');
  const contentPath = resolve(repoRoot, 'content/episodes.md');

  const existingEpisodes = readJson(episodesPath) || { episodes: [] };
  const existingPlaylists = readJson(playlistsPath) || { playlists: [] };
  const existingRankings = readJson(rankingsPath) || { currentSeason: '', allTime: [], seasonal: [] };

  // 5. Merge playlists
  const playlistResult = mergePlaylists(
    activePlaylists,
    existingPlaylists.playlists,
    config.blocklist
  );

  // 6. Merge episodes
  // Build YouTube videos array with playlist associations
  const youtubeVideos = [];
  for (const pl of activePlaylists) {
    const plData = playlistResult.playlists.find(
      (p) => p.youtubePlaylistId === pl.youtubePlaylistId
    );
    const categoryId = plData ? plData.id : pl.youtubePlaylistId;
    const items = allPlaylistItems.get(pl.youtubePlaylistId) || [];

    for (const item of items) {
      const detail = videoMap.get(item.videoId);
      if (detail) {
        youtubeVideos.push({
          id: detail.id,
          youtubeId: detail.id,
          title: detail.title,
          description: detail.description,
          thumbnailUrl: detail.thumbnailUrl,
          duration: detail.duration,
          publishedAt: detail.publishedAt,
          playlistId: categoryId,
        });
      }
    }
  }

  const episodeResult = mergeEpisodes(youtubeVideos, existingEpisodes.episodes);

  // 7. Validate rankings
  const rankingsResult = validateRankings(
    allPlaylistItems,
    playlistResult.playlists,
    episodeResult.episodes,
    existingRankings
  );

  // 8. Update episodes page content
  const contentResult = updateEpisodesPage(
    playlistResult.playlists,
    contentPath,
    dryRun
  );

  // 9. Write data files
  writeJson(episodesPath, { episodes: episodeResult.episodes }, dryRun);
  writeJson(playlistsPath, { playlists: playlistResult.playlists }, dryRun);
  writeJson(rankingsPath, rankingsResult.rankings, dryRun);

  // 10. Print summary
  console.log();
  console.log('Summary:');
  console.log(`  Episodes added: ${episodeResult.added}`);
  console.log(`  Episodes removed: ${episodeResult.removed}`);
  console.log(`  Episodes updated: ${episodeResult.updated}`);
  console.log(`  Playlists renamed: ${playlistResult.renamed}`);
  console.log(`  Playlists added: ${playlistResult.added}`);
  if (blockedCount > 0) console.log(`  Playlists blocklisted: ${blockedCount}`);
  console.log(`  Rankings validated: ✓ (${rankingsResult.staleRemoved} stale removed)`);

  if (contentResult.renamed > 0 || contentResult.added > 0 || contentResult.removed > 0) {
    console.log(`  Content sections renamed: ${contentResult.renamed}`);
    console.log(`  Content sections added: ${contentResult.added}`);
    console.log(`  Content sections removed: ${contentResult.removed}`);
  }

  // Print warnings
  const warnings = [
    ...episodeResult.warnings,
    ...playlistResult.warnings,
    ...rankingsResult.warnings,
    ...contentResult.warnings,
  ];
  if (warnings.length > 0) {
    console.log();
    console.log('Warnings:');
    for (const w of warnings) {
      console.log(`  ⚠ ${w}`);
    }
  }

  if (dryRun) {
    console.log();
    console.log('DRY RUN complete — no files were modified.');
  } else {
    console.log();
    console.log('Files updated:');
    console.log('  data/episodes.json');
    console.log('  data/playlists.json');
    console.log('  data/toptastings.json');
    console.log('  content/episodes.md');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
