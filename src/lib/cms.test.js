jest.mock('next/cache', () => ({
  unstable_cache: (fn) => fn,
  revalidateTag: jest.fn(),
}));

jest.mock('@upstash/redis', () => {
  const get = jest.fn();
  const set = jest.fn();
  const RedisMock = jest.fn(() => ({ get, set }));
  RedisMock._mocks = { get, set };
  return { Redis: RedisMock };
});

jest.mock('@/data/projects.json', () => ({
  projects: { 'web-apps': [{ id: 1, key: 'snapshot-project', img: '/x.png' }] },
  projectCollections: [{ key: 'web-apps', label: 'Web Apps' }],
}));
jest.mock('@/data/experiences.json', () => ({
  experiences: [{ id: 'snap', company: 'Snap Co', logo: '/snap.png' }],
}));
jest.mock('@/data/music.json', () => ({
  tracks: [{ id: 1, key: 'snap-track', img: '/cover.png' }],
}));

const { Redis } = require('@upstash/redis');
const { revalidateTag } = require('next/cache');
const cms = require('./cms');

const mockGet = Redis._mocks.get;
const mockSet = Redis._mocks.set;

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  process.env.ASSETS_BASE_URL = 'https://cdn.example.com/portfolio';
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('getCollection', () => {
  test('returns the bundled snapshot when Redis is not configured', async () => {
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
    expect(mockGet).not.toHaveBeenCalled();
  });

  test('resolves asset URLs by default', async () => {
    const data = await cms.getProjects();
    expect(data.projects['web-apps'][0].img).toBe(
      'https://cdn.example.com/portfolio/x.png',
    );
  });

  test('returns Redis value when configured and present', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.com';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'tkn';
    mockGet.mockResolvedValueOnce({
      projects: { games: [{ id: 9, key: 'live', img: '/live.png' }] },
      projectCollections: [],
    });
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects.games[0].key).toBe('live');
    expect(mockGet).toHaveBeenCalledWith('projects');
  });

  test('falls back to snapshot when Redis returns null', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockGet.mockResolvedValueOnce(null);
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
  });

  test('falls back to snapshot when Redis throws', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockGet.mockRejectedValueOnce(new Error('boom'));
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
  });

  test('also accepts KV_REST_API_* env var names (legacy Vercel KV)', async () => {
    process.env.KV_REST_API_URL = 'https://r';
    process.env.KV_REST_API_TOKEN = 't';
    mockGet.mockResolvedValueOnce({
      projects: { games: [{ id: 9, key: 'kv-live', img: '/x.png' }] },
      projectCollections: [],
    });
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects.games[0].key).toBe('kv-live');
    expect(Redis).toHaveBeenCalledWith({ url: 'https://r', token: 't' });
  });

  test('throws on unknown collection key', async () => {
    await expect(cms.getCollection('nope')).rejects.toThrow(
      /Unknown collection/,
    );
  });

  test('getExperiences unwraps the array', async () => {
    const list = await cms.getExperiences({ resolveAssets: false });
    expect(Array.isArray(list)).toBe(true);
    expect(list[0].id).toBe('snap');
  });

  test('getTracks unwraps the array', async () => {
    const list = await cms.getTracks({ resolveAssets: false });
    expect(list[0].key).toBe('snap-track');
  });
});

describe('setCollection', () => {
  test('throws when Redis credentials are missing', async () => {
    await expect(cms.setCollection('projects', {})).rejects.toThrow(
      /UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN/,
    );
    expect(mockSet).not.toHaveBeenCalled();
  });

  test('throws on unknown key before any network call', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    await expect(cms.setCollection('not-real', {})).rejects.toThrow(
      /Unknown collection/,
    );
    expect(mockSet).not.toHaveBeenCalled();
  });

  test('writes via redis.set and revalidates tags', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockSet.mockResolvedValueOnce('OK');
    const payload = { projects: {}, projectCollections: [] };
    await cms.setCollection('projects', payload);
    expect(mockSet).toHaveBeenCalledWith('projects', payload);
    expect(revalidateTag).toHaveBeenCalledWith('cms');
    expect(revalidateTag).toHaveBeenCalledWith('cms:projects');
  });

  test('propagates underlying Redis errors', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockSet.mockRejectedValueOnce(new Error('upstream 503'));
    await expect(cms.setCollection('projects', {})).rejects.toThrow(
      /upstream 503/,
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe('getCollectionForAdmin', () => {
  test('reads via Redis when configured (bypasses unstable_cache)', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockGet.mockResolvedValueOnce({ tracks: [{ id: 7, key: 'fresh' }] });
    const data = await cms.getCollectionForAdmin('music');
    expect(data.tracks[0].key).toBe('fresh');
    expect(mockGet).toHaveBeenCalledWith('music');
  });

  test('falls back to snapshot when Redis returns null', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://r';
    process.env.UPSTASH_REDIS_REST_TOKEN = 't';
    mockGet.mockResolvedValueOnce(null);
    const data = await cms.getCollectionForAdmin('music');
    expect(data.tracks[0].key).toBe('snap-track');
  });

  test('falls back to snapshot when Redis is not configured', async () => {
    const data = await cms.getCollectionForAdmin('music');
    expect(data.tracks[0].key).toBe('snap-track');
    expect(mockGet).not.toHaveBeenCalled();
  });
});
