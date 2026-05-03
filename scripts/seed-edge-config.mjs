import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');

const required = ['VERCEL_API_TOKEN', 'VERCEL_EDGE_CONFIG_ID'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  console.error(
    'Run with `node --env-file=.env.local scripts/seed-edge-config.mjs`',
  );
  process.exit(1);
}

const TOKEN = process.env.VERCEL_API_TOKEN;
const CONFIG_ID = process.env.VERCEL_EDGE_CONFIG_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

async function readJson(name) {
  const filepath = path.join(DATA_DIR, name);
  const text = await fs.readFile(filepath, 'utf-8');
  return JSON.parse(text);
}

const items = [
  { key: 'projects', value: await readJson('projects.json') },
  { key: 'experiences', value: await readJson('experiences.json') },
  { key: 'music', value: await readJson('music.json') },
];

const qs = TEAM_ID ? `?teamId=${encodeURIComponent(TEAM_ID)}` : '';
const url = `https://api.vercel.com/v1/edge-config/${CONFIG_ID}/items${qs}`;

console.log(`Seeding ${items.length} item(s) into Edge Config ${CONFIG_ID}…`);

const res = await fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: items.map((it) => ({ operation: 'upsert', ...it })),
  }),
});

if (!res.ok) {
  const body = await res.text().catch(() => '');
  console.error(`Vercel API ${res.status}: ${body}`);
  process.exit(1);
}

console.log('Done.');
