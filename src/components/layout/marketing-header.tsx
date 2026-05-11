'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MarketingHeaderProps {
  isLoggedIn: boolean;
}

export default function MarketingHeader({ isLoggedIn }: MarketingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
        padding: '16px 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/" style={{
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
          </Link>
        </div>

        <div className="desktop-nav" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)' }}>
          <Link href="#features" style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-large)',
            fontSize: 'var(--text-body-large)',
            fontWeight: 500,
          }}>
            Features
          </Link>
          <Link href="#use-cases" style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-large)',
            fontSize: 'var(--text-body-large)',
            fontWeight: 500,
          }}>
            Use Cases
          </Link>
        </div>

        <div className="desktop-cta" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Link href="/signup" style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            fontFamily: 'var(--font-label-large)',
            fontSize: 'var(--text-label-large)',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}>
            Create Account
          </Link>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--color-on-surface)',
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
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          padding: 'var(--spacing-lg)',
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          boxShadow: 'var(--shadow-lg)',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}>
          <Link href="#features" onClick={() => setMenuOpen(false)} style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-large)',
            fontSize: 'var(--text-body-large)',
            fontWeight: 500,
            width: '100%',
            textAlign: 'center',
            padding: 'var(--spacing-sm)',
          }}>
            Features
          </Link>
          <Link href="#use-cases" onClick={() => setMenuOpen(false)} style={{
            color: 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-body-large)',
            fontSize: 'var(--text-body-large)',
            fontWeight: 500,
            width: '100%',
            textAlign: 'center',
            padding: 'var(--spacing-sm)',
          }}>
            Use Cases
          </Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)} style={{
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
            maxWidth: '280px',
          }}>
            Create Account
          </Link>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
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
  );
}
