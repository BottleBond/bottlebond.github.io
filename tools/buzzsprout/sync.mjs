#!/usr/bin/env node

/**
 * Buzzsprout RSS Feed Sync
 *
 * Fetches the Buzzsprout podcast RSS feed, parses episode data,
 * fuzzy-matches episodes to existing YouTube episodes, and outputs
 * data/buzzsprout.json for Hugo templates to consume.
 *
 * Usage:
 *   node sync.mjs                        # sync using config file
 *   node sync.mjs --feed-url URL         # override feed URL
 *   node sync.mjs --dry-run              # parse and print, don't write
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "../..");
const CONFIG_PATH = resolve(PROJECT_ROOT, "sync-config.json");
const EPISODES_PATH = resolve(PROJECT_ROOT, "data/episodes.json");
const OUTPUT_PATH = resolve(PROJECT_ROOT, "data/buzzsprout.json");

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { dryRun: false, feedUrl: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--dry-run") {
      args.dryRun = true;
    } else if (argv[i] === "--feed-url" && argv[i + 1]) {
      args.feedUrl = argv[++i];
    }
  }
  return args;
}

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    console.warn("Warning: Could not parse sync-config.json");
    return {};
  }
}

function loadExistingEpisodes() {
  if (!existsSync(EPISODES_PATH)) return [];
  try {
    const data = JSON.parse(readFileSync(EPISODES_PATH, "utf-8"));
    return data.episodes || [];
  } catch {
    return [];
  }
}

function loadExistingBuzzsprout() {
  if (!existsSync(OUTPUT_PATH)) return null;
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// RSS fetching & parsing
// ---------------------------------------------------------------------------

async function fetchFeed(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Feed fetch failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function parseRSS(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
  });
  const parsed = parser.parse(xml);
  const channel = parsed?.rss?.channel;
  if (!channel) throw new Error("Invalid RSS feed: no channel found");

  const items = Array.isArray(channel.item)
    ? channel.item
    : channel.item
      ? [channel.item]
      : [];

  const podcastUrl = channel.link || "";

  const episodes = items.map((item) => {
    const enclosure = item.enclosure || {};
    const guid = item.guid?.["#text"] || item.guid || "";
    // Extract Buzzsprout ID from guid or enclosure URL
    const buzzsproutId = extractBuzzsproutId(guid, enclosure["@_url"] || "");

    return {
      buzzsproutId,
      title: item.title || "",
      audioUrl: enclosure["@_url"] || "",
      listenUrl: item.link || "",
      duration: formatDuration(item["itunes:duration"]),
      publishedAt: formatDate(item.pubDate),
      matchedEpisodeId: null, // filled in later
    };
  });

  return { podcastUrl, episodes };
}

function extractBuzzsproutId(guid, audioUrl) {
  // Buzzsprout GUIDs often look like: Buzzsprout-12345678
  const guidMatch = guid.match(/Buzzsprout-(\d+)/i);
  if (guidMatch) return guidMatch[1];

  // Try extracting from audio URL path
  const urlMatch = audioUrl.match(/\/(\d+)\.mp3/);
  if (urlMatch) return urlMatch[1];

  // Fall back to the raw guid
  return guid.toString();
}

function formatDuration(raw) {
  if (!raw) return "";
  // itunes:duration can be seconds (int) or HH:MM:SS / MM:SS
  if (typeof raw === "number" || /^\d+$/.test(raw)) {
    const totalSeconds = Number(raw);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return raw.toString();
}

function formatDate(pubDate) {
  if (!pubDate) return "";
  try {
    const d = new Date(pubDate);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch {
    return pubDate;
  }
}

// ---------------------------------------------------------------------------
// Fuzzy matching
// ---------------------------------------------------------------------------

/**
 * Normalise a title for comparison: lowercase, strip common podcast prefixes,
 * remove punctuation, collapse whitespace.
 */
function normaliseTitle(title) {
  return title
    .toLowerCase()
    .replace(/^(episode\s*\d+[\s:–-]*|ep\.?\s*\d+[\s:–-]*)/i, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Simple word-overlap similarity (Jaccard-like).
 * Returns a score between 0 and 1.
 */
function titleSimilarity(a, b) {
  const wordsA = new Set(normaliseTitle(a).split(" ").filter(Boolean));
  const wordsB = new Set(normaliseTitle(b).split(" ").filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

const MATCH_THRESHOLD = 0.5;

function matchEpisodes(buzzsproutEpisodes, youtubeEpisodes) {
  const usedYtIds = new Set();

  for (const bEp of buzzsproutEpisodes) {
    let bestScore = 0;
    let bestMatch = null;

    for (const ytEp of youtubeEpisodes) {
      if (usedYtIds.has(ytEp.youtubeId)) continue;
      const score = titleSimilarity(bEp.title, ytEp.title);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = ytEp;
      }
    }

    if (bestMatch && bestScore >= MATCH_THRESHOLD) {
      bEp.matchedEpisodeId = bestMatch.youtubeId;
      usedYtIds.add(bestMatch.youtubeId);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  const config = loadConfig();
  const feedUrl = args.feedUrl || config.buzzsprout?.feedUrl || "";

  if (!feedUrl) {
    console.log("No Buzzsprout feed URL configured. Skipping sync.");
    console.log("Set buzzsprout.feedUrl in sync-config.json or pass --feed-url.");
    process.exit(0);
  }

  console.log(`Fetching Buzzsprout RSS feed: ${feedUrl}`);

  let feedData;
  try {
    const xml = await fetchFeed(feedUrl);
    feedData = parseRSS(xml);
    console.log(`Parsed ${feedData.episodes.length} episodes from feed.`);
  } catch (err) {
    console.error(`Error fetching/parsing feed: ${err.message}`);
    // Graceful failure: preserve existing data
    const existing = loadExistingBuzzsprout();
    if (existing) {
      console.log("Preserving existing data/buzzsprout.json.");
    }
    process.exit(0);
  }

  // Fuzzy-match to YouTube episodes
  const youtubeEpisodes = loadExistingEpisodes();
  if (youtubeEpisodes.length > 0) {
    matchEpisodes(feedData.episodes, youtubeEpisodes);
    const matched = feedData.episodes.filter((e) => e.matchedEpisodeId).length;
    console.log(`Matched ${matched}/${feedData.episodes.length} episodes to YouTube data.`);
  }

  const output = {
    podcastUrl: feedData.podcastUrl,
    episodes: feedData.episodes,
  };

  if (args.dryRun) {
    console.log("\n--- DRY RUN (no file written) ---");
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
