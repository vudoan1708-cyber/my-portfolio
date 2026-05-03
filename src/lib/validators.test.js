const {
  isSafeHtmlSnippet,
  loginSchema,
  totpSchema,
  projectSchema,
  experienceSchema,
  trackSchema,
  projectsDocSchema,
} = require('./validators');

describe('isSafeHtmlSnippet', () => {
  const ALLOWED = [
    '',
    'plain text with no tags',
    '<a href="https://example.com">link</a>',
    '<mark>highlight</mark>',
    '<li>list item</li>',
    '<br />',
    '<p>some text</p>',
  ];
  const FORBIDDEN = [
    '<script>alert(1)</script>',
    '<SCRIPT>alert(1)</SCRIPT>',
    '<a href="javascript:alert(1)">x</a>',
    '<a href="JavaScript:alert(1)">x</a>',
    '<img src="x" onerror="alert(1)">',
    '<img src=x onerror=alert(1)>',
    '<iframe src="//evil.example"></iframe>',
    '<object data="x"></object>',
    '<embed src="x">',
    '<a href="data:text/html,<script>x</script>">x</a>',
    '<a href="vbscript:msgbox(1)">x</a>',
    'click <a href="x" onclick="alert(1)">here</a>',
  ];

  test.each(ALLOWED)('accepts: %s', (snippet) => {
    expect(isSafeHtmlSnippet(snippet)).toBe(true);
  });

  test.each(FORBIDDEN)('rejects: %s', (snippet) => {
    expect(isSafeHtmlSnippet(snippet)).toBe(false);
  });
});

describe('loginSchema', () => {
  test('accepts valid input', () => {
    expect(loginSchema.parse({ username: 'vu', password: 'p' })).toEqual({
      username: 'vu',
      password: 'p',
    });
  });

  test('rejects empty fields', () => {
    expect(() => loginSchema.parse({ username: '', password: '' })).toThrow();
  });

  test('rejects non-string types', () => {
    expect(() => loginSchema.parse({ username: 123, password: 'p' })).toThrow();
  });

  test('rejects oversized input (DoS resistance)', () => {
    expect(() =>
      loginSchema.parse({ username: 'x'.repeat(500), password: 'p' }),
    ).toThrow();
    expect(() =>
      loginSchema.parse({ username: 'x', password: 'p'.repeat(1024) }),
    ).toThrow();
  });
});

describe('totpSchema', () => {
  test('accepts 6 digits', () => {
    expect(totpSchema.parse({ token: '123456' }).token).toBe('123456');
  });

  test('rejects non-digit input', () => {
    expect(() => totpSchema.parse({ token: 'abcdef' })).toThrow();
  });

  test('rejects wrong length', () => {
    expect(() => totpSchema.parse({ token: '12345' })).toThrow();
    expect(() => totpSchema.parse({ token: '123456789' })).toThrow();
  });
});

describe('projectSchema', () => {
  const validProject = {
    id: 1,
    key: 'my-project',
    title: 'My Project',
    img: '/projects/foo.png',
    link: '/portfolio/web-apps/my-project',
    startDate: 'Jan 1, 2024',
    description: ['Hello world'],
  };

  test('accepts a minimal valid project', () => {
    const out = projectSchema.parse(validProject);
    expect(out.key).toBe('my-project');
    expect(out.gallery).toEqual([]);
    expect(out.technologies).toEqual([]);
  });

  test('rejects bad slug', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, key: 'My Project' }),
    ).toThrow();
    expect(() =>
      projectSchema.parse({ ...validProject, key: 'has space' }),
    ).toThrow();
    expect(() =>
      projectSchema.parse({ ...validProject, key: 'UPPER' }),
    ).toThrow();
  });

  test('rejects non-portfolio link prefix', () => {
    expect(() =>
      projectSchema.parse({ ...validProject, link: '/something-else' }),
    ).toThrow();
  });

  test('rejects XSS in description (script tag)', () => {
    expect(() =>
      projectSchema.parse({
        ...validProject,
        description: ['<script>alert(1)</script>'],
      }),
    ).toThrow();
  });

  test('rejects XSS in description (event handler)', () => {
    expect(() =>
      projectSchema.parse({
        ...validProject,
        description: ['<img src="x" onerror="alert(1)">'],
      }),
    ).toThrow();
  });

  test('accepts safe HTML in description', () => {
    expect(
      projectSchema.parse({
        ...validProject,
        description: ['<mark>safe</mark>', '<a href="https://example.com">link</a>'],
      }),
    ).toBeTruthy();
  });

  test('rejects javascript: URL in projectURL', () => {
    expect(() =>
      projectSchema.parse({
        ...validProject,
        projectURL: { title: 't', label: 'l', link: 'javascript:alert(1)' },
      }),
    ).toThrow();
  });
});

describe('experienceSchema', () => {
  const valid = {
    id: 'voly',
    key: 'voly',
    company: 'Voly',
    role: 'Engineer',
    startDate: 'Aug 2021',
  };

  test('accepts a minimal valid experience', () => {
    const out = experienceSchema.parse(valid);
    expect(out.technologies).toEqual([]);
    expect(out.relatedProjectKeys).toEqual([]);
  });

  test('rejects unsafe HTML in summary', () => {
    expect(() =>
      experienceSchema.parse({
        ...valid,
        summary: '<script>x</script>',
      }),
    ).toThrow();
  });

  test('rejects bad related project key (not a slug)', () => {
    expect(() =>
      experienceSchema.parse({
        ...valid,
        relatedProjectKeys: ['Has Space'],
      }),
    ).toThrow();
  });
});

describe('trackSchema', () => {
  test('accepts a minimal valid track', () => {
    const out = trackSchema.parse({
      id: 1,
      key: 'foo',
      title: 'Foo',
      img: '/music/foo/cover.png',
      src: '/music/foo/foo.mp3',
    });
    expect(out.description).toEqual([]);
  });

  test('rejects unsafe HTML in description', () => {
    expect(() =>
      trackSchema.parse({
        id: 1,
        key: 'foo',
        title: 'Foo',
        img: '/music/foo/cover.png',
        src: '/music/foo/foo.mp3',
        description: ['<iframe src="x"></iframe>'],
      }),
    ).toThrow();
  });
});

describe('projectsDocSchema', () => {
  test('rejects unknown collection key', () => {
    expect(() =>
      projectsDocSchema.parse({
        projects: { 'not-a-real-collection': [] },
        projectCollections: [
          { key: 'web-apps', label: 'Web', img: '/x.png', description: 'd' },
        ],
      }),
    ).toThrow();
  });
});
