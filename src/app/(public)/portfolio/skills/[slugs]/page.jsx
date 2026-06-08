import { notFound } from 'next/navigation';
import AnimatedHeader from '@/components/AnimatedHeader';
import PortfolioCollections from '../../PortfolioCollections';
import { getProjects, getExperiences, getTechRegistry } from '@/lib/cms';

function buildTechIndex(projects, experiences) {
  const map = new Map();
  const upsert = (t) => {
    if (!t || typeof t.id !== 'string' || map.has(t.id)) return;
    map.set(t.id, { name: t.name, img: t.img ?? null });
  };
  for (const list of Object.values(projects)) {
    for (const p of list) {
      for (const t of p.technologies || []) upsert(t);
    }
  }
  for (const exp of experiences) {
    for (const t of exp.technologies || []) upsert(t);
  }
  return map;
}

function parseSlugs(raw) {
  return decodeURIComponent(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slugs } = await params;
  const ids = parseSlugs(slugs);
  const [{ projects }, experiences] = await Promise.all([
    getProjects(),
    getExperiences(),
  ]);
  const techIndex = buildTechIndex(projects, experiences);
  const validIds = ids.filter((id) => techIndex.has(id));
  const validNames = validIds.map((id) => techIndex.get(id).name);

  if (validNames.length === 0) return {};

  const list = validNames.join(', ');
  const canonical = `/portfolio/skills/${validIds.join(',')}`;

  // The crawler/social preview image is the icon of the first filtered tech.
  const firstIcon = techIndex.get(validIds[0]).img;
  const images = firstIcon
    ? [{ url: firstIcon, alt: `${validNames[0]} logo` }]
    : undefined;

  return {
    title: `${list} projects`,
    description: `Projects by Vu Doan filtered by ${list}.`,
    alternates: { canonical },
    openGraph: {
      title: `${list} projects · Vu Doan`,
      description: `Projects by Vu Doan filtered by ${list}.`,
      url: canonical,
      images,
    },
  };
}

export default async function SkillsPage({ params }) {
  const { slugs } = await params;
  const ids = parseSlugs(slugs);
  const [{ projects, projectCollections }, experiences, techRegistry] =
    await Promise.all([getProjects(), getExperiences(), getTechRegistry()]);
  const techIndex = buildTechIndex(projects, experiences);
  const validIds = ids.filter((id) => techIndex.has(id));

  if (validIds.length === 0) notFound();

  return (
    <>
      <AnimatedHeader />
      <PortfolioCollections
        projects={projects}
        projectCollections={projectCollections}
        experiences={experiences}
        techRegistry={techRegistry}
      />
    </>
  );
}
