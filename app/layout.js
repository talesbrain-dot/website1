import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

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

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
