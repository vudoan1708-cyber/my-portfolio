import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { Redis } from '@upstash/redis';

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

function getRedisCredentials() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return { url, token };
}

function redisConfigured() {
  const { url, token } = getRedisCredentials();
  return Boolean(url && token);
}

function getRedis() {
  const { url, token } = getRedisCredentials();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readRaw(key) {
  if (redisConfigured()) {
    try {
      const redis = getRedis();
      const value = await redis.get(key);
      if (value !== undefined && value !== null) return value;
    } catch (error) {
      console.error(`[cms] Redis read failed for "${key}"`, error);
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
  if (redisConfigured()) {
    try {
      const redis = getRedis();
      const direct = await redis.get(key);
      if (direct !== undefined && direct !== null) return direct;
    } catch (error) {
      console.error(`[cms] Redis admin read failed for "${key}"`, error);
    }
  }
  return SNAPSHOTS[key];
}

export async function setCollection(key, value) {
  ensureKey(key);
  if (!redisConfigured()) {
    throw new Error(
      '[cms] Cannot write: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.',
    );
  }
  const redis = getRedis();
  await redis.set(key, value);
  revalidateTag('cms');
  revalidateTag(TAGS[key]);
  return true;
}
