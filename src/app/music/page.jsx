import MusicList from './MusicList';

export const metadata = {
  title: 'Music',
  description:
    'Original tracks produced by Vu Doan — moody, cinematic, and storytelling-led.',
  alternates: { canonical: '/music' },
};

export default function MusicPage() {
  return <MusicList />;
}
