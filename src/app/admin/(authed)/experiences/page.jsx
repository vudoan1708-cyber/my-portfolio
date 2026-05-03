import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import DeleteExperienceButton from './DeleteExperienceButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Experiences',
  robots: { index: false, follow: false },
};

export default async function ExperiencesListPage({ searchParams }) {
  const params = await searchParams;
  const doc = await getCollectionForAdmin('experiences');
  const list = doc?.experiences ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experiences</h1>
          <p className="text-sm text-white/60 mt-1">{list.length} entries.</p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New experience
        </Link>
      </div>
      {params?.saved ? <p className="mb-4 text-sm text-emerald-300">Saved.</p> : null}
      {params?.deleted ? <p className="mb-4 text-sm text-emerald-300">Deleted.</p> : null}
      {list.length === 0 ? (
        <p className="text-sm text-white/40">No experiences yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 ring-1 ring-white/10 rounded-xl overflow-hidden">
          {list.map((e) => (
            <li
              key={e.key}
              className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/experiences/${e.key}`}
                  className="text-white hover:text-rose-200 transition-colors font-medium truncate block"
                >
                  {e.role} · {e.company}
                </Link>
                <p className="text-xs text-white/45 truncate">
                  {e.startDate}
                  {e.current ? ' — Present' : e.endDate ? ` — ${e.endDate}` : ''}
                </p>
              </div>
              <DeleteExperienceButton experienceKey={e.key} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
