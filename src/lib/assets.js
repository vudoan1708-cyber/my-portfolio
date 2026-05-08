const FALLBACK_BASE = 'https://vudoan1708-cyber.github.io/logos/portfolio';
const RESERVED_PATH_PREFIXES = ['/admin', '/api', '/portfolio'];

function getBase() {
  const base = process.env.ASSETS_BASE_URL || FALLBACK_BASE;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function isTrustedAssetPath(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (value.startsWith('data:')) return false;
  if (value.startsWith('/')) {
    return !RESERVED_PATH_PREFIXES.some(
      (p) => value === p || value.startsWith(`${p}/`),
    );
  }
  const base = getBase();
  return value === base || value.startsWith(`${base}/`);
}

export function resolveAsset(value) {
  if (typeof value !== 'string' || value.length === 0) return value;
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('/portfolio') || value.startsWith('/admin') || value.startsWith('/api')) {
    return value;
  }
  const base = getBase();
  return value.startsWith('/') ? `${base}${value}` : `${base}/${value}`;
}

const ASSET_KEYS = new Set(['img', 'img-lg', 'logo', 'src', 'cover']);

export function resolveAssetsDeep(node) {
  if (Array.isArray(node)) return node.map(resolveAssetsDeep);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && ASSET_KEYS.has(key)) {
        out[key] = resolveAsset(value);
      } else {
        out[key] = resolveAssetsDeep(value);
      }
    }
    return out;
  }
  return node;
}

export function stripAssetBase(value) {
  if (typeof value !== 'string' || value.length === 0) return value;
  const base = getBase();
  if (value.startsWith(base)) return value.slice(base.length) || '/';
  return value;
}

export function stripAssetsDeep(node) {
  if (Array.isArray(node)) return node.map(stripAssetsDeep);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && ASSET_KEYS.has(key)) {
        out[key] = stripAssetBase(value);
      } else {
        out[key] = stripAssetsDeep(value);
      }
    }
    return out;
  }
  return node;
}
