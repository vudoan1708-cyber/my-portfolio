import { z } from 'zod';

import { isTrustedAssetPath } from './assets';

const FORBIDDEN_HTML_PATTERNS = [
  /<script\b/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /\son\w+\s*=/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
];

export function isSafeHtmlSnippet(value) {
  if (typeof value !== 'string') return true;
  return !FORBIDDEN_HTML_PATTERNS.some((re) => re.test(value));
}

const safeHtml = z.string().refine(isSafeHtmlSnippet, {
  message: 'HTML contains disallowed tags or attributes.',
});

const slug = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'Must be lowercase kebab-case (a-z, 0-9, hyphens).',
  });

const collectionKey = z.enum([
  'web-apps',
  'utilities',
  'games',
  'ai-projects',
  'designs',
]);

const url = z
  .string()
  .min(1)
  .refine((s) => /^https?:\/\//i.test(s), {
    message: 'Must be an http(s) URL.',
  });

const relativeOrAbsoluteUrl = z
  .string()
  .min(1)
  .refine(
    (s) => /^https?:\/\//i.test(s) || s.startsWith('/'),
    { message: 'Must be an http(s) URL or a path starting with /.' },
  );

const safeImagePath = z
  .string()
  .min(1)
  .refine(isTrustedAssetPath, {
    message:
      'Image must be a path starting with / (not /admin, /api, /portfolio) or a URL on the trusted assets host.',
  });

const techRef = z.object({
  id: slug,
  name: z.string().min(1).max(80),
  link: url.optional().or(z.literal('').transform(() => undefined)),
  img: safeImagePath.optional().or(z.literal('').transform(() => undefined)),
});

const linkBlock = z
  .object({
    title: z.string().min(1),
    label: z.string().optional(),
    link: url.optional(),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          link: url,
        }),
      )
      .optional(),
  })
  .refine((v) => Boolean(v.link) || (v.links && v.links.length > 0), {
    message: 'linkBlock must have either link or a non-empty links array.',
  });

const galleryItem = z.object({
  alt: z.string().min(1).max(200),
  img: safeImagePath,
});

const videoItem = z
  .object({
    title: z.string().optional(),
    source: z.string().optional(),
    link: relativeOrAbsoluteUrl.optional(),
    src: relativeOrAbsoluteUrl.optional(),
    poster: safeImagePath.optional(),
  })
  .refine((v) => Boolean(v.link || v.src), {
    message: 'video must have a link or src.',
  });

export const projectSchema = z.object({
  id: z.union([z.number().int(), z.string().min(1)]),
  key: slug,
  title: z.string().min(1).max(120),
  img: safeImagePath,
  'img-lg': safeImagePath.optional().nullable(),
  link: z.string().startsWith('/portfolio/'),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  starred: z.boolean().optional(),
  role: z.string().optional().nullable(),
  projectType: z.string().optional().nullable(),
  projectCode: linkBlock.nullable().optional(),
  projectLog: linkBlock.nullable().optional(),
  projectURL: linkBlock.nullable().optional(),
  report: linkBlock.nullable().optional(),
  videos: z.array(videoItem).default([]),
  design: linkBlock.nullable().optional(),
  technologies: z.array(techRef).default([]),
  apis: z.array(techRef).default([]),
  description: z.array(safeHtml).default([]),
  gallery: z.array(galleryItem).default([]),
});

export const projectCollectionSchema = z.object({
  key: collectionKey,
  label: z.string().min(1).max(60),
  img: safeImagePath,
  description: z.string().min(1).max(500),
});

export const projectsDocSchema = z.object({
  projects: z.record(collectionKey, z.array(projectSchema)),
  projectCollections: z.array(projectCollectionSchema).min(1),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  key: slug,
  company: z.string().min(1).max(120),
  companyURL: url.optional().nullable(),
  role: z.string().min(1).max(120),
  location: z.string().optional().nullable(),
  employmentType: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().nullable().optional(),
  current: z.boolean().optional(),
  logo: safeImagePath.optional().nullable(),
  summary: safeHtml.optional().nullable(),
  technologies: z.array(techRef).default([]),
  relatedProjectKeys: z.array(slug).default([]),
});

export const experiencesDocSchema = z.object({
  experiences: z.array(experienceSchema),
});

export const techRegistryItemSchema = z.object({
  id: slug,
  name: z.string().min(1).max(80),
  link: url,
  img: safeImagePath,
  type: z.enum(['tech', 'api']),
  tailwindCssClass: z.string().max(120).optional().nullable(),
});

export const techRegistryDocSchema = z.object({
  items: z.array(techRegistryItemSchema).default([]),
});

export const trackSchema = z.object({
  id: z.union([z.number().int(), z.string().min(1)]),
  key: slug,
  title: z.string().min(1).max(120),
  img: safeImagePath,
  src: relativeOrAbsoluteUrl,
  dateModified: z.string().optional().nullable(),
  description: z.array(safeHtml).default([]),
});

export const musicDocSchema = z.object({
  tracks: z.array(trackSchema),
});

export const loginSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(256),
});

export const totpSchema = z.object({
  token: z
    .string()
    .min(6)
    .max(8)
    .regex(/^\d+$/, { message: 'Must be 6 digits.' }),
});
