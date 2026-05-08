'use client';

import { useEffect, useState } from 'react';

const HTTP_REGEX = /^https?:\/\/\S+$/i;
const DEBOUNCE_MS = 300;

function classify(raw) {
  const value = (raw ?? '').trim();
  if (!value) return 'empty';
  if (!HTTP_REGEX.test(value)) return 'invalid';
  try {
    new URL(value);
    return 'valid';
  } catch {
    return 'invalid';
  }
}

function StatusLine({ status }) {
  if (status === 'invalid') {
    return (
      <span className="block text-[11px] text-rose-300/80 mt-1.5">
        ✗ Must be an http(s) URL.
      </span>
    );
  }
  if (status === 'valid') {
    return (
      <span className="block text-[11px] text-emerald-300/90 mt-1.5">
        ✓ Valid URL.
      </span>
    );
  }
  return null;
}

export default function UrlField({
  label,
  value,
  onChange,
  error,
  required,
  placeholder = 'https://example.com',
  validityKey,
  onValidityChange,
}) {
  const [debounced, setDebounced] = useState((value ?? '').trim());
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const t = setTimeout(
      () => setDebounced((value ?? '').trim()),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    setStatus(classify(debounced));
  }, [debounced]);

  const isInvalid = status === 'invalid';

  useEffect(() => {
    if (!validityKey || !onValidityChange) return;
    onValidityChange(validityKey, !isInvalid);
  }, [isInvalid, validityKey, onValidityChange]);

  useEffect(() => {
    if (!validityKey || !onValidityChange) return;
    return () => onValidityChange(validityKey, true);
  }, [validityKey, onValidityChange]);

  const showError = Boolean(error) || isInvalid;

  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type="url"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error) || isInvalid || undefined}
        className={`w-full rounded-lg bg-white/5 ring-1 focus:outline-none text-white px-3 py-2 ${
          showError
            ? 'ring-rose-400/60 focus:ring-rose-400'
            : 'ring-white/10 focus:ring-rose-400'
        }`}
      />
      <StatusLine status={status} />
      {error ? (
        <span className="block text-xs text-rose-300 mt-1.5" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
