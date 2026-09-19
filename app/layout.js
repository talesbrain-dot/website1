import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { contactInfo } from '@/lib/content';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kamboj Press Pvt. Ltd. | A Complete Printing Solution',
    template: '%s | Kamboj Press',
  },
  description:
    'Kamboj Press Pvt. Ltd. — a complete printing solution in Dehradun since 1996. Business printing, flex and large-format, packaging, signage, events and more.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Kamboj Press Pvt. Ltd. | A Complete Printing Solution',
    description:
      'A complete printing solution in Dehradun since 1996 — business essentials, marketing, flex & large format, packaging, events and more.',
    siteName: 'Kamboj Press',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#12213A',
};

// LocalBusiness structured data — helps Google show a richer result
// (address, phone, hours) for searches like "printing press dehradun".
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kamboj Press Pvt. Ltd.',
  image: `${siteUrl}/icon-512.png`,
  url: siteUrl,
  telephone: `+91${contactInfo.phone}`,
  email: contactInfo.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contactInfo.address,
    addressLocality: 'Dehradun',
    addressRegion: 'Uttarakhand',
    addressCountry: 'IN',
  },
  areaServed: 'Dehradun',
  foundingDate: String(contactInfo.established),
  sameAs: [contactInfo.instagram, contactInfo.facebook].filter(Boolean),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
