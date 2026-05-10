import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { getProjects } from '@/lib/cms';

export async function generateStaticParams() {
  const { projects, projectCollections } = await getProjects({ resolveAssets: false });
  const params = [];
  for (const c of projectCollections) {
    for (const p of projects[c.key] || []) {
      params.push({ collection: c.key, projectKey: p.key });
    }
  }
  return params;
}

function findProject(projects, collection, projectKey) {
  return (projects[collection] || []).find((p) => p.key === projectKey);
}

function buildRelatedProjects(projects, current, currentCollection, { limit = 8 } = {}) {
  const currentIds = new Set();
  for (const t of current.technologies || []) currentIds.add(t.id);
  for (const a of current.apis || []) currentIds.add(a.id);
  if (currentIds.size === 0) return [];

  const related = [];
  for (const [collectionKey, list] of Object.entries(projects)) {
    for (const project of list) {
      if (collectionKey === currentCollection && project.key === current.key) continue;
      const sharedById = new Map();
      for (const t of project.technologies || []) {
        if (currentIds.has(t.id) && !sharedById.has(t.id)) sharedById.set(t.id, t);
      }
      for (const a of project.apis || []) {
        if (currentIds.has(a.id) && !sharedById.has(a.id)) sharedById.set(a.id, a);
      }
      if (sharedById.size === 0) continue;
      const sharedTechs = Array.from(sharedById.values()).map((t) => ({
        id: t.id,
        name: t.name,
        img: t.img,
      }));
      related.push({
        uid: `${collectionKey}/${project.key}`,
        title: project.title,
        img: project.img,
        link: project.link,
        startDate: project.startDate,
        sharedTechs,
        sharedCount: sharedTechs.length,
      });
    }
  }

  related.sort((a, b) => {
    if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  return related.slice(0, limit);
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateMetadata({ params }) {
  const { collection, projectKey } = await params;
  const { projects } = await getProjects();
  const project = findProject(projects, collection, projectKey);
  if (!project) return {};
  const description = stripHtml(project.description?.[0]).slice(0, 200);
  return {
    title: project.title,
    description: description || `${project.title} — a project by Vu Doan.`,
    alternates: { canonical: `/portfolio/${collection}/${projectKey}` },
    openGraph: {
      title: `${project.title} · Vu Doan`,
      description,
      images: [
        {
          url: project['img-lg'] ?? project.img,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · Vu Doan`,
      description,
      images: [project['img-lg'] ?? project.img],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { collection, projectKey } = await params;
  const { projects } = await getProjects();
  const project = findProject(projects, collection, projectKey);
  if (!project) notFound();

  const relatedProjects = buildRelatedProjects(projects, project, collection);
  const description = stripHtml(project.description?.[0]);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description,
    image: project['img-lg'] ?? project.img,
    author: { '@type': 'Person', name: 'Vu Doan' },
    dateCreated: project.startDate,
    ...(project.endDate ? { dateModified: project.endDate } : {}),
    ...(project.projectURL?.link ? { url: project.projectURL.link } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} relatedProjects={relatedProjects} />
    </>
  );
}
