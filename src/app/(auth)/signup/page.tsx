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

    if (name === 'email') {
      const trimmed = value.trim();
      if (!trimmed) {
        setErrors((prev) => ({ ...prev, email: 'Enter a Valid Company Email Address' }));
      } else {
        const emailDomain = trimmed.split('@')[1]?.toLowerCase();
        if (emailDomain === 'google.com' || emailDomain === 'yahoo.com') {
          setErrors((prev) => ({ ...prev, email: 'This is not a Valid Company Email Address' }));
        } else {
          setErrors((prev) => ({ ...prev, email: '' }));
        }
      }
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors: Record<string, string> = { ...errors };

    if (name === 'companyName' && !value.trim()) {
      newErrors.companyName = 'This field cannot be empty';
    } else if (name === 'companyName') {
      delete newErrors.companyName;
    }

    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'This field cannot be empty';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Enter a Valid Company Email Address';
        } else {
          const emailDomain = value.split('@')[1]?.toLowerCase();
          if (emailDomain === 'google.com' || emailDomain === 'yahoo.com') {
            newErrors.email = 'This is not a Valid Company Email Address';
          } else {
            delete newErrors.email;
          }
        }
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Enter Your Company Name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Enter a Valid Company Email Address';
    } else {
      const emailDomain = formData.email.split('@')[1]?.toLowerCase();
      if (emailDomain === 'google.com' || emailDomain === 'yahoo.com') {
        newErrors.email = 'This is not a Valid Company Email Address';
      }
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Choose a password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

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
          <h1 className={styles.title}>Create account</h1>
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
            onBlur={handleBlur}
            error={errors.companyName}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create account
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
