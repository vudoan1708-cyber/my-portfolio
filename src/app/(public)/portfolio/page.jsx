import AnimatedHeader from '@/components/AnimatedHeader';
import PortfolioCollections from './PortfolioCollections';
import { getProjects, getExperiences, getTechRegistry } from '@/lib/cms';

export const metadata = {
  title: 'Portfolio',
  description:
    'Selected work by Vu Doan — web apps, games, AI projects, utilities, and design.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const [{ projects, projectCollections }, experiences, techRegistry] =
    await Promise.all([getProjects(), getExperiences(), getTechRegistry()]);
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
