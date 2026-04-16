'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setErrors({});

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          data.details.fieldErrors.forEach((err: { path: string[]; message: string }) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(data.error || 'Signup failed');
        }
        return;
      }

      router.push('/onboarding');
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
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>
            Start automating your WhatsApp outreach today
          </p>
        </div>

        {serverError && (
          <div className={styles.errorBanner}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            placeholder="Acme Inc."
            required
          />

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

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 8 characters"
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
