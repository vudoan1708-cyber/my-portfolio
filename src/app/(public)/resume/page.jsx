export const metadata = {
  title: 'Resume',
  description:
    'Resume of Vu Doan — software engineer based in Leeds, UK. Download or view inline.',
  alternates: { canonical: '/resume' },
};

const cvURL =
  'https://raw.githubusercontent.com/vudoan1708-cyber/logos/main/portfolio/resume/CV.pdf';

export default function ResumePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">
            CV
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Resume
          </h1>
        </div>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium transition"
          target="_blank"
          href={cvURL}
          rel="noreferrer"
        >
          Download PDF
        </a>
      </header>
      <div className="w-full h-[80vh] rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-white/5">
        <iframe
          title="CV"
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(cvURL)}&embedded=true`}
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
