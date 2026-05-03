import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import ExperienceForm from '../ExperienceForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Edit experience',
  robots: { index: false, follow: false },
};

export default async function EditExperiencePage({ params }) {
  const { key } = await params;
  const doc = await getCollectionForAdmin('experiences');
  const exp = (doc?.experiences ?? []).find((e) => e.key === key);
  if (!exp) notFound();
  return (
    <div>
      <Link
        href="/admin/experiences"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to experiences
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Edit · {exp.role} at {exp.company}
      </h1>
      <ExperienceForm initial={exp} originalKey={key} />
    </div>
  );
}
