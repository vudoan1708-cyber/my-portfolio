'use client';

import { useMemo } from 'react';
import { resolveAssetsDeep } from '@/lib/assets';
import ProjectDetail from '@/components/ProjectDetail';
import ExperienceStrip from '@/components/ExperienceStrip';

export default function LivePreview({ kind, data }) {
  const resolved = useMemo(() => {
    if (!data) return null;
    return resolveAssetsDeep(data);
  }, [data]);

  if (!resolved) {
    return (
      <p className="p-6 text-sm text-white/40">Nothing to preview yet.</p>
    );
  }

  if (kind === 'project') {
    return (
      <div className="bg-black text-gray-200">
        <ProjectDetail project={resolved} />
      </div>
    );
  }

  if (kind === 'experience') {
    return (
      <div className="bg-neutral-950 text-gray-200 p-6">
        <ExperienceStrip experiences={[resolved]} heading="Experience preview" />
      </div>
    );
  }

  return null;
}
