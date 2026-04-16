'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false,
    disabled,
    className = '',
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className={styles.spinner}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="30 10" />
            </svg>
          </span>
        )}
        <span className={loading ? styles.hiddenText : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
