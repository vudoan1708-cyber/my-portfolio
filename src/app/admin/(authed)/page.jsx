import Link from 'next/link';
import { getCollectionForAdmin } from '@/lib/cms';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Overview',
  robots: { index: false, follow: false },
};

async function counts() {
  const [projectsDoc, expDoc, musicDoc, techDoc, resumeDoc] = await Promise.all(
    [
      getCollectionForAdmin('projects'),
      getCollectionForAdmin('experiences'),
      getCollectionForAdmin('music'),
      getCollectionForAdmin('tech-registry'),
      getCollectionForAdmin('resume'),
    ],
  );
  const projectCount = Object.values(projectsDoc?.projects ?? {}).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0,
  );
  return {
    projects: projectCount,
    collections: projectsDoc?.projectCollections?.length ?? 0,
    experiences: expDoc?.experiences?.length ?? 0,
    tracks: musicDoc?.tracks?.length ?? 0,
    techRegistry: techDoc?.items?.length ?? 0,
    resumeExperiences: resumeDoc?.experiences?.length ?? 0,
  };
}

export default async function AdminHome() {
  const c = await counts();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Overview</h1>
      <p className="text-sm text-white/60 mb-8">
        Edit anything below. Changes write to Vercel Edge Config and propagate
        to public pages within ~30 seconds.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          href="/admin/projects"
          label="Projects"
          value={`${c.projects} across ${c.collections} collections`}
        />
        <Card
          href="/admin/experiences"
          label="Experiences"
          value={`${c.experiences} entries`}
        />
        <Card
          href="/admin/resume"
          label="Resume"
          value={`${c.resumeExperiences} experiences`}
        />
        <Card
          href="/admin/tech-registry"
          label="Tech registry"
          value={`${c.techRegistry} entries`}
        />
        <Card
          href="/admin/music"
          label="Music"
          value={`${c.tracks} tracks`}
        />
      </div>
    </div>
  );
}

function Card({ href, label, value }) {
  return (
    <Link
      href={href}
      className="block rounded-xl ring-1 ring-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors p-5"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-rose-300/80">
        {label}
      </p>
      <p className="text-lg mt-1.5 text-white/90">{value}</p>
    </Link>
  );
}
