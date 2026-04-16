'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './steps.module.css';

interface WhatsAppStepProps {
  onNext: () => void;
  onDataChange: (data: {
    accountName: string;
    phoneNumberId: string;
    businessAccountId: string;
    accessToken: string;
    displayPhoneNumber?: string;
  } | null) => void;
}

export function WhatsappStep({ onNext, onDataChange }: WhatsAppStepProps) {
  const [formData, setFormData] = useState({
    accountName: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    displayPhoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to connect WhatsApp account');
        return;
      }

      onDataChange(formData);
      onNext();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.step}>
      <h1 className={styles.title}>Connect WhatsApp Business</h1>
      <p className={styles.description}>
        Enter your WhatsApp Business API credentials to start sending messages.
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Account Name"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          placeholder="My Business WhatsApp"
          required
        />

        <Input
          label="Phone Number ID"
          name="phoneNumberId"
          value={formData.phoneNumberId}
          onChange={handleChange}
          placeholder="123456789012345"
          required
        />

        <Input
          label="Business Account ID"
          name="businessAccountId"
          value={formData.businessAccountId}
          onChange={handleChange}
          placeholder="987654321098765"
          required
        />

        <Input
          label="Access Token"
          name="accessToken"
          type="password"
          value={formData.accessToken}
          onChange={handleChange}
          placeholder="Your WhatsApp API access token"
          required
        />

        <Input
          label="Display Phone Number (optional)"
          name="displayPhoneNumber"
          value={formData.displayPhoneNumber}
          onChange={handleChange}
          placeholder="+1234567890"
        />

        <Button type="submit" fullWidth loading={loading}>
          Connect Account
        </Button>
      </form>
    </div>
  );
}
