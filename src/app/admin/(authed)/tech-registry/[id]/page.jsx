import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import TechRegistryForm from '../TechRegistryForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Edit tech entry',
  robots: { index: false, follow: false },
};

export default async function EditTechPage({ params }) {
  const { id } = await params;
  const doc = await getCollectionForAdmin('tech-registry');
  const item = (doc?.items ?? []).find((it) => it.id === id);
  if (!item) notFound();
  return (
    <div>
      <Link
        href="/admin/tech-registry"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to registry
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Edit · {item.name}
      </h1>
      <TechRegistryForm initial={item} originalId={id} />
    </div>
  );
}
