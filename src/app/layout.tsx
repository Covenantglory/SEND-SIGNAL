import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0B0F',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Send Signal | Private Messaging Automation',
  description: 'send personalized whatsapp campaign',
  keywords: ['WhatsApp marketing', 'personalized messaging', 'automation tools', 'campaign management'],
  authors: [{ name: 'Send Signal' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://sendsignal.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sendsignal.com/',
    title: 'Send Signal | Private Messaging Automation',
    description: 'The ultimate bridge between your workflows and secure messaging. Automate with confidence.',
    images: ['https://sendsignal.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send Signal | Private Messaging Automation',
    description: 'Automate encrypted messages without the headache. Secure, fast, and built for modern teams.',
    images: ['https://sendsignal.com/og-image.png'],
  },
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
