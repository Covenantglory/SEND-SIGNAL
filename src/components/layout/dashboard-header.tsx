'use client';

import styles from './dashboard-header.module.css';

interface DashboardHeaderProps {
  pageTitle: string;
  onLogout: () => void;
}

export function DashboardHeader({ pageTitle, onLogout }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>
      <div className={styles.headerRight}>
        <button className={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
