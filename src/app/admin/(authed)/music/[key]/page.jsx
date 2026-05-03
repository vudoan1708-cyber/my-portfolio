import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getCollectionForAdmin } from '@/lib/cms';
import TrackForm from '../TrackForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Edit track',
  robots: { index: false, follow: false },
};

export default async function EditTrackPage({ params }) {
  const { key } = await params;
  const doc = await getCollectionForAdmin('music');
  const track = (doc?.tracks ?? []).find((t) => t.key === key);
  if (!track) notFound();
  return (
    <div>
      <Link
        href="/admin/music"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to music
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Edit · {track.title}
      </h1>
      <TrackForm initial={track} originalKey={key} />
    </div>
  );
}
