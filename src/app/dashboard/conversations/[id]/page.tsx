'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import styles from './conversation-detail.module.css';

interface WhatsAppAccount {
  id: string;
  accountName: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      setConversation(data.conversation);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!conversation) {
    return <div>Conversation not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => history.back()}>
          ← Back
        </Button>
        <h2 className={styles.title}>Conversation</h2>
      </div>

      <Card className={styles.conversationCard}>
        <CardContent>
          <div className={styles.messages}>
            {conversation.messages?.map((msg: any) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.direction === 'OUTBOUND' ? styles.outbound : styles.inbound}`}
              >
                <div className={styles.messageBubble}>
                  <p>{msg.body}</p>
                  <span className={styles.messageTime}>
                    {new Date(msg.sentAt || msg.receivedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
