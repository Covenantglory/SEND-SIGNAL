'use client';

import { Button } from '@/components/ui/button';
import styles from './steps.module.css';

interface CompletionStepProps {
  onFinish: () => void;
}

export function CompletionStep({ onFinish }: CompletionStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.successIcon}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="var(--color-success-container)"/>
          <path d="M20 32L28 40L44 24" stroke="var(--color-success)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className={styles.title}>You&apos;re All Set!</h1>
      <p className={styles.description}>
        Your first campaign is now live. Messages will be sent based on your
        configured batch size and delay settings.
      </p>

      <div className={styles.nextSteps}>
        <h3>What&apos;s next?</h3>
        <ul>
          <li>Monitor your campaign progress in the dashboard</li>
          <li>Track message delivery and replies</li>
          <li>Create more templates for different campaigns</li>
          <li>Import additional leads as needed</li>
        </ul>
      </div>

      <Button onClick={onFinish} fullWidth>
        Go to Dashboard
      </Button>
    </div>
  );
}
