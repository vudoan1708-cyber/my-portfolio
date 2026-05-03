'use client';

import { useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteExperienceAction } from './actions';

export default function DeleteExperienceButton({ experienceKey }) {
  const [state, formAction] = useActionState(deleteExperienceAction, { error: null });
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete experience "${experienceKey}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="key" value={experienceKey} />
      <button
        type="submit"
        aria-label={`Delete ${experienceKey}`}
        className="p-1.5 rounded-md ring-1 ring-white/10 hover:bg-rose-500/15 hover:ring-rose-400/40 text-white/65 hover:text-rose-200 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {state.error ? <span className="text-xs text-rose-300 ml-2">{state.error}</span> : null}
    </form>
  );
}
