import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TechRegistryForm from '../TechRegistryForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CMS · New tech entry',
  robots: { index: false, follow: false },
};

export default function NewTechPage() {
  return (
    <div>
      <Link
        href="/admin/tech-registry"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to registry
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New tech entry</h1>
      <TechRegistryForm />
    </div>
  );
}
