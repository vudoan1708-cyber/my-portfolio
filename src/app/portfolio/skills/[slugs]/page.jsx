import { notFound } from 'next/navigation';
import AnimatedHeader from '@/components/AnimatedHeader';
import PortfolioCollections from '../../PortfolioCollections';
import { projects } from '@/data/projects';

function getTechIndex() {
  const map = new Map();
  for (const list of Object.values(projects)) {
    for (const p of list) {
      for (const t of p.technologies || []) {
        if (!map.has(t.id)) map.set(t.id, t.name);
      }
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
  const techIndex = getTechIndex();
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
  const techIndex = getTechIndex();
  const validIds = ids.filter((id) => techIndex.has(id));

  if (validIds.length === 0) notFound();

  return (
    <>
      <AnimatedHeader />
      <PortfolioCollections />
    </>
  );
}
