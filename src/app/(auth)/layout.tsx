'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './auth-layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';
  const isForgotPasswordPage = pathname === '/forgot-password';
  const isResetPasswordPage = pathname === '/reset-password';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.svg" alt="Send Signal" width="32" height="32" />
            Send Signal
          </Link>
          
          {(isSignupPage || isForgotPasswordPage || isResetPasswordPage) && (
            <Link href="/login" className={styles.headerLink}>
              Sign In
            </Link>
          )}
          
          {isLoginPage && (
            <Link href="/signup" className={styles.headerLink}>
              Sign Up
            </Link>
          )}
        </nav>
      </header>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
