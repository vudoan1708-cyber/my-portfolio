import { getCollectionForAdmin } from '@/lib/cms';
import ResumeForm from './ResumeForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · Resume',
  robots: { index: false, follow: false },
};

export default async function ResumeAdminPage({ searchParams }) {
  const params = await searchParams;
  const resume = await getCollectionForAdmin('resume');
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
          <p className="text-sm text-white/60 mt-1">
            Single document. Edit profile, experience, education, skills, and
            languages.
          </p>
        </div>
      </div>
      {params?.saved ? (
        <p className="mb-4 text-sm text-emerald-300">Saved.</p>
      ) : null}
      <ResumeForm initial={resume} />
    </div>
  );
}
