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
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <a href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              color: 'var(--color-on-surface)',
              fontFamily: 'var(--font-title-large)',
              fontWeight: 600,
              fontSize: 'var(--text-title-large)',
            }}>
              <img src="/logo.svg" alt="Send Signal" width="32" height="32" />
              Send Signal
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)' }}>
            <a href="#features" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              fontWeight: 500,
            }}>
              Features
            </a>
            <a href="#use-cases" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              fontWeight: 500,
            }}>
              Use Cases
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <a href="/login" style={{
              color: 'var(--color-on-surface)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontWeight: 500,
            }}>
              Log in
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
        borderTop: '1px solid var(--color-outline-variant)',
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
            <img src="/logo.svg" alt="Send Signal" width="24" height="24" />
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
        </div>
      </footer>
    </div>
  );
}
