'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react';
import { Plus, X, Search } from 'lucide-react';
import { resolveAsset } from '@/lib/assets';
import { createTechInlineAction } from '../tech-registry/actions';
import { TextField } from './Field';
import UrlField from './UrlField';
import ImageUrlField from './ImageUrlField';

function TechIcon({ item, size: dimSize = 'md' }) {
  const dim = dimSize === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  return (
    <div
      className={`shrink-0 ${dim} rounded ring-1 ring-white/10 overflow-hidden flex items-center justify-center ${item.tailwindCssClass ?? ''}`}
    >
      {item.img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveAsset(item.img)}
          alt={item.name ?? item.id}
          className="w-full h-full object-contain p-0.5"
        />
      ) : (
        <span className="text-[8px] uppercase text-white/30">·</span>
      )}
    </div>
  );
}

function Chip({ item, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-md bg-white/5 ring-1 ring-white/10 text-sm text-white/85">
      <TechIcon item={item} size="sm" />
      <span className="truncate max-w-[160px]">{item.name || item.id}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        aria-label={`Remove ${item.name || item.id}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

function emptyDraft(type) {
  return {
    id: '',
    name: '',
    link: '',
    img: '',
    type,
    tailwindCssClass: '',
  };
}

function CreateInline({ type, presetName, onCancel, onCreated }) {
  const [draft, setDraft] = useState(() => ({
    ...emptyDraft(type),
    name: presetName ?? '',
  }));
  const [state, formAction, pending] = useActionState(createTechInlineAction, {
    ok: false,
    error: null,
    fieldErrors: null,
    item: null,
  });
  const errAt = (path) => state.fieldErrors?.[path];
  const set = (field) => (value) =>
    setDraft((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    if (state.ok && state.item) {
      onCreated(state.item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const submitPayload = {
    ...draft,
    type,
    tailwindCssClass: draft.tailwindCssClass?.trim() || null,
  };

  return (
    <form action={formAction} className="space-y-3 p-3 rounded-lg bg-black/40 ring-1 ring-white/10">
      <input type="hidden" name="payload" value={JSON.stringify(submitPayload)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="ID (slug)"
          value={draft.id}
          onChange={set('id')}
          error={errAt('id')}
          pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
          required
        />
        <TextField
          label="Display name"
          value={draft.name}
          onChange={set('name')}
          error={errAt('name')}
          required
        />
      </div>
      <UrlField
        label="Link"
        value={draft.link}
        onChange={set('link')}
        error={errAt('link')}
        placeholder="https://example.com"
        required
      />
      <ImageUrlField
        label="Icon image"
        value={draft.img}
        onChange={set('img')}
        error={errAt('img')}
        placeholder="/projects/techs/foo.svg"
        required
      />
      {type === 'api' ? (
        <TextField
          label="Tailwind class for icon background (optional)"
          value={draft.tailwindCssClass ?? ''}
          onChange={set('tailwindCssClass')}
          error={errAt('tailwindCssClass')}
          placeholder="e.g. bg-white"
        />
      ) : null}
      {state.error ? (
        <p className="text-xs text-rose-300">{state.error}</p>
      ) : null}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-3 py-1.5 rounded-md ring-1 ring-white/15 hover:bg-white/5 text-white/85 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="text-sm px-3 py-1.5 rounded-md bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white transition-colors"
        >
          {pending ? 'Saving…' : 'Save & add'}
        </button>
      </div>
    </form>
  );
}

export default function TechMultiSelect({
  label,
  items = [],
  onChange,
  registry = [],
  type,
  emptyHint,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [extraEntries, setExtraEntries] = useState([]);
  const searchRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (next) => {
      setOpen(next);
      if (!next) setCreating(false);
    },
    placement: 'bottom-start',
    middleware: [
      offset(8),
      flip({ fallbackPlacements: ['bottom-end', 'top-start', 'top-end'] }),
      shift({ padding: 8 }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(availableWidth - 16, 560)}px`,
            maxHeight: `${Math.max(220, availableHeight - 16)}px`,
          });
        },
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: true,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const fullRegistry = useMemo(() => {
    const byId = new Map();
    for (const it of registry) byId.set(it.id, it);
    for (const it of extraEntries) byId.set(it.id, it);
    return Array.from(byId.values()).filter((it) => it.type === type);
  }, [registry, extraEntries, type]);

  const selectedIds = useMemo(
    () => new Set(items.map((it) => it.id).filter(Boolean)),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return fullRegistry
      .filter((it) => !selectedIds.has(it.id))
      .filter(
        (it) =>
          !q ||
          it.id.toLowerCase().includes(q) ||
          (it.name ?? '').toLowerCase().includes(q),
      )
      .sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id));
  }, [fullRegistry, selectedIds, search]);

  useEffect(() => {
    if (open && !creating) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, creating]);

  const addItem = useCallback(
    (item) => {
      if (!item?.id) return;
      if (selectedIds.has(item.id)) return;
      const next = [...items, stripRegistryFields(item)];
      onChange(next);
    },
    [items, onChange, selectedIds],
  );

  const removeAt = (idx) => {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  const onCreated = useCallback(
    (item) => {
      setExtraEntries((prev) => [...prev.filter((p) => p.id !== item.id), item]);
      addItem(item);
      setCreating(false);
      setSearch('');
      setOpen(false);
    },
    [addItem],
  );

  return (
    <div>
      <span className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-2 rounded-lg ring-1 ring-white/10 bg-white/[0.03]">
        {items.length === 0 ? (
          <span className="text-xs text-white/35 px-1">
            {emptyHint ?? 'No entries yet — add one below.'}
          </span>
        ) : (
          items.map((it, idx) => (
            <Chip
              key={`${it.id || 'new'}-${idx}`}
              item={it}
              onRemove={() => removeAt(idx)}
            />
          ))
        )}
        <button
          ref={refs.setReference}
          type="button"
          {...getReferenceProps()}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md ring-1 ring-white/15 hover:bg-white/5 text-white/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {type === 'api' ? 'API' : 'tech'}
        </button>
      </div>

      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              minWidth: 320,
              width: 'max-content',
              zIndex: 50,
            }}
            {...getFloatingProps()}
            className="rounded-xl ring-1 ring-white/15 bg-neutral-950/98 backdrop-blur shadow-2xl shadow-black/60 p-2 flex flex-col"
          >
            {creating ? (
              <CreateInline
                type={type}
                presetName={search.trim()}
                onCancel={() => setCreating(false)}
                onCreated={onCreated}
              />
            ) : (
              <>
                <label className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5 ring-1 ring-white/10 mb-2">
                  <Search className="w-4 h-4 text-white/45" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${type === 'api' ? 'APIs' : 'techs'}…`}
                    className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder:text-white/35"
                  />
                </label>
                <ul className="flex-1 overflow-y-auto -mx-1">
                  {filtered.length === 0 ? (
                    <li className="px-3 py-2 text-xs text-white/45">
                      No matches in registry.
                    </li>
                  ) : (
                    filtered.map((it) => (
                      <li key={it.id}>
                        <button
                          type="button"
                          onClick={() => {
                            addItem(it);
                            setSearch('');
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-left transition-colors"
                        >
                          <TechIcon item={it} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-white/95 truncate">
                              {it.name}
                            </span>
                            <span className="block text-[11px] text-white/40 truncate">
                              {it.id}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
                <div className="border-t border-white/10 mt-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreating(true)}
                    className="w-full inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-sm text-rose-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create new {type === 'api' ? 'API' : 'tech'}
                    {search.trim() ? (
                      <span className="text-white/50 truncate">
                        “{search.trim()}”
                      </span>
                    ) : null}
                  </button>
                </div>
              </>
            )}
          </div>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

function stripRegistryFields(item) {
  const out = {
    id: item.id,
    name: item.name,
    link: item.link,
    img: item.img,
  };
  if (item.tailwindCssClass) out.tailwindCssClass = item.tailwindCssClass;
  return out;
}
