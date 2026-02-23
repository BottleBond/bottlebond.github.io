import { describe, it, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { loadConfig } from '../lib/config.mjs';

// A valid 24-character channelId starting with "UC"
const VALID_CHANNEL_ID = 'UCxxxxxxxxxxxxxxxxxxxxxx';
const VALID_API_KEY = 'test-api-key-abc123';

describe('loadConfig', () => {
  let tmpDir;
  let savedApiKey;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'config-test-'));
    savedApiKey = process.env.YOUTUBE_API_KEY;
    process.env.YOUTUBE_API_KEY = VALID_API_KEY;
  });

  afterEach(() => {
    // Restore original env var (undefined means delete it)
    if (savedApiKey === undefined) {
      delete process.env.YOUTUBE_API_KEY;
    } else {
      process.env.YOUTUBE_API_KEY = savedApiKey;
    }

    // Clean up temp directory
    rmSync(tmpDir, { recursive: true, force: true });
  });

  /** Helper to write a sync-config.json into the temp directory. */
  function writeConfig(obj) {
    writeFileSync(join(tmpDir, 'sync-config.json'), JSON.stringify(obj));
  }

  // ── 1. Valid config loads correctly ──────────────────────────────────

  describe('valid configuration', () => {
    it('loads channelId, apiKey, and blocklist from a valid config', () => {
      const blocklist = ['PLabc123', 'PLdef456'];
      writeConfig({ channelId: VALID_CHANNEL_ID, blocklist });

      const result = loadConfig(tmpDir);

      assert.equal(result.channelId, VALID_CHANNEL_ID);
      assert.equal(result.apiKey, VALID_API_KEY);
      assert.deepEqual(result.blocklist, blocklist);
    });

    it('returns an empty blocklist when blocklist is omitted', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID });

      const result = loadConfig(tmpDir);

      assert.deepEqual(result.blocklist, []);
    });

    it('accepts an empty blocklist array', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID, blocklist: [] });

      const result = loadConfig(tmpDir);

      assert.deepEqual(result.blocklist, []);
    });
  });

  // ── 2. Missing config file ──────────────────────────────────────────

  describe('missing config file', () => {
    it('throws when sync-config.json does not exist', () => {
      const missingDir = join(tmpDir, 'no-such-dir');

      assert.throws(
        () => loadConfig(missingDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('Config file not found'));
          return true;
        }
      );
    });
  });

  // ── 3. Invalid JSON ────────────────────────────────────────────────

  describe('invalid JSON', () => {
    it('throws when config file contains invalid JSON', () => {
      writeFileSync(join(tmpDir, 'sync-config.json'), '{ not valid json }');

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('Invalid JSON'));
          return true;
        }
      );
    });
  });

  // ── 4. Missing YOUTUBE_API_KEY ──────────────────────────────────────

  describe('missing YOUTUBE_API_KEY', () => {
    it('throws when YOUTUBE_API_KEY env var is not set', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID });
      delete process.env.YOUTUBE_API_KEY;

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('YOUTUBE_API_KEY'));
          return true;
        }
      );
    });

    it('throws when YOUTUBE_API_KEY is an empty string', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID });
      process.env.YOUTUBE_API_KEY = '';

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('YOUTUBE_API_KEY'));
          return true;
        }
      );
    });
  });

  // ── 5. Invalid channelId ────────────────────────────────────────────

  describe('invalid channelId', () => {
    it('throws when channelId is missing', () => {
      writeConfig({ blocklist: [] });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('channelId'));
          return true;
        }
      );
    });

    it('throws when channelId is not a string', () => {
      writeConfig({ channelId: 12345 });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('channelId'));
          return true;
        }
      );
    });

    it('throws when channelId does not start with UC', () => {
      // 24 chars but wrong prefix
      writeConfig({ channelId: 'ABxxxxxxxxxxxxxxxxxxxxxx' });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('channelId'));
          assert(err.message.includes('UC'));
          return true;
        }
      );
    });

    it('throws when channelId is too short', () => {
      writeConfig({ channelId: 'UCshort' });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('channelId'));
          assert(err.message.includes('24'));
          return true;
        }
      );
    });

    it('throws when channelId is too long', () => {
      writeConfig({ channelId: 'UC' + 'x'.repeat(30) });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('channelId'));
          return true;
        }
      );
    });
  });

  // ── 6. Invalid blocklist ────────────────────────────────────────────

  describe('invalid blocklist', () => {
    it('throws when blocklist is a string instead of an array', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID, blocklist: 'not-an-array' });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('blocklist'));
          assert(err.message.includes('array'));
          return true;
        }
      );
    });

    it('throws when blocklist is a number', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID, blocklist: 42 });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('blocklist'));
          return true;
        }
      );
    });

    it('throws when blocklist contains non-string entries', () => {
      writeConfig({ channelId: VALID_CHANNEL_ID, blocklist: ['valid', 123] });

      assert.throws(
        () => loadConfig(tmpDir),
        (err) => {
          assert(err instanceof Error);
          assert(err.message.includes('blocklist'));
          assert(err.message.includes('string'));
          return true;
        }
      );
    });
  });
});
