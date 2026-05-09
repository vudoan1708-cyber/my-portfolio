'use client';

import { useState } from 'react';
import { Eye, PencilLine, Smartphone, Monitor } from 'lucide-react';
import IframePreview from './IframePreview';

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

function DeviceButton({ active, onClick, icon: Icon, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/55 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

const MOBILE_PREVIEW_WIDTH = 390;
const DESKTOP_PREVIEW_MIN_WIDTH = 1280;

export default function PreviewLayout({ preview, children }) {
  const [view, setView] = useState('edit');
  const [device, setDevice] = useState('desktop');

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
          className={`${view === 'edit' ? 'hidden lg:block' : ''} lg:sticky lg:top-6 lg:self-start h-[calc(100vh-8rem)] rounded-xl ring-1 ring-white/10 overflow-hidden bg-black/60 relative`}
        >
          <div className="absolute inset-x-0 top-0 h-[37px] flex items-center justify-between gap-2 px-3 border-b border-white/10 bg-black/70 z-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-rose-300/70">
              <Eye className="w-3.5 h-3.5" />
              Live preview
            </div>
            <div className="inline-flex rounded-md ring-1 ring-white/10 bg-white/[0.03] p-0.5">
              <DeviceButton
                active={device === 'mobile'}
                onClick={() => setDevice('mobile')}
                icon={Smartphone}
                label="Mobile preview"
              >
                Mobile
              </DeviceButton>
              <DeviceButton
                active={device === 'desktop'}
                onClick={() => setDevice('desktop')}
                icon={Monitor}
                label="Desktop preview"
              >
                Desktop
              </DeviceButton>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-[37px] overflow-auto">
            {device === 'mobile' ? (
              <div className="h-full p-4 flex items-stretch justify-center">
                <div
                  className="rounded-[1.5rem] ring-1 ring-white/15 overflow-hidden bg-neutral-950 h-full"
                  style={{ width: MOBILE_PREVIEW_WIDTH }}
                >
                  <IframePreview
                    width={MOBILE_PREVIEW_WIDTH}
                    title="Mobile preview"
                    style={{ height: '100%', display: 'block' }}
                  >
                    {preview}
                  </IframePreview>
                </div>
              </div>
            ) : (
              <div style={{ minWidth: DESKTOP_PREVIEW_MIN_WIDTH }}>
                {preview}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
