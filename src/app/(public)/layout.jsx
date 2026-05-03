import { Suspense } from 'react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import StarField from '@/components/StarField';
import NavigationLoader from '@/components/NavigationLoader';

export default function PublicLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavigationLoader />
      </Suspense>
      <StarField />
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
    </>
  );
}
