import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Redis } from '@upstash/redis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');

const url =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    'Missing env vars: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_* equivalents).',
  );
  console.error(
    'Run with `node --env-file=.env.local scripts/seed-cms.mjs`',
  );
  process.exit(1);
}

async function readJson(name) {
  const filepath = path.join(DATA_DIR, name);
  return JSON.parse(await fs.readFile(filepath, 'utf-8'));
}

const items = [
  { key: 'projects', value: await readJson('projects.json') },
  { key: 'experiences', value: await readJson('experiences.json') },
  { key: 'music', value: await readJson('music.json') },
];

const redis = new Redis({ url, token });

console.log(`Seeding ${items.length} key(s) into Upstash Redis…`);
for (const { key, value } of items) {
  const bytes = JSON.stringify(value).length;
  await redis.set(key, value);
  console.log(`  ✓ ${key}  (${bytes.toLocaleString()} bytes)`);
}
console.log('Done.');
