import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import { resolveAsset } from '@/lib/assets';
import DeleteTechButton from './DeleteTechButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Tech registry',
  robots: { index: false, follow: false },
};

export default async function TechRegistryListPage({ searchParams }) {
  const params = await searchParams;
  const doc = await getCollectionForAdmin('tech-registry');
  const items = (doc?.items ?? []).slice().sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  const techCount = items.filter((it) => it.type === 'tech').length;
  const apiCount = items.filter((it) => it.type === 'api').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tech registry</h1>
          <p className="text-sm text-white/60 mt-1">
            {items.length} entries · {techCount} tech · {apiCount} API
          </p>
        </div>
        <Link
          href="/admin/tech-registry/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New entry
        </Link>
      </div>
      {params?.saved ? (
        <p className="mb-4 text-sm text-emerald-300">Saved.</p>
      ) : null}
      {params?.deleted ? (
        <p className="mb-4 text-sm text-emerald-300">Deleted.</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-sm text-white/40">
          Registry is empty. Run{' '}
          <code className="text-white/60">node scripts/seed-tech-registry.mjs --redis</code>{' '}
          to seed from current projects/experiences.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg ring-1 ring-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div
                className={`shrink-0 w-12 h-12 rounded-md ring-1 ring-white/10 overflow-hidden flex items-center justify-center ${it.tailwindCssClass ?? ''}`}
              >
                {it.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveAsset(it.img)}
                    alt={it.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    no img
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/tech-registry/${it.id}`}
                  className="block text-white hover:text-rose-200 transition-colors font-medium truncate"
                >
                  {it.name}
                </Link>
                <p className="text-xs text-white/45 truncate">
                  {it.id} · {it.type}
                  {it.category ? ` · ${it.category}` : ''}
                </p>
              </div>
              <DeleteTechButton techId={it.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
