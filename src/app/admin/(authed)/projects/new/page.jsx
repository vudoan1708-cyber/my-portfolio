import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import ProjectForm from '../ProjectForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · New project',
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  const [doc, registryDoc] = await Promise.all([
    getCollectionForAdmin('projects'),
    getCollectionForAdmin('tech-registry'),
  ]);
  const collections = doc?.projectCollections ?? [];
  const techRegistry = registryDoc?.items ?? [];
  const firstCollection = collections[0]?.key ?? 'web-apps';
  const initial = {
    id: Date.now(),
    key: '',
    title: '',
    img: '',
    link: `/portfolio/${firstCollection}/`,
    startDate: '',
    endDate: null,
  };
  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New project</h1>
      <ProjectForm
        initial={initial}
        collections={collections}
        techRegistry={techRegistry}
      />
    </div>
  );
}
