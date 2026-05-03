import MusicList from './MusicList';
import { getTracks } from '@/lib/cms';

export const metadata = {
  title: 'Music',
  description:
    'Original tracks produced by Vu Doan — moody, cinematic, and storytelling-led.',
  alternates: { canonical: '/music' },
};

export default async function MusicPage() {
  const tracks = await getTracks();
  return <MusicList tracks={tracks} />;
}
