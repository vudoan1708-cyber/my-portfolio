'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors"
    >
      {pending ? 'Signing in…' : 'Continue'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: null });
  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
          Username
        </span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          maxLength={120}
          className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 focus:ring-rose-400 focus:outline-none text-white px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
          Password
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          maxLength={256}
          className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 focus:ring-rose-400 focus:outline-none text-white px-3 py-2"
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
