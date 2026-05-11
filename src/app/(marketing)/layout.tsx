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


      <footer style={{
        borderTop: '1px solid var(--color-outline)',
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        background: 'var(--color-surface)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-on-surface)',
              fontFamily: 'var(--font-title-large)',
              fontWeight: 600,
              fontSize: 'var(--text-title-large)',
            }}>
              <img src="/logo.svg" alt="Send Signal" width="28" height="28" />
              Send Signal
            </div>
            <p style={{
              fontSize: 'var(--text-body-medium)',
              color: 'var(--color-on-surface-variant)',
              lineHeight: 1.6,
              maxWidth: '240px',
            }}>
              Automate personalized WhatsApp outreach at scale.
            </p>
          </div>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-title-small)',
              fontSize: 'var(--text-title-small)',
              fontWeight: 600,
              color: 'var(--color-on-surface)',
              marginBottom: 'var(--spacing-md)',
            }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <a href="#features" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Features</a>
              <a href="#use-cases" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Use Cases</a>
              <Link href="/signup" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Create Account</Link>
            </div>
          </div>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-title-small)',
              fontSize: 'var(--text-title-small)',
              fontWeight: 600,
              color: 'var(--color-on-surface)',
              marginBottom: 'var(--spacing-md)',
            }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <a href="/privacy" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Privacy Policy</a>
              <a href="/terms" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Terms of Service</a>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: 'var(--spacing-xl) auto 0',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--color-outline)',
          textAlign: 'center',
          fontSize: 'var(--text-body-small)',
          color: 'var(--color-on-surface-variant)',
        }}>
          &copy; {new Date().getFullYear()} Send Signal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}