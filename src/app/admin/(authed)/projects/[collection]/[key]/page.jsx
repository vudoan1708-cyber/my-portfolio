import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import ProjectForm from '../../ProjectForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Edit project',
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({ params }) {
  const { collection, key } = await params;
  const doc = await getCollectionForAdmin('projects');
  const projects = doc?.projects ?? {};
  const collections = doc?.projectCollections ?? [];
  const project = (projects[collection] ?? []).find((p) => p.key === key);
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Edit · {project.title}
      </h1>
      <ProjectForm
        initial={project}
        collections={collections}
        originalCollection={collection}
        originalKey={key}
      />
    </div>
  );
}
