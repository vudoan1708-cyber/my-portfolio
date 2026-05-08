'use client';

import { useEffect, useState } from 'react';
import { isTrustedAssetPath, resolveAsset } from '@/lib/assets';

const TRUSTED_ORIGIN = 'https://vudoan1708-cyber.github.io/';
const DEBOUNCE_MS = 450;

function classify(raw) {
  const value = (raw ?? '').trim();
  if (!value) return 'empty';
  return isTrustedAssetPath(value) ? 'trusted' : 'untrusted';
}

function ErrorText({ error }) {
  if (!error) return null;
  return (
    <span className="block text-xs text-rose-300 mt-1.5" role="alert">
      {error}
    </span>
  );
}

function StatusLine({ status }) {
  if (status === 'untrusted') {
    return (
      <span className="block text-[11px] text-amber-300/80 mt-1.5">
        Preview only loads for paths starting with <code className="text-amber-200">/</code> or
        URLs from <code className="text-amber-200">{TRUSTED_ORIGIN}</code>
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="block text-[11px] text-rose-300/80 mt-1.5">
        ✗ Couldn’t load the image at that URL.
      </span>
    );
  }
  if (status === 'loading') {
    return (
      <span className="block text-[11px] text-white/50 mt-1.5">Loading…</span>
    );
  }
  if (status === 'ok') {
    return (
      <span className="block text-[11px] text-emerald-300/90 mt-1.5">
        ✓ Image loaded.
      </span>
    );
  }
  return null;
}

function isInvalidStatus(status) {
  return status === 'error' || status === 'untrusted';
}

export default function ImageUrlField({
  label,
  value,
  onChange,
  error,
  placeholder = '/projects/foo/cover.webp',
  required,
  validityKey,
  onValidityChange,
}) {
  const [debounced, setDebounced] = useState((value ?? '').trim());
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const next = (value ?? '').trim();
    const t = setTimeout(() => setDebounced(next), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const kind = classify(debounced);
    if (kind === 'empty') {
      setStatus('idle');
      return;
    }
    if (kind === 'untrusted') {
      setStatus('untrusted');
      return;
    }
    setStatus('loading');
    const url = resolveAsset(debounced);
    const probe = new window.Image();
    let cancelled = false;
    probe.onload = () => {
      if (!cancelled) setStatus('ok');
    };
    probe.onerror = () => {
      if (!cancelled) setStatus('error');
    };
    probe.src = url;
    return () => {
      cancelled = true;
      probe.onload = null;
      probe.onerror = null;
    };
  }, [debounced]);

  useEffect(() => {
    if (!validityKey || !onValidityChange) return;
    onValidityChange(validityKey, !isInvalidStatus(status));
  }, [status, validityKey, onValidityChange]);

  useEffect(() => {
    if (!validityKey || !onValidityChange) return;
    return () => onValidityChange(validityKey, true);
  }, [validityKey, onValidityChange]);

  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error) || isInvalidStatus(status) || undefined}
        className={`w-full rounded-lg bg-white/5 ring-1 focus:outline-none text-white px-3 py-2 ${
          error || isInvalidStatus(status)
            ? 'ring-rose-400/60 focus:ring-rose-400'
            : 'ring-white/10 focus:ring-rose-400'
        }`}
      />
      <StatusLine status={status} />
      <ErrorText error={error} />
    </label>
  );
}
