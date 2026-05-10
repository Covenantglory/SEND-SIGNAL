'use client';

import { useState } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 6rem',
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

          <div className="desktop-nav" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)' }}>
            <a href="#features" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-body-large)',
              fontSize: 'var(--text-body-large)',
              fontWeight: 500,
            }}>
              Features
            </a>
            <a href="#use-cases" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-body-large)',
              fontSize: 'var(--text-body-large)',
              fontWeight: 500,
            }}>
              Use Cases
            </a>
          </div>

          <div className="desktop-cta" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              justifyContent: 'flex-end',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <>
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>

          <div className="mobile-menu" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: 'var(--spacing-md)',
            display: menuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <a href="#features" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-body-large)',
              fontSize: 'var(--text-body-large)',
              fontWeight: 500,
              padding: 'var(--spacing-md) 0',
            }}>
              Features
            </a>
            <a href="#use-cases" style={{
              color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-body-large)',
              fontSize: 'var(--text-body-large)',
              fontWeight: 500,
              padding: 'var(--spacing-md) 0',
            }}>
              Use Cases
            </a>
            <a href="/signup" style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontFamily: 'var(--font-label-large)',
              fontSize: 'var(--text-label-large)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              textAlign: 'center',
              marginTop: 'var(--spacing-md)',
              width: '100%',
              maxWidth: '200px',
            }}>
              Get Started
            </a>
          </div>

          <style jsx>{`
            @media (max-width: 768px) {
              nav {
                display: flex !important;
                padding: 12px 1rem !important;
              }
              .desktop-nav, .desktop-cta {
                display: none !important;
              }
              .mobile-menu-btn {
                display: flex !important;
              }
            }
          `}</style>
        </nav>
      </header>

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
              <a href="/signup" style={{ fontSize: 'var(--text-body-medium)', color: 'var(--color-on-surface-variant)' }}>Sign Up</a>
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