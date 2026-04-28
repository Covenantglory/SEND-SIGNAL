import styles from './auth-layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="/" className={styles.logo}>
            <img src="/logo.svg" alt="Send Signal" width="32" height="32" />
            Send Signal
          </a>
        </nav>
      </header>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
