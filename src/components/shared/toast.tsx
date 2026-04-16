'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styles from './toast.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.container}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <div className={styles.icon}>{getIcon(toast.type)}</div>
            <span className={styles.message}>{toast.message}</span>
            <button
              className={styles.closeButton}
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'error':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6v5M10 13v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L19 18H1L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 8v5M10 15v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 6v4M10 12v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
  }
}
