import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import MarketingHeader from '@/components/layout/marketing-header';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <MarketingHeader isLoggedIn={isLoggedIn} />

      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>



    </div>
  );
}