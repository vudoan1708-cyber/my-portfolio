import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import DeleteProjectButton from './DeleteProjectButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Projects',
  robots: { index: false, follow: false },
};

export default async function ProjectsListPage({ searchParams }) {
  const params = await searchParams;
  const doc = await getCollectionForAdmin('projects');
  const projects = doc?.projects ?? {};
  const collections = doc?.projectCollections ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-white/60 mt-1">
            All entries across {collections.length} collections.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New project
        </Link>
      </div>

      {params?.saved ? (
        <p className="mb-4 text-sm text-emerald-300">Saved.</p>
      ) : null}
      {params?.deleted ? (
        <p className="mb-4 text-sm text-emerald-300">Deleted.</p>
      ) : null}

      {collections.map((c) => {
        const list = projects[c.key] ?? [];
        return (
          <section key={c.key} className="mb-10">
            <h2 className="text-sm uppercase tracking-[0.25em] text-rose-300/80 mb-3">
              {c.label} · {list.length}
            </h2>
            {list.length === 0 ? (
              <p className="text-sm text-white/40">
                No projects in this collection.
              </p>
            ) : (
              <ul className="divide-y divide-white/10 ring-1 ring-white/10 rounded-xl overflow-hidden">
                {list.map((p) => (
                  <li
                    key={p.key}
                    className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/projects/${c.key}/${p.key}`}
                        className="text-white hover:text-rose-200 transition-colors font-medium truncate block"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-white/45 truncate">
                        {p.startDate}
                        {p.endDate ? ` — ${p.endDate}` : ''}
                      </p>
                    </div>
                    <DeleteProjectButton collection={c.key} projectKey={p.key} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
