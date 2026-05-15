'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './login.module.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setErrors({});

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setServerError('An invalid email or password');
        } else if (data.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          data.details.fieldErrors.forEach((err: { path: string[]; message: string }) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(data.error || 'Login failed');
        }
        return;
      }

      router.push(redirect);
    } catch {
      setServerError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in to continue to your dashboard
          </p>
        </div>

        {serverError && (
          <div className={styles.errorBanner}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@company.com"
            required
          />

          <div>
            <div className={styles.passwordLabelRow}>
              <label htmlFor="password" className={styles.passwordLabel}>
                Password
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Input
                name="password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.card}>Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
