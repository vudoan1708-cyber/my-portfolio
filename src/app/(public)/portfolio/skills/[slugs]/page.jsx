import { notFound } from 'next/navigation';
import AnimatedHeader from '@/components/AnimatedHeader';
import PortfolioCollections from '../../PortfolioCollections';
import { getProjects, getExperiences, getTechRegistry } from '@/lib/cms';

function buildTechIndex(projects, experiences) {
  const map = new Map();
  for (const list of Object.values(projects)) {
    for (const p of list) {
      for (const t of p.technologies || []) {
        if (!map.has(t.id)) map.set(t.id, t.name);
      }
    }
  }
  for (const exp of experiences) {
    for (const t of exp.technologies || []) {
      if (!map.has(t.id)) map.set(t.id, t.name);
    }
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
  const validNames = ids
    .filter((id) => techIndex.has(id))
    .map((id) => techIndex.get(id));

  if (validNames.length === 0) return {};

  const list = validNames.join(', ');
  const canonical = `/portfolio/skills/${ids.filter((id) => techIndex.has(id)).join(',')}`;

  return {
    title: `${list} projects`,
    description: `Projects by Vu Doan filtered by ${list}.`,
    alternates: { canonical },
    openGraph: {
      title: `${list} projects · Vu Doan`,
      description: `Projects by Vu Doan filtered by ${list}.`,
      url: canonical,
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
