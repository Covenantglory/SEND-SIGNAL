'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './reset-password.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const passwordReqs = [
    { key: 'length', label: 'Minimum 8 characters', met: password.length >= 8 },
    { key: 'number', label: 'Contains a number', met: /\d/.test(password) },
    { key: 'special', label: 'Contains a special character', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    { key: 'uppercase', label: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
  ];

  const allPasswordReqsMet = passwordReqs.every((req) => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (!allPasswordReqsMet) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'An error occurred');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="var(--color-success)" />
              </svg>
            </div>
            <h1 className={styles.successTitle}>Password reset!</h1>
            <p className={styles.successText}>
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
          </div>

          <div className={styles.footer}>
            <Link href="/login" className={styles.link}>
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Invalid link</h1>
            <p className={styles.subtitle}>
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className={styles.footer}>
            <Link href="/forgot-password" className={styles.link}>
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Set new password</h1>
          <p className={styles.subtitle}>
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className={styles.errorBanner}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="New password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setShowPasswordReqs(true);
            }}
            placeholder="Min. 8 characters"
            required
          />

          {showPasswordReqs && (
            <div className={styles.passwordReqs}>
              {passwordReqs.map((req) => (
                <p key={req.key} className={`${styles.passwordReq} ${req.met ? styles.passwordReqMet : ''}`}>
                  {req.met ? '✓' : '•'} {req.label}
                </p>
              ))}
            </div>
          )}

          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
          />

          <Button type="submit" fullWidth loading={loading} className={styles.submitButton}>
            Reset password
          </Button>
        </form>

        <div className={styles.footer}>
          Back to{' '}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.card}>Loading...</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
