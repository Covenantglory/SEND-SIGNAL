'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/shared/toast';
import styles from './dashboard.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/leads', label: 'Leads', icon: 'leads' },
  { href: '/dashboard/templates', label: 'Templates', icon: 'templates' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: 'campaigns' },
  { href: '/dashboard/messages', label: 'Messages', icon: 'messages' },
  { href: '/dashboard/conversations', label: 'Conversations', icon: 'conversations' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  leads: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 17C3 13.6863 6.13401 11 10 11C13.866 11 17 13.6863 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  templates: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  campaigns: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 3L7 13L4 10L2 12L4 14L7 11L18 1L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  messages: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 10C18 14.4183 14.4183 18 10 18C8.16713 18 6.42178 17.3745 5.04472 16.2943L2 17L3 14C1.62545 12.623 1 10.8776 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  conversations: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 6C17 9.3137 14.3137 12 11 12H6L3 15V3C3 2.44772 3.44772 2 4 2H16C16.5523 2 17 2.44772 17 3V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  analytics: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 17V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 17V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <ToastProvider>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16C24 20.418 20.418 24 16 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8V16L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!sidebarCollapsed && <span>Send Signal</span>}
          </div>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {icons[item.icon]}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <button
            className={styles.collapseButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d={sidebarCollapsed ? 'M6 4L10 8L6 12' : 'M10 4L6 8L10 12'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </aside>

        <div className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>
                {navItems.find(item => isActive(item.href))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.logoutButton} onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}>
                Logout
              </button>
            </div>
          </header>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
