'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, isValid, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.inputContainer}>
          <input
            ref={ref}
            id={inputId}
            className={`${styles.input} ${rightElement ? styles.hasRightElement : ''} ${error ? styles.inputError : ''} ${isValid && !error ? styles.inputValid : ''} ${className}`}
            {...props}
          />
          {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
        </div>
        {error && <span className={styles.error}>{error}</span>}
        {hint && !error && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
