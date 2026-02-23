import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Load and validate sync configuration.
 * @param {string} repoRoot - Path to the repository root
 * @returns {{ channelId: string, apiKey: string, blocklist: string[] }}
 */
export function loadConfig(repoRoot) {
  const configPath = resolve(repoRoot, 'sync-config.json');

  let raw;
  try {
    raw = readFileSync(configPath, 'utf-8');
  } catch (err) {
    throw new Error(
      `Config file not found: ${configPath}\n` +
      'Create sync-config.json with { "channelId": "UC...", "blocklist": [] }'
    );
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${configPath}`);
  }

  // Validate channelId
  if (!config.channelId || typeof config.channelId !== 'string') {
    throw new Error('sync-config.json: "channelId" is required and must be a string');
  }
  if (!config.channelId.startsWith('UC') || config.channelId.length !== 24) {
    throw new Error(
      `sync-config.json: "channelId" must start with "UC" and be 24 characters. ` +
      `Got: "${config.channelId}"`
    );
  }

  // Validate blocklist
  if (config.blocklist !== undefined) {
    if (!Array.isArray(config.blocklist)) {
      throw new Error('sync-config.json: "blocklist" must be an array of playlist IDs');
    }
    for (const id of config.blocklist) {
      if (typeof id !== 'string') {
        throw new Error(`sync-config.json: blocklist entries must be strings. Got: ${typeof id}`);
      }
    }
  }

  // Read API key from environment
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'YOUTUBE_API_KEY environment variable is not set.\n' +
      'Get an API key from https://console.cloud.google.com/apis/credentials'
    );
  }

  return {
    channelId: config.channelId,
    apiKey,
    blocklist: config.blocklist || [],
  };
}
