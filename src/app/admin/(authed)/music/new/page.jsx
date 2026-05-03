import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TrackForm from '../TrackForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · New track',
  robots: { index: false, follow: false },
};

export default function NewTrackPage() {
  return (
    <div>
      <Link
        href="/admin/music"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to music
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New track</h1>
      <TrackForm initial={{ id: Date.now() }} />
    </div>
  );
}
