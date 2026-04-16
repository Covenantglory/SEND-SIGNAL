'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import styles from './steps.module.css';

interface CampaignStepProps {
  onNext: () => void;
  onDataChange: (data: { id: string; name: string } | null) => void;
}

export function CampaignStep({ onNext, onDataChange }: CampaignStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    batchSize: 10,
    delayInSeconds: 5,
  });
  const [leadsCount, setLeadsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) {
          setLeadsCount(data.leads.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create campaign');
        return;
      }

      onDataChange({ id: data.id, name: formData.name });
      onNext();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const estimatedTime = Math.ceil((leadsCount * formData.delayInSeconds) / 60);

  return (
    <div className={styles.step}>
      <h1 className={styles.title}>Launch Your First Campaign</h1>
      <p className={styles.description}>
        Set up your campaign and we&apos;ll start sending messages right away.
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Campaign Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Welcome Campaign"
          required
        />

        <div className={styles.inputGroup}>
          <Input
            label="Batch Size"
            name="batchSize"
            type="number"
            value={formData.batchSize}
            onChange={handleChange}
            min={1}
            max={100}
            hint="Messages per batch"
          />
        </div>

        <div className={styles.inputGroup}>
          <Input
            label="Delay Between Batches"
            name="delayInSeconds"
            type="number"
            value={formData.delayInSeconds}
            onChange={handleChange}
            min={1}
            max={300}
            hint="Seconds between batches"
          />
        </div>

        <div className={styles.campaignSummary}>
          <div className={styles.summaryItem}>
            <span>Recipients</span>
            <Badge variant="primary">{leadsCount} leads</Badge>
          </div>
          <div className={styles.summaryItem}>
            <span>Estimated Time</span>
            <Badge variant="info">
              {estimatedTime < 1 ? 'Less than 1 min' : `~${estimatedTime} min`}
            </Badge>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading} disabled={leadsCount === 0}>
          Launch Campaign
        </Button>

        {leadsCount === 0 && (
          <p className={styles.warning}>
            No leads imported yet. Import leads before launching a campaign.
          </p>
        )}
      </form>
    </div>
  );
}
