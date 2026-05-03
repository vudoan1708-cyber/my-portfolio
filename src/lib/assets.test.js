import {
  resolveAsset,
  resolveAssetsDeep,
  stripAssetBase,
  stripAssetsDeep,
} from './assets';

const ORIGINAL_ENV = process.env.ASSETS_BASE_URL;

beforeEach(() => {
  process.env.ASSETS_BASE_URL = 'https://cdn.example.com/portfolio';
});

afterAll(() => {
  if (ORIGINAL_ENV === undefined) delete process.env.ASSETS_BASE_URL;
  else process.env.ASSETS_BASE_URL = ORIGINAL_ENV;
});

describe('resolveAsset', () => {
  test('prepends base to relative paths starting with /', () => {
    expect(resolveAsset('/projects/techs/react.svg')).toBe(
      'https://cdn.example.com/portfolio/projects/techs/react.svg',
    );
  });

  test('prepends base to relative paths without leading /', () => {
    expect(resolveAsset('projects/techs/react.svg')).toBe(
      'https://cdn.example.com/portfolio/projects/techs/react.svg',
    );
  });

  test('passes through absolute http URLs', () => {
    expect(resolveAsset('https://other.example.com/img.png')).toBe(
      'https://other.example.com/img.png',
    );
  });

  test('passes through protocol-relative URLs', () => {
    expect(resolveAsset('//other.example.com/img.png')).toBe(
      '//other.example.com/img.png',
    );
  });

  test('passes through data URIs', () => {
    expect(resolveAsset('data:image/png;base64,iVBOR')).toBe(
      'data:image/png;base64,iVBOR',
    );
  });

  test('passes through internal app routes (not asset paths)', () => {
    expect(resolveAsset('/portfolio/web-apps/foo')).toBe(
      '/portfolio/web-apps/foo',
    );
    expect(resolveAsset('/admin/projects')).toBe('/admin/projects');
    expect(resolveAsset('/api/something')).toBe('/api/something');
  });

  test('handles empty / non-string input', () => {
    expect(resolveAsset('')).toBe('');
    expect(resolveAsset(null)).toBe(null);
    expect(resolveAsset(undefined)).toBe(undefined);
    expect(resolveAsset(42)).toBe(42);
  });

  test('strips trailing slash from base URL', () => {
    process.env.ASSETS_BASE_URL = 'https://cdn.example.com/portfolio/';
    expect(resolveAsset('/img.png')).toBe(
      'https://cdn.example.com/portfolio/img.png',
    );
  });

  test('falls back to GitHub Pages base when env var unset', () => {
    delete process.env.ASSETS_BASE_URL;
    expect(resolveAsset('/img.png')).toBe(
      'https://vudoan1708-cyber.github.io/logos/portfolio/img.png',
    );
  });
});

describe('resolveAssetsDeep', () => {
  test('only resolves whitelisted asset keys', () => {
    const input = {
      title: '/projects/foo.png',
      img: '/projects/foo.png',
      link: '/portfolio/foo',
    };
    expect(resolveAssetsDeep(input)).toEqual({
      title: '/projects/foo.png',
      img: 'https://cdn.example.com/portfolio/projects/foo.png',
      link: '/portfolio/foo',
    });
  });

  test('recurses into nested objects and arrays', () => {
    const input = {
      gallery: [
        { alt: 'one', img: '/a.png' },
        { alt: 'two', img: '/b.png' },
      ],
      logo: '/logo.svg',
      nested: { src: '/audio.mp3' },
    };
    expect(resolveAssetsDeep(input)).toEqual({
      gallery: [
        { alt: 'one', img: 'https://cdn.example.com/portfolio/a.png' },
        { alt: 'two', img: 'https://cdn.example.com/portfolio/b.png' },
      ],
      logo: 'https://cdn.example.com/portfolio/logo.svg',
      nested: { src: 'https://cdn.example.com/portfolio/audio.mp3' },
    });
  });

  test('handles null and primitives', () => {
    expect(resolveAssetsDeep(null)).toBe(null);
    expect(resolveAssetsDeep('hello')).toBe('hello');
    expect(resolveAssetsDeep([1, 2])).toEqual([1, 2]);
  });
});

describe('stripAssetBase', () => {
  test('strips base prefix from absolute URLs', () => {
    expect(
      stripAssetBase('https://cdn.example.com/portfolio/img.png'),
    ).toBe('/img.png');
  });

  test('returns "/" if value equals the base', () => {
    expect(stripAssetBase('https://cdn.example.com/portfolio')).toBe('/');
  });

  test('leaves URLs not under base untouched', () => {
    expect(stripAssetBase('https://other.example.com/img.png')).toBe(
      'https://other.example.com/img.png',
    );
  });

  test('handles empty / non-string input', () => {
    expect(stripAssetBase('')).toBe('');
    expect(stripAssetBase(null)).toBe(null);
  });
});

describe('stripAssetsDeep', () => {
  test('strips only whitelisted asset keys', () => {
    const input = {
      img: 'https://cdn.example.com/portfolio/a.png',
      link: 'https://cdn.example.com/portfolio/should-not-strip',
    };
    expect(stripAssetsDeep(input)).toEqual({
      img: '/a.png',
      link: 'https://cdn.example.com/portfolio/should-not-strip',
    });
  });

  test('round-trips with resolveAssetsDeep', () => {
    const original = {
      img: '/projects/x.png',
      gallery: [{ img: '/projects/y.png', alt: 'y' }],
    };
    const resolved = resolveAssetsDeep(original);
    const stripped = stripAssetsDeep(resolved);
    expect(stripped).toEqual(original);
  });
});
