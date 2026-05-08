'use client';

import { useState } from 'react';
import { Eye, PencilLine } from 'lucide-react';

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/65 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

export default function PreviewLayout({ preview, children }) {
  const [view, setView] = useState('edit');

  return (
    <div>
      <div className="lg:hidden mb-4 inline-flex rounded-lg ring-1 ring-white/10 bg-white/[0.03] p-1">
        <TabButton
          active={view === 'edit'}
          onClick={() => setView('edit')}
          icon={PencilLine}
        >
          Edit
        </TabButton>
        <TabButton
          active={view === 'preview'}
          onClick={() => setView('preview')}
          icon={Eye}
        >
          Preview
        </TabButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
        <div className={view === 'preview' ? 'hidden lg:block' : ''}>
          {children}
        </div>
        <div
          className={`${view === 'edit' ? 'hidden lg:block' : ''} lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-8rem)] rounded-xl ring-1 ring-white/10 overflow-hidden bg-black/60`}
        >
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/70 text-[11px] uppercase tracking-[0.2em] text-rose-300/70">
            <Eye className="w-3.5 h-3.5" />
            Live preview
          </div>
          <div className="lg:h-[calc(100vh-8rem-37px)] overflow-y-auto overflow-x-hidden">
            {preview}
          </div>
        </div>
      </div>
    </div>
  );
}
