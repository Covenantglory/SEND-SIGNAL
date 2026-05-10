import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0B0F',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'sendsignal-whatsapp campaign',
  description: 'send personalized whatsapp campaign messages',
  keywords: ['AI app builder', 'no-code platform', 'SaaS builder', 'automation tools', 'workflow automation', 'full-stack AI', 'build apps fast', 'developer tools', 'startup tools'],
  authors: [{ name: 'Send Signal' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://sendsignal.ai/',
  },
  openGraph: {
    type: 'website',
    url: 'https://sendsignal.ai/',
    title: 'Send Signal — Build Apps Faster with AI',
    description: 'Turn ideas into production-ready apps with AI. Send Signal helps you design, build, and automate faster than ever.',
    images: ['https://sendsignal.ai/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Send Signal — AI App Builder',
    description: 'Launch full-stack apps and automations using AI. Faster builds, smarter workflows.',
    images: ['https://sendsignal.ai/og-image.png'],
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
