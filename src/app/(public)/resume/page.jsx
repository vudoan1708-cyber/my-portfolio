import ResumeContent from './ResumeContent';

export const metadata = {
  title: 'Resume',
  description:
    'Resume of Vu Doan — software engineer based in Leeds, UK. Experience, education, and skills.',
  alternates: { canonical: '/resume' },
};

export default function ResumePage() {
  return <ResumeContent />;
}
