import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Send Signal - WhatsApp Outreach Automation',
  description: 'Automate personalized WhatsApp outreach campaigns for your business. Import leads, create templates, and send messages at scale.',
  keywords: ['WhatsApp', 'outreach', 'automation', 'messaging', 'CRM', 'campaigns'],
  authors: [{ name: 'Send Signal' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
