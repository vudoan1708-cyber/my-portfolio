'use client';

import { History } from 'lucide-react';

function timeAgo(ts) {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 60) return 'a moment ago';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DraftRestoreBanner({ restoredAt, onDiscard }) {
  if (!restoredAt) return null;
  return (
    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md ring-1 ring-amber-400/30 bg-amber-500/10 text-xs text-amber-200">
      <History className="w-3.5 h-3.5" />
      <span>
        Restored unsaved draft from{' '}
        <span className="text-amber-100">{timeAgo(restoredAt)}</span>.
      </span>
      <button
        type="button"
        onClick={onDiscard}
        className="ml-1 underline underline-offset-2 hover:text-white"
      >
        Discard
      </button>
    </div>
  );
}
