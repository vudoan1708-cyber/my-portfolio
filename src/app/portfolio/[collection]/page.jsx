import { notFound } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import { projectCollections, projects } from '@/data/projects';

export function generateStaticParams() {
  return projectCollections.map((c) => ({ collection: c.key }));
}

export async function generateMetadata({ params }) {
  const { collection } = await params;
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
  if (!projects[collection]) notFound();
  return <ProjectGrid collection={collection} />;
}
