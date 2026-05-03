jest.mock('next/cache', () => ({
  unstable_cache: (fn) => fn,
  revalidateTag: jest.fn(),
}));

jest.mock('@vercel/edge-config', () => ({
  get: jest.fn(),
}));

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

const { get: edgeConfigGet } = require('@vercel/edge-config');
const { revalidateTag } = require('next/cache');
const cms = require('./cms');

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.EDGE_CONFIG;
  delete process.env.VERCEL_API_TOKEN;
  delete process.env.VERCEL_EDGE_CONFIG_ID;
  delete process.env.VERCEL_TEAM_ID;
  process.env.ASSETS_BASE_URL = 'https://cdn.example.com/portfolio';
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('getCollection', () => {
  test('returns the bundled snapshot when Edge Config is not configured', async () => {
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
    expect(edgeConfigGet).not.toHaveBeenCalled();
  });

  test('resolves asset URLs by default', async () => {
    const data = await cms.getProjects();
    expect(data.projects['web-apps'][0].img).toBe(
      'https://cdn.example.com/portfolio/x.png',
    );
  });

  test('returns Edge Config value when configured and present', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/abc?token=xyz';
    edgeConfigGet.mockResolvedValueOnce({
      projects: { games: [{ id: 9, key: 'live', img: '/live.png' }] },
      projectCollections: [],
    });
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects.games[0].key).toBe('live');
    expect(edgeConfigGet).toHaveBeenCalledWith('projects');
  });

  test('falls back to snapshot when Edge Config returns null', async () => {
    process.env.EDGE_CONFIG = 'edge://x';
    edgeConfigGet.mockResolvedValueOnce(null);
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
  });

  test('falls back to snapshot when Edge Config throws', async () => {
    process.env.EDGE_CONFIG = 'edge://x';
    edgeConfigGet.mockRejectedValueOnce(new Error('boom'));
    const data = await cms.getProjects({ resolveAssets: false });
    expect(data.projects['web-apps'][0].key).toBe('snapshot-project');
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
  test('throws when Vercel API token / config id are missing', async () => {
    await expect(cms.setCollection('projects', {})).rejects.toThrow(
      /VERCEL_API_TOKEN and VERCEL_EDGE_CONFIG_ID/,
    );
  });

  test('throws on unknown key before any network call', async () => {
    process.env.VERCEL_API_TOKEN = 't';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_1';
    const fetchMock = jest.fn();
    global.fetch = fetchMock;
    await expect(cms.setCollection('not-real', {})).rejects.toThrow(
      /Unknown collection/,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('PATCHes Edge Config items with upsert and revalidates tags', async () => {
    process.env.VERCEL_API_TOKEN = 'tkn';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_42';
    process.env.VERCEL_TEAM_ID = 'team_99';
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200, text: async () => '' });
    global.fetch = fetchMock;
    const payload = { projects: {}, projectCollections: [] };
    await cms.setCollection('projects', payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://api.vercel.com/v1/edge-config/cfg_42/items?teamId=team_99',
    );
    expect(init.method).toBe('PATCH');
    expect(init.headers.Authorization).toBe('Bearer tkn');
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      items: [{ operation: 'upsert', key: 'projects', value: payload }],
    });
    expect(revalidateTag).toHaveBeenCalledWith('cms');
    expect(revalidateTag).toHaveBeenCalledWith('cms:projects');
  });

  test('throws when Edge Config write returns non-OK', async () => {
    process.env.VERCEL_API_TOKEN = 'tkn';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_42';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'unauthorized',
    });
    await expect(cms.setCollection('projects', {})).rejects.toThrow(
      /Edge Config write failed \(401\): unauthorized/,
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('omits teamId from query string when not set', async () => {
    process.env.VERCEL_API_TOKEN = 'tkn';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_42';
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, status: 200, text: async () => '' });
    global.fetch = fetchMock;
    await cms.setCollection('music', { tracks: [] });
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.vercel.com/v1/edge-config/cfg_42/items');
  });
});

describe('getCollectionForAdmin', () => {
  test('reads via Vercel API when configured (bypasses Edge Config cache)', async () => {
    process.env.VERCEL_API_TOKEN = 'tkn';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_42';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ value: { tracks: [{ id: 7, key: 'fresh' }] } }),
    });
    global.fetch = fetchMock;
    const data = await cms.getCollectionForAdmin('music');
    expect(data.tracks[0].key).toBe('fresh');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain(
      '/v1/edge-config/cfg_42/item/music',
    );
  });

  test('falls back to snapshot when Vercel API returns 404', async () => {
    process.env.VERCEL_API_TOKEN = 'tkn';
    process.env.VERCEL_EDGE_CONFIG_ID = 'cfg_42';
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 404, text: async () => '' });
    const data = await cms.getCollectionForAdmin('music');
    expect(data.tracks[0].key).toBe('snap-track');
  });
});
