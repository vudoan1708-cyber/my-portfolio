'use client';

import { useFormStatus } from 'react-dom';

export default function SaveBar({ error, success }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-neutral-950/90 backdrop-blur border-t border-white/10 flex items-center justify-between gap-4 mt-8">
      <div className="min-w-0 text-sm">
        {error ? <span className="text-rose-300">{error}</span> : null}
        {success && !error ? (
          <span className="text-emerald-300">Saved.</span>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-medium px-5 py-2 transition-colors"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
