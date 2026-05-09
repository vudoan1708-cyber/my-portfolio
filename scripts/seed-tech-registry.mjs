#!/usr/bin/env node
/**
 * Seed the tech registry by walking every project + experience and collecting
 * unique technologies/apis by id.
 *
 * Default behaviour: write to src/data/tech-registry.json (snapshot).
 * Pass --redis to also push the seeded doc to Upstash Redis.
 *
 * Usage:
 *   node scripts/seed-tech-registry.mjs
 *   node --env-file=.env.local scripts/seed-tech-registry.mjs --redis
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');

async function readJson(name) {
  return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), 'utf-8'));
}

async function readJsonIfExists(name) {
  try {
    return await readJson(name);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function collectFromProjects(doc, byId) {
  const collections = doc?.projects ?? {};
  for (const list of Object.values(collections)) {
    for (const project of list ?? []) {
      for (const t of project.technologies ?? []) {
        addEntry(byId, t, 'tech');
      }
      for (const a of project.apis ?? []) {
        addEntry(byId, a, 'api');
      }
    }
  }
}

function collectFromExperiences(doc, byId) {
  for (const exp of doc?.experiences ?? []) {
    for (const t of exp.technologies ?? []) {
      addEntry(byId, t, 'tech');
    }
  }
}

function addEntry(byId, raw, type) {
  if (!raw?.id) return;
  const existing = byId.get(raw.id);
  const next = {
    id: raw.id,
    name: raw.name ?? raw.id,
    link: raw.link ?? '',
    img: raw.img ?? '',
    type,
    ...(raw.tailwindCssClass
      ? { tailwindCssClass: raw.tailwindCssClass }
      : {}),
  };
  if (!existing) {
    byId.set(raw.id, next);
    return;
  }
  // Prefer richer data: keep first non-empty fields, but upgrade type from
  // tech -> api if any usage marks it as api (apis are a stricter subset).
  const merged = {
    ...existing,
    name: existing.name || next.name,
    link: existing.link || next.link,
    img: existing.img || next.img,
    type: existing.type === 'api' || next.type === 'api' ? 'api' : 'tech',
  };
  if (next.tailwindCssClass && !existing.tailwindCssClass) {
    merged.tailwindCssClass = next.tailwindCssClass;
  }
  byId.set(raw.id, merged);
}

const [projectsDoc, experiencesDoc, existingDoc] = await Promise.all([
  readJson('projects.json'),
  readJson('experiences.json'),
  readJsonIfExists('tech-registry.json'),
]);

const existingById = new Map(
  (existingDoc?.items ?? []).map((it) => [it.id, it]),
);

const byId = new Map();
collectFromProjects(projectsDoc, byId);
collectFromExperiences(experiencesDoc, byId);

for (const [id, item] of byId) {
  const prior = existingById.get(id);
  if (prior?.category && item.type === 'tech') {
    byId.set(id, { ...item, category: prior.category });
  }
}

const items = Array.from(byId.values()).sort((a, b) =>
  a.id.localeCompare(b.id),
);
const doc = { items };

const outPath = path.join(DATA_DIR, 'tech-registry.json');
await fs.writeFile(outPath, JSON.stringify(doc, null, 2) + '\n', 'utf-8');
console.log(`Wrote ${items.length} entries to ${path.relative(ROOT, outPath)}`);

if (process.argv.includes('--redis')) {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error(
      'Missing Upstash creds. Run with `node --env-file=.env.local scripts/seed-tech-registry.mjs --redis`.',
    );
    process.exit(1);
  }
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({ url, token });
  await redis.set('tech-registry', doc);
  console.log('  ✓ tech-registry pushed to Upstash Redis');
}
