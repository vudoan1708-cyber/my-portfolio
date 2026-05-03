'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export default function Repeater({
  items,
  onChange,
  renderItem,
  newItem,
  itemLabel = 'Item',
  emptyHint = 'No entries yet.',
}) {
  const list = items ?? [];

  const update = (idx, next) => {
    const copy = list.slice();
    copy[idx] = next;
    onChange(copy);
  };
  const remove = (idx) => {
    const copy = list.slice();
    copy.splice(idx, 1);
    onChange(copy);
  };
  const move = (idx, delta) => {
    const target = idx + delta;
    if (target < 0 || target >= list.length) return;
    const copy = list.slice();
    const [moved] = copy.splice(idx, 1);
    copy.splice(target, 0, moved);
    onChange(copy);
  };
  const add = () => {
    onChange([...list, newItem()]);
  };

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <p className="text-sm text-white/40">{emptyHint}</p>
      ) : null}
      {list.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg ring-1 ring-white/10 bg-white/[0.02] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-white/45">
              {itemLabel} {idx + 1}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn label="Move up" onClick={() => move(idx, -1)} disabled={idx === 0}>
                <ArrowUp className="w-3.5 h-3.5" />
              </IconBtn>
              <IconBtn
                label="Move down"
                onClick={() => move(idx, 1)}
                disabled={idx === list.length - 1}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => remove(idx)} danger>
                <Trash2 className="w-3.5 h-3.5" />
              </IconBtn>
            </div>
          </div>
          {renderItem(item, (next) => update(idx, next), idx)}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md ring-1 ring-white/15 hover:bg-white/5 text-white/85 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function IconBtn({ children, onClick, disabled, danger, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md ring-1 ring-white/10 transition-colors ${
        danger ? 'hover:bg-rose-500/20 hover:ring-rose-400/40' : 'hover:bg-white/5'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
