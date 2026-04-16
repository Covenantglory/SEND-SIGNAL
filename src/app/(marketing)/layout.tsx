export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(16, 16, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-outline)',
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <a href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            color: 'var(--color-on-surface)',
            fontFamily: 'var(--font-title-large)',
            fontWeight: 600,
            fontSize: 'var(--text-title-large)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16C24 20.418 20.418 24 16 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8V16L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send Signal
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <a href="/login" style={{
              color: 'var(--color-on-surface)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}>
              Sign In
            </a>
            <a href="/signup" style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
            }}>
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>

      <footer style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-outline)',
        padding: 'var(--spacing-3xl) var(--spacing-lg)',
        marginTop: 'var(--spacing-3xl)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            color: 'var(--color-on-surface)',
            fontFamily: 'var(--font-title-large)',
            fontWeight: 600,
          }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16C24 20.418 20.418 24 16 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8V16L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send Signal
          </div>

          <p style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-medium)',
            fontSize: 'var(--text-body-medium)',
            maxWidth: '400px',
          }}>
            Automate personalized WhatsApp outreach campaigns. Import leads, create templates, and send messages at scale.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xl)',
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-medium)',
            fontSize: 'var(--text-body-medium)',
          }}>
            <a href="#" style={{ color: 'inherit' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit' }}>Terms</a>
            <a href="#" style={{ color: 'inherit' }}>Contact</a>
          </div>

          <p style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-small)',
            fontSize: 'var(--text-body-small)',
          }}>
            © 2024 Send Signal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
