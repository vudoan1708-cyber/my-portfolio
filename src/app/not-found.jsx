import Link from 'next/link';

export const metadata = {
  title: 'Not found',
  description: 'The page you were looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-8 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70 mb-3">
        404
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
        Page not found
      </h1>
      <p className="text-white/70 mt-4 leading-relaxed">
        This route doesn&apos;t exist — or the skill you&apos;re filtering on
        isn&apos;t tagged against any work in this portfolio.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium transition"
        >
          Back to portfolio
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg ring-1 ring-white/15 text-white/80 hover:bg-white/5 hover:text-white transition"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
