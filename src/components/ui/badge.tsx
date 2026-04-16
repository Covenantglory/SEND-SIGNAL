import { ReactNode } from 'react';
import styles from './badge.module.css';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  );
}

export type MessageStatus = 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'READ' | 'REPLIED' | 'UNSUBSCRIBED' | 'CONVERTED' | 'BOUNCED';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'REPLIED' | 'INTERESTED' | 'NOT_INTERESTED' | 'UNSUBSCRIBED' | 'CONVERTED' | 'BOUNCED';

interface StatusBadgeProps {
  status: MessageStatus | LeadStatus;
}

const messageStatusConfig: Record<MessageStatus, { label: string; variant: BadgeProps['variant'] }> = {
  QUEUED: { label: 'Queued', variant: 'info' },
  SENDING: { label: 'Sending', variant: 'info' },
  SENT: { label: 'Sent', variant: 'primary' },
  FAILED: { label: 'Failed', variant: 'error' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  READ: { label: 'Read', variant: 'success' },
  REPLIED: { label: 'Replied', variant: 'success' },
  UNSUBSCRIBED: { label: 'Unsubscribed', variant: 'warning' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  BOUNCED: { label: 'Bounced', variant: 'error' },
};

const leadStatusConfig: Record<LeadStatus, { label: string; variant: BadgeProps['variant'] }> = {
  NEW: { label: 'New', variant: 'info' },
  CONTACTED: { label: 'Contacted', variant: 'primary' },
  REPLIED: { label: 'Replied', variant: 'success' },
  INTERESTED: { label: 'Interested', variant: 'success' },
  NOT_INTERESTED: { label: 'Not Interested', variant: 'warning' },
  UNSUBSCRIBED: { label: 'Unsubscribed', variant: 'warning' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  BOUNCED: { label: 'Bounced', variant: 'error' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isMessageStatus = status in messageStatusConfig;
  const config = isMessageStatus 
    ? messageStatusConfig[status as MessageStatus] 
    : leadStatusConfig[status as LeadStatus];
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
