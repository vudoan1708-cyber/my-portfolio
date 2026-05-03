import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import DeleteTrackButton from './DeleteTrackButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Music',
  robots: { index: false, follow: false },
};

export default async function MusicListPage({ searchParams }) {
  const params = await searchParams;
  const doc = await getCollectionForAdmin('music');
  const list = doc?.tracks ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Music</h1>
          <p className="text-sm text-white/60 mt-1">{list.length} tracks.</p>
        </div>
        <Link
          href="/admin/music/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New track
        </Link>
      </div>
      {params?.saved ? <p className="mb-4 text-sm text-emerald-300">Saved.</p> : null}
      {params?.deleted ? <p className="mb-4 text-sm text-emerald-300">Deleted.</p> : null}
      {list.length === 0 ? (
        <p className="text-sm text-white/40">No tracks yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 ring-1 ring-white/10 rounded-xl overflow-hidden">
          {list.map((t) => (
            <li
              key={t.key}
              className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/music/${t.key}`}
                  className="text-white hover:text-rose-200 transition-colors font-medium truncate block"
                >
                  {t.title}
                </Link>
                <p className="text-xs text-white/45 truncate">{t.dateModified ?? ''}</p>
              </div>
              <DeleteTrackButton trackKey={t.key} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
