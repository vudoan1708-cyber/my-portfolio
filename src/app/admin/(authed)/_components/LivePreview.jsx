'use client';

import { useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { resolveAssetsDeep } from '@/lib/assets';
import ProjectDetail from '@/components/ProjectDetail';
import ExperienceStrip from '@/components/ExperienceStrip';
import ResumeContent from '@/app/(public)/resume/ResumeContent';

function PreviewBody({ kind, resolved }) {
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
  if (kind === 'resume') {
    return (
      <div className="bg-neutral-950 text-gray-200">
        <ResumeContent data={resolved} hideHeader />
      </div>
    );
  }
  return null;
}

export default function LivePreview({ kind, data }) {
  const resolved = useMemo(() => {
    if (!data) return null;
    return resolveAssetsDeep(data);
  }, [data]);

  if (!resolved) {
    return <p className="p-6 text-sm text-white/40">Nothing to preview yet.</p>;
  }

  // Disable mount animations: framer-motion `initial={{opacity:0}}` won't run
  // reliably when components are React-portalled into an iframe, leaving them
  // stuck invisible. Skipping animations keeps the preview correct.
  return (
    <MotionConfig reducedMotion="always">
      <PreviewBody kind={kind} resolved={resolved} />
    </MotionConfig>
  );
}
