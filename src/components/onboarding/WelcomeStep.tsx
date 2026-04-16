'use client';

import { Button } from '@/components/ui/button';
import styles from './steps.module.css';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.icon}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="var(--color-primary-container)"/>
          <path d="M20 32C20 26.4772 24.4772 22 30 22C35.5228 22 40 26.4772 40 32C40 37.5228 35.5228 42 30 42" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M30 22V32L36 38" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className={styles.title}>Welcome to Send Signal</h1>
      <p className={styles.description}>
        Let&apos;s get you set up to start sending personalized WhatsApp messages
        to your leads. This quick setup will take about 5 minutes.
      </p>
      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>1</span>
          <span>Connect your WhatsApp Business account</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>2</span>
          <span>Import your leads</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>3</span>
          <span>Create your first message template</span>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>4</span>
          <span>Launch your first campaign</span>
        </div>
      </div>
      <Button onClick={onNext} fullWidth>
        Continue Setup
      </Button>
    </div>
  );
}
