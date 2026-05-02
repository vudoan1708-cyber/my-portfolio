import AnimatedHeader from '@/components/AnimatedHeader';
import PortfolioCollections from './PortfolioCollections';

export const metadata = {
  title: 'Portfolio',
  description:
    'Selected work by Vu Doan — web apps, games, AI projects, utilities, and design.',
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return (
    <>
      <AnimatedHeader />
      <PortfolioCollections />
    </>
  );
}
