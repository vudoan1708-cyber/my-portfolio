import { getProjects } from '@/lib/cms';

const SITE_URL = 'https://vudoan.vercel.app';

export default async function sitemap() {
  const { projects, projectCollections } = await getProjects({ resolveAssets: false });
  const now = new Date();

  const staticRoutes = [
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/music`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const collectionRoutes = projectCollections.map((c) => ({
    url: `${SITE_URL}/portfolio/${c.key}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const projectRoutes = [];
  for (const c of projectCollections) {
    for (const p of projects[c.key] || []) {
      const lastMod = p.endDate ? new Date(p.endDate) : (p.startDate ? new Date(p.startDate) : now);
      projectRoutes.push({
        url: `${SITE_URL}/portfolio/${c.key}/${p.key}`,
        lastModified: Number.isNaN(lastMod.getTime()) ? now : lastMod,
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...collectionRoutes, ...projectRoutes];
}
