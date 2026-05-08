import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import ExperienceForm from '../ExperienceForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · New experience',
  robots: { index: false, follow: false },
};

export default async function NewExperiencePage() {
  const registryDoc = await getCollectionForAdmin('tech-registry');
  const techRegistry = registryDoc?.items ?? [];
  return (
    <div>
      <Link
        href="/admin/experiences"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to experiences
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New experience</h1>
      <ExperienceForm techRegistry={techRegistry} />
    </div>
  );
}
