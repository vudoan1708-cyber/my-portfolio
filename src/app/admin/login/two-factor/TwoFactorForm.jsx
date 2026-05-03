'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { verifyTotpAction } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors"
    >
      {pending ? 'Verifying…' : 'Verify'}
    </button>
  );
}

export default function TwoFactorForm() {
  const [state, formAction] = useActionState(verifyTotpAction, { error: null });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="h-[60px] rounded-lg bg-white/5 ring-1 ring-white/10" />
        <div className="h-[44px] rounded-lg bg-white/5" />
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
          6-digit code
        </span>
        <input
          type="text"
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          autoFocus
          className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 focus:ring-rose-400 focus:outline-none text-white text-center tracking-[0.5em] text-xl px-3 py-2 font-mono"
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-rose-300">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
