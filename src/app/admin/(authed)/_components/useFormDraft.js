'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'cms-draft:';
const SAVE_DEBOUNCE_MS = 500;

export default function useFormDraft({ key, value, initialJson, onRestore }) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  const [restoredAt, setRestoredAt] = useState(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = window.localStorage.getItem(fullKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.state) return;
      if (JSON.stringify(parsed.state) === initialJson) {
        window.localStorage.removeItem(fullKey);
        return;
      }
      onRestore(parsed.state);
      setRestoredAt(parsed.savedAt ?? Date.now());
    } catch {
      // localStorage unavailable / parse error — silently ignore.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (JSON.stringify(value) === initialJson) {
          window.localStorage.removeItem(fullKey);
          return;
        }
        window.localStorage.setItem(
          fullKey,
          JSON.stringify({ state: value, savedAt: Date.now() }),
        );
      } catch {
        // ignore
      }
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, fullKey, initialJson]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(fullKey);
    } catch {
      // ignore
    }
    setRestoredAt(null);
  }, [fullKey]);

  return { restoredAt, clear };
}
