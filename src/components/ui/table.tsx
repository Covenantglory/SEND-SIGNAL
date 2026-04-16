'use client';

import { ReactNode, useState } from 'react';
import { Badge } from './badge';
import { Skeleton } from './skeleton';
import styles from './table.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        if (aVal === bVal) return 0;
        const comparison = aVal && bVal ? (aVal < bVal ? -1 : 1) : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      })
    : data;

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={styles.th}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    <Skeleton variant="text" width="80%" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span>{col.header}</span>
                {col.sortable && sortKey === col.key && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={onRowClick ? styles.clickable : ''}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
    NEW: 'info',
    CONTACTED: 'primary',
    REPLIED: 'secondary',
    INTERESTED: 'success',
    NOT_INTERESTED: 'warning',
    CONVERTED: 'success',
    BOUNCED: 'error',
    UNSUBSCRIBED: 'error',
    DRAFT: 'default',
    SCHEDULED: 'info',
    RUNNING: 'primary',
    PAUSED: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'default',
    FAILED: 'error',
    QUEUED: 'info',
    SENDING: 'primary',
    SENT: 'primary',
    DELIVERED: 'success',
    READ: 'success',
  };

  const label = status.replace(/_/g, ' ');

  return (
    <Badge variant={variantMap[status] || 'default'}>
      {label}
    </Badge>
  );
}
