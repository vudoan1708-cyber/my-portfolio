import './globals.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';

const SITE_URL = 'https://vudoan.vercel.app';
const SITE_NAME = 'Vu Doan — Software Engineer';
const SITE_DESCRIPTION =
  'Software engineer based in Leeds, UK. I build expressive web apps, games, and creative tooling — and produce music in my spare time.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s · Vu Doan',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Vu Doan',
    'software engineer',
    'frontend engineer',
    'portfolio',
    'web developer',
    'React',
    'Next.js',
    'Svelte',
    'Leeds',
    'UK',
    'music production',
  ],
  authors: [{ name: 'Vu Doan' }],
  creator: 'Vu Doan',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/avatar.webp',
        width: 800,
        height: 800,
        alt: 'Vu Doan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/images/avatar.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/avatar.webp',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vu Doan',
  url: SITE_URL,
  image: `${SITE_URL}/images/avatar.webp`,
  jobTitle: 'Software Engineer',
  description: SITE_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Leeds',
    addressCountry: 'United Kingdom',
  },
  sameAs: [
    'https://github.com/vudoan1708-cyber',
    'https://www.linkedin.com/in/vu-doan-812490154/',
    'https://www.youtube.com/channel/UCgNT0Z2gaKgba8_zCRhIZrA',
    'https://www.fiverr.com/vu_doan',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-100 antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
      </body>
    </html>
  );
}
