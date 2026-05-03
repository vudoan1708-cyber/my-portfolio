import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { get as edgeConfigGet } from '@vercel/edge-config';

import { resolveAssetsDeep } from './assets';

import projectsSnapshot from '@/data/projects.json';
import experiencesSnapshot from '@/data/experiences.json';
import musicSnapshot from '@/data/music.json';

export const COLLECTION_KEYS = ['projects', 'experiences', 'music'];

const SNAPSHOTS = {
  projects: projectsSnapshot,
  experiences: experiencesSnapshot,
  music: musicSnapshot,
};

const TAGS = {
  projects: 'cms:projects',
  experiences: 'cms:experiences',
  music: 'cms:music',
};

function edgeConfigConfigured() {
  return Boolean(process.env.EDGE_CONFIG);
}

function vercelApiConfigured() {
  return Boolean(
    process.env.VERCEL_API_TOKEN && process.env.VERCEL_EDGE_CONFIG_ID,
  );
}

async function readRaw(key) {
  if (edgeConfigConfigured()) {
    try {
      const value = await edgeConfigGet(key);
      if (value !== undefined && value !== null) return value;
    } catch (error) {
      console.error(`[cms] Edge Config read failed for "${key}"`, error);
    }
  }
  return SNAPSHOTS[key];
}

const taggedReaders = {
  projects: unstable_cache(
    async () => readRaw('projects'),
    ['cms-read', 'projects'],
    { tags: ['cms', TAGS.projects], revalidate: 60 },
  ),
  experiences: unstable_cache(
    async () => readRaw('experiences'),
    ['cms-read', 'experiences'],
    { tags: ['cms', TAGS.experiences], revalidate: 60 },
  ),
  music: unstable_cache(
    async () => readRaw('music'),
    ['cms-read', 'music'],
    { tags: ['cms', TAGS.music], revalidate: 60 },
  ),
};

function ensureKey(key) {
  if (!COLLECTION_KEYS.includes(key)) {
    throw new Error(`[cms] Unknown collection key: ${key}`);
  }
}

export async function getCollection(key, { resolveAssets = true } = {}) {
  ensureKey(key);
  const raw = (await taggedReaders[key]()) ?? SNAPSHOTS[key];
  return resolveAssets ? resolveAssetsDeep(raw) : raw;
}

export async function getProjects(options) {
  return getCollection('projects', options);
}

export async function getExperiences(options) {
  const data = await getCollection('experiences', options);
  return data?.experiences ?? [];
}

export async function getTracks(options) {
  const data = await getCollection('music', options);
  return data?.tracks ?? [];
}

export async function getCollectionForAdmin(key) {
  ensureKey(key);
  if (vercelApiConfigured()) {
    try {
      const direct = await fetchEdgeConfigItem(key);
      if (direct !== undefined && direct !== null) return direct;
    } catch (error) {
      console.error(`[cms] Vercel API read failed for "${key}"`, error);
    }
  }
  return readRaw(key);
}

async function fetchEdgeConfigItem(key) {
  const id = process.env.VERCEL_EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const url = `https://api.vercel.com/v1/edge-config/${id}/item/${encodeURIComponent(key)}${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Vercel API ${res.status}: ${body}`);
  }
  const json = await res.json();
  return json?.value ?? null;
}

export async function setCollection(key, value) {
  ensureKey(key);
  if (!vercelApiConfigured()) {
    throw new Error(
      '[cms] Cannot write: VERCEL_API_TOKEN and VERCEL_EDGE_CONFIG_ID must be set.',
    );
  }
  const id = process.env.VERCEL_EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const url = `https://api.vercel.com/v1/edge-config/${id}/items${qs}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ operation: 'upsert', key, value }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`[cms] Edge Config write failed (${res.status}): ${body}`);
  }

  revalidateTag('cms');
  revalidateTag(TAGS[key]);
  return true;
}
