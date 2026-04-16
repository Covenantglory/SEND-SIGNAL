'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ navItems, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
          <path
            d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16C24 20.418 20.418 24 16 24"
            stroke="white" strokeWidth="2" strokeLinecap="round"
          />
          <path
            d="M16 8V16L20 20"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        {!collapsed && <span>Send Signal</span>}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <button
        className={styles.collapseButton}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d={collapsed ? 'M6 4L10 8L6 12' : 'M10 4L6 8L10 12'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  );
}
