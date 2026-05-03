import { notFound } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import { getProjects } from '@/lib/cms';

export async function generateStaticParams() {
  const { projectCollections } = await getProjects({ resolveAssets: false });
  return projectCollections.map((c) => ({ collection: c.key }));
}

export async function generateMetadata({ params }) {
  const { collection } = await params;
  const { projectCollections } = await getProjects();
  const meta = projectCollections.find((c) => c.key === collection);
  if (!meta) return {};
  return {
    title: meta.label,
    description: meta.description,
    alternates: { canonical: `/portfolio/${collection}` },
    openGraph: {
      title: `${meta.label} · Vu Doan`,
      description: meta.description,
      images: [{ url: meta.img, alt: meta.label }],
    },
  };
}

export default async function CollectionPage({ params }) {
  const { collection } = await params;
  const { projects, projectCollections } = await getProjects();
  if (!projects[collection]) notFound();
  const meta = projectCollections.find((c) => c.key === collection);
  return (
    <ProjectGrid
      collection={collection}
      items={projects[collection]}
      meta={meta}
    />
  );
}
