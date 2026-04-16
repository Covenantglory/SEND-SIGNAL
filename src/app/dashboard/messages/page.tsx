'use client';

import { useState, useEffect } from 'react';
import { Table, StatusBadge, Column } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import styles from './messages.module.css';

interface Message {
  id: string;
  renderedBody: string | null;
  direction: string;
  status: string;
  lead: {
    phoneNumber: string;
    firstName: string | null;
    lastName: string | null;
  };
  campaign: {
    name: string;
  } | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Message>[] = [
    {
      key: 'lead',
      header: 'Recipient',
      render: (message) => (
        <div className={styles.recipient}>
          <span className={styles.phoneNumber}>{message.lead.phoneNumber}</span>
          <span className={styles.name}>
            {message.lead.firstName || message.lead.lastName
              ? `${message.lead.firstName || ''} ${message.lead.lastName || ''}`.trim()
              : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'campaign',
      header: 'Campaign',
      render: (message) => (
        <span>{message.campaign?.name || 'Manual'}</span>
      ),
    },
    {
      key: 'direction',
      header: 'Direction',
      render: (message) => (
        <span className={message.direction === 'OUTBOUND' ? styles.outbound : styles.inbound}>
          {message.direction === 'OUTBOUND' ? 'Sent' : 'Received'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (message) => <StatusBadge status={message.status} />,
    },
    {
      key: 'time',
      header: 'Time',
      render: (message) => (
        <span className={styles.time}>
          {message.sentAt ? new Date(message.sentAt).toLocaleString() : '-'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Message Logs</h2>
      </div>

      {messages.length === 0 && !loading ? (
        <EmptyState
          title="No messages yet"
          description="Messages will appear here when you send or receive WhatsApp messages."
        />
      ) : (
        <Table
          columns={columns}
          data={messages}
          keyExtractor={(message) => message.id}
          loading={loading}
        />
      )}
    </div>
  );
}
